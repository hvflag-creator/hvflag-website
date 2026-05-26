"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Wrong password.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        <div className="rounded-xl p-8" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <h1 className="font-display font-black text-2xl uppercase tracking-wide mb-1" style={{ color: "var(--gold)" }}>
            HVFF Admin
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Enter your password to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded text-sm outline-none"
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
              autoFocus
            />
            {error && <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-display font-bold text-sm uppercase tracking-wide"
              style={{ background: "var(--gold)", color: "#0d0f14", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Checking..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
