import { HISTORICAL_SEASONS, CURRENT_SEASON_NAME } from "@/lib/historical-stats";
import type { SeasonStat } from "@/lib/historical-stats";
import type { SBStatLine } from "@/lib/sportsbook";
import { RECORD_CATEGORIES, computeRecords } from "@/lib/records";
import { getStatsByPhase } from "@/lib/sportsbook";
import RecordsClient from "@/components/RecordsClient";

export const revalidate = 60;

function toSeasonStat(p: SBStatLine): SeasonStat {
  return {
    playerName: p.name, teamName: p.team,
    passAtt:  p.passAtt,  passCmp:  p.passCmp,  passYds: p.passYds, passTDs: p.passTDs, passInt: p.passInt,
    rushAtt:  p.rushAtt,  rushYds:  p.rushYds,  rushTDs: p.rushTDs,
    recTgt:   p.recTgt,   recRec:   p.recRec,   recYds:  p.recYds,  recTDs:  p.recTDs,
    defInt:   p.defInt,   defPBU:   p.defPBU,   defSacks: p.defSacks, defPulls: p.defPulls,
    defFF:    p.defFF,    defFR:    p.defFR,    defTDs:  p.defTDs,  defTFL:  p.defTFL,
    fgMade:   p.fgMade,   punt10: 0, punt5: 0, pancakes: 0,
  };
}

function mergeStatLines(a: SBStatLine[], b: SBStatLine[]): SBStatLine[] {
  const map: Record<string, SBStatLine> = {};
  for (const p of [...a, ...b]) {
    if (!map[p.name]) { map[p.name] = { ...p }; continue; }
    const t = map[p.name];
    t.passAtt += p.passAtt; t.passCmp += p.passCmp; t.passYds += p.passYds;
    t.passTDs += p.passTDs; t.passInt += p.passInt;
    t.rushAtt += p.rushAtt; t.rushYds += p.rushYds; t.rushTDs += p.rushTDs;
    t.recTgt  += p.recTgt;  t.recRec  += p.recRec;  t.recYds  += p.recYds; t.recTDs += p.recTDs;
    t.defInt  += p.defInt;  t.defPBU  += p.defPBU;  t.defSacks += p.defSacks; t.defPulls += p.defPulls;
    t.defFF   += p.defFF;   t.defFR   += p.defFR;   t.defTDs   += p.defTDs; t.defTFL += p.defTFL;
    t.fgMade  += p.fgMade;
  }
  return Object.values(map);
}

export default async function RecordsPage() {
  const { regular: regularSb, playoffs: playoffSb } = await getStatsByPhase();

  const currentAll  = { name: CURRENT_SEASON_NAME, stats: mergeStatLines(regularSb, playoffSb).map(toSeasonStat) };
  const currentReg  = { name: CURRENT_SEASON_NAME, stats: regularSb.map(toSeasonStat) };
  const currentPlay = { name: `${CURRENT_SEASON_NAME} Playoffs`, stats: playoffSb.map(toSeasonStat) };

  // Historical stats are full-season totals (regular + playoffs combined) so all
  // seasons feed every tab. Only the live current season is split by phase.
  const allRecords     = computeRecords(HISTORICAL_SEASONS, currentAll);
  const regularRecords = computeRecords(HISTORICAL_SEASONS, currentReg);
  const playoffRecords = computeRecords(HISTORICAL_SEASONS, currentPlay);

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
