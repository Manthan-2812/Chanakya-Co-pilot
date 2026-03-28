"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { getUserSummary } from "@/library/api";

const USER_ID = "default_user";

const goalColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("ahead") || s.includes("on track")) return "#10b981";
  if (s.includes("behind") || s.includes("at risk")) return "#ef4444";
  return "#f5a623";
};

const fmt = (n) =>
  n !== undefined && n !== null
    ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : "—";

export default function SummaryPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserSummary(USER_ID)
      .then(setData)
      .catch(() => setError("Could not load summary. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const progress = data ? Math.min(100, Math.round(data.overall_progress * 100)) : 0;
  const statusColor = data ? goalColor(data.goal_status) : "#f5a623";

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Goal Summary</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Your aggregated financial snapshot powered by live data.</p>

      {loading && <p style={{ color: "var(--text-muted)" }}>Loading your summary…</p>}
      {error && <p style={{ color: "var(--red)" }}>{error}</p>}

      {data && (
        <div className="flex flex-col gap-5 max-w-2xl">

          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Goals",     value: data.total_goals },
              { label: "Completed",       value: data.completed_goals },
              { label: "Portfolio Value", value: fmt(data.portfolio_value) },
              { label: "Gap to Target",   value: fmt(data.gap) },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border p-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>{k.label}</p>
                <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* Overall progress */}
          <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Overall Progress</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ color: statusColor, background: `${statusColor}18` }}>
                {data.goal_status}
              </span>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Completion</span>
                <span className="text-xs font-bold" style={{ color: statusColor }}>{progress}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: statusColor }} />
              </div>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Target</p>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{fmt(data.total_target)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Risk Level</p>
                <p className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{data.risk_level}</p>
              </div>
            </div>
          </div>

          {/* AI Insight */}
          {data.ai_summary && (
            <div className="rounded-xl border px-5 py-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>AI Insight</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{data.ai_summary}</p>
            </div>
          )}

          {/* Suggestions */}
          {data.suggestions && (
            <div className="rounded-xl border px-5 py-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--emerald)" }}>Recommendations</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{data.suggestions}</p>
            </div>
          )}

        </div>
      )}
    </MainLayout>
  );
}