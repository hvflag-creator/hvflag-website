export type TeamRecord = {
  seasonId:      string;
  seasonName:    string;
  teamName:      string;
  coach:         string;
  wins:          number;
  losses:        number;
  ties?:         number;
  playoffWins?:  number;
  playoffLosses?: number;
  champion?:     boolean;
};

export const TEAM_RECORDS: TeamRecord[] = [
  // ── WinterBash 2022 ──────────────────────────────────────────────────────
  // Champion: Jack (Royal Creeps) — 2-0 in playoffs
  { seasonId: "winterbash-2022", seasonName: "WinterBash 2022", teamName: "Royal Creeps",  coach: "Jack",  wins: 1, losses: 3, playoffWins: 2, playoffLosses: 0, champion: true  },
  { seasonId: "winterbash-2022", seasonName: "WinterBash 2022", teamName: "Red Rockets",   coach: "Ryan",  wins: 1, losses: 3, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2022", seasonName: "WinterBash 2022", teamName: "Barking Frogs", coach: "Jason", wins: 3, losses: 1, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2022", seasonName: "WinterBash 2022", teamName: "Elks Club",     coach: "Mo",    wins: 4, losses: 0, playoffWins: 1, playoffLosses: 1 },

  // ── Summer Showdown 2023 ─────────────────────────────────────────────────
  // Champion: Ryan (Billy Joes) — 2-0 in playoffs
  { seasonId: "summer-showdown-2023", seasonName: "Summer Showdown 2023", teamName: "Royal Crepes", coach: "Jack",  wins: 4, losses: 1, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "summer-showdown-2023", seasonName: "Summer Showdown 2023", teamName: "Billys",       coach: "Ryan",  wins: 3, losses: 2, playoffWins: 2, playoffLosses: 0, champion: true },
  { seasonId: "summer-showdown-2023", seasonName: "Summer Showdown 2023", teamName: "Costellos",    coach: "JJ",    wins: 2, losses: 3, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-showdown-2023", seasonName: "Summer Showdown 2023", teamName: "Melzingah",    coach: "Jason", wins: 0, losses: 0 },
  { seasonId: "summer-showdown-2023", seasonName: "Summer Showdown 2023", teamName: "Twins",        coach: "Mo",    wins: 3, losses: 2, playoffWins: 0, playoffLosses: 1 },

  // ── WinterBash 2023 ──────────────────────────────────────────────────────
  // Champion: Mo (Twins Barber Shop) — 2-0 in playoffs
  { seasonId: "winterbash-2023", seasonName: "WinterBash 2023", teamName: "Pedego",            coach: "Jack",    wins: 1, losses: 4 },
  { seasonId: "winterbash-2023", seasonName: "WinterBash 2023", teamName: "Baja",              coach: "Ryan",    wins: 3, losses: 2, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2023", seasonName: "WinterBash 2023", teamName: "Twins Barber Shop", coach: "Mo",      wins: 1, losses: 4, playoffWins: 2, playoffLosses: 0, champion: true },
  { seasonId: "winterbash-2023", seasonName: "WinterBash 2023", teamName: "Pachas Barber Shop", coach: "Richard", wins: 5, losses: 0, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2023", seasonName: "WinterBash 2023", teamName: "Carters Restaurant", coach: "JJ",     wins: 3, losses: 2, playoffWins: 1, playoffLosses: 1 },

  // ── Summer Showdown 2024 ─────────────────────────────────────────────────
  // Champion: Jack (Pedego) — 3-0 in playoffs
  { seasonId: "summer-showdown-2024", seasonName: "Summer Showdown 2024", teamName: "Pedego",   coach: "Jack",    wins: 3, losses: 2, playoffWins: 3, playoffLosses: 0, champion: true },
  { seasonId: "summer-showdown-2024", seasonName: "Summer Showdown 2024", teamName: "Baja",     coach: "Ryan",    wins: 4, losses: 1, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-showdown-2024", seasonName: "Summer Showdown 2024", teamName: "Pacha",    coach: "Richard", wins: 4, losses: 1, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "summer-showdown-2024", seasonName: "Summer Showdown 2024", teamName: "Carters",  coach: "Mike V",  wins: 1, losses: 4, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-showdown-2024", seasonName: "Summer Showdown 2024", teamName: "Twins",    coach: "Mo",      wins: 0, losses: 5, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "summer-showdown-2024", seasonName: "Summer Showdown 2024", teamName: "Marcelos", coach: "JJ",      wins: 2, losses: 3, playoffWins: 0, playoffLosses: 1 },

  // ── WinterBash 2024 ──────────────────────────────────────────────────────
  // Champion: Forever (Baja) — 2-0 in playoffs
  { seasonId: "winterbash-2024", seasonName: "WinterBash 2024", teamName: "Pedego",     coach: "Jack",    wins: 3, losses: 2, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "winterbash-2024", seasonName: "WinterBash 2024", teamName: "Baja",       coach: "Forever", wins: 4, losses: 1, playoffWins: 2, playoffLosses: 0, champion: true },
  { seasonId: "winterbash-2024", seasonName: "WinterBash 2024", teamName: "Marcelo's",  coach: "JJ",      wins: 4, losses: 1, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2024", seasonName: "WinterBash 2024", teamName: "Roma Nova",  coach: "Mike V",  wins: 1, losses: 4, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2024", seasonName: "WinterBash 2024", teamName: "Costellos",  coach: "Ali T",   wins: 3, losses: 2, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "winterbash-2024", seasonName: "WinterBash 2024", teamName: "Stinson's Hub", coach: "Richard", wins: 2, losses: 3, playoffWins: 0, playoffLosses: 1 },

  // ── Summer Showdown 2025 ─────────────────────────────────────────────────
  // Champion: JJ (Marcelo Home Improvement) — 3-0 in playoffs
  { seasonId: "summer-showdown-2025", seasonName: "Summer Showdown 2025", teamName: "Marcelo Home Improvement", coach: "JJ",      wins: 4, losses: 2, playoffWins: 3, playoffLosses: 0, champion: true },
  { seasonId: "summer-showdown-2025", seasonName: "Summer Showdown 2025", teamName: "Stinson's Hub",            coach: "Jack",    wins: 4, losses: 2, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-showdown-2025", seasonName: "Summer Showdown 2025", teamName: "Beacon Bikes",             coach: "Kyle",    wins: 5, losses: 1, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "summer-showdown-2025", seasonName: "Summer Showdown 2025", teamName: "Costellos Maverick Pop",   coach: "Ali T",   wins: 1, losses: 5, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-showdown-2025", seasonName: "Summer Showdown 2025", teamName: "Baja 328",                 coach: "Forever", wins: 3, losses: 3, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-showdown-2025", seasonName: "Summer Showdown 2025", teamName: "Roma Nova",                coach: "Ryan",    wins: 1, losses: 5, playoffWins: 1, playoffLosses: 1 },

  // ── WinterBash 2025 ──────────────────────────────────────────────────────
  // Champion: Kyle (Beacon Bikes) — 3-0 in playoffs
  { seasonId: "winterbash-2025", seasonName: "WinterBash 2025", teamName: "S&S Par-Tee's", coach: "Jack",  wins: 4, losses: 1, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "winterbash-2025", seasonName: "WinterBash 2025", teamName: "Costellos",     coach: "Mo",    wins: 0, losses: 5, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2025", seasonName: "WinterBash 2025", teamName: "Marcelo's",     coach: "JJ",    wins: 4, losses: 1, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "winterbash-2025", seasonName: "WinterBash 2025", teamName: "St Rocco's",    coach: "Ryan",  wins: 4, losses: 1, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2025", seasonName: "WinterBash 2025", teamName: "Stinson's Hub", coach: "Besim", wins: 1, losses: 4, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "winterbash-2025", seasonName: "WinterBash 2025", teamName: "Beacon Bikes",  coach: "Kyle",  wins: 2, losses: 3, playoffWins: 3, playoffLosses: 0, champion: true },

  // ── Summer 2026 ──────────────────────────────────────────────────────────
  // Champion: Jack (S&S Par-Tee's) — 3-0 in playoffs
  { seasonId: "summer-2026", seasonName: "Summer 2026", teamName: "S&S Par-Tee's", coach: "Jack",    wins: 6, losses: 1, playoffWins: 3, playoffLosses: 0, champion: true },
  { seasonId: "summer-2026", seasonName: "Summer 2026", teamName: "Costellos",     coach: "Nick",    wins: 6, losses: 1, playoffWins: 2, playoffLosses: 1 },
  { seasonId: "summer-2026", seasonName: "Summer 2026", teamName: "SDCC",          coach: "Jason",   wins: 5, losses: 2, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "summer-2026", seasonName: "Summer 2026", teamName: "Marcelo's",     coach: "JJ",      wins: 4, losses: 3, playoffWins: 1, playoffLosses: 1 },
  { seasonId: "summer-2026", seasonName: "Summer 2026", teamName: "Stinson's Hub", coach: "Dennis",  wins: 2, losses: 5, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-2026", seasonName: "Summer 2026", teamName: "Beacon Bikes",  coach: "Anthony", wins: 3, losses: 4, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-2026", seasonName: "Summer 2026", teamName: "CutNCoat",      coach: "Theo",    wins: 2, losses: 5, playoffWins: 0, playoffLosses: 1 },
  { seasonId: "summer-2026", seasonName: "Summer 2026", teamName: "Queen City",    coach: "Ty",      wins: 0, losses: 7, playoffWins: 0, playoffLosses: 1 },
];

// Derive all-time coach records from TEAM_RECORDS
export type CoachAllTimeRecord = {
  coach:         string;
  wins:          number; // regular season
  losses:        number; // regular season
  ties:          number;
  seasons:       number;
  titles:        number;
  playoffWins:   number;
  playoffLosses: number;
  totalWins:     number; // regular season + playoffs
  totalLosses:   number; // regular season + playoffs
};

export function getCoachAllTimeRecords(): CoachAllTimeRecord[] {
  const map = new Map<string, CoachAllTimeRecord>();
  for (const r of TEAM_RECORDS) {
    if (!map.has(r.coach)) {
      map.set(r.coach, { coach: r.coach, wins: 0, losses: 0, ties: 0, seasons: 0, titles: 0, playoffWins: 0, playoffLosses: 0, totalWins: 0, totalLosses: 0 });
    }
    const c = map.get(r.coach)!;
    c.wins          += r.wins;
    c.losses        += r.losses;
    c.ties          += r.ties ?? 0;
    c.seasons       += 1;
    c.titles        += r.champion ? 1 : 0;
    c.playoffWins   += r.playoffWins   ?? 0;
    c.playoffLosses += r.playoffLosses ?? 0;
    c.totalWins      = c.wins + c.playoffWins;
    c.totalLosses    = c.losses + c.playoffLosses;
  }
  return Array.from(map.values()).sort((a, b) => b.totalWins - a.totalWins);
}
