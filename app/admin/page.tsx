"use client";

import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/shop-config")
      .then((r) => r.json())
      .then(({ products, config }) => {
        setProducts(products);
        if (config.enabledProductIds?.length > 0) {
          setEnabled(new Set(config.enabledProductIds));
        } else {
          // Default: enable all visible products
          setEnabled(new Set(products.filter((p: Product) => p.visible).map((p: Product) => p.id)));
        }
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
      body: JSON.stringify({ enabledProductIds: [...enabled] }),
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

  const enabledCount = enabled.size;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div>
          <h1 className="font-display font-black text-xl uppercase tracking-wide" style={{ color: "var(--gold)" }}>
            Shop Manager
          </h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {enabledCount} product{enabledCount !== 1 ? "s" : ""} showing on site
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/shop" target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-1.5 rounded"
            style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
            View Shop ↗
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-1.5 rounded font-display font-bold text-sm uppercase tracking-wide"
            style={{ background: saved ? "#22c55e" : "var(--gold)", color: "#0d0f14", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </button>
          <button onClick={logout} className="text-xs px-3 py-1.5 rounded"
            style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-20" style={{ color: "var(--muted)" }}>Loading products...</div>
        ) : (
          <>
            <div className="flex gap-3 mb-4">
              <button onClick={() => { setEnabled(new Set(products.map(p => p.id))); setSaved(false); }}
                className="text-xs px-3 py-1.5 rounded font-semibold"
                style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}>
                Enable All
              </button>
              <button onClick={() => { setEnabled(new Set()); setSaved(false); }}
                className="text-xs px-3 py-1.5 rounded font-semibold"
                style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}>
                Disable All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products.map((product) => {
                const isEnabled = enabled.has(product.id);
                const img = getImage(product);
                const price = getMinPrice(product);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggle(product.id)}
                    className="relative rounded-lg overflow-hidden text-left transition-all"
                    style={{
                      background: "var(--surface)",
                      border: `2px solid ${isEnabled ? "var(--gold)" : "var(--border)"}`,
                      opacity: isEnabled ? 1 : 0.45,
                    }}
                  >
                    {img && (
                      <img src={img} alt={product.title}
                        className="w-full aspect-square object-cover" />
                    )}
                    <div className="p-2">
                      <p className="text-xs font-semibold leading-tight line-clamp-2" style={{ color: "var(--text)" }}>
                        {product.title}
                      </p>
                      {price && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--gold)" }}>${price}</p>
                      )}
                    </div>
                    {/* Checkbox indicator */}
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                      style={{
                        background: isEnabled ? "var(--gold)" : "rgba(0,0,0,0.5)",
                        color: isEnabled ? "#0d0f14" : "var(--muted)",
                        border: isEnabled ? "none" : "1px solid var(--border)",
                      }}>
                      {isEnabled ? "✓" : ""}
                    </div>
                    {!product.visible && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-bold"
                        style={{ background: "rgba(0,0,0,0.7)", color: "#f87171" }}>
                        Hidden in Printify
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
