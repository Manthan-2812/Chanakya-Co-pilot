"use client";

import { motion } from "framer-motion";
import { TrendingDown, FileText, BarChart, Shuffle } from "lucide-react";

const problems = [
  {
    Icon: TrendingDown,
    title: "Flying Blind",
    desc: "14 crore+ demat accounts in India — most investors react to tips with zero data backing.",
  },
  {
    Icon: FileText,
    title: "Missed Filings",
    desc: "Quarterly results, bulk deals, insider trades — critical signals buried in regulatory noise.",
  },
  {
    Icon: BarChart,
    title: "Can't Read Technicals",
    desc: "Breakouts, divergences, support/resistance — complex patterns that retail investors miss daily.",
  },
  {
    Icon: Shuffle,
    title: "Gut-Feel Portfolios",
    desc: "Mutual fund portfolios managed on emotion, not aligned to personal goals or risk appetite.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

export default function ProblemSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-16 relative">
      {/* Section bg accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,166,35,0.04) 0%, transparent 70%)" }}
      />

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
            The Problem
          </span>
          <h2
            className="mt-4 text-4xl md:text-5xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The Indian investor is{" "}
            <span className="text-[var(--gold)]">data-rich</span>
            <br />
            but{" "}
            <span className="text-[var(--red)]">intelligence-poor</span>
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto text-[16px]">
            ET Markets has the data. What was missing was the intelligence layer
            that turns raw signals into actionable, money-making decisions.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 flex flex-col gap-3 hover:border-[var(--gold)]/40 hover:bg-[var(--bg-card-hover)] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gold-glow)", color: "var(--gold)" }}>
                <p.Icon size={20} />
              </div>
              <h3
                className="text-[var(--text-primary)] font-semibold text-base group-hover:text-[var(--gold)] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {p.title}
              </h3>
              <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Arrow to solution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-14"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Enter Chanakya</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[var(--gold)] text-xl"
            >
              ↓
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
