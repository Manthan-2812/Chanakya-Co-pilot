"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMobileLink = (href) => {
    setMobileOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-12 py-4 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-[var(--bg-primary)]/98 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
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

        {/* Desktop Nav Links */}
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <button
            onClick={() => router.push("/auth")}
            className="hidden md:block px-5 py-2 rounded-lg bg-[var(--gold)] text-[#080d1a] text-sm font-bold hover:bg-[var(--gold-dim)] transition-all duration-200 shadow-[0_0_16px_var(--gold-glow)]"
          >
            Login / Sign Up
          </button>

          {/* Mobile CTA (compact) */}
          <button
            onClick={() => router.push("/auth")}
            className="md:hidden px-3 py-1.5 rounded-lg bg-[var(--gold)] text-[#080d1a] text-xs font-bold shadow-[0_0_12px_var(--gold-glow)]"
          >
            Login
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "rgba(245,166,35,0.1)", color: "var(--gold)", border: "1px solid rgba(245,166,35,0.2)" }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed top-[65px] left-0 right-0 z-40 md:hidden flex flex-col px-5 py-4 gap-1 border-b"
            style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleMobileLink(link.href)}
                className="text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--gold)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-primary)"}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileOpen(false); router.push("/auth"); }}
              className="mt-2 w-full py-3 rounded-xl text-sm font-bold"
              style={{ background: "var(--gold)", color: "#080d1a" }}
            >
              Login / Sign Up
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}