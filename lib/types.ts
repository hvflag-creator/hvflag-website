export type Team = {
  id: string;
  name: string;
  slug: string;
  color: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
};

export type Player = {
  id: string;
  teamId: string;
  name: string;
  number?: number;
  position?: string;
};

export type Game = {
  id: string;
  week: number;
  date: string; // ISO string
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  isComplete: boolean;
  season: string;
};

export type PlayerStats = {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  touchdowns: number;
  passYards: number;
  rushYards: number;
  recYards: number;
  interceptions: number;
  flagPulls: number;
};

export type Season = {
  id: string;
  name: string;
  isActive: boolean;
};
