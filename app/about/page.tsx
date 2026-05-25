import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      <div
        className="border-b py-10"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> About
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Hudson Valley Flag Football League</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-14">
        {/* Mission */}
        <section className="mb-12">
          <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-4">
            Our <span style={{ color: "var(--gold)" }}>Mission</span>
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
            Hudson Valley Flag Football League is a dedicated non-profit sports league based in
            Beacon, NY, committed to providing a platform for athletes to showcase their skills
            and to build our community.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Our primary goal is to establish what we call a &ldquo;flag family&rdquo; — a supportive network
            encompassing both players and sponsoring businesses that uplift one another. We believe
            in teamwork, sportsmanship, and community engagement in everything we do.
          </p>
        </section>

        {/* Key facts */}
        <section className="mb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Founded", value: "2019" },
              { label: "Seasons per year", value: "2 (Summer & Winter)" },
              { label: "Teams", value: "8 (and growing)" },
              { label: "Location", value: "Beacon, NY 12508" },
              { label: "Type", value: "Non-profit community league" },
              { label: "Current season", value: "Winterbash '25–26" },
            ].map((fact) => (
              <div
                key={fact.label}
                className="rounded-lg p-4"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <div className="text-xs uppercase tracking-wide mb-1 font-semibold" style={{ color: "var(--muted)" }}>
                  {fact.label}
                </div>
                <div className="font-display font-bold text-base">{fact.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Community */}
        <section className="mb-12">
          <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-4">
            Community <span style={{ color: "var(--gold)" }}>Partners</span>
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            HVFF is proud to partner with local Beacon businesses who are the backbone of our wonderful
            community. Our teams are named after and sponsored by local spots including Marcelo&apos;s,
            S&amp;S, Stinson&apos;s Hub, Beacon Bikes, St. Rocco&apos;s, and Costello&apos;s. If your
            business is interested in sponsoring a team, get in touch.
          </p>
        </section>

        {/* Seasons */}
        <section className="mb-12">
          <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-4">
            The <span style={{ color: "var(--gold)" }}>Seasons</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div
              className="rounded-lg p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="font-display font-black text-xl uppercase mb-2" style={{ color: "var(--gold)" }}>
                Summer Season
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                May through mid-to-late August. Outdoor competition in the Hudson Valley summer.
              </p>
            </div>
            <div
              className="rounded-lg p-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="font-display font-black text-xl uppercase mb-2" style={{ color: "var(--gold)" }}>
                Winter Season
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Fall through winter. Currently running the inaugural Winterbash &apos;25–26 campaign.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div
          className="rounded-lg p-8 text-center"
          style={{ background: "var(--surface)", border: "1px solid rgba(245,200,66,0.3)" }}
        >
          <h2 className="font-display font-black text-2xl uppercase mb-2">
            Want to <span style={{ color: "var(--gold)" }}>Join?</span>
          </h2>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Players, sponsors, and businesses are always welcome. Reach out to learn how to get involved.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 rounded font-display font-bold text-sm uppercase tracking-wide"
            style={{ background: "var(--gold)", color: "#0d0f14" }}
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
