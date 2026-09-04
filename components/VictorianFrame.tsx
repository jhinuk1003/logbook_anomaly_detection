"use client";

import React from "react";

interface VictorianFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  variant?: "card" | "gilded" | "parchment";
}

export default function VictorianFrame({
  children,
  className = "",
  title,
  subtitle,
  badge,
  variant = "card",
}: VictorianFrameProps) {
  const baseClass =
    variant === "gilded"
      ? "glass-card-gilded"
      : "glass-card";

  return (
    <div className={`p-6 ${baseClass} ${className}`}>
      {/* Header Bar */}
      {(title || badge) && (
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
          <div>
            {title && (
              <h3 className="text-lg font-cinzel tracking-wider text-[#f5ecd7] flex items-center gap-2">
                <span className="text-[#d4af37] text-sm">⚜</span>
                <span className="gold-emboss font-bold">{title}</span>
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#c5b59a]/90 font-parchment italic mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <span className="px-2.5 py-0.5 text-[11px] font-telegraph uppercase tracking-widest text-[#f5ecd7] border border-white/15 bg-white/5 backdrop-blur-md rounded-full shadow-inner">
              {badge}
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
