"use client";

import { useState } from "react";

// Positions players can sign up for. High-demand ones are what the league needs most.
const POSITIONS: { code: string; label: string; demand: "high" | "low" }[] = [
  { code: "QB", label: "Quarterback", demand: "high" },
  { code: "OL", label: "Offensive Line", demand: "high" },
  { code: "DL", label: "Defensive Line", demand: "high" },
  { code: "WR", label: "Wide Receiver", demand: "low" },
  { code: "RB", label: "Running Back", demand: "low" },
  { code: "CB", label: "Cornerback", demand: "low" },
  { code: "S", label: "Safety", demand: "low" },
];

const MESSAGE_LABEL: Record<string, string> = {
  player: "Anything else we should know?",
  sponsor: "Tell us about your business & what you're hoping for",
  general: "Your question",
  media: "Tell us what you'd like to shoot or create",
};

const MESSAGE_PLACEHOLDER: Record<string, string> = {
  player: "Experience level, availability, friends you'd like to play with...",
  sponsor: "What does your business do? Which team or area would you love to be part of? Any questions about sponsoring?",
  general: "Ask us anything about the league, schedule, or how it all works...",
  media: "Photography, video, highlights, social content — tell us what you have in mind...",
};

const SPONSOR_PERKS = [
  {
    icon: "👕",
    title: "Your name on the jersey",
    body: "A custom team jersey with your business logo and name on it, worn by the whole roster all season long.",
  },
  {
    icon: "📍",
    title: "Seen all around the league",
    body: "Your brand displayed around our league — on game days, at the field, and everywhere our teams show up.",
  },
  {
    icon: "📱",
    title: "A full season on social media",
    body: "Featured across our social media for the entire season, so the whole community gets to know your business.",
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "player", message: "" });
  const [company, setCompany] = useState(""); // honeypot — real visitors never see this
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [positions, setPositions] = useState<string[]>([]);
  // Extra fields that only show for sponsors / media.
  const [business, setBusiness] = useState({ name: "", type: "", link: "" });
  const [mediaLink, setMediaLink] = useState("");
  const [positionError, setPositionError] = useState(false);

  function togglePosition(code: string) {
    setPositionError(false);
    setPositions((cur) => (cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.subject === "player" && positions.length === 0) {
      setPositionError(true);
      return;
    }
    setSendError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, positions, business, mediaLink, company }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
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
              value: "@hvflag",
              href: "https://www.instagram.com/hvflag/",
            },
            {
              icon: "📅",
              label: "Seasons",
              value: "Summer & Fall",
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
              {form.subject === "sponsor" ? "Thank You!" : "Message Sent!"}
            </div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              {form.subject === "sponsor"
                ? "We're excited you're interested in sponsoring a team. We'll reach out soon to chat about what that looks like. In the meantime, follow us on Instagram to see the league in action."
                : "We'll get back to you soon. In the meantime, follow us on Instagram for updates."}
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
                  Phone <span className="normal-case font-normal">(optional — so we can text you)</span>
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded px-3 py-2.5 text-sm outline-none transition-colors"
                  style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
                  placeholder="(845) 555-1234"
                />
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
                  <option value="sponsor">Sponsoring a team (local businesses welcome!)</option>
                  <option value="general">General question</option>
                  <option value="media">Media / photography</option>
                </select>
              </div>

              {form.subject === "sponsor" && (
                <div className="flex flex-col gap-5">
                  <div
                    className="rounded-lg p-5"
                    style={{ background: "rgba(245,200,66,0.07)", border: "1px solid rgba(245,200,66,0.3)" }}
                  >
                    <div className="font-display font-black text-xl uppercase tracking-wide mb-1" style={{ color: "var(--gold)" }}>
                      We&apos;d love to have you on the team 🤝
                    </div>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      HVFF is a non-profit community league in Beacon, NY, and our sponsors are a big part of what makes every season happen.
                      Tell us a little about your business and we&apos;ll reach out to chat — here&apos;s what you get as a team sponsor:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3 mt-4">
                      {SPONSOR_PERKS.map((perk) => (
                        <div key={perk.title} className="rounded-lg p-4" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
                          <div className="text-2xl mb-1.5">{perk.icon}</div>
                          <div className="font-display font-bold text-sm uppercase tracking-wide mb-1">{perk.title}</div>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{perk.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                        Business name *
                      </label>
                      <input
                        required
                        type="text"
                        value={business.name}
                        onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                        className="w-full rounded px-3 py-2.5 text-sm outline-none"
                        style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
                        placeholder="Your business"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                        What does your business do?
                      </label>
                      <input
                        type="text"
                        value={business.type}
                        onChange={(e) => setBusiness({ ...business, type: e.target.value })}
                        className="w-full rounded px-3 py-2.5 text-sm outline-none"
                        style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
                        placeholder="Restaurant, shop, service..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                      Website or Instagram
                    </label>
                    <input
                      type="text"
                      value={business.link}
                      onChange={(e) => setBusiness({ ...business, link: e.target.value })}
                      className="w-full rounded px-3 py-2.5 text-sm outline-none"
                      style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
                      placeholder="yourbusiness.com or @yourbusiness"
                    />
                  </div>
                </div>
              )}

              {form.subject === "general" && (
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Curious how the league works, when games are, or how to get involved? Ask away — we&apos;re happy to help.
                </p>
              )}

              {form.subject === "media" && (
                <div className="flex flex-col gap-5">
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Photographers, videographers and content creators are always welcome at our games. Tell us what you do and we&apos;ll be in touch.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                      Link to your work
                    </label>
                    <input
                      type="text"
                      value={mediaLink}
                      onChange={(e) => setMediaLink(e.target.value)}
                      className="w-full rounded px-3 py-2.5 text-sm outline-none"
                      style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
                      placeholder="Portfolio or Instagram"
                    />
                  </div>
                </div>
              )}

              {form.subject === "player" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                    Positions you&apos;d play * <span className="normal-case font-normal">(pick as many as you like)</span>
                  </label>
                  <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
                    We&apos;re looking for <span style={{ color: "var(--gold)", fontWeight: 700 }}>linemen</span> and{" "}
                    <span style={{ color: "var(--gold)", fontWeight: 700 }}>quarterbacks</span>{" "}
                    most — if you can play one of those, you&apos;re more likely to get a spot.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {POSITIONS.map((pos) => {
                      const on = positions.includes(pos.code);
                      const high = pos.demand === "high";
                      return (
                        <button
                          key={pos.code}
                          type="button"
                          aria-pressed={on}
                          onClick={() => togglePosition(pos.code)}
                          className="rounded-lg px-3 py-3 text-left transition-transform hover:scale-[1.03]"
                          style={{
                            background: on ? (high ? "rgba(245,200,66,0.16)" : "rgba(255,255,255,0.08)") : "var(--surface2)",
                            border: on
                              ? `2px solid ${high ? "var(--gold)" : "rgba(255,255,255,0.55)"}`
                              : `1px solid ${high ? "rgba(245,200,66,0.4)" : "var(--border)"}`,
                            color: "var(--text)",
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display font-black text-xl leading-none">{pos.code}</span>
                            <span
                              className="font-display font-bold uppercase text-[10px] tracking-wide px-1.5 py-0.5 rounded whitespace-nowrap"
                              style={
                                high
                                  ? { background: "var(--gold)", color: "#0d0f14" }
                                  : { background: "rgba(255,255,255,0.08)", color: "var(--muted)" }
                              }
                            >
                              {high ? "🔥 High demand" : "Low demand"}
                            </span>
                          </div>
                          <div className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>{pos.label}</div>
                        </button>
                      );
                    })}
                  </div>
                  {positionError && (
                    <p className="text-xs mt-2" style={{ color: "#f87171" }}>Pick at least one position.</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
                  {MESSAGE_LABEL[form.subject] ?? "Message"} *
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
                  placeholder={MESSAGE_PLACEHOLDER[form.subject] ?? "Tell us about yourself and what you're looking for..."}
                />
              </div>

              {/* Honeypot: hidden from people, tempting for bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />

              {sendError && <p className="text-sm" style={{ color: "#f87171" }}>{sendError}</p>}

              <button
                type="submit"
                disabled={sending}
                className="self-start px-8 py-3 rounded font-display font-bold text-sm uppercase tracking-wide transition-transform hover:scale-105"
                style={{ background: "var(--gold)", color: "#0d0f14", opacity: sending ? 0.7 : 1 }}
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
