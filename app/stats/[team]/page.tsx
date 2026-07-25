import { getStatsByPhase } from "@/lib/sportsbook";
import type { SBStatLine } from "@/lib/sportsbook";
import StatsClient, { type StatRow } from "@/components/StatsClient";
import { teamToSlug } from "@/lib/team-slug";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export async function generateMetadata({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params;
  const { regular } = await getStatsByPhase();
  const teamName = regular.find((p) => teamToSlug(p.team) === slug)?.team;
  if (!teamName) return {};
  return { title: `${teamName} Stats – Summer 2026` };
}

export default async function TeamStatsPage({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params;
  const { regular, playoffs } = await getStatsByPhase();

  // Resolve team name from slug
  const teamName =
    regular.find((p) => teamToSlug(p.team) === slug)?.team ??
    playoffs.find((p) => teamToSlug(p.team) === slug)?.team;

  if (!teamName) notFound();

  const regularRows = toRows(regular.filter((p) => p.team === teamName));
  const playoffRows = toRows(playoffs.filter((p) => p.team === teamName));

  return (
    <div>
      <div
        className="border-b py-10"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/stats"
            className="text-sm font-semibold hover:opacity-70 transition-opacity mb-3 inline-block"
            style={{ color: "var(--gold)" }}
          >
            ← Stats
          </Link>
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> {teamName}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Summer 2026 · Team Stats
          </p>
        </div>
      </div>

      <StatsClient
        regularRows={regularRows}
        playoffRows={playoffRows}
        hideTeamFilter
      />
    </div>
  );
}
