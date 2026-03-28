"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { TrendingDown, Briefcase, HeartPulse } from "lucide-react";

const scenarios = [
  {
    id: "crash",
    label: "Market Crash",
    Icon: TrendingDown,
    color: "#ef4444",
    result: "Portfolio drops by ~20%. Equity goals delayed by 3 years. Consider moving 15% to debt instruments immediately.",
  },
  {
    id: "jobloss",
    label: "Job Loss",
    Icon: Briefcase,
    color: "#f5a623",
    result: "Monthly SIP stops. Savings deplete within 8 months. Emergency fund covers only 40% of obligations.",
  },
  {
    id: "health",
    label: "Health Emergency",
    Icon: HeartPulse,
    color: "#3b82f6",
    result: "₹5–10L emergency expense impacts investments. Retirement goal delayed by 1.5 years without health insurance.",
  },
];

export default function SimulationPage() {
  const [active, setActive] = useState(null);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
        Risk Simulation
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Stress-test your portfolio against real-life scenarios.
      </p>

      {/* Scenario buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id === active ? null : s.id)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-200"
            style={{
              background: active === s.id ? `${s.color}18` : "var(--bg-card)",
              borderColor: active === s.id ? s.color : "var(--border)",
              color: active === s.id ? s.color : "var(--text-secondary)",
              boxShadow: active === s.id ? `0 0 16px ${s.color}30` : "none",
            }}
          >
            <s.Icon size={16} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Result panel */}
      {active && (() => {
        const s = scenarios.find((x) => x.id === active);
        return (
          <div
            className="max-w-xl rounded-2xl border p-6 flex flex-col gap-3"
            style={{ background: "var(--bg-card)", borderColor: `${s.color}40` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: s.color }}>
                  Simulated Scenario
                </p>
                <h2 className="text-base font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
                  {s.label}
                </h2>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {s.result}
            </p>
            <div
              className="h-1 rounded-full mt-1"
              style={{ background: `linear-gradient(to right, ${s.color}, transparent)` }}
            />
          </div>
        );
      })()}
    </MainLayout>
  );
}
