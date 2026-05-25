"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div
        className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-4xl"
        style={{ background: "rgba(34,197,94,0.15)", border: "2px solid #22c55e" }}
      >
        ✓
      </div>
      <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-3">
        Order Confirmed!
      </h1>
      <p className="mb-2" style={{ color: "var(--muted)" }}>
        Thanks for your order. You&apos;ll receive a confirmation email shortly.
      </p>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Your gear is being printed and will ship within 3–7 business days.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link
          href="/shop"
          className="px-6 py-3 rounded font-display font-bold text-sm uppercase tracking-wide"
          style={{ background: "var(--gold)", color: "#0d0f14" }}
        >
          Back to Shop
        </Link>
        <Link
          href="/"
          className="px-6 py-3 rounded font-display font-bold text-sm uppercase tracking-wide"
          style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
        >
          Home
        </Link>
      </div>
    </div>
  );
}
