"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SignalCard from "@/components/ui/SignalCard";
import { getMarketSummary } from "@/library/api";

const signalType = (val) => {
  const v = (val || "").toLowerCase();
  if (v.includes("bull") || v.includes("buy")) return "buy";
  if (v.includes("bear") || v.includes("sell")) return "sell";
  return "neutral";
};

const changeColor = (n) => (n > 0 ? "#10b981" : n < 0 ? "#ef4444" : "#f5a623");

export default function MarketPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMarketSummary()
      .then(setData)
      .catch(() => setError("Could not load market data. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const sectorSignals = data
    ? Object.entries(data.sector_signals).map(([sector, signal]) => ({
        sector,
        title: `${sector} — ${signal}`,
        reason: data.market_context || "Live market analysis",
        action: data.suggestion || "Review your exposure",
        type: signalType(signal),
      }))
    : [];

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Market Sentiment</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Live signals powered by Gemini AI from real market data.</p>

      {loading && <p style={{ color: "var(--text-muted)" }}>Fetching live market data…</p>}
      {error && <p style={{ color: "var(--red)" }}>{error}</p>}

      {data && (
        <>
          {/* Index strip */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {[
              { label: "NIFTY 50", change: data.nifty_change },
              { label: "SENSEX",   change: data.sensex_change },
            ].map((idx) => (
              <div key={idx.label} className="rounded-xl border px-5 py-3" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>{idx.label}</p>
                <p className="text-lg font-bold" style={{ color: changeColor(idx.change) }}>
                  {idx.change > 0 ? "+" : ""}{idx.change?.toFixed(2)}%
                </p>
              </div>
            ))}
            <div className="rounded-xl border px-5 py-3" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>Trend</p>
              <p className="text-lg font-bold" style={{ color: "var(--gold)" }}>{data.market_trend}</p>
            </div>
          </div>

          {/* AI Summary */}
          {data.ai_summary && (
            <div className="rounded-xl border px-5 py-4 mb-6 max-w-2xl" style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>AI Summary</p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{data.ai_summary}</p>
            </div>
          )}

          {/* Sector signals */}
          <div className="flex flex-col gap-4 max-w-2xl">
            {sectorSignals.map((s) => (
              <SignalCard key={s.sector} signal={s.title} context={s.reason} action={s.action} type={s.type} />
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
}