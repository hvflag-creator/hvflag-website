export type TeamRecord = {
  seasonId:   string;
  seasonName: string;
  teamName:   string;
  coach:      string;
  wins:       number;
  losses:     number;
  ties?:      number;
  champion?:  boolean; // true if this team won the season
};

export const TEAM_RECORDS: TeamRecord[] = [
  // ── Winter 2020 ──────────────────────────────────────────────────────────

  // ── SpringBash 2021 ──────────────────────────────────────────────────────

  // ── WinterBash 2022 ──────────────────────────────────────────────────────

  // ── Summer Showdown 2023 ─────────────────────────────────────────────────

  // ── WinterBash 2023 ──────────────────────────────────────────────────────

  // ── Summer Showdown 2024 ─────────────────────────────────────────────────

  // ── WinterBash 2024 ──────────────────────────────────────────────────────

  // ── Summer Showdown 2025 ─────────────────────────────────────────────────

  // ── WinterBash 2025 ──────────────────────────────────────────────────────
];

// Derive all-time coach records from TEAM_RECORDS
export type CoachAllTimeRecord = {
  coach:   string;
  wins:    number;
  losses:  number;
  ties:    number;
  seasons: number;
  titles:  number;
};

export function getCoachAllTimeRecords(): CoachAllTimeRecord[] {
  const map = new Map<string, CoachAllTimeRecord>();
  for (const r of TEAM_RECORDS) {
    if (!map.has(r.coach)) {
      map.set(r.coach, { coach: r.coach, wins: 0, losses: 0, ties: 0, seasons: 0, titles: 0 });
    }
    const c = map.get(r.coach)!;
    c.wins    += r.wins;
    c.losses  += r.losses;
    c.ties    += r.ties ?? 0;
    c.seasons += 1;
    c.titles  += r.champion ? 1 : 0;
  }
  return Array.from(map.values()).sort((a, b) => b.wins - a.wins);
}
