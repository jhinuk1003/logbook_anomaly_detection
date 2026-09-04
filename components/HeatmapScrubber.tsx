"use client";

import React, { useState } from "react";
import VictorianFrame from "./VictorianFrame";
import { playTelegraphClick } from "@/lib/audio";

interface HeatmapCell {
  hour: number;
  node: string;
  anomalyCount: number;
  severity: "SAFE" | "WARNING" | "CRITICAL" | "FATAL";
  primaryCause?: string;
}

interface HeatmapScrubberProps {
  onSelectCell?: (cell: HeatmapCell) => void;
}

export default function HeatmapScrubber({ onSelectCell }: HeatmapScrubberProps) {
  const nodes = ["node-victoria-01", "node-victoria-02", "node-victoria-03", "node-victoria-04"];
  const hours = Array.from({ length: 12 }, (_, i) => i);

  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>({
    hour: 6,
    node: "node-victoria-02",
    anomalyCount: 14,
    severity: "CRITICAL",
    primaryCause: "SQL Injection Probe Cluster & High Latency",
  });

  const getCellData = (node: string, hour: number): HeatmapCell => {
    if (node === "node-victoria-02" && hour === 6) {
      return {
        hour,
        node,
        anomalyCount: 14,
        severity: "CRITICAL",
        primaryCause: "SQL Injection Probe Cluster & High Latency",
      };
    }
    if (node === "node-victoria-01" && hour === 8) {
      return {
        hour,
        node,
        anomalyCount: 22,
        severity: "FATAL",
        primaryCause: "JVM OutOfMemoryError & Gateway Cascades",
      };
    }
    if (node === "node-victoria-03" && hour === 3) {
      return {
        hour,
        node,
        anomalyCount: 8,
        severity: "WARNING",
        primaryCause: "Directory Traversal & 404 Scanning",
      };
    }
    if ((hour === 4 || hour === 5) && (node === "node-victoria-01" || node === "node-victoria-02")) {
      return {
        hour,
        node,
        anomalyCount: 3,
        severity: "WARNING",
        primaryCause: "Latency Drift (GC Pressure)",
      };
    }
    return {
      hour,
      node,
      anomalyCount: 0,
      severity: "SAFE",
    };
  };

  const handleCellClick = (cell: HeatmapCell) => {
    playTelegraphClick(850 + cell.anomalyCount * 15);
    setSelectedCell(cell);
    if (onSelectCell) onSelectCell(cell);
  };

  return (
    <VictorianFrame
      title="Root Cause Incident Heatmap Matrix"
      subtitle="Node clusters vs. Hourly telemetry segments (Click cell to inspect)"
      badge="SPATIAL-TEMPORAL"
    >
      <div className="overflow-x-auto pb-2">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="text-[11px] font-cinzel text-[#f3cf7a] p-2 text-left w-36">
                Chamber Node
              </th>
              {hours.map((h) => (
                <th
                  key={h}
                  className="text-[10px] font-telegraph text-white/50 p-2 font-normal"
                >
                  {h.toString().padStart(2, "0")}:00
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node} className="border-t border-white/5">
                <td className="text-xs font-telegraph text-[#f3cf7a] text-left py-2.5 pr-2 font-medium">
                  {node}
                </td>
                {hours.map((h) => {
                  const cell = getCellData(node, h);
                  const isSelected =
                    selectedCell?.node === node && selectedCell?.hour === h;

                  let bg = "bg-white/4 hover:bg-white/10";
                  let border = "border-white/5";
                  let text = "text-white/30";

                  if (cell.severity === "FATAL") {
                    bg = "bg-rose-600/35 hover:bg-rose-600/50 shadow-[0_0_12px_rgba(244,63,94,0.25)]";
                    border = "border-rose-500/60";
                    text = "text-rose-100 font-bold";
                  } else if (cell.severity === "CRITICAL") {
                    bg = "bg-amber-600/35 hover:bg-amber-600/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]";
                    border = "border-amber-500/60";
                    text = "text-amber-100 font-bold";
                  } else if (cell.severity === "WARNING") {
                    bg = "bg-yellow-600/25 hover:bg-yellow-600/40";
                    border = "border-yellow-500/40";
                    text = "text-yellow-100";
                  }

                  return (
                    <td key={h} className="p-1">
                      <button
                        onClick={() => handleCellClick(cell)}
                        className={`w-full h-8 rounded-lg border text-[11px] font-telegraph flex items-center justify-center transition-all backdrop-blur-md ${bg} ${border} ${text} ${
                          isSelected
                            ? "ring-2 ring-[#ffd700] scale-105 shadow-[0_0_12px_#ffd700]"
                            : ""
                        }`}
                        title={`${node} at ${h}:00 - ${cell.anomalyCount} anomalies`}
                      >
                        {cell.anomalyCount > 0 ? cell.anomalyCount : "—"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Root Cause Detail Card */}
      {selectedCell && (
        <div className="mt-4 p-4 bg-white/5 border border-white/12 rounded-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-parchment">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-cinzel text-amber-200 font-bold">
                Inspected Node: {selectedCell.node} @ {selectedCell.hour.toString().padStart(2, "0")}:00 hrs
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-telegraph uppercase border border-[#f3cf7a]/40 text-[#ffd700] bg-[#f3cf7a]/10">
                {selectedCell.severity} ({selectedCell.anomalyCount} Incidents)
              </span>
            </div>
            <p className="text-[#d8cce8] mt-1 text-xs">
              <strong>Root Cause Diagnosis: </strong>
              {selectedCell.primaryCause || "Nominal operations, no critical variance detected."}
            </p>
          </div>

          <div className="text-right text-[11px] font-telegraph text-[#f3cf7a] flex-shrink-0">
            <span>Vector Cluster: [0.88, 0.42, 0.94]</span>
          </div>
        </div>
      )}
    </VictorianFrame>
  );
}
