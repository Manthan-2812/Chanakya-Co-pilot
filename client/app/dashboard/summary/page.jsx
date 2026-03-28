"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { getUserSummary, getUserGoals, deleteGoal, completeGoal } from "@/library/api";
import { Target, TrendingUp, Calendar, Trash2, CheckCircle } from "lucide-react";

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

/* ── Animated Goal Timeline ───────────────────────────── */
function GoalTimeline({ goal, index, onDelete, onComplete }) {
  const start = goal.start_date ? new Date(goal.start_date) : new Date();
  const end = goal.achievement_date ? new Date(goal.achievement_date) : new Date(start.getTime() + goal.years * 365.25 * 86400000);
  const now = new Date();
  const totalMs = end - start;
  const elapsedMs = Math.max(0, now - start);
  const pct = totalMs > 0 ? Math.min(100, (elapsedMs / totalMs) * 100) : 0;

  const fmtDate = (d) => d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="rounded-2xl border p-5 flex flex-col gap-3"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Target size={14} style={{ color: goal.status === "completed" ? "#10b981" : "var(--gold)" }} />
          <span className="font-semibold" style={{
            color: goal.status === "completed" ? "#10b981" : "var(--text-primary)",
            textDecoration: goal.status === "completed" ? "line-through" : "none",
          }}>{goal.goal_name}</span>
          {goal.status === "completed" && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>COMPLETED</span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {goal.investment_type && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ color: "var(--gold)", background: "rgba(245,166,35,0.12)" }}>{goal.investment_type}</span>
          )}
          {goal.risk_level && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ color: "#a78bfa", background: "rgba(167,139,250,0.12)" }}>{goal.risk_level} Risk</span>
          )}
          {goal.status !== "completed" && (
            <button onClick={() => onComplete?.(goal._id || goal.id)}
              title="Mark as Complete"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>
              <CheckCircle size={13} />
            </button>
          )}
          <button onClick={() => onDelete?.(goal._id || goal.id)}
            title="Delete Goal"
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Target", value: "₹" + Number(goal.target_amount).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
          { label: "Inflation-Adj", value: "₹" + Number(goal.inflation_adjusted_value).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
          { label: "SIP/mo", value: "₹" + Number(goal.monthly_sip).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
          { label: "Your SIP", value: goal.invest_amount > 0 ? "₹" + Number(goal.invest_amount).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : "—" },
        ].map((k) => (
          <div key={k.label}>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{k.label}</p>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Timeline bar */}
      <div>
        <div className="flex justify-between text-[10px] mb-1.5" style={{ color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1"><Calendar size={10} />{fmtDate(start)}</span>
          <span className="font-bold" style={{ color: "var(--gold)" }}>
            {goal.months_to_achieve > 0
              ? `${(goal.months_to_achieve / 12).toFixed(1)} yrs to achieve`
              : `${goal.years} yr goal`}
          </span>
          <span className="flex items-center gap-1">{fmtDate(end)}<Calendar size={10} /></span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--gold), #10b981)" }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: "easeOut" }}
          />
          {/* Today marker */}
          <motion.div
            className="absolute top-0 h-full w-0.5 rounded-full"
            style={{ background: "#fff", left: `${pct}%`, opacity: 0.9 }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.1 + 1.5 }}
          />
        </div>
        <p className="text-[10px] mt-1 text-right" style={{ color: "var(--text-muted)" }}>
          {goal.expected_return_pct}% expected return · Achieve by {goal.achievement_date || "N/A"}
        </p>
      </div>

      {/* Type comparison mini chart */}
      {goal.type_comparison && Object.keys(goal.type_comparison).length > 0 && (
        <TypeComparisonChart comparison={goal.type_comparison} chosen={goal.investment_type} />
      )}
    </motion.div>
  );
}

/* ── Investment Type Comparison Chart ─────────────────── */
const TYPE_COLORS = {
  FD: "#60a5fa", PPF: "#34d399", Gold: "#fbbf24",
  NPS: "#a78bfa", MF: "#f5a623", Stocks: "#10b981",
};

function TypeComparisonChart({ comparison, chosen }) {
  const data = Object.entries(comparison).map(([type, v]) => ({
    type,
    years: v.years_to_achieve || 0,
    projected: Math.round((v.projected_value_at_goal_years || 0) / 100000),
    rate: v.rate_pct,
    isChosen: type === chosen,
  })).filter((d) => d.years > 0).sort((a, b) => a.years - b.years);

  if (!data.length) return null;

  return (
    <div className="mt-1">
      <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
        Investment Type Comparison — Years to Achieve Goal
      </p>
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
          <XAxis dataKey="type" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }}
            formatter={(val, name, props) => [`${val} yrs (${props.payload.rate}% p.a.)`, "Time to Goal"]}
          />
          <Bar dataKey="years" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.type}
                fill={entry.isChosen ? "var(--gold)" : (TYPE_COLORS[entry.type] || "#4a5568")}
                opacity={entry.isChosen ? 1 : 0.55}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
        Gold bar = your chosen type. Shorter bar = reaches goal faster.
      </p>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default function SummaryPage() {
  const [summary, setSummary] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () =>
    Promise.all([
      getUserSummary(USER_ID).catch(() => null),
      getUserGoals(USER_ID).catch(() => []),
    ]).then(([s, g]) => {
      setSummary(s);
      setGoals(Array.isArray(g) ? g : []);
    }).catch(() => setError("Could not load data. Is the backend running?"))
      .finally(() => setLoading(false));

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (goalId) => {
    if (!goalId) return;
    await deleteGoal(USER_ID, goalId).catch(() => {});
    setGoals((prev) => prev.filter((g) => g._id !== goalId));
  };

  const handleComplete = async (goalId) => {
    if (!goalId) return;
    await completeGoal(USER_ID, goalId).catch(() => {});
    setGoals((prev) => prev.map((g) => g._id === goalId ? { ...g, status: "completed" } : g));
  };

  const progress = summary ? Math.min(100, Math.round((summary.overall_progress || 0) * 100)) : 0;
  const statusColor = summary ? goalColor(summary.goal_status) : "#f5a623";

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
        Goal Summary
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Animated timeline · Inflation-adjusted targets · Investment type comparison
      </p>

      {loading && <p style={{ color: "var(--text-muted)" }}>Loading your financial summary…</p>}
      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      {summary && (
        <div className="flex flex-col gap-5 max-w-3xl">

          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Goals",     value: summary.total_goals },
              { label: "Completed",       value: summary.completed_goals },
              { label: "Portfolio Value", value: "₹" + Number(summary.portfolio_value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
              { label: "Gap to Target",   value: "₹" + Number(summary.gap || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
            ].map((k) => (
              <motion.div key={k.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border p-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>{k.label}</p>
                <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{k.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} style={{ color: statusColor }} />
                <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Overall Portfolio Progress</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ color: statusColor, background: `${statusColor}18` }}>
                {summary.goal_status}
              </span>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Target Completion</span>
                <span className="text-xs font-bold" style={{ color: statusColor }}>{progress}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${statusColor}, #10b981)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="flex gap-6 flex-wrap">
              {[
                { label: "Total Target", value: "₹" + Number(summary.total_target || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 }) },
                { label: "Risk Level", value: summary.risk_level, color: "var(--gold)" },
              ].map((k) => (
                <div key={k.label}>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{k.label}</p>
                  <p className="text-sm font-semibold" style={{ color: k.color || "var(--text-primary)" }}>{k.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight + Suggestions */}
          {(summary.ai_summary || summary.suggestions) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {summary.ai_summary && (
                <div className="rounded-xl border px-5 py-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>AI Insight</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{summary.ai_summary}</p>
                </div>
              )}
              {summary.suggestions && (
                <div className="rounded-xl border px-5 py-4" style={{ background: "var(--bg-card)", borderColor: "rgba(16,185,129,0.3)" }}>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#10b981" }}>Recommendations</p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{summary.suggestions}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Per-goal animated timelines */}
      {goals.length > 0 && (
        <div className="mt-8 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={15} style={{ color: "var(--gold)" }} />
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              Goal Timelines &amp; Investment Comparison
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            {goals.map((g, i) => (
              <GoalTimeline key={g._id || g.id || i} goal={g} index={i}
                onDelete={handleDelete} onComplete={handleComplete} />
            ))}
          </div>
        </div>
      )}

      {!loading && !summary && !error && (
        <p style={{ color: "var(--text-muted)" }}>No goals found. Add goals on the Goal Setting page to see your timeline here.</p>
      )}
    </MainLayout>
  );
}