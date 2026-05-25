"use client";

import { useCart } from "./CartProvider";
import { useState } from "react";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalPrice, totalItems } = useCart();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col"
        style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="font-display font-black text-xl uppercase tracking-wide">
            Cart {totalItems > 0 && <span style={{ color: "var(--gold)" }}>({totalItems})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="text-2xl leading-none hover:opacity-70 transition-opacity"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-16" style={{ color: "var(--muted)" }}>
              <p className="font-display font-bold text-lg uppercase mb-2">Your cart is empty</p>
              <p className="text-sm">Add some HVFF gear to get started.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3 py-3 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0" style={{ background: "var(--surface2)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm leading-tight">{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{item.variantTitle}</p>
                    <p className="font-bold text-sm mt-1" style={{ color: "var(--gold)" }}>
                      ${(item.price / 100).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="w-6 h-6 rounded text-sm font-bold flex items-center justify-center hover:opacity-70"
                        style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                        onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="text-sm font-bold tabular-nums w-4 text-center">{item.quantity}</span>
                      <button
                        className="w-6 h-6 rounded text-sm font-bold flex items-center justify-center hover:opacity-70"
                        style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
                        onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="ml-2 text-xs hover:opacity-70 transition-opacity"
                        style={{ color: "var(--muted)" }}
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-display font-bold uppercase tracking-wide">Subtotal</span>
              <span className="font-display font-black text-xl" style={{ color: "var(--gold)" }}>
                ${(totalPrice / 100).toFixed(2)}
              </span>
            </div>
            <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
              Shipping & taxes calculated at checkout
            </p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 rounded font-display font-black text-sm uppercase tracking-wide transition-opacity disabled:opacity-50"
              style={{ background: "var(--gold)", color: "#0d0f14" }}
            >
              {loading ? "Loading..." : "Checkout →"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
