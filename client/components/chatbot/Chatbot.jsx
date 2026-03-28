"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { sendChatMessage } from "@/library/api";

const quickActions = [
  { label: "Analyze Portfolio", prompt: "Analyze my portfolio" },
  { label: "Rebalance", prompt: "Suggest rebalancing" },
  { label: "Simulate Risk", prompt: "Simulate risk scenarios" },
  { label: "Goal Progress", prompt: "How is my goal progress?" },
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm Chanakya, your financial co-pilot. Ask me anything about your portfolio, goals, or market signals." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I couldn't reach the server. Please make sure the backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div
                className="w-6 h-6 rounded-full shrink-0 mr-2 mt-0.5 flex items-center justify-center text-[10px] font-bold"
                style={{ background: "var(--gold)", color: "#080d1a" }}
              >
                ₹
              </div>
            )}
            <div
              className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? {
                      background: "rgba(245,166,35,0.18)",
                      border: "1px solid rgba(245,166,35,0.3)",
                      color: "var(--text-primary)",
                      borderBottomRightRadius: 4,
                    }
                  : {
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      borderBottomLeftRadius: 4,
                    }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start items-center gap-2">
            <div
              className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
              style={{ background: "var(--gold)", color: "#080d1a" }}
            >
              ₹
            </div>
            <div
              className="flex gap-1 px-4 py-3 rounded-2xl"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            >
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: "var(--gold)", animationDelay: `${d * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => setInput(a.prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full border transition-all duration-150 hover:border-[var(--gold)] hover:text-[var(--gold)]"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="mx-3 mb-3 flex items-center gap-2 rounded-xl px-3 py-2 border"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
      >
        <input
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
          style={{ color: "var(--text-primary)" }}
          placeholder="Ask anything about your money..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30"
          style={{ background: input.trim() ? "var(--gold)" : "transparent", color: input.trim() ? "#080d1a" : "var(--text-muted)" }}
        >
          <SendHorizontal size={14} />
        </button>
      </div>

    </div>
  );
}