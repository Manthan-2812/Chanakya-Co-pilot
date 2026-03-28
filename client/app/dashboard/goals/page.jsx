"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { createGoal, getUserGoals } from "@/library/api";

const USER_ID = "default_user";

const fmt = (n) =>
  n !== undefined && n !== null
    ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : "—";

export default function GoalsPage() {
  const [form, setForm] = useState({ name: "", years: "", amount: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);

  const fetchGoals = () =>
    getUserGoals(USER_ID).then(setGoals).catch(() => {});

  useEffect(() => { fetchGoals(); }, []);

  const handleAddGoal = async () => {
    if (!form.name || !form.years || !form.amount) return;
    setSubmitting(true);
    setError(null);
    try {
      await createGoal({
        user_id: USER_ID,
        goal_name: form.name,
        years: parseInt(form.years),
        target_amount: parseFloat(form.amount),
        investments: [],
      });
      setForm({ name: "", years: "", amount: "" });
      await fetchGoals();
    } catch {
      setError("Failed to save goal. Is the backend running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Goal Setting</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Define your financial milestones and let Chanakya plan the path.</p>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Form */}
        <div
          className="p-7 rounded-2xl border w-full max-w-md flex flex-col gap-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-secondary)" }}>Goal Name</label>
            <input
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              placeholder="House, Car, Retirement…"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-secondary)" }}>Target Years</label>
            <input
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              placeholder="e.g. 5"
              type="number"
              value={form.years}
              onChange={(e) => setForm({ ...form, years: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-secondary)" }}>Target Amount (₹)</label>
            <input
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
              placeholder="e.g. 5000000"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          {error && <p className="text-sm" style={{ color: "var(--red)" }}>{error}</p>}

          <button
            onClick={handleAddGoal}
            disabled={submitting}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50"
            style={{ background: "var(--gold)", color: "#080d1a", boxShadow: "0 0 20px var(--gold-glow)" }}
          >
            {submitting ? "Saving…" : "Add Goal"}
          </button>
        </div>

        {/* Saved goals */}
        {goals.length > 0 && (
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Your Goals</p>
            {goals.map((g) => (
              <div
                key={g.id}
                className="rounded-2xl border p-5 flex flex-col gap-2"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{g.goal_name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ color: "var(--gold)", background: "rgba(245,166,35,0.12)" }}>
                    {g.risk_level}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {[
                    { label: "Target",    value: fmt(g.target_amount) },
                    { label: "Monthly SIP", value: fmt(g.monthly_sip) },
                    { label: "Inflation-adj", value: fmt(g.inflation_adjusted_value) },
                  ].map((k) => (
                    <div key={k.label}>
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{k.label}</p>
                      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{k.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{g.years} years · {g.expected_return * 100}% expected return</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}