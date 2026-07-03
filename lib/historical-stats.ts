export type SeasonStat = {
  playerName: string;
  teamName: string;
  // Passing
  passAtt:  number; passCmp:  number; passYds: number; passTDs: number; passInt: number;
  // Rushing
  rushAtt:  number; rushYds:  number; rushTDs: number;
  // Receiving
  recTgt:   number; recRec:   number; recYds:  number; recTDs:  number;
  // Defense
  defInt:   number; defPBU:   number; defSacks: number; defPulls: number;
  defFF:    number; defFR:    number; defTDs:   number; defTFL:   number;
};

export type HistoricalSeason = {
  id: string;
  name: string;
  stats: SeasonStat[];
};

export const HISTORICAL_SEASONS: HistoricalSeason[] = [
  { id: "winter-2020",           name: "Winter 2020",              stats: [] },
  { id: "springbash-2021",       name: "SpringBash 2021",          stats: [] },
  { id: "winterbash-2022",       name: "WinterBash 2022",          stats: [] },
  { id: "summer-showdown-2023",  name: "Summer Showdown 2023",     stats: [] },
  { id: "winterbash-2023",       name: "WinterBash 2023",          stats: [] },
  { id: "summer-showdown-2024",  name: "Summer Showdown 2024",     stats: [] },
  { id: "winterbash-2024",       name: "WinterBash 2024",          stats: [] },
  { id: "summer-showdown-2025",  name: "Summer Showdown 2025",     stats: [] },
  { id: "winterbash-2025",       name: "WinterBash 2025",          stats: [] },
];

export const CURRENT_SEASON_ID   = "summer-2026";
export const CURRENT_SEASON_NAME = "Inaugural HVFF Summer 2026";
