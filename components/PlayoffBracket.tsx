"use client";

interface BracketTeam {
  name: string;
  slug: string;
  color: string;
  score?: number;
  winner?: boolean;
  eliminated?: boolean;
}

interface BracketGame {
  label: string;
  date?: string;
  away: BracketTeam;
  home: BracketTeam;
  status: "final" | "upcoming";
  overtime?: boolean;
}

const QF: BracketGame[] = [
  {
    label: "QF1",
    away: { name: "Queen City E-Gills", slug: "queen-city-e-gills", color: "#3b82f6", score: 7, eliminated: true },
    home: { name: "Costellos Maverick Pop", slug: "costellos-maverick-pop", color: "#f5c842", score: 28, winner: true },
    status: "final",
  },
  {
    label: "QF2",
    away: { name: "Beacon Bikes", slug: "beacon-bikes", color: "#10b981", score: 14, eliminated: true },
    home: { name: "Marcelo Home Improvement", slug: "marcelo-home-improvement", color: "#ef4444", score: 24, winner: true },
    status: "final",
  },
  {
    label: "QF3",
    away: { name: "CutNCoat", slug: "cutncoat", color: "#8b5cf6", score: 17, eliminated: true },
    home: { name: "Southern Dutchess CC", slug: "southern-dutchess-cc", color: "#06b6d4", score: 35, winner: true },
    status: "final",
  },
  {
    label: "QF4",
    away: { name: "Stinson's Hub", slug: "stinsons-hub", color: "#f97316", score: 45, eliminated: true },
    home: { name: "S&S Par-Tee's", slug: "ss-par-tees", color: "#ec4899", score: 48, winner: true },
    status: "final",
  },
];

const SF: BracketGame[] = [
  {
    label: "SF1",
    away: { name: "Marcelo Home Improvement", slug: "marcelo-home-improvement", color: "#ef4444", score: 10, eliminated: true },
    home: { name: "Costellos Maverick Pop", slug: "costellos-maverick-pop", color: "#f5c842", score: 17, winner: true },
    status: "final",
  },
  {
    label: "SF2",
    away: { name: "S&S Par-Tee's", slug: "ss-par-tees", color: "#ec4899", score: 35, winner: true },
    home: { name: "Southern Dutchess CC", slug: "southern-dutchess-cc", color: "#06b6d4", score: 14, eliminated: true },
    status: "final",
  },
];

const CHAMP: BracketGame = {
  label: "Championship",
  date: "Thursday, July 23 · 8:00 PM",
  away: { name: "S&S Par-Tee's", slug: "ss-par-tees", color: "#ec4899", score: 37, winner: true },
  home: { name: "Costellos Maverick Pop", slug: "costellos-maverick-pop", color: "#f5c842", score: 30, eliminated: true },
  status: "final",
  overtime: true,
};

function TeamRow({ team, isFinal }: { team: BracketTeam; isFinal: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2"
      style={{ opacity: team.eliminated ? 0.45 : 1 }}
    >
      {/* logo */}
      <img
        src={`/logos/${team.slug}.png`}
        alt={team.name}
        width={22}
        height={22}
        style={{ objectFit: "contain", flexShrink: 0 }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      {/* name */}
      <span
        className="text-xs font-display font-bold uppercase tracking-wide truncate flex-1"
        style={{ color: team.winner ? "var(--gold)" : "var(--text)" }}
      >
        {team.name}
      </span>
      {/* score */}
      {isFinal && (
        <span
          className="text-sm font-display font-black tabular-nums ml-auto pl-2 flex-shrink-0"
          style={{ color: team.winner ? "var(--gold)" : "var(--muted)" }}
        >
          {team.score}
        </span>
      )}
    </div>
  );
}

function GameCard({ game }: { game: BracketGame }) {
  const isFinal = game.status === "final";
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
        minWidth: 0,
      }}
    >
      {/* round label */}
      <div
        className="px-3 py-1 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span className="text-[10px] font-display font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          {game.label}
        </span>
        {isFinal ? (
          <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Final</span>
        ) : (
          <span className="text-[10px] font-semibold" style={{ color: "var(--gold)" }}>{game.date}</span>
        )}
      </div>
      {/* away */}
      <TeamRow team={game.away} isFinal={isFinal} />
      <div style={{ height: 1, background: "var(--border)", margin: "0 12px" }} />
      {/* home */}
      <TeamRow team={game.home} isFinal={isFinal} />
    </div>
  );
}

export default function PlayoffBracket() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-6 flex items-center gap-3">
        <span style={{ color: "var(--gold)" }}>—</span> 2026 Playoffs
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Quarterfinals column */}
        <div>
          <div
            className="text-[11px] font-display font-bold uppercase tracking-widest mb-3 px-1"
            style={{ color: "var(--muted)" }}
          >
            Quarterfinals
          </div>
          <div className="flex flex-col gap-3">
            {QF.map((g) => (
              <GameCard key={g.label} game={g} />
            ))}
          </div>
        </div>

        {/* Semifinals column */}
        <div className="flex flex-col justify-start">
          <div
            className="text-[11px] font-display font-bold uppercase tracking-widest mb-3 px-1"
            style={{ color: "var(--gold)" }}
          >
            Semifinals
          </div>
          <div className="flex flex-col gap-3">
            {SF.map((g) => (
              <GameCard key={g.label} game={g} />
            ))}
          </div>

          {/* Championship */}
          <div
            className="text-[11px] font-display font-bold uppercase tracking-widest mt-6 mb-3 px-1"
            style={{ color: "var(--gold)" }}
          >
            Championship
          </div>
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1a1408 0%, #0d0b04 60%, #1a1408 100%)",
              border: "1px solid rgba(245,200,66,0.5)",
              boxShadow: "0 0 24px rgba(245,200,66,0.15), 0 0 0 1px rgba(245,200,66,0.1)",
            }}
          >
            <div
              className="px-3 py-1 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(245,200,66,0.2)" }}
            >
              <span className="text-[10px] font-display font-semibold uppercase tracking-widest" style={{ color: "rgba(245,200,66,0.6)" }}>
                Championship
              </span>
              <div className="flex items-center gap-1.5">
                {CHAMP.overtime && (
                  <span className="text-[10px] font-display font-black uppercase px-1 py-0.5 rounded" style={{ background: "rgba(245,200,66,0.2)", color: "var(--gold)" }}>OT</span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Final</span>
              </div>
            </div>
            <TeamRow team={CHAMP.away} isFinal={true} />
            <div style={{ height: 1, background: "rgba(245,200,66,0.15)", margin: "0 12px" }} />
            <TeamRow team={CHAMP.home} isFinal={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
