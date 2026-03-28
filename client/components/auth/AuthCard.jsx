"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
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

      {/* Card */}
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
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] transition-all duration-200"
          aria-label="Close"
        >
          <X size={13} />
        </button>

        {/* Tab switcher */}
        <div className="flex rounded-xl p-1 mb-8" style={{ background: "var(--bg-secondary)" }}>
          {["Login", "Sign Up"].map((tab) => (
            <button
              key={tab}
              onClick={() => setIsLogin(tab === "Login")}
              className="relative flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200"
              style={{
                color: (tab === "Login") === isLogin ? "#080d1a" : "var(--text-muted)",
              }}
            >
              {(tab === "Login") === isLogin && (
                <motion.div
                  layoutId="auth-tab"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--gold)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: isLogin ? -12 : 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 12 : -12 }}
            transition={{ duration: 0.22 }}
          >
            {isLogin ? <LoginForm /> : <SignupForm />}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-center text-xs text-[var(--text-muted)] mt-6">
        अर्थ को समझो, भविष्य को संवारो
      </p>
    </motion.div>
  );
}