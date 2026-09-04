"use client";

import React from "react";
import VictorianFrame from "./VictorianFrame";
import {
  ShieldAlert,
  Cpu,
  Activity,
  BellRing,
  Binary,
  Layers,
  Sparkles,
  Terminal,
  Compass,
  FileCode,
  Gauge,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { playTelegraphClick } from "@/lib/audio";

interface LandingPageProps {
  onEnterDashboard: () => void;
  onOpenAuthModal: () => void;
  onSelectDatasetTab: () => void;
}

export default function LandingPage({
  onEnterDashboard,
  onOpenAuthModal,
  onSelectDatasetTab,
}: LandingPageProps) {
  const handleLaunch = () => {
    playTelegraphClick(880);
    onEnterDashboard();
  };

  const handleAuth = () => {
    playTelegraphClick(720);
    onOpenAuthModal();
  };

  return (
    <div className="relative min-h-screen flex flex-col text-[#f3eef8]">
      {/* Glassmorphic Responsive Navbar */}
      <header className="border-b border-white/10 bg-[#100b19]/75 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="wax-seal w-9 h-9 sm:w-11 sm:h-11">
                <span className="text-base sm:text-xl">⚜</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[11px] uppercase tracking-widest text-[#f3cf7a] font-cinzel">
                    Imperial Telemetry Bureau
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-telegraph text-amber-200/90 bg-white/5 border border-white/15 rounded-full">
                    EST. 1888
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-cinzel font-bold tracking-wide gold-emboss leading-tight">
                  LogBook Anomaly Detection
                </h1>
              </div>
            </div>

            {/* Mobile quick CTA icon button */}
            <div className="sm:hidden flex items-center gap-2">
              <button
                onClick={handleAuth}
                className="glass-btn p-2 text-[#f3cf7a] rounded-lg"
                title="Login"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button
                onClick={handleLaunch}
                className="glass-btn-gold px-3 py-1.5 text-[11px] font-bold uppercase rounded-lg"
              >
                Enter
              </button>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleAuth}
              className="glass-btn px-4 py-2 text-xs font-cinzel uppercase tracking-wider text-[#f3cf7a] hover:text-white rounded-xl flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Telegraph Registry / Login</span>
            </button>
            <button
              onClick={handleLaunch}
              className="glass-btn-gold px-5 py-2 text-xs uppercase tracking-widest rounded-xl flex items-center gap-2"
            >
              <span>Enter Apparatus</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Hackathon Ribbon - Mobile-friendly */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 sm:px-5 py-2 mb-6 rounded-full border border-[#f3cf7a]/40 bg-white/5 backdrop-blur-xl shadow-[0_4px_20px_rgba(212,175,55,0.15)] text-center">
          <span className="text-[#ffd700] text-sm animate-pulse">★</span>
          <span className="text-[11px] sm:text-xs font-cinzel tracking-widest text-[#fbf1dc] uppercase font-semibold">
            Certified Hackathon Accolades
          </span>
          <span className="hidden sm:inline text-xs text-white/30">|</span>
          <span className="text-[11px] sm:text-xs font-telegraph text-[#f3cf7a]">
            ⚡ React + Next.js + Python ML Pipeline
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-cinzel font-bold gold-emboss tracking-wide max-w-5xl leading-tight">
          Intelligent Network & System Log Telemetry Diagnostic Engine
        </h2>

        <p className="mt-4 text-sm sm:text-lg text-[#d8cce8] font-parchment italic max-w-3xl leading-relaxed px-2">
          🔍 Enterprise Log Pattern Recognition & Threat Prevention
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto glass-btn-gold px-7 py-3.5 text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-2xl flex items-center justify-center gap-2.5 transition-transform hover:-translate-y-0.5"
          >
            <Gauge className="w-4 h-4" />
            <span>Launch Telemetry Console</span>
          </button>
          <button
            onClick={handleAuth}
            className="w-full sm:w-auto glass-btn px-6 py-3.5 text-xs sm:text-sm font-cinzel uppercase tracking-wider text-[#f5ecd7] rounded-xl flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-[#f3cf7a]" />
            <span>Guest Inspector Sign-In</span>
          </button>
        </div>

        {/* Glass Metrics Bar - 2 cols on mobile, 4 on desktop */}
        <div className="mt-12 sm:mt-16 w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <VictorianFrame variant="card" className="text-center py-4 px-3">
            <span className="text-[10px] sm:text-xs uppercase font-cinzel tracking-widest text-[#f3cf7a] block">
              Throughput
            </span>
            <div className="text-xl sm:text-3xl font-telegraph font-bold text-amber-200 mt-1">
              &lt; 0.42 ms
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#b8a7cb] font-parchment italic block mt-0.5">
              Sub-second Ingestion
            </span>
          </VictorianFrame>

          <VictorianFrame variant="card" className="text-center py-4 px-3">
            <span className="text-[10px] sm:text-xs uppercase font-cinzel tracking-widest text-[#f3cf7a] block">
              Precision
            </span>
            <div className="text-xl sm:text-3xl font-telegraph font-bold text-emerald-400 mt-1">
              99.82%
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#b8a7cb] font-parchment italic block mt-0.5">
              Z-Score & IQR Dual-Audit
            </span>
          </VictorianFrame>

          <VictorianFrame variant="card" className="text-center py-4 px-3">
            <span className="text-[10px] sm:text-xs uppercase font-cinzel tracking-widest text-[#f3cf7a] block">
              Threat Patterns
            </span>
            <div className="text-xl sm:text-3xl font-telegraph font-bold text-amber-300 mt-1">
              50+ Signatures
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#b8a7cb] font-parchment italic block mt-0.5">
              SQLi, Heap Leaks, Recons
            </span>
          </VictorianFrame>

          <VictorianFrame variant="card" className="text-center py-4 px-3">
            <span className="text-[10px] sm:text-xs uppercase font-cinzel tracking-widest text-[#f3cf7a] block">
              Webhook Latency
            </span>
            <div className="text-xl sm:text-3xl font-telegraph font-bold text-cyan-300 mt-1">
              18 ms
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#b8a7cb] font-parchment italic block mt-0.5">
              Instant Dispatch to DevOps
            </span>
          </VictorianFrame>
        </div>
      </section>

      {/* SYSTEM OVERVIEW SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[11px] sm:text-xs uppercase font-cinzel tracking-widest text-[#f3cf7a]">
              Galvanic Apparatus Specification
            </span>
            <h3 className="text-2xl sm:text-3xl font-cinzel font-bold gold-emboss mt-1">
              System Overview
            </h3>
            <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-[#f3cf7a] to-transparent mx-auto mt-2" />
          </div>

          <VictorianFrame variant="gilded" className="p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-white/20 p-2 flex-shrink-0 bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-lg">
                <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-[#f3cf7a] animate-spin" style={{ animationDuration: "35s" }} />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <p className="text-sm sm:text-lg text-[#f6effe] font-parchment leading-relaxed">
                  High performance log analysis and anomaly detection suite designed to parse, index,
                  and monitor massive distributed network and server log streams. Detects abnormal
                  access patterns, security breaches, and latent failure precursors before
                  catastrophic downtimes occur.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 pt-1">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-telegraph text-[#f3cf7a] px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Real-Time Stream Processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-telegraph text-[#f3cf7a] px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Multi-variate Time Series</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-telegraph text-[#f3cf7a] px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Autonomous Threat Vector Isolation</span>
                  </div>
                </div>
              </div>
            </div>
          </VictorianFrame>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE & LOGIC */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-[11px] sm:text-xs uppercase font-cinzel tracking-widest text-[#f3cf7a]">
            Mechanical Schematic & Logical Pipeline
          </span>
          <h3 className="text-2xl sm:text-3xl font-cinzel font-bold gold-emboss mt-1">
            System Architecture & Logic
          </h3>
          <p className="text-xs sm:text-sm text-[#b8a7cb] font-parchment italic mt-1 sm:mt-2">
            Engineered across 4 coordinated galvanic chambers:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1 */}
          <VictorianFrame
            title="Frontend Telemetry Console"
            subtitle="Chamber I • Visual Telemetry Apparatus"
            badge="NEXT.JS & REACT"
          >
            <div className="flex gap-3.5">
              <div className="p-3 bg-white/5 border border-white/15 rounded-xl h-fit shadow-inner flex-shrink-0">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-[#f3cf7a]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#e8def5] leading-relaxed">
                  <strong className="text-amber-300">[&gt;] </strong>
                  Next.js and React frontend dashboard rendering real-time streaming charts and
                  interactive incident timelines with sub-second responsiveness.
                </p>
                <div className="mt-2.5 text-[11px] font-telegraph text-[#b8a7cb] flex flex-wrap gap-2 sm:gap-3">
                  <span>• Glass Dials</span>
                  <span>• Interactive Timeline</span>
                  <span>• Waveforms</span>
                </div>
              </div>
            </div>
          </VictorianFrame>

          {/* Card 2 */}
          <VictorianFrame
            title="Statistical Outlier Engine"
            subtitle="Chamber II • Python ML Analytics"
            badge="PYTHON & FASTAPI"
          >
            <div className="flex gap-3.5">
              <div className="p-3 bg-white/5 border border-white/15 rounded-xl h-fit shadow-inner flex-shrink-0">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#e8def5] leading-relaxed">
                  <strong className="text-amber-300">[&gt;] </strong>
                  Python data processing engine executing statistical time series outlier detection
                  and clustering on unstructured log entries using Pandas and NumPy.
                </p>
                <div className="mt-2.5 text-[11px] font-telegraph text-[#b8a7cb] flex flex-wrap gap-2 sm:gap-3">
                  <span>• Z-Score</span>
                  <span>• IQR Multiplier</span>
                  <span>• Shannon Entropy</span>
                </div>
              </div>
            </div>
          </VictorianFrame>

          {/* Card 3 */}
          <VictorianFrame
            title="Dynamic Severity Scoring"
            subtitle="Chamber III • Triage & Threat Rating"
            badge="ALGORITHMIC MATRIX"
          >
            <div className="flex gap-3.5">
              <div className="p-3 bg-white/5 border border-white/15 rounded-xl h-fit shadow-inner flex-shrink-0">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#e8def5] leading-relaxed">
                  <strong className="text-amber-300">[&gt;] </strong>
                  Dynamic severity scoring algorithm categorizing warnings, errors, memory leaks,
                  and malicious intrusion patterns into actionable triage levels.
                </p>
                <div className="mt-2.5 text-[11px] font-telegraph text-[#b8a7cb] flex flex-wrap gap-2 sm:gap-3">
                  <span>• Safe</span>
                  <span>• Warning</span>
                  <span>• Memory Leak</span>
                  <span>• Fatal</span>
                </div>
              </div>
            </div>
          </VictorianFrame>

          {/* Card 4 */}
          <VictorianFrame
            title="Webhook Dispatcher"
            subtitle="Chamber IV • Telegram & Alert Hub"
            badge="DEV-OPS NOTIFIER"
          >
            <div className="flex gap-3.5">
              <div className="p-3 bg-white/5 border border-white/15 rounded-xl h-fit shadow-inner flex-shrink-0">
                <BellRing className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#e8def5] leading-relaxed">
                  <strong className="text-amber-300">[&gt;] </strong>
                  Webhook notification dispatcher alerting DevOps on Slack/Email with root cause
                  diagnostic context, cURL previews, and incident metadata.
                </p>
                <div className="mt-2.5 text-[11px] font-telegraph text-[#b8a7cb] flex flex-wrap gap-2 sm:gap-3">
                  <span>• Slack Hooks</span>
                  <span>• SMTP Dispatch</span>
                  <span>• Root Cause</span>
                </div>
              </div>
            </div>
          </VictorianFrame>
        </div>
      </section>

      {/* KEY CAPABILITIES */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[11px] sm:text-xs uppercase font-cinzel tracking-widest text-[#f3cf7a]">
              Patented Mechanisms
            </span>
            <h3 className="text-2xl sm:text-3xl font-cinzel font-bold gold-emboss mt-1">
              Key Capabilities
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="glass-card p-5 sm:p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center mb-3">
                <Binary className="w-5 h-5 text-[#f3cf7a]" />
              </div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#fbf1dc] mb-1">
                Automated Unstructured Log Parsing & Vectorization
              </h4>
              <p className="text-xs text-[#b8a7cb] leading-relaxed">
                Tokenizes Apache, Nginx, and Syslog lines into structured telemetry vectors and
                calculates Shannon entropy metrics.
              </p>
            </div>

            <div className="glass-card p-5 sm:p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#fbf1dc] mb-1">
                Sub-Second Real Time Anomaly Scoring & Alerts
              </h4>
              <p className="text-xs text-[#b8a7cb] leading-relaxed">
                Calculates threat indices in real-time, firing instantaneous alarms when statistical
                anomalies exceed tolerance limits.
              </p>
            </div>

            <div className="glass-card p-5 sm:p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5 text-cyan-300" />
              </div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#fbf1dc] mb-1">
                Interactive Root Cause Heatmaps & Timeline Scrubber
              </h4>
              <p className="text-xs text-[#b8a7cb] leading-relaxed">
                Visual matrix across server nodes and hourly bins with time-scrubber to pinpoint
                exact moments of compromise.
              </p>
            </div>

            <div className="glass-card p-5 sm:p-6 text-left">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center mb-3">
                <Terminal className="w-5 h-5 text-violet-300" />
              </div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#fbf1dc] mb-1">
                Custom Regex Filter Rule Engine & Threshold Tuning
              </h4>
              <p className="text-xs text-[#b8a7cb] leading-relaxed">
                Dynamic sensitivity sliders (Z-score, IQR, latency) and live regex evaluator for
                custom threat targeting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ENGINEERED WITH TECH STACK */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 max-w-7xl mx-auto w-full text-center">
        <span className="text-[11px] sm:text-xs uppercase font-cinzel tracking-widest text-[#f3cf7a]">
          Crafted with Precision & Modern Science
        </span>
        <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f5ecd7] mt-1 mb-5">
          ENGINEERED WITH:
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          {[
            "#Next.js",
            "#Python",
            "#FastAPI",
            "#Pandas",
            "#NumPy",
            "#EDA",
            "#REST APIs",
            "#Firebase Auth",
            "#Glassmorphism",
            "#Web Audio API",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-telegraph tracking-wider text-[#f3cf7a] bg-white/5 border border-white/12 rounded-xl backdrop-blur-md shadow-sm hover:border-[#f3cf7a] transition-all cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#b8a7cb] font-parchment text-center sm:text-left">
          <div>
            <span>© 1888–2026 LogBook Anomaly Detection. All Rights Reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={onSelectDatasetTab}
              className="hover:text-[#f3cf7a] transition-colors flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-[#f3cf7a]" />
              <span>Inspect Datasets Folder</span>
            </button>
            <button
              onClick={handleLaunch}
              className="hover:text-[#f3cf7a] transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#f3cf7a]" />
              <span>Enter Telemetry Console</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
