"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Connect Your Goals",
    desc: "Tell Chanakya what you're investing for — house, retirement, education. Set your timeline and risk appetite.",
  },
  {
    step: "02",
    title: "AI Analyses Your Portfolio",
    desc: "The agent scans your holdings against market signals, filings, and technical patterns continuously.",
  },
  {
    step: "03",
    title: "Receive Actionable Signals",
    desc: "Not summaries — specific, goal-aware actions: buy, hold, exit, rebalance. With context and reasoning.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6 md:px-16 relative overflow-hidden">
      {/* Bg glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #f5a623, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--gold)] border border-[var(--gold)]/30 px-3 py-1 rounded-full bg-[var(--gold-glow)]">
            About Chanakya
          </span>
          <h2
            className="mt-5 text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Built for the{" "}
            <span className="text-[var(--gold)]">bharat</span> investor
          </h2>
          <p className="mt-5 text-[var(--text-secondary)] text-[16px] leading-relaxed">
            Inspired by Chanakya — the ancient Indian strategist whose Arthashastra
            laid the foundation of economic intelligence — we are building the modern
            equivalent for India's retail investor.
          </p>
          <p className="mt-3 text-[var(--text-secondary)] text-[16px] leading-relaxed">
            Not a news aggregator. Not a chatbot. An <span className="text-[var(--text-primary)] font-medium">agentic system</span> that
            detects signals, enriches them with context, and delivers decisions
            — autonomously, continuously, personally.
          </p>
          <Link
            href="/auth"
            className="inline-block mt-8 px-7 py-3 rounded-xl bg-[var(--gold)] text-[#080d1a] font-bold hover:bg-[var(--gold-dim)] transition-all shadow-[0_0_20px_var(--gold-glow)]"
          >
            Start Your Journey →
          </Link>
        </motion.div>

        {/* Right: Steps */}
        <div className="flex flex-col gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.55 }}
              className="flex gap-5 p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--gold)]/30 transition-all group"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-[var(--gold-glow)] border border-[var(--gold)]/30 flex items-center justify-center text-[var(--gold)] font-bold text-sm group-hover:bg-[var(--gold)] group-hover:text-[#080d1a] transition-all">
                {s.step}
              </div>
              <div>
                <h3
                  className="text-[var(--text-primary)] font-semibold text-base"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {s.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-[15px] mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
