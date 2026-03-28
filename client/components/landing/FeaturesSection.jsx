"use client";

import { motion } from "framer-motion";
import { Target, Radio, BarChart2, Bot, Scale, MessageSquare } from "lucide-react";

const features = [
  {
    Icon: Target,
    tag: "Goal Planning",
    title: "Set Goals, Not Just Budgets",
    desc: "Define targets — house, car, retirement. Chanakya builds a personalised investment roadmap with risk-adjusted allocations.",
    color: "from-[#1a2d5a] to-[#0d1a3a]",
    accent: "#4a7fd4",
  },
  {
    Icon: Radio,
    tag: "Opportunity Radar",
    title: "Signal Finder, Not Summarizer",
    desc: "Continuously monitors filings, bulk deals, insider trades, and management commentary — surfaces alpha as daily alerts.",
    color: "from-[#2a1a0a] to-[#1a0d00]",
    accent: "#f5a623",
  },
  {
    Icon: BarChart2,
    tag: "Chart Intelligence",
    title: "Pattern Detection Across NSE",
    desc: "Real-time breakout, reversal, and divergence detection with plain-English explanation and back-tested success rates.",
    color: "from-[#0a2a1a] to-[#051510]",
    accent: "#10b981",
  },
  {
    Icon: Bot,
    tag: "Agentic AI",
    title: "3-Step Autonomous Analysis",
    desc: "Detect signal → Enrich with context → Generate actionable alert. No human input required between steps.",
    color: "from-[#1a0a2a] to-[#0d0515]",
    accent: "#a855f7",
  },
  {
    Icon: Scale,
    tag: "Risk Simulation",
    title: "Stress Test Your Portfolio",
    desc: "Simulate market crashes, inflation spikes, and rate hikes against your holdings. Know your real downside before it happens.",
    color: "from-[#2a0a0a] to-[#150505]",
    accent: "#ef4444",
  },
  {
    Icon: MessageSquare,
    tag: "Portfolio Chatbot",
    title: "Ask Anything About Your Money",
    desc: "Portfolio-aware answers with source-cited responses. Multi-step analysis that understands your goals and risk profile.",
    color: "from-[#0a1a2a] to-[#05101a]",
    accent: "#38bdf8",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 md:px-16 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)] border border-[var(--gold)]/30 px-3 py-1 rounded-full bg-[var(--gold-glow)]">
            What Chanakya Does
          </span>
          <h2
            className="mt-4 text-4xl md:text-5xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Intelligence that{" "}
            <span className="text-[var(--gold)]">acts</span>, not just informs
          </h2>
        </motion.div>

        {/* Feature Grid — flip cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="perspective h-52 cursor-pointer group"
            >
              {/* Inner — rotates on hover */}
              <div className="relative w-full h-full preserve-3d transition-transform duration-700 ease-in-out group-hover:rotate-y-180">

                {/* ── FRONT: Currency note style ── */}
                <div
                  className="absolute inset-0 rounded-2xl backface-hidden overflow-hidden border border-[#3a7a3a]/50"
                  style={{ background: "linear-gradient(135deg, #1a4a1a 0%, #0d2e0d 60%, #163516 100%)" }}
                >
                  {/* Watermark ₹ pattern */}
                  <div className="absolute inset-0 opacity-[0.08] flex flex-wrap gap-2 p-2 overflow-hidden pointer-events-none">
                    {Array.from({ length: 35 }).map((_, k) => (
                      <span key={k} className="text-green-300 text-xs font-mono">₹</span>
                    ))}
                  </div>
                  {/* Top gold strip */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f5a623] via-yellow-300 to-[#f5a623]" />
                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-5 z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-green-300/70 uppercase tracking-widest">भारत सरकार</p>
                        <p className="text-[10px] text-green-300/60">Government of India</p>
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                        style={{ color: f.accent, borderColor: `${f.accent}60`, background: `${f.accent}18` }}
                      >
                        {f.tag}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-green-100 font-bold text-base leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                          {f.title}
                        </p>
                        <p className="text-green-300/50 text-[11px] mt-0.5">Hover to learn more →</p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: `${f.accent}60`, color: f.accent }}
                      >
                        <f.Icon size={18} />
                      </div>
                    </div>
                  </div>
                  {/* Bottom gold strip */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f5a623] via-yellow-300 to-[#f5a623]" />
                </div>

                {/* ── BACK ── */}
                <div
                  className="absolute inset-0 rounded-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 text-center gap-4 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${f.accent}22, ${f.accent}08)`, border: `1px solid ${f.accent}40` }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ background: `linear-gradient(to right, transparent, ${f.accent}, transparent)` }}
                  />
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `${f.accent}20`, border: `1px solid ${f.accent}50`, color: f.accent }}
                  >
                    <f.Icon size={22} />
                  </div>
                  <p
                    className="text-[15px] leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {f.desc}
                  </p>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
                    style={{ background: `linear-gradient(to right, transparent, ${f.accent}, transparent)` }}
                  />
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
