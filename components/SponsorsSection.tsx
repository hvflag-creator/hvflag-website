import { SPONSORS } from "@/lib/sponsors";

export default function SponsorsSection() {
  const presenting = SPONSORS.filter((s) => s.tier === "presenting");
  const gold = SPONSORS.filter((s) => s.tier === "gold");
  const community = SPONSORS.filter((s) => s.tier === "community");

  return (
    <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-2 flex items-center gap-3">
          <span style={{ color: "var(--gold)" }}>—</span> Our Sponsors
        </h2>
        <p className="text-sm mb-10" style={{ color: "var(--muted)" }}>
          Thank you to the businesses and individuals who make HVFF possible.
        </p>

        {/* Presenting sponsors */}
        {presenting.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-display font-bold uppercase tracking-widest mb-4" style={{ color: "var(--gold)" }}>
              Presenting Sponsor
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {presenting.map((s) => (
                <SponsorCard key={s.name} sponsor={s} size="large" />
              ))}
            </div>
          </div>
        )}

        {/* Gold sponsors */}
        {gold.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-display font-bold uppercase tracking-widest mb-4" style={{ color: "var(--gold)" }}>
              Team Sponsors
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {gold.map((s) => (
                <SponsorCard key={s.name} sponsor={s} size="medium" />
              ))}
            </div>
          </div>
        )}

        {/* Community sponsors */}
        {community.length > 0 && (
          <div>
            <p className="text-xs font-display font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted)" }}>
              Community Sponsors
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {community.map((s) => (
                <SponsorCard key={s.name} sponsor={s} size="small" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SponsorCard({
  sponsor,
  size,
}: {
  sponsor: { name: string; url?: string; logo?: string };
  size: "large" | "medium" | "small";
}) {
  const padding = size === "large" ? "p-8" : size === "medium" ? "p-5" : "p-4";
  const textSize = size === "large" ? "text-xl" : size === "medium" ? "text-sm" : "text-xs";

  const inner = (
    <div
      className={`rounded-lg ${padding} flex flex-col items-center justify-center text-center gap-3 h-full transition-all`}
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        minHeight: size === "large" ? "120px" : "80px",
      }}
    >
      {sponsor.logo ? (
        <img
          src={`/logos/${sponsor.logo}`}
          alt={sponsor.name}
          className="max-h-16 w-auto object-contain"
        />
      ) : (
        <span
          className={`font-display font-black ${textSize} uppercase tracking-wide leading-tight`}
          style={{ color: "var(--text)" }}
        >
          {sponsor.name}
        </span>
      )}
    </div>
  );

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-[1.02] transition-transform block"
        style={{ color: "inherit", textDecoration: "none" }}
      >
        {inner}
      </a>
    );
  }

  return <div>{inner}</div>;
}
