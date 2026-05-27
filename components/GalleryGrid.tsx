"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } };
  }
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const instagrams = items.filter((i): i is Extract<GalleryItem, { type: "instagram" }> => i.type === "instagram");
  const photos = items.filter((i): i is Extract<GalleryItem, { type: "photo" }> => i.type === "photo");

  useEffect(() => {
    // If embed.js already loaded before this component mounted, process manually
    window.instgrm?.Embeds.process();
  }, [instagrams.length]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  if (items.length === 0) {
    return (
      <div
        className="rounded-lg p-16 text-center"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div className="font-display font-black text-2xl uppercase mb-2" style={{ color: "var(--gold)" }}>
          Coming Soon
        </div>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Photos and posts will appear here once the season kicks off.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Load Instagram embed script */}
      {instagrams.length > 0 && (
        <Script
          src="https://www.instagram.com/embed.js"
          strategy="afterInteractive"
          onLoad={() => window.instgrm?.Embeds.process()}
        />
      )}

      {/* Manual photos */}
      {photos.length > 0 && (
        <div className={instagrams.length > 0 ? "mb-14" : ""}>
          {instagrams.length > 0 && (
            <h2 className="font-display font-black text-2xl uppercase tracking-wide mb-6 flex items-center gap-3">
              <span style={{ color: "var(--gold)" }}>—</span> Photos
            </h2>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((item, i) => (
              <button
                key={i}
                onClick={() => setLightbox(item.src)}
                className="group relative rounded-lg overflow-hidden focus:outline-none"
                style={{ border: "1px solid var(--border)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.caption ?? `Gallery photo ${i + 1}`}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.caption && (
                  <div
                    className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-xs font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-200"
                    style={{ background: "rgba(13,15,20,0.85)", color: "var(--text)" }}
                  >
                    {item.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instagram embeds */}
      {instagrams.length > 0 && (
        <div>
          {photos.length > 0 && (
            <h2 className="font-display font-black text-2xl uppercase tracking-wide mb-6 flex items-center gap-3">
              <span style={{ color: "var(--gold)" }}>—</span> From Instagram
            </h2>
          )}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {instagrams.map((item, i) => (
              <div key={i} className="break-inside-avoid">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={item.url}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: 0,
                    borderRadius: "8px",
                    boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                    margin: "0 auto",
                    maxWidth: "540px",
                    minWidth: "326px",
                    padding: 0,
                    width: "100%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Gallery photo"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
