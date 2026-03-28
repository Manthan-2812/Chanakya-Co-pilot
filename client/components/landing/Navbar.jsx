"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-[var(--bg-primary)]/60 backdrop-blur-md border-b border-[var(--border)]/40"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-[var(--gold)] flex items-center justify-center text-[#080d1a] font-bold text-sm shadow-[0_0_12px_var(--gold-glow)]">
          ₹
        </div>
        <span
          className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Chanakya
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--gold)] transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/auth")}
        className="px-5 py-2 rounded-lg bg-[var(--gold)] text-[#080d1a] text-sm font-bold hover:bg-[var(--gold-dim)] transition-all duration-200 shadow-[0_0_16px_var(--gold-glow)] hover:shadow-[0_0_24px_var(--gold-glow)]"
      >
        Login / Sign Up
      </button>
    </motion.nav>
  );
}