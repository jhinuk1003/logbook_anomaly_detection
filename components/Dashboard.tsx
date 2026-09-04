"use client";

import React, { useState, useEffect } from "react";
import VictorianFrame from "./VictorianFrame";
import AnomalyGauges from "./AnomalyGauges";
import TelemetryStream from "./TelemetryStream";
import HeatmapScrubber from "./HeatmapScrubber";
import RegexEngine from "./RegexEngine";
import LogVectorizer from "./LogVectorizer";
import WebhookDispatcher from "./WebhookDispatcher";
import DatasetStation from "./DatasetStation";
import { UserProfile, clearUserSession } from "@/lib/firebase";
import {
  INITIAL_LOG_STREAM,
  INITIAL_METRICS_SERIES,
  generateRandomLog,
  LogEntry,
  MetricDataPoint,
} from "@/lib/sampleData";
import {
  DetectionThresholds,
  DEFAULT_THRESHOLDS,
  evaluateLogEntry,
} from "@/lib/anomalyDetector";
import {
  toggleTelegraphAudio,
  isTelegraphAudioEnabled,
  playTelegraphClick,
  playBrassChime,
} from "@/lib/audio";
import {
  Compass,
  Volume2,
  VolumeX,
  LogOut,
  Activity,
  Layers,
  Terminal,
  Binary,
  BellRing,
  FolderArchive,
  ArrowLeft,
  Clock,
  Sparkles,
} from "lucide-react";

interface DashboardProps {
  user: UserProfile;
  onSignOut: () => void;
  onReturnToLanding: () => void;
}

export default function Dashboard({
  user,
  onSignOut,
  onReturnToLanding,
}: DashboardProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    "overview" | "stream" | "heatmap" | "regex" | "vectorizer" | "webhook" | "dataset"
  >("overview");

  // Telemetry state
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOG_STREAM);
  const [metrics, setMetrics] = useState<MetricDataPoint[]>(INITIAL_METRICS_SERIES);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(INITIAL_LOG_STREAM[4]);
  const [thresholds, setThresholds] = useState<DetectionThresholds>(DEFAULT_THRESHOLDS);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [clockTime, setClockTime] = useState<string>("");

  // Clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString("en-GB", { hour12: false }) + " GMT"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic real-time stream simulation
  useEffect(() => {
    if (!isStreaming) return;

    let counter = 10;
    const interval = setInterval(() => {
      counter += 1;
      const newEntry = generateRandomLog(counter);
      const evalResult = evaluateLogEntry(newEntry, thresholds);

      if (evalResult.isAnomaly && newEntry.severity === "SAFE") {
        newEntry.severity = "WARNING";
      }

      setLogs((prev) => [...prev.slice(-35), newEntry]);

      // Add to metrics
      setMetrics((prev) => {
        const threatIndex = Math.min(100, Math.round(evalResult.score * 100));
        const newMetric: MetricDataPoint = {
          timestamp: newEntry.timestamp,
          timeLabel: newEntry.timestamp,
          cpuPercent: Math.round(30 + Math.random() * 45),
          memoryMb: Math.round(4500 + Math.random() * 1500),
          latencyMs: newEntry.latencyMs,
          errorRate: newEntry.status >= 500 ? 0.08 : 0.002,
          networkKbps: Math.round(1800 + Math.random() * 3000),
          threatIndex: threatIndex,
          isAnomaly: evalResult.isAnomaly,
        };
        return [...prev.slice(-14), newMetric];
      });

      if (evalResult.isAnomaly) {
        playTelegraphClick(950);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming, thresholds]);

  const handleAudioToggle = () => {
    const next = toggleTelegraphAudio();
    setAudioEnabled(next);
    if (next) playBrassChime();
  };

  // Aggregated dynamic scores
  const anomalyLogs = logs.filter((l) => l.severity !== "SAFE");
  const fatalLogs = logs.filter((l) => l.severity === "FATAL");
  const criticalLogs = logs.filter((l) => l.severity === "CRITICAL");

  let aggregatedSeverity: "SAFE" | "WARNING" | "CRITICAL" | "FATAL" = "SAFE";
  if (fatalLogs.length > 0) aggregatedSeverity = "FATAL";
  else if (criticalLogs.length > 0) aggregatedSeverity = "CRITICAL";
  else if (anomalyLogs.length > 0) aggregatedSeverity = "WARNING";

  const threatScore = Math.min(
    100,
    Math.round(
      fatalLogs.length * 40 + criticalLogs.length * 20 + anomalyLogs.length * 8
    )
  );

  const memoryLeakRisk = Math.min(
    100,
    Math.round(
      logs.filter((l) => l.anomalyTag?.includes("HEAP") || l.anomalyTag?.includes("OOM"))
        .length * 45 + 15
    )
  );

  const intrusionConfidence = Math.min(
    100,
    Math.round(
      logs.filter((l) => l.anomalyTag?.includes("SQL") || l.anomalyTag?.includes("PROBE"))
        .length * 35 + 20
    )
  );

  const systemIntegrity = Math.max(10, 100 - threatScore);

  return (
    <div className="min-h-screen flex flex-col text-[#f3eef8]">
      {/* Glassmorphic Responsive Console Master Header */}
      <header className="border-b border-white/10 bg-[#120a1c]/75 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <button
                onClick={onReturnToLanding}
                className="p-1.5 sm:p-2 border border-white/15 text-[#f3cf7a] hover:bg-white/10 rounded-xl transition-colors backdrop-blur-md"
                title="Return to Landing Proclamation"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="wax-seal w-8 h-8 sm:w-10 sm:h-10">
                <span className="text-sm sm:text-base">{user.avatarSeal}</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#f3cf7a] font-cinzel">
                    Imperial Console
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-telegraph text-amber-200/90 bg-white/5 border border-white/15 rounded-full">
                    PATENT NO. 488219
                  </span>
                </div>
                <h1 className="text-sm sm:text-lg font-cinzel font-bold gold-emboss truncate max-w-[200px] sm:max-w-none">
                  LogBook Diagnostic Engine
                </h1>
              </div>
            </div>

            {/* Mobile Controls Right */}
            <div className="sm:hidden flex items-center gap-2">
              <button
                onClick={handleAudioToggle}
                className="p-1.5 border border-white/15 text-[#f3cf7a] rounded-lg"
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white/40" />
                )}
              </button>
              <button
                onClick={() => {
                  playTelegraphClick(600);
                  clearUserSession();
                  onSignOut();
                }}
                className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Chronometer & Profile Bar */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-telegraph">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[#f3cf7a] backdrop-blur-md">
              <Clock className="w-3.5 h-3.5" />
              <span>{clockTime || "12:00:00 GMT"}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              className="p-2 border border-white/15 text-[#f3cf7a] hover:bg-white/10 rounded-xl transition-colors backdrop-blur-md"
              title={audioEnabled ? "Mute Acoustic Telegraph" : "Enable Acoustic Telegraph"}
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-white/40" />
              )}
            </button>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
              <div className="text-right">
                <span className="block text-[11px] text-[#ffd700] font-cinzel font-bold">
                  {user.displayName}
                </span>
                <span className="block text-[10px] text-[#b8a7cb] font-parchment italic truncate max-w-[140px]">
                  {user.victorianRank}
                </span>
              </div>
              <button
                onClick={() => {
                  playTelegraphClick(600);
                  clearUserSession();
                  onSignOut();
                }}
                className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-all"
                title="Sign Out from Telemetry Bureau"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar with Touch Scrolling */}
        <div className="max-w-7xl mx-auto mt-2 sm:mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-[11px] sm:text-xs font-cinzel tracking-wider uppercase no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: <Activity className="w-3.5 h-3.5" /> },
            { id: "stream", label: "Log Tape", icon: <Terminal className="w-3.5 h-3.5" /> },
            { id: "heatmap", label: "Heatmap", icon: <Layers className="w-3.5 h-3.5" /> },
            { id: "regex", label: "Regex & Rules", icon: <Compass className="w-3.5 h-3.5" /> },
            { id: "vectorizer", label: "Vectorizer", icon: <Binary className="w-3.5 h-3.5" /> },
            { id: "webhook", label: "DevOps Alerts", icon: <BellRing className="w-3.5 h-3.5" /> },
            { id: "dataset", label: "Datasets", icon: <FolderArchive className="w-3.5 h-3.5" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                playTelegraphClick(800);
                setActiveTab(t.id as any);
              }}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border flex items-center gap-1.5 whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === t.id
                  ? "glass-btn-gold text-[#120902] font-bold"
                  : "glass-btn text-[#b8a7cb] hover:text-white"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Console Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Tab 1: Overview & Rotary Gauges */}
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            <AnomalyGauges
              threatIndex={threatScore}
              memoryLeakRisk={memoryLeakRisk}
              intrusionConfidence={intrusionConfidence}
              systemIntegrity={systemIntegrity}
              severity={aggregatedSeverity}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <TelemetryStream
                logs={logs}
                metrics={metrics}
                isStreaming={isStreaming}
                onToggleStreaming={() => {
                  playTelegraphClick(700);
                  setIsStreaming(!isStreaming);
                }}
                onSelectLog={(log) => setSelectedLog(log)}
                selectedLogId={selectedLog?.id}
              />

              <div className="space-y-4 sm:space-y-6">
                <LogVectorizer selectedLog={selectedLog} />
                <HeatmapScrubber />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Log Stream */}
        {activeTab === "stream" && (
          <TelemetryStream
            logs={logs}
            metrics={metrics}
            isStreaming={isStreaming}
            onToggleStreaming={() => setIsStreaming(!isStreaming)}
            onSelectLog={(log) => setSelectedLog(log)}
            selectedLogId={selectedLog?.id}
          />
        )}

        {/* Tab 3: Heatmap */}
        {activeTab === "heatmap" && <HeatmapScrubber />}

        {/* Tab 4: Regex Engine & Threshold Tuning */}
        {activeTab === "regex" && (
          <RegexEngine
            thresholds={thresholds}
            onUpdateThresholds={(updated) => setThresholds(updated)}
          />
        )}

        {/* Tab 5: Vectorizer */}
        {activeTab === "vectorizer" && <LogVectorizer selectedLog={selectedLog} />}

        {/* Tab 6: DevOps Webhook Notifier */}
        {activeTab === "webhook" && <WebhookDispatcher />}

        {/* Tab 7: Datasets & File Upload */}
        {activeTab === "dataset" && (
          <DatasetStation
            onLoadCustomLogs={(custom) => {
              setLogs(custom);
              setSelectedLog(custom[0]);
              setActiveTab("overview");
            }}
          />
        )}
      </main>
    </div>
  );
}
