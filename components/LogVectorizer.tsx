"use client";

import React from "react";
import VictorianFrame from "./VictorianFrame";
import { LogEntry } from "@/lib/sampleData";
import { calculateShannonEntropy } from "@/lib/anomalyDetector";

interface LogVectorizerProps {
  selectedLog?: LogEntry | null;
}

export default function LogVectorizer({ selectedLog }: LogVectorizerProps) {
  const defaultSample: LogEntry = {
    id: "LOG-DEMO-SAMPLE",
    timestamp: "12:06:14",
    ip: "45.155.205.233",
    method: "POST",
    path: "/api/v1/query?q=1' UNION SELECT username,password_hash FROM admin_vault--",
    status: 500,
    latencyMs: 420,
    sizeBytes: 1200,
    node: "node-victoria-02",
    severity: "CRITICAL",
    anomalyTag: "SQL_INJECTION_EXPLOIT",
    raw: '45.155.205.233 - - [04/Sep/2026:12:06:14] "POST /api/v1/query?q=1\' UNION SELECT username,password_hash FROM admin_vault-- HTTP/1.1" 500 1200 420ms [PAYLOAD_INTERCEPTED]',
    vector: [0.95, 0.42, 1.0, 0.94],
  };

  const log = selectedLog || defaultSample;
  const entropy = calculateShannonEntropy(log.path);

  return (
    <VictorianFrame
      title="Automated Unstructured Log Parsing & Vectorization"
      subtitle="Extracting high-dimensional feature vectors from raw syslog & web telemetry"
      badge="VECTORIZER"
    >
      <div className="space-y-4 text-xs font-telegraph">
        {/* Raw Unstructured Stream Preview */}
        <div>
          <span className="text-[10px] font-cinzel text-[#f3cf7a] uppercase tracking-wider block mb-1.5">
            Raw Unstructured Stream Input:
          </span>
          <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl text-white/80 break-all backdrop-blur-md">
            {log.raw}
          </div>
        </div>

        {/* Structured Field Decomposition */}
        <div>
          <span className="text-[10px] font-cinzel text-[#f3cf7a] uppercase tracking-wider block mb-2">
            Decomposed Semantic Attributes:
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <span className="text-[10px] text-white/50 block">Source Address</span>
              <span className="text-amber-200 font-bold">{log.ip}</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <span className="text-[10px] text-white/50 block">Protocol Verb</span>
              <span className="text-amber-200 font-bold">{log.method}</span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <span className="text-[10px] text-white/50 block">HTTP Status Code</span>
              <span
                className={`font-bold ${
                  log.status >= 500
                    ? "text-rose-400"
                    : log.status >= 400
                    ? "text-yellow-400"
                    : "text-emerald-400"
                }`}
              >
                {log.status}
              </span>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <span className="text-[10px] text-white/50 block">Shannon Entropy</span>
              <span
                className={`font-bold ${
                  entropy >= 3.8 ? "text-rose-400" : "text-amber-200"
                }`}
              >
                {entropy} bits
              </span>
            </div>
          </div>
        </div>

        {/* Feature Vector Embeddings Bar */}
        <div>
          <span className="text-[10px] font-cinzel text-[#f3cf7a] uppercase tracking-wider block mb-2">
            Mathematical Vector Embedding 4D [StatusRisk, LatencyNorm, AttackWeight, EntropyWeight]:
          </span>
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-amber-300 font-bold text-sm tracking-wider">
                [{log.vector.map((v) => v.toFixed(2)).join(", ")}]
              </span>
              <span className="px-3 py-1 text-[10px] bg-white/10 text-[#f3cf7a] border border-white/15 rounded-full uppercase backdrop-blur-md">
                Vector Clustered
              </span>
            </div>

            {/* Dimensional bars */}
            <div className="grid grid-cols-4 gap-3 pt-1 text-[10px]">
              {["Status Risk", "Latency Norm", "Attack Signature", "Entropy Norm"].map(
                (label, idx) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex justify-between text-white/60">
                      <span>{label}</span>
                      <span className="text-amber-200 font-bold">
                        {Math.round((log.vector[idx] || 0) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-[#ffd700] to-emerald-400 shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                        style={{
                          width: `${Math.min(100, (log.vector[idx] || 0) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </VictorianFrame>
  );
}
