export default function Card({ children, className = "", hover = false, glow = false }) {
  const base =
    "rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5";
  const hoverStyle = hover
    ? "transition-all duration-300 hover:border-[var(--border-bright)] hover:bg-[var(--bg-card-hover)]"
    : "";
  const glowStyle = glow
    ? "shadow-[0_0_30px_var(--gold-glow)]"
    : "";

  return (
    <div className={`${base} ${hoverStyle} ${glowStyle} ${className}`}>
      {children}
    </div>
  );
}
