import { getStatsFromSportsbook } from "@/lib/sportsbook";
import { HISTORICAL_SEASONS, CURRENT_SEASON_ID, CURRENT_SEASON_NAME } from "@/lib/historical-stats";
import type { SeasonStat } from "@/lib/historical-stats";
import AllTimeStatsClient from "@/components/AllTimeStatsClient";

export const revalidate = 60;

export default async function AllTimePage() {
  const sbStats = await getStatsFromSportsbook();

  const currentSeasonStats: SeasonStat[] = sbStats.map((p) => ({
    playerName: p.name,
    teamName:   p.team,
    passAtt:  p.passAtt,  passCmp:  p.passCmp,  passYds: p.passYds, passTDs: p.passTDs, passInt: p.passInt,
    rushAtt:  p.rushAtt,  rushYds:  p.rushYds,  rushTDs: p.rushTDs,
    recTgt:   p.recTgt,   recRec:   p.recRec,   recYds:  p.recYds,  recTDs:  p.recTDs,
    defInt:   p.defInt,   defPBU:   p.defPBU,   defSacks: p.defSacks, defPulls: p.defPulls,
    defFF:    p.defFF,    defFR:    p.defFR,    defTDs:  p.defTDs,  defTFL:  p.defTFL,
    fgMade:   p.fgMade,
    pancakes: 0,
  }));

  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> All-Time Stats
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Every season since Winter 2020 · Select a season or view all-time totals
          </p>
        </div>
      </div>

      <AllTimeStatsClient
        historicalSeasons={HISTORICAL_SEASONS}
        currentSeasonId={CURRENT_SEASON_ID}
        currentSeasonName={CURRENT_SEASON_NAME}
        currentSeasonStats={currentSeasonStats}
      />
    </div>
  );
}
