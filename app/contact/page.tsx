"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "player", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire up to a form handler (Resend, Formspree, etc.)
    setSubmitted(true);
  }

  return (
    <div>
      <div
        className="border-b py-10"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Contact
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Get in touch with the league</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: "📍",
              label: "Location",
              value: "Beacon, NY 12508",
            },
            {
              icon: "📸",
              label: "Instagram",
              value: "@hvflagfootball",
              href: "https://www.instagram.com/hvflagfootball",
            },
            {
              icon: "📅",
              label: "Seasons",
              value: "Summer & Winter",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg p-5 text-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: "var(--muted)" }}>
                {item.label}
              </div>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-display font-bold text-sm hover:underline" style={{ color: "var(--gold)" }}>
                  {item.value}
                </a>
              ) : (
                <div className="font-display font-bold text-sm">{item.value}</div>
              )}
            </div>
          ))}
        </div>

        {submitted ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{ background: "var(--surface)", border: "1px solid rgba(245,200,66,0.3)" }}
          >
            <div className="text-4xl mb-3">🏈</div>
            <div className="font-display font-black text-2xl uppercase mb-2" style={{ color: "var(--gold)" }}>
              Message Sent!
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              We&apos;ll get back to you soon. In the meantime, follow us on Instagram for updates.
            </p>
          </div>
        ) : (
          <div
            className="rounded-lg p-8"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <h2 className="font-display font-black text-2xl uppercase tracking-wide mb-6">
              Send Us a <span style={{ color: "var(--gold)" }}>Message</span>
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                    Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded px-3 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                    Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded px-3 py-2.5 text-sm outline-none transition-colors"
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                  I&apos;m interested in...
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded px-3 py-2.5 text-sm outline-none"
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <option value="player">Playing in the league</option>
                  <option value="sponsor">Sponsoring a team</option>
                  <option value="general">General question</option>
                  <option value="media">Media / photography</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded px-3 py-2.5 text-sm outline-none resize-none"
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                  placeholder="Tell us about yourself and what you're looking for..."
                />
              </div>

              <button
                type="submit"
                className="self-start px-8 py-3 rounded font-display font-bold text-sm uppercase tracking-wide transition-transform hover:scale-105"
                style={{ background: "var(--gold)", color: "#0d0f14" }}
              >
                Send Message
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
