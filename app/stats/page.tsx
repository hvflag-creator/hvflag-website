import { getStatsByPhase, getGamesMissingStats } from "@/lib/sportsbook";
import type { SBStatLine } from "@/lib/sportsbook";
import StatsClient, { type StatRow } from "@/components/StatsClient";

export const revalidate = 60;

function toRows(lines: SBStatLine[]): StatRow[] {
  return lines.map((p) => ({
    playerId: p.id,
    playerName: p.name,
    teamName: p.team,
    jersey: p.jersey ?? null,
    touchdowns: p.passTDs + p.rushTDs + p.recTDs + p.defTDs,
    passAtt:  p.passAtt,  passCmp:  p.passCmp,  passYds: p.passYds,
    passTDs:  p.passTDs,  passInt:  p.passInt,
    rushAtt:  p.rushAtt,  rushYds:  p.rushYds,  rushTDs: p.rushTDs,
    recTgt:   p.recTgt,   recRec:   p.recRec,   recYds:  p.recYds,  recTDs: p.recTDs,
    defInt:   p.defInt,   defPBU:   p.defPBU,   defSacks: p.defSacks,
    defPulls: p.defPulls, defTDs:   p.defTDs,
  }));
}

export default async function StatsPage() {
  const [{ regular, playoffs }, missing] = await Promise.all([getStatsByPhase(), getGamesMissingStats()]);

  return (
    <div>
      <div
        className="border-b py-10"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Stats
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Fall 2026 · Click a column header to sort
          </p>
        </div>
      </div>

      {missing.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{ background: "rgba(245,200,66,0.08)", border: "1px solid rgba(245,200,66,0.3)", color: "var(--muted)" }}
          >
            <span className="font-display font-bold uppercase tracking-wide" style={{ color: "var(--gold)" }}>Box scores coming soon · </span>
            Final scores are posted, but player stats for{" "}
            {missing.map((g, i) => (
              <span key={g.id}>
                {i > 0 && (i === missing.length - 1 ? " and " : ", ")}
                <span style={{ color: "var(--text)" }}>{g.awayTeam} @ {g.homeTeam}</span>
              </span>
            ))}{" "}
            are still being entered. Totals below will update once they are in.
          </div>
        </div>
      )}

      <StatsClient regularRows={toRows(regular)} playoffRows={toRows(playoffs)} />
    </div>
  );
}
