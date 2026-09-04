"use client";

import React, { useState } from "react";
import VictorianFrame from "./VictorianFrame";
import { playBrassChime, playTelegraphClick } from "@/lib/audio";
import { BellRing, Send, CheckCircle2, Copy, Radio, Terminal } from "lucide-react";

interface DispatchRecord {
  id: string;
  timestamp: string;
  channel: string;
  severity: string;
  status: "DELIVERED" | "TRANSMITTING";
  target: string;
}

export default function WebhookDispatcher() {
  const [channel, setChannel] = useState<"slack" | "email" | "custom">("slack");
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/T00/B00/VICTORIAN_KEY_882");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const [history, setHistory] = useState<DispatchRecord[]>([
    {
      id: "DSP-1888-01",
      timestamp: "12:06:15",
      channel: "SLACK",
      severity: "CRITICAL",
      status: "DELIVERED",
      target: "#devops-telemetry-alerts",
    },
    {
      id: "DSP-1888-02",
      timestamp: "12:04:16",
      channel: "EMAIL",
      severity: "FATAL",
      status: "DELIVERED",
      target: "oncall-sre@royal-telegraph.org",
    },
  ]);

  const payloadPreview = {
    incident_id: "INC-1888-488219",
    timestamp: new Date().toISOString(),
    engine: "LogBook Anomaly Detection & Telemetry Engine",
    triage_severity: "CRITICAL",
    affected_node: "node-victoria-02",
    root_cause_diagnosis: "SQL Injection Probe Cluster detected with elevated entropy (4.1 bits)",
    telemetry_metrics: {
      latency_ms: 420,
      cpu_surge: "87.4%",
      error_rate: "9.5%",
      vector_fingerprint: [0.95, 0.42, 1.0, 0.94],
    },
    action_required: "WAF Rule 88219 automated IP ban recommended. Inspect pneumatic SQL gateway.",
  };

  const handleTransmit = () => {
    playTelegraphClick(900);
    setIsTransmitting(true);

    setTimeout(() => {
      playBrassChime();
      setIsTransmitting(false);
      const newRecord: DispatchRecord = {
        id: `DSP-1888-${Math.floor(10 + Math.random() * 90)}`,
        timestamp: new Date().toTimeString().split(" ")[0],
        channel: channel.toUpperCase(),
        severity: "CRITICAL",
        status: "DELIVERED",
        target: channel === "slack" ? "#devops-telemetry-alerts" : "devops@company.org",
      };
      setHistory([newRecord, ...history]);
    }, 800);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payloadPreview, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <VictorianFrame
      title="DevOps Webhook & Telegraph Notification Dispatcher"
      subtitle="Autonomous incident alerting to DevOps on Slack, Email, and HTTP hooks"
      badge="ALERT-DISPATCHER"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs font-telegraph">
        {/* Dispatch Configuration */}
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-cinzel text-[#f3cf7a] uppercase tracking-wider mb-2">
              Notification Delivery Channel:
            </label>
            <div className="flex gap-2">
              {[
                { id: "slack", label: "Slack Webhook" },
                { id: "email", label: "DevOps SMTP / Email" },
                { id: "custom", label: "Custom REST Hook" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    playTelegraphClick(700);
                    setChannel(c.id as any);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl border uppercase text-[10px] tracking-wider transition-all backdrop-blur-md ${
                    channel === c.id
                      ? "bg-[#f3cf7a]/20 border-[#f3cf7a] text-[#ffd700] font-bold shadow-[0_0_12px_rgba(243,207,122,0.25)]"
                      : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-cinzel text-[#f3cf7a] uppercase tracking-wider mb-1.5">
              Destination Endpoint URI:
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 text-amber-100 rounded-xl font-telegraph"
            />
          </div>

          <button
            onClick={handleTransmit}
            disabled={isTransmitting}
            className="w-full glass-btn-gold py-3 text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {isTransmitting ? "Broadcasting via Galvanic Wire..." : "Transmit Test Dispatch"}
            </span>
          </button>

          {/* Dispatch Transmission Chronicle */}
          <div className="pt-2">
            <span className="text-[10px] font-cinzel text-[#f3cf7a] uppercase tracking-wider block mb-2">
              Recent Transmissions Chronicle:
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-[11px] backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-white/50">{h.timestamp}</span>
                    <span className="px-2 py-0.5 bg-white/10 border border-white/15 text-amber-200 rounded-full text-[10px]">
                      {h.channel}
                    </span>
                    <span className="text-white/80 truncate max-w-xs">{h.target}</span>
                  </div>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JSON Payload & Context Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-cinzel text-[#f3cf7a] uppercase tracking-wider">
              Diagnostic Context Payload (JSON):
            </span>
            <button
              onClick={handleCopyJson}
              className="text-[10px] text-[#ffd700] hover:underline flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? "Copied to Clipboard!" : "Copy Payload"}</span>
            </button>
          </div>

          <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-[#f3eef8] text-[11px] font-telegraph overflow-x-auto max-h-72 backdrop-blur-md">
            <pre>{JSON.stringify(payloadPreview, null, 2)}</pre>
          </div>
        </div>
      </div>
    </VictorianFrame>
  );
}
