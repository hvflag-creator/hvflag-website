import { HISTORICAL_SEASONS, CURRENT_SEASON_NAME } from "@/lib/historical-stats";
import type { SeasonStat } from "@/lib/historical-stats";
import { RECORD_CATEGORIES, computeRecords } from "@/lib/records";
import { getStatsFromSportsbook } from "@/lib/sportsbook";
import RecordsClient from "@/components/RecordsClient";

export const revalidate = 60;

export default async function RecordsPage() {
  const sbStats = await getStatsFromSportsbook();

  const currentStats: SeasonStat[] = sbStats.map((p) => ({
    playerName: p.name,
    teamName:   p.team,
    passAtt:  p.passAtt,  passCmp:  p.passCmp,  passYds: p.passYds, passTDs: p.passTDs, passInt: p.passInt,
    rushAtt:  p.rushAtt,  rushYds:  p.rushYds,  rushTDs: p.rushTDs,
    recTgt:   p.recTgt,   recRec:   p.recRec,   recYds:  p.recYds,  recTDs:  p.recTDs,
    defInt:   p.defInt,   defPBU:   p.defPBU,   defSacks: p.defSacks, defPulls: p.defPulls,
    defFF:    p.defFF,    defFR:    p.defFR,    defTDs:  p.defTDs,  defTFL:  p.defTFL,
    fgMade:   p.fgMade,  punt10: 0, punt5: 0, pancakes: 0,
  }));

  const currentSeason = { name: CURRENT_SEASON_NAME, stats: currentStats };

  const regularSeasons = HISTORICAL_SEASONS.filter((s) => s.type === "regular");
  const playoffSeasons = HISTORICAL_SEASONS.filter((s) => s.type === "playoff");

  const allRecords     = computeRecords(HISTORICAL_SEASONS, currentSeason);
  const regularRecords = computeRecords(regularSeasons,     currentSeason);
  const playoffRecords = computeRecords(playoffSeasons);

  return (
    <div>
      {/* Header */}
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> All-Time Records
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Single-season bests · Every season since Winter 2020 · Includes {CURRENT_SEASON_NAME}
          </p>
        </div>
      </div>

      <RecordsClient
        allRecords={allRecords}
        regularRecords={regularRecords}
        playoffRecords={playoffRecords}
        categories={RECORD_CATEGORIES}
      />
    </div>
  );
}
