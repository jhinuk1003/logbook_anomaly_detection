"use client";

import React from "react";
import VictorianFrame from "./VictorianFrame";
import { ShieldCheck, AlertTriangle, Flame, ShieldAlert, Cpu } from "lucide-react";

interface AnomalyGaugesProps {
  threatIndex: number; // 0 to 100
  memoryLeakRisk: number; // 0 to 100
  intrusionConfidence: number; // 0 to 100
  systemIntegrity: number; // 0 to 100
  severity: "SAFE" | "WARNING" | "CRITICAL" | "FATAL";
}

export default function AnomalyGauges({
  threatIndex,
  memoryLeakRisk,
  intrusionConfidence,
  systemIntegrity,
  severity,
}: AnomalyGaugesProps) {
  const toGaugeAngle = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    return -90 + (clamped / 100) * 180;
  };

  const getSeverityBadge = () => {
    switch (severity) {
      case "FATAL":
        return {
          label: "FATAL OUTAGE / HEAP COLLAPSE",
          color: "bg-rose-950/50 text-rose-100 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.2)]",
          icon: <Flame className="w-5 h-5 text-rose-400 animate-bounce" />,
        };
      case "CRITICAL":
        return {
          label: "CRITICAL INTRUSION ATTACK",
          color: "bg-amber-950/50 text-amber-100 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
          icon: <ShieldAlert className="w-5 h-5 text-amber-300 animate-pulse" />,
        };
      case "WARNING":
        return {
          label: "LATENT DRIFT / HEAP ANOMALY",
          color: "bg-yellow-950/40 text-yellow-100 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.15)]",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-300" />,
        };
      default:
        return {
          label: "OPTIMAL GALVANIC EQUILIBRIUM",
          color: "bg-emerald-950/40 text-emerald-100 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        };
    }
  };

  const badge = getSeverityBadge();

  return (
    <div className="space-y-4">
      {/* Triage Severity Indicator Banner - Glass Pill */}
      <div
        className={`p-4 border rounded-xl backdrop-blur-xl flex items-center justify-between transition-all ${badge.color}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
            {badge.icon}
          </div>
          <div>
            <span className="text-[10px] font-telegraph tracking-widest uppercase opacity-80 block">
              Dynamic Severity Triage
            </span>
            <span className="font-cinzel text-sm md:text-base font-bold tracking-wider">
              {badge.label}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-telegraph uppercase opacity-80 block">
            Aggregated Threat
          </span>
          <span className="font-telegraph text-xl md:text-2xl font-bold text-amber-200">
            {threatIndex}%
          </span>
        </div>
      </div>

      {/* 4 Frosted Glass Rotary Dial Needles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gauge 1: Threat Severity */}
        <VictorianFrame variant="card" className="text-center p-5">
          <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#f3cf7a] block mb-3">
            Threat Severity Index
          </span>

          <div className="relative w-32 h-20 mx-auto overflow-hidden">
            <div className="w-32 h-32 rounded-full border-4 border-white/10 border-t-rose-500 border-r-amber-400 border-b-transparent border-l-emerald-500 absolute top-0 left-0" />
            <div className="w-24 h-24 rounded-full border border-white/10 absolute top-4 left-4" />

            <div
              className="absolute bottom-0 left-16 w-0.5 h-14 bg-amber-200 origin-bottom shadow-[0_0_8px_#ffd700] transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${toGaugeAngle(threatIndex)}deg)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-[4px] -mt-1 shadow-[0_0_6px_#f43f5e]" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#f3cf7a] border-2 border-[#120902] absolute bottom-0 left-14 z-10 shadow" />
          </div>

          <div className="mt-3 font-telegraph text-lg font-bold text-amber-200">
            {threatIndex} <span className="text-xs font-normal text-white/50">/ 100</span>
          </div>
        </VictorianFrame>

        {/* Gauge 2: Memory Leak Probability */}
        <VictorianFrame variant="card" className="text-center p-5">
          <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#f3cf7a] block mb-3">
            Latent Memory Leak
          </span>

          <div className="relative w-32 h-20 mx-auto overflow-hidden">
            <div className="w-32 h-32 rounded-full border-4 border-white/10 border-t-amber-500 border-r-rose-500 border-b-transparent border-l-cyan-400 absolute top-0 left-0" />
            <div
              className="absolute bottom-0 left-16 w-0.5 h-14 bg-amber-300 origin-bottom shadow-[0_0_8px_#fcd34d] transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${toGaugeAngle(memoryLeakRisk)}deg)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 -ml-[4px] -mt-1 shadow" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#f3cf7a] border-2 border-[#120902] absolute bottom-0 left-14 z-10 shadow" />
          </div>

          <div className="mt-3 font-telegraph text-lg font-bold text-amber-300">
            {memoryLeakRisk}%
          </div>
        </VictorianFrame>

        {/* Gauge 3: Intrusion Confidence */}
        <VictorianFrame variant="card" className="text-center p-5">
          <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#f3cf7a] block mb-3">
            Intrusion & Exploit Risk
          </span>

          <div className="relative w-32 h-20 mx-auto overflow-hidden">
            <div className="w-32 h-32 rounded-full border-4 border-white/10 border-t-violet-500 border-r-rose-500 border-b-transparent border-l-emerald-400 absolute top-0 left-0" />
            <div
              className="absolute bottom-0 left-16 w-0.5 h-14 bg-rose-400 origin-bottom shadow-[0_0_8px_#fb7185] transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${toGaugeAngle(intrusionConfidence)}deg)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-[4px] -mt-1 shadow" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#f3cf7a] border-2 border-[#120902] absolute bottom-0 left-14 z-10 shadow" />
          </div>

          <div className="mt-3 font-telegraph text-lg font-bold text-rose-300">
            {intrusionConfidence}%
          </div>
        </VictorianFrame>

        {/* Gauge 4: Steam Galvanic Integrity */}
        <VictorianFrame variant="card" className="text-center p-5">
          <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#f3cf7a] block mb-3">
            Apparatus Equilibrium
          </span>

          <div className="relative w-32 h-20 mx-auto overflow-hidden">
            <div className="w-32 h-32 rounded-full border-4 border-white/10 border-t-emerald-400 border-r-emerald-500 border-b-transparent border-l-rose-500 absolute top-0 left-0" />
            <div
              className="absolute bottom-0 left-16 w-0.5 h-14 bg-emerald-400 origin-bottom shadow-[0_0_8px_#34d399] transition-transform duration-700 ease-out"
              style={{ transform: `rotate(${toGaugeAngle(systemIntegrity)}deg)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-[4px] -mt-1 shadow" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#f3cf7a] border-2 border-[#120902] absolute bottom-0 left-14 z-10 shadow" />
          </div>

          <div className="mt-3 font-telegraph text-lg font-bold text-emerald-400">
            {systemIntegrity}%
          </div>
        </VictorianFrame>
      </div>
    </div>
  );
}
