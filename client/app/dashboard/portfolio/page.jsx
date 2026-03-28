"use client";

import MainLayout from "@/components/layout/MainLayout";
import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, ResponsiveContainer,
} from "recharts";
import { AlertTriangle, Sparkles } from "lucide-react";

export default function PortfolioPage() {
  const data = [
    { name: "Equity", value: 70 },
    { name: "Debt", value: 20 },
    { name: "Cash", value: 10 },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#facc15"];

  const inflationData = [
    { year: "2024", portfolio: 100, inflation: 100 },
    { year: "2025", portfolio: 110, inflation: 105 },
    { year: "2026", portfolio: 120, inflation: 110 },
    { year: "2027", portfolio: 130, inflation: 118 },
  ];

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Portfolio</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Your current asset allocation and AI-driven insights.</p>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Pie Chart Card */}
        <div className="rounded-2xl border p-6" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Asset Allocation</p>
          <PieChart width={280} height={280}>
            <Pie data={data} dataKey="value" outerRadius={110} innerRadius={55} paddingAngle={3}>
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }}
            />
          </PieChart>
          {/* Legend */}
          <div className="flex flex-col gap-2 mt-2">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{d.name}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div
          className="rounded-2xl border p-5 flex flex-col gap-3 max-w-sm"
          style={{ background: "var(--bg-card)", borderColor: "rgba(245,166,35,0.3)" }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} style={{ color: "var(--gold)" }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>AI Insight</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Your <span style={{ color: "#22c55e", fontWeight: 600 }}>equity exposure at 70%</span> is elevated for a moderate risk profile. Consider rebalancing — move <span style={{ color: "var(--gold)", fontWeight: 600 }}>10–15%</span> into debt instruments to reduce volatility.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <div className="h-1 flex-1 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
              <div className="h-full rounded-full" style={{ width: "70%", background: "#22c55e" }} />
            </div>
            <span className="text-xs font-bold" style={{ color: "#22c55e" }}>70% Equity</span>
          </div>
        </div>
      </div>

      {/* Inflation vs Growth */}
      <div
        className="mt-8 rounded-2xl border p-6 max-w-2xl"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Projection</p>
        <h2 className="text-base font-bold mb-5" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Inflation vs Portfolio Growth</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={inflationData}>
            <XAxis dataKey="year" tick={{ fill: "#4a5568", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4a5568", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text-primary)" }} />
            <Line type="monotone" dataKey="portfolio" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: "#22c55e", r: 4 }} name="Portfolio" />
            <Line type="monotone" dataKey="inflation" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: "#ef4444", r: 4 }} name="Inflation" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#22c55e]" /><span className="text-xs" style={{ color: "var(--text-secondary)" }}>Portfolio Growth</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ef4444]" /><span className="text-xs" style={{ color: "var(--text-secondary)" }}>Inflation</span></div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <AlertTriangle size={14} style={{ color: "#f5a623" }} />
          <p className="text-sm font-medium" style={{ color: "#f5a623" }}>Real return is narrowing. Inflation is eroding your portfolio gains.</p>
        </div>
      </div>

      {/* Portfolio-aware insight */}
      <div
        className="mt-6 rounded-2xl border p-5 max-w-2xl"
        style={{ background: "var(--bg-card)", borderColor: "rgba(245,166,35,0.25)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} style={{ color: "var(--gold)" }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>Portfolio AI Insight</p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Your portfolio is <span style={{ color: "#22c55e", fontWeight: 600 }}>heavily equity-focused (70%)</span>. In a market downturn, your financial goals may be delayed by
          {" "}<span style={{ color: "#ef4444", fontWeight: 600 }}>2–3 years</span>. Consider stress-testing via the{" "}
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>Risk Simulation</span> panel.
        </p>
      </div>
    </MainLayout>
  );
}