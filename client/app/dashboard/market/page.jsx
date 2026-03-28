"use client";

import MainLayout from "@/components/layout/MainLayout";
import SignalCard from "@/components/ui/SignalCard";

export default function MarketPage() {
  const signals = [
    {
      sector: "IT",
      title: "IT sector overvalued",
      reason: "High PE ratios detected across NIFTY IT constituents",
      action: "Reduce exposure",
      type: "sell",
    },
    {
      sector: "BANK",
      title: "Banking sector strong",
      reason: "Strong earnings growth & improving credit quality",
      action: "Consider investing",
      type: "buy",
    },
    {
      sector: "PHARMA",
      title: "Pharma under accumulation",
      reason: "Bulk deal activity and rising institutional ownership",
      action: "Watch closely",
      type: "neutral",
    },
  ];

  const typeStyles = {
    sell:    { badge: "SELL",    badgeColor: "#ef4444", badgeBg: "rgba(239,68,68,0.12)",    actionColor: "#ef4444" },
    buy:     { badge: "BUY",     badgeColor: "#10b981", badgeBg: "rgba(16,185,129,0.12)",  actionColor: "#10b981" },
    neutral: { badge: "WATCH",   badgeColor: "#f5a623", badgeBg: "rgba(245,166,35,0.12)",  actionColor: "#f5a623" },
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>Market Sentiment</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>AI-detected signals from filings, bulk deals and earnings data.</p>

      <div className="flex flex-col gap-4 max-w-2xl">
        {signals.map((s) => (
          <SignalCard
            key={s.title}
            signal={s.title}
            context={s.reason}
            action={s.action}
            type={s.type}
          />
        ))}
      </div>
    </MainLayout>
  );
}