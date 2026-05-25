"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/standings", label: "Standings" },
  { href: "/rosters", label: "Rosters" },
  { href: "/stats", label: "Stats" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="font-display font-black text-2xl tracking-wide" style={{ color: "var(--gold)" }}>
            HVFF
          </span>
          <span className="font-display font-semibold text-sm text-white/60 uppercase tracking-widest hidden sm:block">
            Flag Football
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded font-display font-semibold text-sm uppercase tracking-wide transition-colors ${
                pathname === link.href
                  ? "text-[var(--gold)] bg-white/5"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Cart icon */}
        <button
          onClick={openCart}
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded font-display font-bold text-sm uppercase tracking-wide transition-colors hover:bg-white/5"
          style={{ color: "var(--gold)" }}
          aria-label="Open cart"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {totalItems > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-black flex items-center justify-center"
              style={{ background: "var(--gold)", color: "#0d0f14" }}
            >
              {totalItems}
            </span>
          )}
        </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded font-display font-semibold uppercase tracking-wide ${
                pathname === link.href
                  ? "text-[var(--gold)] bg-white/5"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
