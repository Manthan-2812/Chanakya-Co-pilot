"use client";

import MainLayout from "@/components/layout/MainLayout";

export default function SummaryPage() {
  const goals = [
    { name: "Retirement", progress: 40, target: "₹2,00,00,000", years: 20, status: "on_track" },
    { name: "House",      progress: 25, target: "₹80,00,000",   years: 7,  status: "behind" },
    { name: "Car",        progress: 65, target: "₹15,00,000",   years: 2,  status: "ahead" },
  ];

  const statusStyles = {
    on_track: { label: "On Track",        color: "#f5a623", barColor: "#f5a623" },
    behind:   { label: "Behind Schedule", color: "#ef4444", barColor: "#ef4444" },
    ahead:    { label: "Ahead",           color: "#10b981", barColor: "#10b981" },
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Goal Summary</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Track progress toward your financial milestones.</p>

      <div className="flex flex-col gap-4 max-w-2xl">
        {goals.map((g) => {
          const s = statusStyles[g.status];
          return (
            <div
              key={g.name}
              className="rounded-2xl border p-5 flex flex-col gap-3"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{g.name}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ color: s.color, background: `${s.color}18` }}
                >
                  {s.label}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Progress</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{g.progress}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${g.progress}%`, background: s.barColor }}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Target</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{g.target}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Years Left</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{g.years} yrs</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}