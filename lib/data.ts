import type { Team, Player, Game, PlayerStats, Season } from "./types";

export const SEASONS: Season[] = [
  { id: "summer-2026", name: "Summer 2026", isActive: true },
];

export const TEAMS: Team[] = [
  { id: "ss-par-tees", name: "S&S Par-Tee's", slug: "ss-par-tees", color: "#a87c3e", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "costellos-maverick-pop", name: "Costello's Maverick Pop", slug: "costellos-maverick-pop", color: "#f77f00", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "beacon-bikes", name: "Beacon Bikes", slug: "beacon-bikes", color: "#c9a84c", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "queen-city-e-gills", name: "Queen City E-Gills", slug: "queen-city-e-gills", color: "#1e3a8a", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "cutncoat", name: "CutNCoat", slug: "cutncoat", color: "#cd7f5b", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "marcelo-home-improvement", name: "Marcelo Home Improvement", slug: "marcelo-home-improvement", color: "#3b3dca", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "stinsons-hub", name: "Stinson's Hub", slug: "stinsons-hub", color: "#22c55e", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "southern-dutchess-cc", name: "Southern Dutchess Country Club", slug: "southern-dutchess-cc", color: "#1a6b3c", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
];

export const PLAYERS: Player[] = [
  // Placeholder — populate via Supabase or update here directly
];

export const GAMES: Game[] = [
  // Placeholder — populate via Supabase or update here directly
];

export const STATS: PlayerStats[] = [
  // Placeholder — populate via Supabase or update here directly
];

export function getTeamById(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}

export function getPlayersByTeam(teamId: string): Player[] {
  return PLAYERS.filter((p) => p.teamId === teamId);
}

export function getGamesByWeek(week: number): Game[] {
  return GAMES.filter((g) => g.week === week);
}

export function getStatsByTeam(teamId: string): PlayerStats[] {
  return STATS.filter((s) => s.teamId === teamId);
}

export function getAllTimeLeaders(): PlayerStats[] {
  return [...STATS].sort((a, b) => b.touchdowns - a.touchdowns);
}

export function getStandings(): Team[] {
  return [...TEAMS].sort((a, b) => {
    const aWinPct = a.wins + a.losses === 0 ? 0 : a.wins / (a.wins + a.losses);
    const bWinPct = b.wins + b.losses === 0 ? 0 : b.wins / (b.wins + b.losses);
    if (bWinPct !== aWinPct) return bWinPct - aWinPct;
    return b.pointsFor - a.pointsFor;
  });
}
