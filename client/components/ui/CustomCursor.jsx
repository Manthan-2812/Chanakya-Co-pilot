"use client";

import { useEffect, useRef, useState } from "react";

const TRAIL_LENGTH = 14;

export default function CustomCursor() {
  const cursorRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }))
  );
  const dotsRef = useRef([]);
  const mainRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      const target = cursorRef.current;
      const trail = trailRef.current;

      // Shift trail positions
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.38;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.38;
      }
      trail[0].x += (target.x - trail[0].x) * 0.5;
      trail[0].y += (target.y - trail[0].y) * 0.5;

      // Move main dot
      if (mainRef.current) {
        mainRef.current.style.transform = `translate(${target.x - 6}px, ${target.y - 6}px)`;
      }
      // Move ring (slightly lagged)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${trail[2].x - 16}px, ${trail[2].y - 16}px)`;
      }
      // Move trail dots
      dotsRef.current.forEach((dot, i) => {
        if (!dot) return;
        const t = trail[i + 1];
        const scale = 1 - (i / TRAIL_LENGTH) * 0.85;
        const opacity = (1 - i / TRAIL_LENGTH) * 0.55;
        dot.style.transform = `translate(${t.x - 4}px, ${t.y - 4}px) scale(${scale})`;
        dot.style.opacity = opacity;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>

      {/* Main gold dot */}
      <div
        ref={mainRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-3 h-3 rounded-full"
        style={{
          background: "#f5a623",
          boxShadow: "0 0 8px #f5a623, 0 0 18px #f5a62388",
          willChange: "transform",
          transition: "none",
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none w-8 h-8 rounded-full border"
        style={{
          borderColor: "rgba(245,166,35,0.45)",
          boxShadow: "0 0 12px rgba(245,166,35,0.2)",
          willChange: "transform",
          transition: "none",
        }}
      />

      {/* Trail dots */}
      {Array.from({ length: TRAIL_LENGTH - 1 }).map((_, i) => {
        const hue = i % 3 === 0 ? "#f5a623" : i % 3 === 1 ? "#10b981" : "#60a5fa";
        return (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            className="fixed top-0 left-0 z-[9997] pointer-events-none w-2 h-2 rounded-full"
            style={{
              background: hue,
              boxShadow: `0 0 6px ${hue}`,
              willChange: "transform, opacity",
              transition: "none",
            }}
          />
        );
      })}
    </>
  );
}
