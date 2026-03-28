"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass = `w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] border border-[var(--border)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/40 transition-all duration-200`;

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Minimum 6 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Email</label>
        <input
          className={inputClass}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
        />
        {errors.email && <p className="text-[var(--red)] text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">Password</label>
        <input
          type="password"
          className={inputClass}
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
        />
        {errors.password && <p className="text-[var(--red)] text-xs mt-1">{errors.password}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/forgot")}
          className="text-xs text-[var(--gold)] hover:text-[var(--gold-dim)] transition-colors"
        >
          Forgot Password?
        </button>
      </div>

      <button
        onClick={handleLogin}
        className="w-full py-3 rounded-xl bg-[var(--gold)] text-[#080d1a] text-sm font-bold hover:bg-[var(--gold-dim)] transition-all duration-200 shadow-[0_0_20px_var(--gold-glow)] hover:shadow-[0_0_30px_var(--gold-glow)] mt-1"
      >
        Login to Chanakya
      </button>
    </div>
  );
}