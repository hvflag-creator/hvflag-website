"use client";

import { useState, useEffect } from "react";
import type { PrintifyProduct, PrintifyVariant } from "@/lib/printify";
import { findVariant, getImageForVariant } from "@/lib/printify";
import { useCart } from "./CartProvider";

interface Props {
  product: PrintifyProduct;
}

export default function VariantPicker({ product }: Props) {
  const { addItem, openCart } = useCart();

  const enabledVariants = product.variants.filter((v) => v.is_enabled);

  // Build option → available values map
  const options = product.options;

  // Selected option value IDs, keyed by option index
  const [selected, setSelected] = useState<Record<number, number>>(() => {
    const init: Record<number, number> = {};
    // Pick defaults from first enabled variant
    if (enabledVariants[0]) {
      enabledVariants[0].options.forEach((valId, i) => {
        init[i] = valId;
      });
    }
    return init;
  });

  const [currentVariant, setCurrentVariant] = useState<PrintifyVariant | undefined>();
  const [currentImage, setCurrentImage] = useState<string>("");
  const [activeImageSrc, setActiveImageSrc] = useState<string>("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const variant = findVariant(product, selected);
    setCurrentVariant(variant);
    if (variant) {
      const img = getImageForVariant(product, variant.id);
      setCurrentImage(img);
      setActiveImageSrc(img); // reset to front when variant changes
    }
  }, [selected, product]);

  // Initialize image on mount
  useEffect(() => {
    const variant = findVariant(product, selected);
    if (variant) {
      const img = getImageForVariant(product, variant.id);
      setCurrentImage(img);
      setActiveImageSrc(img);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // All images available for the current variant, deduped by position
  const variantImages = currentVariant
    ? product.images.filter((img) => img.variant_ids.includes(currentVariant.id))
    : [];

  function isValueAvailableForOption(optionIdx: number, valueId: number): boolean {
    // Check if any enabled variant has this value AND the currently selected values for other options
    return enabledVariants.some((v) => {
      if (!v.options.includes(valueId)) return false;
      for (const [idx, selVal] of Object.entries(selected)) {
        if (Number(idx) === optionIdx) continue;
        if (!v.options.includes(selVal)) return false;
      }
      return true;
    });
  }

  function handleAddToCart() {
    if (!currentVariant) return;
    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      title: product.title,
      variantTitle: currentVariant.title,
      price: currentVariant.price,
      image: currentImage || (product.images[0]?.src ?? ""), // always use front for cart
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Main product image */}
      {activeImageSrc && (
        <div
          className="rounded-lg overflow-hidden aspect-square"
          style={{ background: "var(--surface2)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImageSrc}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Image thumbnails (front / back / etc.) */}
      {variantImages.length > 1 && (
        <div className="flex gap-2">
          {variantImages.map((img) => (
            <button
              key={img.src}
              onClick={() => setActiveImageSrc(img.src)}
              className="flex flex-col items-center gap-1 group"
            >
              <div
                className="rounded overflow-hidden w-16 h-16 flex-shrink-0 transition-all"
                style={{
                  background: "var(--surface2)",
                  border: `2px solid ${activeImageSrc === img.src ? "var(--gold)" : "var(--border)"}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.position}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="text-[10px] font-display font-bold uppercase tracking-wide"
                style={{ color: activeImageSrc === img.src ? "var(--gold)" : "var(--muted)" }}
              >
                {img.position}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Price */}
      <div>
        <span className="font-display font-black text-3xl" style={{ color: "var(--gold)" }}>
          {currentVariant ? `$${(currentVariant.price / 100).toFixed(2)}` : "—"}
        </span>
      </div>

      {/* Options */}
      {options.map((option, optIdx) => (
        <div key={optIdx}>
          <p className="font-display font-bold text-sm uppercase tracking-wide mb-2">
            {option.name}
            {selected[optIdx] !== undefined && (
              <span className="ml-2 font-normal normal-case tracking-normal" style={{ color: "var(--muted)" }}>
                {option.values.find((v) => v.id === selected[optIdx])?.title}
              </span>
            )}
          </p>

          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const available = isValueAvailableForOption(optIdx, value.id);
              const isSelected = selected[optIdx] === value.id;

              if (option.type === "color") {
                const color = value.colors?.[0] ?? "#ccc";
                return (
                  <button
                    key={value.id}
                    title={value.title}
                    disabled={!available}
                    onClick={() => setSelected((prev) => ({ ...prev, [optIdx]: value.id }))}
                    className="w-7 h-7 rounded-full transition-all"
                    style={{
                      background: color,
                      border: isSelected
                        ? "2px solid var(--gold)"
                        : "2px solid transparent",
                      outline: isSelected ? "2px solid var(--gold)" : "none",
                      outlineOffset: "2px",
                      opacity: available ? 1 : 0.25,
                      cursor: available ? "pointer" : "not-allowed",
                    }}
                  />
                );
              }

              return (
                <button
                  key={value.id}
                  disabled={!available}
                  onClick={() => setSelected((prev) => ({ ...prev, [optIdx]: value.id }))}
                  className="px-3 py-1.5 rounded text-sm font-display font-bold uppercase tracking-wide transition-colors"
                  style={{
                    background: isSelected ? "var(--gold)" : "var(--surface2)",
                    color: isSelected ? "#0d0f14" : available ? "var(--text)" : "var(--muted)",
                    border: `1px solid ${isSelected ? "var(--gold)" : "var(--border)"}`,
                    opacity: available ? 1 : 0.4,
                    cursor: available ? "pointer" : "not-allowed",
                  }}
                >
                  {value.title}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!currentVariant}
        className="w-full py-4 rounded font-display font-black text-base uppercase tracking-wide transition-all disabled:opacity-40"
        style={{
          background: added ? "#22c55e" : "var(--gold)",
          color: "#0d0f14",
        }}
      >
        {added ? "Added to Cart ✓" : currentVariant ? "Add to Cart" : "Select options"}
      </button>
    </div>
  );
}
