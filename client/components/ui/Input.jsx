"use client";

export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border bg-[var(--bg-secondary)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-200 focus:border-[var(--gold)] focus:shadow-[0_0_0_3px_var(--gold-glow)] ${
          error
            ? "border-[var(--red)]"
            : "border-[var(--border)] hover:border-[var(--border-bright)]"
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--red)]">{error}</p>
      )}
    </div>
  );
}
