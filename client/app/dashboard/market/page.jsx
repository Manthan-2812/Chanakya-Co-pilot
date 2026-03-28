"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SignalCard from "@/components/ui/SignalCard";
import { getMarketSummary, getMarketNews } from "@/library/api";
import { Newspaper, ExternalLink } from "lucide-react";

const signalType = (val) => {
  const v = (val || "").toLowerCase();
  if (v.includes("bull") || v.includes("buy")) return "buy";
  if (v.includes("bear") || v.includes("sell")) return "sell";
  return "neutral";
};

const changeColor = (n) => (n > 0 ? "#10b981" : n < 0 ? "#ef4444" : "#f5a623");

export default function MarketPage() {
  const [data, setData] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      getMarketSummary().catch(() => null),
      getMarketNews().catch(() => []),
    ]).then(([market, headlines]) => {
      setData(market);
      setNews(Array.isArray(headlines) ? headlines : []);
    }).catch(() => setError("Could not load market data. Is the backend running?"))
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

      {/* ── Live News ──────────────────────────────── */}
      {news.length > 0 && (
        <div className="mt-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper size={15} style={{ color: "var(--gold)" }} />
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              Live Market Headlines
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
              LIVE · Economic Times
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {news.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                className="rounded-xl border p-4 flex flex-col gap-1 transition-all hover:border-[rgba(245,166,35,0.4)] group"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)", textDecoration: "none" }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold leading-snug group-hover:text-[var(--gold)] transition-colors"
                    style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </p>
                  <ExternalLink size={12} className="shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }} />
                </div>
                {item.summary && (
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                    {item.summary.replace(/<[^>]*>/g, "")}
                  </p>
                )}
                {item.published && (
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{item.published}</p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}