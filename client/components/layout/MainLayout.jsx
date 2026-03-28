"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/uiStore";
import { usePathname, useRouter } from "next/navigation";
import { Bot, MessageSquare, X, LogOut, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "@/components/chatbot/Chatbot";

export default function MainLayout({ children }) {
  const { chatbotOpen, toggleChatbot, darkMode, toggleTheme } = useUIStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
    return () => {
      root.classList.remove("light");
    };
  }, [darkMode]);

  const navItems = [
    { name: "Goals", path: "/dashboard/goals" },
    { name: "Portfolio", path: "/dashboard/portfolio" },
    { name: "Market", path: "/dashboard/market" },
    { name: "Simulation", path: "/dashboard/simulation" },
    { name: "Summary", path: "/dashboard/summary" },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--gradient-dashboard)" }}>

      {/* Sidebar */}
      <div
        className="w-64 flex flex-col p-5 shrink-0 border-r"
        style={{ background: "var(--gradient-sidebar)", borderColor: "var(--border)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: "var(--gold)", color: "#080d1a", boxShadow: "0 0 12px var(--gold-glow)" }}>
            ₹
          </div>
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
            Chanakya
          </span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const active = pathname === item.path;
            return (
              <div
                key={item.name}
                onClick={() => router.push(item.path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium"
                style={{
                  background: active ? "rgba(245,166,35,0.12)" : "transparent",
                  color: active ? "var(--gold)" : "var(--text-secondary)",
                  border: active ? "1px solid rgba(245,166,35,0.25)" : "1px solid transparent",
                }}
              >
                {item.name}
              </div>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="mt-2 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200"
          style={{
            background: darkMode ? "rgba(245,166,35,0.08)" : "rgba(15,23,42,0.06)",
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          {darkMode
            ? <><Sun size={14} style={{ color: "var(--gold)" }} /> <span>Light Mode</span></>
            : <><Moon size={14} style={{ color: "#6366f1" }} /> <span>Dark Mode</span></>}
        </button>

        {/* Logout */}
        <button
          className="mt-2 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-200 hover:bg-red-500/10"
          style={{ color: "var(--red)" }}
          onClick={() => router.push("/auth")}
        >
          <span className="flex items-center gap-2"><LogOut size={14} /> Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${chatbotOpen ? "mr-80" : ""}`}
        style={{ background: "var(--gradient-main)" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chatbot Panel */}
      {chatbotOpen && (
        <div
          className="w-80 fixed right-0 top-0 h-full flex flex-col border-l"
          style={{ background: "var(--gradient-sidebar)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <Bot size={18} style={{ color: "var(--gold)" }} />
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Chanakya AI</p>
            </div>
            <button
              onClick={toggleChatbot}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}
            >
              <X size={13} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chatbot />
          </div>
        </div>
      )}

      {/* Floating reopen button */}
      {!chatbotOpen && (
        <button
          onClick={toggleChatbot}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-2xl flex items-center justify-center shadow-lg transition-all z-50 hover:scale-110"
          style={{ background: "var(--gold)", color: "#080d1a", boxShadow: "0 0 24px var(--gold-glow)" }}
          title="Open Chanakya AI"
        >
          <MessageSquare size={22} />
        </button>
      )}
    </div>
  );
}