"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";

export default function GoalsPage() {
  const [goal, setGoal] = useState({
    name: "",
    years: "",
    amount: "",
    risk: "Moderate",
  });

  const [added, setAdded] = useState(false);

  const handleAddGoal = () => {
    if (!goal.name || !goal.years || !goal.amount) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Goal Setting</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Define your financial milestones and let Chanakya plan the path.</p>

      <div
        className="p-7 rounded-2xl border w-full max-w-lg flex flex-col gap-4"
        style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-secondary)" }}>Goal Name</label>
          <input
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            placeholder="House, Car, Retirement…"
            onChange={(e) => setGoal({ ...goal, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-secondary)" }}>Target Years</label>
          <input
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            placeholder="e.g. 5"
            type="number"
            onChange={(e) => setGoal({ ...goal, years: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-secondary)" }}>Target Amount (₹)</label>
          <input
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            placeholder="e.g. 50,00,000"
            onChange={(e) => setGoal({ ...goal, amount: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-secondary)" }}>Risk Appetite</label>
          <select
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            defaultValue="Moderate"
            onChange={(e) => setGoal({ ...goal, risk: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          onClick={handleAddGoal}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
          style={{ background: "var(--gold)", color: "#080d1a", boxShadow: "0 0 20px var(--gold-glow)" }}
        >
          {added ? "✓ Goal Added!" : "Add Goal"}
        </button>
      </div>
    </MainLayout>
  );
}