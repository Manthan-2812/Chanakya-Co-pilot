"use client";

import AuthCard from "@/components/auth/AuthCard";
import AuthBackground from "@/components/auth/AuthBackground";
import CustomCursor from "@/components/ui/CustomCursor";

export default function AuthPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <CustomCursor />
      <AuthBackground />
      <AuthCard />
    </div>
  );
}