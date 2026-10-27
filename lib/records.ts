import type { SeasonStat, HistoricalSeason } from "./historical-stats";

export type RecordEntry = {
  value: number;
  playerName: string;
  seasonName: string;
  teamName: string;
};

export type RecordCategory = {
  id: string;
  label: string;
  stat: keyof SeasonStat;
  group: "offense" | "defense" | "special";
  note?: string;
};

export const RECORD_CATEGORIES: RecordCategory[] = [
  // Offense
  { id: "passYds",  label: "Passing Yards",     stat: "passYds",  group: "offense" },
  { id: "passTDs",  label: "Passing TDs",        stat: "passTDs",  group: "offense" },
  { id: "recYds",   label: "Receiving Yards",    stat: "recYds",   group: "offense" },
  { id: "recTDs",   label: "Receiving TDs",      stat: "recTDs",   group: "offense" },
  { id: "recRec",   label: "Receptions",         stat: "recRec",   group: "offense" },
  { id: "rushYds",  label: "Rushing Yards",      stat: "rushYds",  group: "offense" },
  { id: "rushTDs",  label: "Rushing TDs",        stat: "rushTDs",  group: "offense" },
  // Defense
  { id: "defInt",   label: "Interceptions",      stat: "defInt",   group: "defense" },
  { id: "defSacks", label: "Sacks",              stat: "defSacks", group: "defense" },
  { id: "defPulls", label: "Flag Pulls",         stat: "defPulls", group: "defense", note: "Tracked since WinterBash 2025" },
  { id: "defPBU",   label: "Pass Breakups",      stat: "defPBU",   group: "defense" },
  { id: "defTDs",   label: "Defensive TDs",      stat: "defTDs",   group: "defense" },
  // Special teams
  { id: "fgMade",   label: "Field Goals Made",   stat: "fgMade",   group: "special" },
];

export type SeasonRecords = Record<string, RecordEntry[]>;

export function computeRecords(
  seasons: HistoricalSeason[],
  extraSeason?: { name: string; stats: SeasonStat[] },
  topN = 5,
): SeasonRecords {
  const allSeasons = extraSeason
    ? [...seasons, { id: "current", name: extraSeason.name, stats: extraSeason.stats }]
    : seasons;

  const result: SeasonRecords = {};

  for (const cat of RECORD_CATEGORIES) {
    const entries: RecordEntry[] = [];

    for (const season of allSeasons) {
      for (const player of season.stats) {
        const val = player[cat.stat] as number;
        if (!val || val <= 0) continue;
        entries.push({
          value: val,
          playerName: player.playerName,
          seasonName: season.name,
          teamName: player.teamName,
        });
      }
    }

    entries.sort((a, b) => b.value - a.value);
    result[cat.id] = entries.slice(0, topN);
  }

  return result;
}
