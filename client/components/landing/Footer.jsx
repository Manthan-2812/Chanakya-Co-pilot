"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-10 px-6 md:px-16"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--gold)] flex items-center justify-center text-[#080d1a] font-bold text-xs">
            ₹
          </div>
          <span className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
            Chanakya
          </span>
          <span className="text-[var(--text-muted)] text-sm ml-1">— Your Financial Co-Pilot</span>
        </div>

        <p className="text-[var(--text-muted)] text-xs text-center">
          अर्थ को समझो, भविष्य को संवारो &nbsp;·&nbsp; Built for ET Markets Hackathon 2025
        </p>

        <Link
          href="/auth"
          className="text-sm text-[var(--gold)] hover:text-[var(--gold-dim)] font-medium transition-colors"
        >
          Get Started →
        </Link>
      </div>
    </footer>
  );
}
