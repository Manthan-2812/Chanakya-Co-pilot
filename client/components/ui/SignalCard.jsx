export default function SignalCard({ signal, context, action, type = "neutral" }) {
  const typeStyles = {
    sell:    { color: "#ef4444", badge: "SELL",  bg: "rgba(239,68,68,0.10)" },
    buy:     { color: "#10b981", badge: "BUY",   bg: "rgba(16,185,129,0.10)" },
    neutral: { color: "#f5a623", badge: "WATCH", bg: "rgba(245,166,35,0.10)" },
  };
  const t = typeStyles[type] ?? typeStyles.neutral;

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-2"
      style={{ background: "var(--bg-card)", borderColor: `${t.color}30` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-base font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
          {signal}
        </p>
        <span
          className="shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ color: t.color, background: t.bg }}
        >
          {t.badge}
        </span>
      </div>

      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{context}</p>

      <p className="text-sm font-semibold" style={{ color: t.color }}>→ {action}</p>
    </div>
  );
}
