export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[var(--border)] text-[var(--text-secondary)]",
    gold: "bg-[var(--gold-glow)] text-[var(--gold)] border border-[var(--gold-dim)]",
    green: "bg-emerald-900/30 text-emerald-400 border border-emerald-800",
    red: "bg-red-900/30 text-red-400 border border-red-800",
    blue: "bg-blue-900/30 text-blue-400 border border-blue-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
