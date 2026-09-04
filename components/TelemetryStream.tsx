"use client";

import React, { useState, useEffect } from "react";
import VictorianFrame from "./VictorianFrame";
import { LogEntry, MetricDataPoint } from "@/lib/sampleData";
import { playTelegraphClick } from "@/lib/audio";
import {
  Play,
  Pause,
  Filter,
  SlidersHorizontal,
  Clock,
  Radio,
  Zap,
  CheckCircle,
  AlertOctagon,
} from "lucide-react";

interface TelemetryStreamProps {
  logs: LogEntry[];
  metrics: MetricDataPoint[];
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onSelectLog: (log: LogEntry) => void;
  selectedLogId?: string;
}

export default function TelemetryStream({
  logs,
  metrics,
  isStreaming,
  onToggleStreaming,
  onSelectLog,
  selectedLogId,
}: TelemetryStreamProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [scrubberIndex, setScrubberIndex] = useState<number>(logs.length - 1);

  // Keep scrubber at latest entry when streaming
  useEffect(() => {
    if (isStreaming) {
      setScrubberIndex(logs.length - 1);
    }
  }, [logs.length, isStreaming]);

  const filteredLogs = logs.filter((l) => {
    if (filterSeverity === "ANOMALIES") return l.severity !== "SAFE";
    if (filterSeverity === "FATAL") return l.severity === "FATAL" || l.severity === "CRITICAL";
    return true;
  });

  const displayedLogs = filteredLogs.slice(0, scrubberIndex + 1);

  const handleScrubberChange = (val: number) => {
    playTelegraphClick(750 + val * 10);
    setScrubberIndex(val);
  };

  // SVG Chart Dimensions & Data
  const chartHeight = 110;
  const chartWidth = 500;
  const maxMetricLatency = Math.max(...metrics.map((m) => m.latencyMs), 200);

  const pointsLatency = metrics
    .map((m, idx) => {
      const x = (idx / (metrics.length - 1 || 1)) * chartWidth;
      const y = chartHeight - (m.latencyMs / maxMetricLatency) * (chartHeight - 15) - 8;
      return `${x},${y}`;
    })
    .join(" ");

  const pointsThreat = metrics
    .map((m, idx) => {
      const x = (idx / (metrics.length - 1 || 1)) * chartWidth;
      const y = chartHeight - (m.threatIndex / 100) * (chartHeight - 15) - 8;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="space-y-4">
      {/* Streaming Controls & Timeline Scrubber Bar */}
      <VictorianFrame variant="card" className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleStreaming}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel tracking-wider uppercase flex items-center gap-2 transition-all ${
                isStreaming
                  ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                  : "bg-amber-500/20 border border-amber-400/50 text-amber-200"
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Galvanic Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Live Feed</span>
                </>
              )}
            </button>

            <span className="flex items-center gap-1.5 text-xs font-telegraph text-[#f3cf7a]">
              <Radio className={`w-3.5 h-3.5 ${isStreaming ? "text-emerald-400 animate-pulse" : "text-white/40"}`} />
              <span>{isStreaming ? "TELEGRAPH TAPE LIVE" : "FEED FROZEN"}</span>
            </span>
          </div>

          {/* Severity Filters - Glass Pills */}
          <div className="flex items-center gap-1.5 text-xs font-telegraph">
            <span className="text-white/50 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {["ALL", "ANOMALIES", "FATAL"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  playTelegraphClick(800);
                  setFilterSeverity(f);
                }}
                className={`px-3 py-1 rounded-lg border text-[11px] uppercase transition-all ${
                  filterSeverity === f
                    ? "bg-[#f3cf7a]/20 border-[#f3cf7a] text-[#ffd700] shadow-[0_0_10px_rgba(243,207,122,0.25)]"
                    : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Scrubber */}
        <div className="bg-white/5 p-3.5 border border-white/10 rounded-xl space-y-2 backdrop-blur-md">
          <div className="flex justify-between items-center text-xs font-telegraph text-[#f3cf7a]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#f3cf7a]" />
              <span>Incident Timeline Scrubber</span>
            </span>
            <span className="text-amber-200">
              Entry {scrubberIndex + 1} of {logs.length} (
              {logs[scrubberIndex]?.timestamp || "Live"})
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={logs.length - 1}
            value={scrubberIndex}
            onChange={(e) => handleScrubberChange(parseInt(e.target.value, 10))}
            className="w-full accent-[#f3cf7a] cursor-pointer"
          />
        </div>
      </VictorianFrame>

      {/* SVG Multi-trace Telemetry Chart */}
      <VictorianFrame
        title="Galvanic Telemetry Waveforms"
        subtitle="Dual Stream: Latency (ms) vs. Dynamic Threat Index (%)"
        badge="TIME-SERIES"
      >
        <div className="relative w-full h-[120px] bg-black/40 border border-white/10 rounded-xl p-2 overflow-hidden backdrop-blur-md">
          {/* Chart Grid Lines */}
          <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none opacity-10">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="border-b border-r border-white" />
            ))}
          </div>

          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Latency Trace (Gold glow) */}
            <polyline
              fill="none"
              stroke="#f3cf7a"
              strokeWidth="2.5"
              points={pointsLatency}
              className="drop-shadow-[0_0_6px_rgba(243,207,122,0.6)]"
            />
            {/* Threat Index Trace (Crimson Neon) */}
            <polyline
              fill="none"
              stroke="#fb7185"
              strokeWidth="2"
              strokeDasharray="4 2"
              points={pointsThreat}
              className="drop-shadow-[0_0_6px_rgba(251,113,133,0.7)]"
            />
          </svg>

          {/* Chart Legend */}
          <div className="absolute bottom-2 right-3 flex items-center gap-3 text-[10px] font-telegraph bg-black/60 px-3 py-1 border border-white/10 rounded-full backdrop-blur-md">
            <span className="flex items-center gap-1.5 text-[#f3cf7a]">
              <span className="w-2 h-0.5 bg-[#f3cf7a]" /> Latency Spike (ms)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-0.5 bg-rose-400" /> Threat Score (%)
            </span>
          </div>
        </div>
      </VictorianFrame>

      {/* Real-time Ticker Tape Log Stream */}
      <VictorianFrame
        title="Imperial Log Tape Stream"
        subtitle="Unstructured server access lines parsed in real-time"
        badge={`${displayedLogs.length} TELEGRAMS`}
      >
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 font-telegraph text-xs">
          {displayedLogs.map((entry) => {
            const isSelected = entry.id === selectedLogId;
            const isAnom = entry.severity !== "SAFE";

            let tagColor = "border-emerald-500/30 text-emerald-300 bg-emerald-950/30";
            if (entry.severity === "FATAL") {
              tagColor = "border-rose-500/50 text-rose-200 bg-rose-950/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]";
            } else if (entry.severity === "CRITICAL") {
              tagColor = "border-amber-500/50 text-amber-200 bg-amber-950/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]";
            } else if (entry.severity === "WARNING") {
              tagColor = "border-yellow-500/40 text-yellow-200 bg-yellow-950/30";
            }

            return (
              <div
                key={entry.id}
                onClick={() => {
                  playTelegraphClick(900);
                  onSelectLog(entry);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-2.5 backdrop-blur-md ${
                  isSelected
                    ? "border-[#f3cf7a] bg-white/10 shadow-[0_0_16px_rgba(243,207,122,0.25)]"
                    : isAnom
                    ? "border-rose-500/30 bg-rose-950/20 hover:border-rose-400/50 hover:bg-rose-950/30"
                    : "border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[11px] text-white/50 w-16 font-semibold">
                    {entry.timestamp}
                  </span>

                  <span
                    className={`px-2 py-0.5 text-[10px] border uppercase rounded-full font-bold ${tagColor}`}
                  >
                    {entry.severity}
                  </span>

                  <span className="font-bold text-amber-200">{entry.method}</span>
                  <span className="text-white/80 break-all max-w-md truncate">
                    {entry.path}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-white/60 flex-shrink-0">
                  <span
                    className={
                      entry.status >= 500
                        ? "text-rose-400 font-bold"
                        : entry.status >= 400
                        ? "text-yellow-400"
                        : "text-emerald-400"
                    }
                  >
                    HTTP {entry.status}
                  </span>
                  <span>{entry.latencyMs}ms</span>
                  {entry.anomalyTag && (
                    <span className="px-2 py-0.5 bg-rose-950/50 text-rose-300 border border-rose-500/40 rounded-full text-[9px] uppercase">
                      {entry.anomalyTag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </VictorianFrame>
    </div>
  );
}
