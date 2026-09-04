"use client";

import React, { useState } from "react";
import VictorianFrame from "./VictorianFrame";
import { DetectionThresholds } from "@/lib/anomalyDetector";
import { playTelegraphClick } from "@/lib/audio";
import { Sliders, Wrench, CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";

interface RegexEngineProps {
  thresholds: DetectionThresholds;
  onUpdateThresholds: (updated: DetectionThresholds) => void;
}

export default function RegexEngine({ thresholds, onUpdateThresholds }: RegexEngineProps) {
  const [testLine, setTestLine] = useState(
    '192.168.1.100 - - [04/Sep/2026] "POST /api/v1/query?q=1\' UNION SELECT password FROM users-- HTTP/1.1" 500 1200 850ms'
  );

  const presets = [
    {
      name: "SQL Injection Vectors",
      pattern: "(?i)(UNION|SELECT|DROP|INSERT|OR\\s+['\\d]=['\\d]|SLEEP)",
    },
    {
      name: "Memory Leaks & OOM",
      pattern: "(?i)(OutOfMemoryError|heap\\s+space|GC\\s+overhead|leak)",
    },
    {
      name: "Authentication Brute-Force",
      pattern: "(?i)(wp-login|/admin|401|invalid\\s+credentials)",
    },
    {
      name: "Directory Reconnaissance",
      pattern: "(\\.\\./|/etc/passwd|\\.env|/\\.git)",
    },
  ];

  const handlePresetClick = (pat: string) => {
    playTelegraphClick(850);
    onUpdateThresholds({ ...thresholds, regexPattern: pat });
  };

  const handleReset = () => {
    playTelegraphClick(600);
    onUpdateThresholds({
      zScoreThreshold: 2.2,
      iqrMultiplier: 1.5,
      latencySpikeMs: 650,
      entropyCutoff: 3.5,
      regexPattern: "(?i)(UNION|SELECT|wp-admin|OutOfMemoryError|40[1-4]|50[0-4])",
    });
  };

  // Evaluate current regex test match
  let isMatch = false;
  let regexError: string | null = null;
  try {
    let cleanPat = thresholds.regexPattern;
    let flags = "i";
    if (cleanPat.startsWith("(?i)")) {
      cleanPat = cleanPat.slice(4);
    }
    const re = new RegExp(cleanPat, flags);
    isMatch = re.test(testLine);
  } catch (err: any) {
    regexError = err.message;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Panel 1: Threshold Tuning Sliders */}
      <VictorianFrame
        title="Apparatus Sensitivity & Threshold Tuning"
        subtitle="Calibrate statistical variance cutoffs and latency limits"
        badge="CALIBRATOR"
      >
        <div className="space-y-4 text-xs font-telegraph">
          {/* Z-Score Slider */}
          <div className="bg-white/5 p-4 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-2 text-[#f3cf7a]">
              <span>Z-Score Outlier Cutoff (σ)</span>
              <span className="font-bold text-amber-200">
                {thresholds.zScoreThreshold.toFixed(1)} σ
              </span>
            </div>
            <input
              type="range"
              min={1.0}
              max={4.0}
              step={0.1}
              value={thresholds.zScoreThreshold}
              onChange={(e) => {
                playTelegraphClick(700 + parseFloat(e.target.value) * 40);
                onUpdateThresholds({
                  ...thresholds,
                  zScoreThreshold: parseFloat(e.target.value),
                });
              }}
              className="w-full accent-[#f3cf7a] cursor-pointer"
            />
            <span className="text-[10px] text-white/50 italic font-parchment block mt-1">
              Lower sigma catches faint micro-drifts; higher catches only severe deviations.
            </span>
          </div>

          {/* IQR Multiplier */}
          <div className="bg-white/5 p-4 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-2 text-[#f3cf7a]">
              <span>Interquartile Range (IQR) Factor</span>
              <span className="font-bold text-amber-200">
                {thresholds.iqrMultiplier.toFixed(1)} × IQR
              </span>
            </div>
            <input
              type="range"
              min={1.0}
              max={3.0}
              step={0.1}
              value={thresholds.iqrMultiplier}
              onChange={(e) => {
                playTelegraphClick(700 + parseFloat(e.target.value) * 40);
                onUpdateThresholds({
                  ...thresholds,
                  iqrMultiplier: parseFloat(e.target.value),
                });
              }}
              className="w-full accent-[#f3cf7a] cursor-pointer"
            />
          </div>

          {/* Latency Spike Ms */}
          <div className="bg-white/5 p-4 border border-white/10 rounded-xl backdrop-blur-md">
            <div className="flex justify-between items-center mb-2 text-[#f3cf7a]">
              <span>Latency Anomaly Ceiling</span>
              <span className="font-bold text-amber-200">
                {thresholds.latencySpikeMs} ms
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={2500}
              step={50}
              value={thresholds.latencySpikeMs}
              onChange={(e) => {
                playTelegraphClick(600 + parseInt(e.target.value, 10) / 4);
                onUpdateThresholds({
                  ...thresholds,
                  latencySpikeMs: parseInt(e.target.value, 10),
                });
              }}
              className="w-full accent-[#f3cf7a] cursor-pointer"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleReset}
              className="text-xs font-cinzel text-[#f3cf7a] hover:text-white flex items-center gap-1.5 uppercase tracking-wider transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Factory Calibration</span>
            </button>
          </div>
        </div>
      </VictorianFrame>

      {/* Panel 2: Custom Regex Rule Engine */}
      <VictorianFrame
        title="Custom Regex Rule Engine"
        subtitle="Inject signature filters into the real-time parsing stream"
        badge="PATTERN-MATCHER"
      >
        <div className="space-y-4 text-xs font-telegraph">
          {/* Active Pattern Input */}
          <div>
            <label className="block text-[11px] font-cinzel text-[#f3cf7a] uppercase tracking-wider mb-2">
              Active Regular Expression Pattern:
            </label>
            <input
              type="text"
              value={thresholds.regexPattern}
              onChange={(e) =>
                onUpdateThresholds({ ...thresholds, regexPattern: e.target.value })
              }
              className="w-full glass-input px-3.5 py-2.5 text-amber-100 rounded-xl font-telegraph"
            />
            {regexError && (
              <span className="text-rose-400 text-[10px] mt-1 block">
                Syntax Error: {regexError}
              </span>
            )}
          </div>

          {/* Presets */}
          <div>
            <span className="text-[10px] font-cinzel text-white/50 uppercase tracking-wider block mb-2">
              Imperial Preset Signatures:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handlePresetClick(p.pattern)}
                  className="px-3 py-2 bg-white/5 border border-white/10 hover:border-[#f3cf7a] rounded-xl text-[11px] text-left text-[#f3cf7a] truncate transition-all backdrop-blur-md"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Evaluation Sandbox */}
          <div className="bg-white/5 p-4 border border-white/10 rounded-xl space-y-2.5 backdrop-blur-md">
            <span className="text-[10px] text-white/50 uppercase tracking-wider block">
              Sandbox Validation Line:
            </span>
            <input
              type="text"
              value={testLine}
              onChange={(e) => setTestLine(e.target.value)}
              className="w-full glass-input px-3 py-2 text-xs text-white/90 rounded-lg"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-white/50">Rule Evaluation:</span>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold ${
                  isMatch
                    ? "bg-rose-500/20 border border-rose-500/40 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                    : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                }`}
              >
                {isMatch ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>PATTERN DETECTED & INTERCEPTED</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NO MATCH (NOMINAL PASS)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </VictorianFrame>
    </div>
  );
}
