"use client";

import React, { useState } from "react";
import {
  createGuestInspector,
  loginWithEmail,
  registerWithEmail,
  type UserProfile,
} from "@/lib/firebase";
import { playTelegraphClick, playBrassChime } from "@/lib/audio";
import { X, KeyRound, ShieldCheck, UserCheck, Sparkles, Settings } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"guest" | "email" | "config">("guest");
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Custom Firebase Config state
  const [customApiKey, setCustomApiKey] = useState("");
  const [customProjectId, setCustomProjectId] = useState("");

  if (!isOpen) return null;

  const handleGuestLogin = () => {
    playTelegraphClick(950);
    playBrassChime();
    setLoading(true);
    setTimeout(() => {
      const guest = createGuestInspector();
      setLoading(false);
      onSuccess(guest);
      onClose();
    }, 400);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    playTelegraphClick(800);

    try {
      let profile: UserProfile;
      if (isRegistering) {
        profile = await registerWithEmail(email, password);
      } else {
        profile = await loginWithEmail(email, password);
      }
      playBrassChime();
      onSuccess(profile);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Telegraph connection denied.");
    } finally {
      setLoading(false);
    }
  };

  const saveCustomConfig = () => {
    playTelegraphClick(700);
    if (typeof window !== "undefined") {
      const config = {
        apiKey: customApiKey,
        projectId: customProjectId,
        authDomain: `${customProjectId}.firebaseapp.com`,
      };
      localStorage.setItem("victorian_firebase_config", JSON.stringify(config));
      alert("Custom Firebase credentials registered with the Imperial Gateway!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto glass-card-gilded p-5 sm:p-8 rounded-2xl shadow-2xl text-[#f5ecd7] border border-white/15">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Herald Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="wax-seal mx-auto mb-2.5 sm:mb-3 w-10 h-10 sm:w-12 sm:h-12">
            <span className="text-lg sm:text-2xl">⚖</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-telegraph uppercase tracking-widest text-[#f3cf7a]">
            Imperial Registry of Telegraphists
          </span>
          <h3 className="text-xl sm:text-2xl font-cinzel font-bold gold-emboss mt-0.5">
            Authenticate & Enter Apparatus
          </h3>
          <p className="text-[11px] sm:text-xs text-[#b8a7cb] font-parchment italic mt-1">
            Certified Telemetry Operator Access Required
          </p>
        </div>

        {/* Glass Tabs */}
        <div className="flex border-b border-white/10 mb-5 sm:mb-6 text-[11px] sm:text-xs font-cinzel uppercase tracking-wider">
          <button
            onClick={() => {
              playTelegraphClick(600);
              setTab("guest");
            }}
            className={`flex-1 py-2 sm:py-2.5 text-center transition-all ${
              tab === "guest"
                ? "border-b-2 border-[#f3cf7a] text-[#ffd700] font-bold"
                : "text-white/50 hover:text-white/90"
            }`}
          >
            Guest Inspector
          </button>
          <button
            onClick={() => {
              playTelegraphClick(600);
              setTab("email");
            }}
            className={`flex-1 py-2 sm:py-2.5 text-center transition-all ${
              tab === "email"
                ? "border-b-2 border-[#f3cf7a] text-[#ffd700] font-bold"
                : "text-white/50 hover:text-white/90"
            }`}
          >
            Firebase Auth
          </button>
          <button
            onClick={() => {
              playTelegraphClick(600);
              setTab("config");
            }}
            className={`py-2 sm:py-2.5 px-3 text-center transition-all ${
              tab === "config"
                ? "border-b-2 border-[#f3cf7a] text-[#ffd700] font-bold"
                : "text-white/50 hover:text-white/90"
            }`}
            title="Configure Firebase Keys"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab 1: Guest Inspector Login */}
        {tab === "guest" && (
          <div className="space-y-4 sm:space-y-5 text-center">
            <div className="p-3.5 sm:p-4 bg-white/5 border border-white/10 rounded-xl text-left backdrop-blur-md">
              <div className="flex items-center gap-2 text-[#f3cf7a] text-xs font-cinzel font-bold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Immediate Apparatus Clearance</span>
              </div>
              <p className="text-xs text-[#d8cce8] leading-relaxed">
                Step in immediately as an accredited <strong>Guest Telemetry Inspector</strong>. No
                external credentials or setup required. Grants full privileges across all live log
                streams, dials, and telemetry modules.
              </p>
            </div>

            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full glass-btn-gold py-3 text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{loading ? "Forging Credentials..." : "Enter as Guest Inspector"}</span>
            </button>
          </div>
        )}

        {/* Tab 2: Firebase Email & Password */}
        {tab === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-left">
            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 text-xs text-red-200 rounded-lg">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-cinzel text-[#f3cf7a] uppercase tracking-wider mb-1">
                Telegraphist Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@royal-telegraph.org"
                className="w-full glass-input px-3 py-2 text-xs sm:text-sm font-telegraph rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel text-[#f3cf7a] uppercase tracking-wider mb-1">
                Galvanic Passphrase
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full glass-input px-3 py-2 text-xs sm:text-sm font-telegraph rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full glass-btn-gold py-3 text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {loading
                  ? "Transmitting..."
                  : isRegistering
                  ? "Register with Imperial Bureau"
                  : "Sign In via Firebase Auth"}
              </span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-[#f3cf7a] hover:underline font-parchment"
              >
                {isRegistering
                  ? "Already registered? Sign in here."
                  : "Need a new credentials registry? Register here."}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Custom Firebase Config */}
        {tab === "config" && (
          <div className="space-y-3.5 text-left text-xs">
            <p className="text-[#d8cce8] leading-relaxed">
              Connect your own live Google Firebase Project. Leave blank to run with the built-in
              Victorian demonstration registry.
            </p>

            <div>
              <label className="block font-cinzel text-[#f3cf7a] uppercase mb-1">
                Firebase API Key
              </label>
              <input
                type="text"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full glass-input px-3 py-2 text-xs font-telegraph rounded-lg"
              />
            </div>

            <div>
              <label className="block font-cinzel text-[#f3cf7a] uppercase mb-1">
                Project ID
              </label>
              <input
                type="text"
                value={customProjectId}
                onChange={(e) => setCustomProjectId(e.target.value)}
                placeholder="my-telemetry-project"
                className="w-full glass-input px-3 py-2 text-xs font-telegraph rounded-lg"
              />
            </div>

            <button
              onClick={saveCustomConfig}
              className="w-full py-2.5 glass-btn text-[#f3cf7a] hover:text-white rounded-lg uppercase tracking-wider font-cinzel font-bold"
            >
              Save Credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
