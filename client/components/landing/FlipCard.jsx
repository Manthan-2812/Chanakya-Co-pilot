"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FlipCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, duration: 0.6 }}
      className="w-80 h-48 perspective cursor-pointer mt-10 select-none"
      onClick={() => setFlipped(!flipped)}
      title="Click to flip"
    >
      <div
        className={`relative w-full h-full preserve-3d transition-transform duration-700 ease-in-out ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ── FRONT: ₹ Note ── */}
        <div
          className="absolute w-full h-full rounded-2xl backface-hidden overflow-hidden border border-[#3a7a3a]/60"
          style={{ background: "linear-gradient(135deg, #1a4a1a 0%, #0d2e0d 60%, #163516 100%)" }}
        >
          {/* Watermark pattern */}
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-3 p-2 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="text-green-300 text-xs font-mono">₹</span>
            ))}
          </div>
          {/* Top strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f5a623] via-yellow-300 to-[#f5a623]" />
          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-5 z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-green-300/70 uppercase tracking-widest">भारत सरकार</p>
                <p className="text-[10px] text-green-300/70 tracking-widest">Government of India</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#f5a623]" style={{ fontFamily: "var(--font-heading)" }}>
                  ₹500
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-green-200/50 text-xs italic">— click to reveal —</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-green-100 text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  Chanakya
                </p>
                <p className="text-green-300/70 text-[10px]">Your Financial Co-Pilot</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#f5a623]/60 flex items-center justify-center text-[#f5a623] text-lg">
                ₹
              </div>
            </div>
          </div>
          {/* Bottom strip */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f5a623] via-yellow-300 to-[#f5a623]" />
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute w-full h-full rounded-2xl backface-hidden rotate-y-180 overflow-hidden border border-[var(--border-bright)]"
          style={{ background: "var(--gradient-card)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--gold)] via-yellow-300 to-[var(--gold)]" />
          <div className="relative h-full flex flex-col items-center justify-center p-6 text-center gap-3 z-10">
            <div className="w-10 h-10 rounded-full bg-[var(--gold-glow)] border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] text-xl">
              ₹
            </div>
            <p className="text-[var(--text-primary)] font-semibold text-sm leading-relaxed" style={{ fontFamily: "var(--font-heading)" }}>
              AI-powered portfolio intelligence for the Indian investor
            </p>
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
              Goal planning · Risk simulation · Real-time signals
            </p>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">₹ अर्थ को समझो, भविष्य को संवारो ₹</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--gold)] via-yellow-300 to-[var(--gold)]" />
        </div>
      </div>
    </motion.div>
  );
}