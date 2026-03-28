"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="p-6 bg-slate-800 rounded-xl w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          className="w-full p-2 mb-2 bg-slate-700 rounded"
          placeholder="Email"
        />

        <input
          className="w-full p-2 mb-4 bg-slate-700 rounded"
          placeholder="Password"
        />

        <button
          className="w-full bg-green-500 p-2 rounded"
          onClick={() => router.push("/dashboard")}
        >
          Login
        </button>
      </div>
    </div>
  );
}