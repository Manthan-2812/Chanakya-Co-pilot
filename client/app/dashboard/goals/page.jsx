"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import { createGoal, getUserGoals, saveStockPositions, getStockPositions } from "@/library/api";
import { PlusCircle, Trash2, TrendingUp, Target, Clock } from "lucide-react";

const USER_ID = "default_user";
const INVEST_TYPES = ["FD", "MF", "Stocks", "PPF", "Gold", "NPS"];
const RETURN_OPTIONS = [6, 8, 10, 12, 14, 16, 20];
const INSTRUMENT_TYPES = ["Stock", "Futures", "Options"];

const fmt = (n) =>
  n !== undefined && n !== null
    ? "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : "—";

const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none";
const inputStyle = { background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-primary)" };
const labelCls = "block text-xs font-semibold uppercase tracking-widest mb-1.5";
const labelStyle = { color: "var(--text-secondary)" };

export default function GoalsPage() {
  const [form, setForm] = useState({
    name: "", years: "", amount: "",
    investAmount: "", returnPct: "12", investType: "MF",
  });
  const [submitting, setSubmitting] = useState(false);
  const [goalError, setGoalError] = useState(null);
  const [goals, setGoals] = useState([]);

  // Stocks/Derivatives state
  const [stockForm, setStockForm] = useState({
    symbol: "", name: "", quantity: "", buyPrice: "", instrumentType: "Stock",
  });
  const [stockPositions, setStockPositions] = useState([]);
  const [stockSubmitting, setStockSubmitting] = useState(false);
  const [stockResult, setStockResult] = useState(null);
  const [stockError, setStockError] = useState(null);

  const fetchGoals = () => getUserGoals(USER_ID).then(setGoals).catch(() => {});
  const fetchStocks = () => getStockPositions(USER_ID).then(setStockResult).catch(() => {});

  useEffect(() => { fetchGoals(); fetchStocks(); }, []);

  const handleAddGoal = async () => {
    if (!form.name || !form.years || !form.amount) return;
    setSubmitting(true); setGoalError(null);
    try {
      await createGoal({
        user_id: USER_ID,
        goal_name: form.name,
        years: parseInt(form.years),
        target_amount: parseFloat(form.amount),
        invest_amount: parseFloat(form.investAmount) || 0,
        expected_return_pct: parseFloat(form.returnPct) || 12,
        investment_type: form.investType,
        investments: [],
      });
      setForm({ name: "", years: "", amount: "", investAmount: "", returnPct: "12", investType: "MF" });
      await fetchGoals();
    } catch { setGoalError("Failed to save. Is the backend running?"); }
    finally { setSubmitting(false); }
  };

  const addStockRow = () => {
    if (!stockForm.symbol || !stockForm.quantity || !stockForm.buyPrice) return;
    setStockPositions((prev) => [...prev, { ...stockForm }]);
    setStockForm({ symbol: "", name: "", quantity: "", buyPrice: "", instrumentType: "Stock" });
  };

  const removeStockRow = (i) => setStockPositions((prev) => prev.filter((_, idx) => idx !== i));

  const saveStocks = async () => {
    if (!stockPositions.length) return;
    setStockSubmitting(true); setStockError(null);
    try {
      const positions = stockPositions.map((p) => ({
        symbol: p.symbol.toUpperCase(),
        name: p.name || p.symbol,
        quantity: parseFloat(p.quantity),
        buy_price: parseFloat(p.buyPrice),
        instrument_type: p.instrumentType,
      }));
      const res = await saveStockPositions(USER_ID, positions);
      setStockResult(res);
    } catch { setStockError("Failed to fetch live prices. Check symbol or backend."); }
    finally { setStockSubmitting(false); }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
        Goal Setting
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Plan inflation-adjusted goals, compare investment types, and track market instruments.
      </p>

      <div className="flex flex-col xl:flex-row gap-8 items-start">

        {/* ── Goal Form ───────────────────────────────── */}
        <div className="p-6 rounded-2xl border w-full max-w-md flex flex-col gap-4"
          style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
            New Goal
          </p>

          {[
            { label: "Goal Name", key: "name", type: "text", placeholder: "House, Retirement, Car…" },
            { label: "Target Amount (₹)", key: "amount", type: "number", placeholder: "e.g. 5000000" },
            { label: "Years to Achieve", key: "years", type: "number", placeholder: "e.g. 10" },
            { label: "Monthly Invest I'm Ready to Put (₹)", key: "investAmount", type: "number", placeholder: "e.g. 15000" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className={labelCls} style={labelStyle}>{label}</label>
              <input className={inputCls} style={inputStyle} type={type} placeholder={placeholder}
                value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} style={labelStyle}>Expected Return</label>
              <select className={inputCls} style={inputStyle} value={form.returnPct}
                onChange={(e) => setForm({ ...form, returnPct: e.target.value })}>
                {RETURN_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}% per year</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Investment Type</label>
              <select className={inputCls} style={inputStyle} value={form.investType}
                onChange={(e) => setForm({ ...form, investType: e.target.value })}>
                {INVEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {goalError && <p className="text-sm" style={{ color: "#ef4444" }}>{goalError}</p>}

          <button onClick={handleAddGoal} disabled={submitting}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50"
            style={{ background: "var(--gold)", color: "#080d1a", boxShadow: "0 0 20px var(--gold-glow)" }}>
            {submitting ? "Calculating & Saving…" : "Add Goal"}
          </button>
        </div>

        {/* ── Saved Goals ─────────────────────────────── */}
        {goals.length > 0 && (
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Your Goals</p>
            <AnimatePresence>
              {goals.map((g, i) => (
                <motion.div key={g.id || i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border p-5 flex flex-col gap-3"
                  style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Target size={15} style={{ color: "var(--gold)" }} />
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{g.goal_name}</span>
                    </div>
                    <div className="flex gap-2">
                      {[g.risk_level, g.investment_type].map((badge) => badge && (
                        <span key={badge} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                          style={{ color: "var(--gold)", background: "rgba(245,166,35,0.12)" }}>{badge}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Target", value: fmt(g.target_amount) },
                      { label: "Inflation-Adj", value: fmt(g.inflation_adjusted_value) },
                      { label: "Rec. SIP/mo", value: fmt(g.monthly_sip) },
                      { label: "Your SIP/mo", value: fmt(g.invest_amount) },
                    ].map((k) => (
                      <div key={k.label}>
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{k.label}</p>
                        <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{k.value}</p>
                      </div>
                    ))}
                  </div>

                  {g.months_to_achieve > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <Clock size={13} style={{ color: "var(--gold)" }} />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        At ₹{Number(g.invest_amount).toLocaleString("en-IN")}/mo @ {g.expected_return_pct}% →{" "}
                        <span style={{ color: "#10b981", fontWeight: 700 }}>
                          {(g.months_to_achieve / 12).toFixed(1)} yrs
                        </span>
                        {g.achievement_date && ` (by ${g.achievement_date})`}
                      </span>
                    </div>
                  )}

                  {g.expected_return_pct && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {g.years} yr goal · {g.expected_return_pct}% expected return · Start: {g.start_date}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Market Instruments ────────────────────────── */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} style={{ color: "var(--gold)" }} />
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
            Market Instruments
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full border" style={{ color: "var(--gold)", borderColor: "rgba(245,166,35,0.3)", fontSize: "10px" }}>
            Stocks · Futures · Options
          </span>
        </div>
        <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
          Add your equity positions. Live P&amp;L is fetched via Yahoo Finance (NSE tickers, e.g. TCS.NS).
        </p>

        {/* Add row */}
        <div className="rounded-2xl border p-5 mb-4" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: "symbol", placeholder: "TCS.NS", label: "Ticker" },
              { key: "name", placeholder: "TCS", label: "Name" },
              { key: "quantity", placeholder: "10", label: "Qty", type: "number" },
              { key: "buyPrice", placeholder: "3800", label: "Buy Price (₹)", type: "number" },
            ].map(({ key, placeholder, label, type = "text" }) => (
              <div key={key}>
                <label className={labelCls} style={labelStyle}>{label}</label>
                <input className={inputCls} style={inputStyle} type={type} placeholder={placeholder}
                  value={stockForm[key]}
                  onChange={(e) => setStockForm({ ...stockForm, [key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className={labelCls} style={labelStyle}>Type</label>
              <select className={inputCls} style={inputStyle} value={stockForm.instrumentType}
                onChange={(e) => setStockForm({ ...stockForm, instrumentType: e.target.value })}>
                {INSTRUMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button onClick={addStockRow}
            className="mt-3 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            style={{ color: "var(--gold)", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)" }}>
            <PlusCircle size={14} /> Add Position
          </button>
        </div>

        {/* Queue */}
        {stockPositions.length > 0 && (
          <div className="rounded-2xl border overflow-hidden mb-4" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  {["Symbol", "Name", "Qty", "Buy ₹", "Type", ""].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockPositions.map((p, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="px-4 py-2.5 font-bold" style={{ color: "var(--gold)" }}>{p.symbol}</td>
                    <td className="px-4 py-2.5" style={{ color: "var(--text-primary)" }}>{p.name || "—"}</td>
                    <td className="px-4 py-2.5" style={{ color: "var(--text-secondary)" }}>{p.quantity}</td>
                    <td className="px-4 py-2.5" style={{ color: "var(--text-secondary)" }}>₹{p.buyPrice}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(245,166,35,0.12)", color: "var(--gold)" }}>{p.instrumentType}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => removeStockRow(i)}>
                        <Trash2 size={13} style={{ color: "#ef4444" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {stockPositions.length > 0 && (
          <button onClick={saveStocks} disabled={stockSubmitting}
            className="py-2.5 px-6 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: "var(--gold)", color: "#080d1a" }}>
            {stockSubmitting ? "Fetching live prices…" : "Analyse Positions"}
          </button>
        )}

        {stockError && <p className="mt-2 text-sm" style={{ color: "#ef4444" }}>{stockError}</p>}

        {/* Live results */}
        {stockResult && stockResult.positions?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="flex gap-6 px-5 py-4 flex-wrap" style={{ background: "var(--bg-secondary)" }}>
              {[
                { label: "Invested", value: fmt(stockResult.total_invested) },
                { label: "Current Value", value: fmt(stockResult.total_current_value) },
                { label: "P&L", value: fmt(stockResult.total_pnl), color: stockResult.total_pnl >= 0 ? "#10b981" : "#ef4444" },
                { label: "Return", value: `${stockResult.total_pnl_pct?.toFixed(2)}%`, color: stockResult.total_pnl_pct >= 0 ? "#10b981" : "#ef4444" },
              ].map((k) => (
                <div key={k.label}>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{k.label}</p>
                  <p className="text-base font-bold" style={{ color: k.color || "var(--text-primary)" }}>{k.value}</p>
                </div>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-card)" }}>
                  {["Symbol", "Type", "Qty", "Buy", "LTP", "P&L", "Return"].map((h) => (
                    <th key={h} className="px-4 py-2 text-left text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockResult.positions.map((pos, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="px-4 py-2.5 font-bold" style={{ color: "var(--gold)" }}>{pos.symbol}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(245,166,35,0.1)", color: "var(--gold)" }}>
                        {pos.instrument_type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5" style={{ color: "var(--text-secondary)" }}>{pos.quantity}</td>
                    <td className="px-4 py-2.5" style={{ color: "var(--text-secondary)" }}>₹{pos.buy_price}</td>
                    <td className="px-4 py-2.5" style={{ color: "var(--text-primary)" }}>
                      {pos.current_price ? `₹${pos.current_price.toFixed(2)}` : "N/A"}
                    </td>
                    <td className="px-4 py-2.5 font-semibold" style={{ color: pos.pnl >= 0 ? "#10b981" : "#ef4444" }}>
                      {pos.pnl >= 0 ? "+" : ""}{fmt(pos.pnl)}
                    </td>
                    <td className="px-4 py-2.5 font-semibold" style={{ color: pos.pnl_pct >= 0 ? "#10b981" : "#ef4444" }}>
                      {pos.pnl_pct >= 0 ? "+" : ""}{pos.pnl_pct?.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}