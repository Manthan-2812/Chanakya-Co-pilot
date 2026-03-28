"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    if (!email) { setError("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email"); return; }
    setError("");
    setSent(true);
    setTimeout(() => router.push("/auth"), 2500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full opacity-10 blur-[100px] pointer-events-none" style={{ background: "var(--gold)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[var(--gold)] flex items-center justify-center text-[#080d1a] font-bold text-base shadow-[0_0_20px_var(--gold-glow)]">
            ₹
          </div>
          <span className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
            Chanakya
          </span>
        </div>

        <div
          className="rounded-2xl border border-[var(--border)] p-8 relative"
          style={{
            background: "rgba(10, 16, 33, 0.85)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(245,166,35,0.06), 0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => router.push("/auth")}
            className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-all duration-200"
            aria-label="Close"
          >
            <X size={13} />
          </button>

          {!sent ? (
            <>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                Reset your password
              </h2>
              <p className="text-sm text-[var(--text-muted)] mb-6">We'll send a reset link to your email.</p>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
                <input
                  className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/40 transition-all duration-200"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                />
                {error && <p className="text-[var(--red)] text-xs mt-1">{error}</p>}
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl bg-[var(--gold)] text-[#080d1a] text-sm font-bold hover:bg-[var(--gold-dim)] transition-all duration-200 shadow-[0_0_20px_var(--gold-glow)]"
              >
                Send Reset Link
              </button>

              <button
                onClick={() => router.push("/auth")}
                className="w-full mt-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                ← Back to Login
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)" }}>
                <Mail size={28} style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Check your inbox</h3>
              <p className="text-sm text-[var(--text-muted)]">Reset link sent to <span className="text-[var(--gold)]">{email}</span></p>
              <p className="text-xs text-[var(--text-muted)] mt-4">Redirecting you back...</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}