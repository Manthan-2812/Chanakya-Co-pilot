"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ThreeBackground from "./ThreeBackground";
import FlipCard from "./FlipCard";

const TITLE = "Chanakya";
const SUBTITLE = "Your Financial Co-Pilot";
const SLOGAN = "अर्थ को समझो, भविष्य को संवारो";

function MoneyRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const symbols = ["₹", "₹", "₹", "$", "€", "₹", "▲", "▼", "₹"];
    const drops = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      speed: 0.4 + Math.random() * 0.8,
      size: 16 + Math.random() * 14,
      opacity: 0.28 + Math.random() * 0.22,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach((d) => {
        ctx.globalAlpha = d.opacity;
        ctx.fillStyle = "#f5a623";
        ctx.font = `${d.size}px 'Space Grotesk', monospace`;
        ctx.fillText(d.symbol, d.x, d.y);
        d.y += d.speed;
        if (d.y > canvas.height + 20) {
          d.y = -20;
          d.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
    />
  );
}

const letterVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -90 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.55, ease: "easeOut" },
  }),
};

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Three.js particle background */}
      <ThreeBackground />

      {/* Money rain */}
      <MoneyRain />

      {/* Radial glow */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,166,35,0.05) 0%, transparent 70%)" }}
      />

      {/* Main content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 px-4 py-1 rounded-full border border-[var(--gold)]/30 bg-[var(--gold-glow)] text-[var(--gold)] text-xs font-semibold uppercase tracking-widest"
        >
          AI Financial Intelligence Layer
        </motion.div>

        {/* Animated Title */}
        <h1
          className="flex flex-wrap justify-center gap-[2px] text-6xl md:text-8xl font-bold leading-none mb-1"
          style={{ fontFamily: "var(--font-heading)", perspective: "600px" }}
        >
          {TITLE.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-[var(--gold)] drop-shadow-[0_0_20px_rgba(245,166,35,0.6)]"
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-xl md:text-3xl font-medium text-[var(--text-primary)] mt-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {SUBTITLE}
        </motion.p>

        {/* Hindi Slogan */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-2 text-sm md:text-base text-[var(--gold)] font-medium italic tracking-wide"
        >
          {SLOGAN}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/auth"
            className="px-8 py-3 rounded-xl bg-[var(--gold)] text-[#080d1a] font-bold text-base hover:bg-[var(--gold-dim)] transition-all shadow-[0_0_24px_var(--gold-glow)] hover:shadow-[0_0_36px_var(--gold-glow)] hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
          <a
            href="#features"
            className="px-8 py-3 rounded-xl border border-[var(--border-bright)] text-[var(--text-primary)] font-semibold text-base hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
          >
            See Features →
          </a>
        </motion.div>

        {/* Flip Card */}
        <FlipCard />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg-primary))" }}
      />

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <span className="text-[var(--text-muted)] text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="w-0.5 h-6 bg-gradient-to-b from-[var(--gold)] to-transparent rounded-full"
        />
      </motion.div>
    </div>
  );
}