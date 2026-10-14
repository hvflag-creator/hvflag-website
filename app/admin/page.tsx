"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  title: string;
  visible: boolean;
  images: { src: string; is_default: boolean }[];
  variants: { price: number; is_enabled: boolean }[];
};

export default function AdminShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [enabled, setEnabled] = useState<Set<string>>(new Set());
  const [order, setOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Drag state
  const dragId = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/shop-config")
      .then((r) => r.json())
      .then(({ products: prods, config }) => {
        setProducts(prods);
        if (config.enabledProductIds?.length > 0) {
          setEnabled(new Set(config.enabledProductIds));
        } else {
          setEnabled(new Set(prods.filter((p: Product) => p.visible).map((p: Product) => p.id)));
        }
        // Initialize order: saved order first, then any new products not yet in order
        const savedOrder: string[] = config.productOrder ?? [];
        const allIds: string[] = prods.map((p: Product) => p.id);
        const merged = [
          ...savedOrder.filter((id: string) => allIds.includes(id)),
          ...allIds.filter((id: string) => !savedOrder.includes(id)),
        ];
        setOrder(merged);
        setLoading(false);
      });
  }, []);

  function toggle(id: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/shop-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabledProductIds: [...enabled], productOrder: order }),
    });
    setSaving(false);
    setSaved(true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function getMinPrice(product: Product) {
    const prices = product.variants.filter((v) => v.is_enabled).map((v) => v.price);
    if (!prices.length) return null;
    return (Math.min(...prices) / 100).toFixed(2);
  }

  function getImage(product: Product) {
    return product.images.find((i) => i.is_default)?.src ?? product.images[0]?.src ?? "";
  }

  // ── Drag handlers ─────────────────────────────────────────────────────────────
  function handleDragStart(id: string) {
    dragId.current = id;
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (dragId.current && dragId.current !== id) setDragOverId(id);
  }

  function handleDrop(id: string) {
    const from = dragId.current;
    if (!from || from === id) return;
    setOrder((prev) => {
      const next = [...prev];
      const fi = next.indexOf(from);
      const ti = next.indexOf(id);
      next.splice(fi, 1);
      next.splice(ti, 0, from);
      return next;
    });
    dragId.current = null;
    setDragOverId(null);
    setSaved(false);
  }

  function handleDragEnd() {
    dragId.current = null;
    setDragOverId(null);
  }

  const productById = Object.fromEntries(products.map((p) => [p.id, p]));
  const orderedProducts = order.map((id) => productById[id]).filter(Boolean);
  const enabledCount = enabled.size;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div>
          <h1 className="font-display font-black text-xl uppercase tracking-wide" style={{ color: "var(--gold)" }}>
            Shop Manager
          </h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {enabledCount} product{enabledCount !== 1 ? "s" : ""} showing · drag rows to reorder
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/signups"
            className="text-xs font-semibold px-3 py-1.5 rounded"
            style={{ color: "var(--gold)", border: "1px solid rgba(245,200,66,0.4)" }}
          >
            Sign-ups
          </a>
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded"
            style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
          >
            View Shop ↗
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-1.5 rounded font-display font-bold text-sm uppercase tracking-wide"
            style={{
              background: saved ? "#22c55e" : "var(--gold)",
              color: "#0d0f14",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded"
            style={{ color: "var(--muted)", border: "1px solid var(--border)" }}
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20" style={{ color: "var(--muted)" }}>Loading products...</div>
        ) : (
          <>
            <div className="flex gap-3 mb-5">
              <button
                onClick={() => { setEnabled(new Set(products.map((p) => p.id))); setSaved(false); }}
                className="text-xs px-3 py-1.5 rounded font-semibold"
                style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                Enable All
              </button>
              <button
                onClick={() => { setEnabled(new Set()); setSaved(false); }}
                className="text-xs px-3 py-1.5 rounded font-semibold"
                style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
              >
                Disable All
              </button>
              <span className="text-xs self-center" style={{ color: "var(--muted)" }}>
                Toggle on/off · drag ☰ to reorder · position = shop order
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {orderedProducts.map((product, idx) => {
                const isEnabled = enabled.has(product.id);
                const img = getImage(product);
                const price = getMinPrice(product);
                const isDragOver = dragOverId === product.id;

                return (
                  <div
                    key={product.id}
                    draggable
                    onDragStart={() => handleDragStart(product.id)}
                    onDragOver={(e) => handleDragOver(e, product.id)}
                    onDrop={() => handleDrop(product.id)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                    style={{
                      background: "var(--surface)",
                      border: `2px solid ${isDragOver ? "var(--gold)" : isEnabled ? "rgba(245,200,66,0.35)" : "var(--border)"}`,
                      opacity: isEnabled ? 1 : 0.5,
                      cursor: "grab",
                      transform: isDragOver ? "scale(1.01)" : "scale(1)",
                    }}
                  >
                    {/* Position number */}
                    <span
                      className="text-xs font-display font-black w-5 text-center flex-shrink-0"
                      style={{ color: isEnabled ? "var(--gold)" : "var(--muted)" }}
                    >
                      {isEnabled ? idx + 1 - [...orderedProducts.slice(0, idx)].filter(p => !enabled.has(p.id)).length : "—"}
                    </span>

                    {/* Drag handle */}
                    <span className="flex-shrink-0 text-lg select-none" style={{ color: "var(--muted)", cursor: "grab" }}>
                      ☰
                    </span>

                    {/* Thumbnail */}
                    {img && (
                      <img
                        src={img}
                        alt={product.title}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                        style={{ border: "1px solid var(--border)" }}
                        draggable={false}
                      />
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-tight truncate" style={{ color: "var(--text)" }}>
                        {product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {price && (
                          <span className="text-xs" style={{ color: "var(--gold)" }}>
                            from ${price}
                          </span>
                        )}
                        {!product.visible && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}>
                            Hidden in Printify
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggle(product.id); }}
                      className="flex-shrink-0 px-3 py-1 rounded text-xs font-display font-bold uppercase tracking-wide transition-all"
                      style={{
                        background: isEnabled ? "var(--gold)" : "var(--surface2)",
                        color: isEnabled ? "#0d0f14" : "var(--muted)",
                        border: isEnabled ? "none" : "1px solid var(--border)",
                      }}
                    >
                      {isEnabled ? "On" : "Off"}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
