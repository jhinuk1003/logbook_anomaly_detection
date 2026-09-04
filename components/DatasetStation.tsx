"use client";

import React, { useState } from "react";
import VictorianFrame from "./VictorianFrame";
import { playTelegraphClick, playBrassChime } from "@/lib/audio";
import { parseRawLogLine } from "@/lib/anomalyDetector";
import { LogEntry } from "@/lib/sampleData";
import {
  FolderArchive,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  FileCode,
  CheckCircle2,
} from "lucide-react";

interface DatasetStationProps {
  onLoadCustomLogs: (logs: LogEntry[]) => void;
}

export default function DatasetStation({ onLoadCustomLogs }: DatasetStationProps) {
  const [activePreset, setActivePreset] = useState<string>("access_log");
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [customLineCount, setCustomLineCount] = useState<number | null>(null);

  const datasets = [
    {
      id: "access_log",
      name: "server_telemetry_access.log",
      format: "Apache/Nginx Log Stream",
      description:
        "High-density server access logs containing SQLi exploit vectors, brute force bursts, and 404 scans.",
      path: "/dataset/server_telemetry_access.log",
      icon: <FileText className="w-5 h-5 text-[#f3cf7a]" />,
    },
    {
      id: "metrics_csv",
      name: "system_metrics_anomalies.csv",
      format: "Multivariate Time-Series CSV",
      description:
        "Time series records with CPU%, Memory_MB, Disk_IO, Latency_ms, and explicit Out-of-Memory cascade labels.",
      path: "/dataset/system_metrics_anomalies.csv",
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: "cluster_json",
      name: "distributed_cluster_events.json",
      format: "Microservice Trace JSON",
      description:
        "Structured microservice JSON traces with dynamic severity ratings, vector embeddings, and node IDs.",
      path: "/dataset/distributed_cluster_events.json",
      icon: <FileCode className="w-5 h-5 text-amber-300" />,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playTelegraphClick(900);
    setCustomFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split("\n").filter((l) => l.trim().length > 0);
      setCustomLineCount(lines.length);

      const parsed: LogEntry[] = lines.slice(0, 100).map((line, idx) =>
        parseRawLogLine(line, `CUSTOM-${idx + 1}`)
      );

      onLoadCustomLogs(parsed);
      playBrassChime();
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <VictorianFrame
        title="Imperial Telemetry Dataset Archive"
        subtitle="Dedicated dataset repository folder for raw logs and multi-variate telemetry streams"
        badge="DATASET-VAULT"
      >
        <div className="space-y-5">
          <p className="text-xs text-[#d8cce8] font-parchment leading-relaxed">
            The telemetry engine monitors the local <code className="text-[#ffd700] bg-white/10 px-2 py-0.5 rounded-md border border-white/10 font-telegraph">log_book_analyzer/dataset/</code>{" "}
            folder. You may place custom logs directly into the project repository or ingest them below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {datasets.map((d) => (
              <div
                key={d.id}
                onClick={() => {
                  playTelegraphClick(700);
                  setActivePreset(d.id);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all backdrop-blur-md ${
                  activePreset === d.id
                    ? "bg-white/12 border-[#f3cf7a] shadow-[0_0_20px_rgba(243,207,122,0.25)]"
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/8"
                }`}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                    {d.icon}
                  </div>
                  <span className="font-cinzel text-xs font-bold text-[#f5ecd7] truncate">
                    {d.name}
                  </span>
                </div>
                <span className="text-[10px] font-telegraph uppercase tracking-wider text-[#f3cf7a] block mb-1.5">
                  {d.format}
                </span>
                <p className="text-xs text-[#b8a7cb] font-parchment mb-4 line-clamp-2">
                  {d.description}
                </p>

                <a
                  href={d.path}
                  download={d.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-telegraph text-[#f3cf7a] border border-white/15 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
              </div>
            ))}
          </div>

          {/* File Upload Dropzone */}
          <div className="pt-2">
            <div className="border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center hover:border-[#f3cf7a] hover:bg-white/8 transition-all relative">
              <input
                type="file"
                accept=".log,.txt,.csv,.json"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-[#f3cf7a]" />
              </div>
              <span className="font-cinzel text-sm text-[#f5ecd7] block font-bold">
                Drop Custom Logbook Dataset or Click to Browse
              </span>
              <span className="text-xs text-white/50 font-telegraph block mt-1">
                Supports .log, .txt (Apache/Nginx/Syslog), .csv, and .json
              </span>

              {customFileName && (
                <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-telegraph rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Loaded <strong>{customFileName}</strong> ({customLineCount} lines parsed into Telemetry Engine)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </VictorianFrame>
    </div>
  );
}
