"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "14 Cr+", label: "Demat Accounts in India" },
  { value: "₹100T+", label: "Indian Equity Market Cap" },
  { value: "3-Step", label: "Autonomous AI Agent" },
  { value: "Real-time", label: "NSE-wide Signal Detection" },
];

export default function StatsSection() {
  return (
    <section className="py-14 px-6 border-y border-[var(--border)]"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex flex-col items-center text-center gap-1"
          >
            <span
              className="text-3xl md:text-4xl font-bold text-[var(--gold)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {s.value}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
