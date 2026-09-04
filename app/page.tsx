"use client";

import React, { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/components/Dashboard";
import { getSavedSession, createGuestInspector, UserProfile } from "@/lib/firebase";

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");
  const [isLoading, setIsLoading] = useState(true);

  // Restore saved session if any
  useEffect(() => {
    const saved = getSavedSession();
    if (saved) {
      setUser(saved);
    }
    setIsLoading(false);
  }, []);

  const handleEnterDashboard = () => {
    if (user) {
      setCurrentView("dashboard");
    } else {
      // Prompt auth modal
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setUser(profile);
    setCurrentView("dashboard");
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentView("landing");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#120a06] flex items-center justify-center text-[#d4af37] font-cinzel text-lg">
        <div className="text-center space-y-3">
          <div className="wax-seal mx-auto animate-spin" style={{ animationDuration: "12s" }}>
            <span>⚜</span>
          </div>
          <span className="tracking-widest block text-sm">Priming Galvanic Telemetry Valves...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#120a06] text-[#eadeca]">
      {currentView === "landing" ? (
        <LandingPage
          onEnterDashboard={handleEnterDashboard}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onSelectDatasetTab={() => {
            if (!user) {
              const guest = createGuestInspector();
              setUser(guest);
            }
            setCurrentView("dashboard");
          }}
        />
      ) : (
        user && (
          <Dashboard
            user={user}
            onSignOut={handleSignOut}
            onReturnToLanding={() => setCurrentView("landing")}
          />
        )
      )}

      {/* Firebase & Guest Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
