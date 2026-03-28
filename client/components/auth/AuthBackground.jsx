"use client";

import { useEffect, useRef } from "react";

const PARTICLES = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  duration: 6 + Math.random() * 10,
  delay: Math.random() * 8,
  opacity: 0.15 + Math.random() * 0.35,
}));

const RUPEES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: (i * 23 + 5) % 100,
  y: (i * 17 + 8) % 100,
  size: 18 + Math.random() * 28,
  duration: 10 + Math.random() * 14,
  delay: Math.random() * 10,
}));

export default function AuthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0px) scale(1);   opacity: var(--op); }
          50%  { transform: translateY(-22px) scale(1.08); opacity: calc(var(--op) * 1.4); }
          100% { transform: translateY(0px) scale(1);   opacity: var(--op); }
        }
        @keyframes driftRupee {
          0%   { transform: translateY(0px) rotate(0deg);   opacity: var(--rop); }
          40%  { transform: translateY(-14px) rotate(6deg);  opacity: calc(var(--rop) * 1.6); }
          70%  { transform: translateY(-8px) rotate(-4deg); opacity: var(--rop); }
          100% { transform: translateY(0px) rotate(0deg);   opacity: var(--rop); }
        }
        @keyframes pulseOrb {
          0%, 100% { transform: scale(1);   opacity: 0.10; }
          50%       { transform: scale(1.15); opacity: 0.17; }
        }
        @keyframes pulseOrbGreen {
          0%, 100% { transform: scale(1);   opacity: 0.07; }
          50%       { transform: scale(1.2);  opacity: 0.13; }
        }
      `}</style>

      {/* Pulsing glow orbs */}
      <div
        className="absolute rounded-full blur-[130px]"
        style={{
          top: "15%", left: "10%", width: 420, height: 420,
          background: "#f5a623",
          animation: "pulseOrb 7s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-[110px]"
        style={{
          bottom: "10%", right: "8%", width: 340, height: 340,
          background: "#10b981",
          animation: "pulseOrbGreen 9s ease-in-out infinite 2s",
        }}
      />
      <div
        className="absolute rounded-full blur-[90px]"
        style={{
          top: "55%", left: "55%", width: 260, height: 260,
          background: "#3b82f6",
          opacity: 0.06,
          animation: "pulseOrb 11s ease-in-out infinite 4s",
        }}
      />

      {/* Floating dot particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#f5a623]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            "--op": p.opacity,
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}

      {/* Drifting ₹ symbols */}
      {RUPEES.map((r) => (
        <span
          key={r.id}
          className="absolute font-bold select-none"
          style={{
            left: `${r.x}%`,
            top: `${r.y}%`,
            fontSize: r.size,
            color: "#f5a623",
            "--rop": 0.055,
            opacity: 0.055,
            fontFamily: "var(--font-heading)",
            animation: `driftRupee ${r.duration}s ease-in-out infinite ${r.delay}s`,
          }}
        >
          ₹
        </span>
      ))}

      {/* Subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
