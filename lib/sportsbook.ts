import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { sbDb } from "./firebase-sportsbook";

// ── Types ──────────────────────────────────────────────────────────────────

export type SBGame = {
  id: string;
  weekId: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string | null;
  status: "open" | "live" | "settled" | "void";
  result: { homeScore: number; awayScore: number } | null;
};

export type SBPlayer = {
  id: string;
  name: string;
  team: string;
  jersey?: number | string;
  position?: string;
};

export type SBStatLine = {
  id: string;
  name: string;
  team: string;
  jersey?: number | null;
  passAtt: number; passCmp: number; passYds: number; passTDs: number; passInt: number;
  rushAtt: number; rushYds: number; rushTDs: number;
  recTgt: number;  recRec: number;  recYds: number;  recTDs: number;
  defInt: number;  defPBU: number;  defSacks: number; defPulls: number;
  defFF: number;   defFR: number;   defTDs: number;   defTFL: number;
};

export type SBStanding = {
  team: string;
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  winPct: number;
};

// ── Team name normalisation (mirrors FlagBucks) ────────────────────────────

const TEAM_NAME_MAP: Record<string, string> = {
  "CoatNCoat": "CutNCoat",
  "Cut/Coat":  "CutNCoat",
  "Marcelos":  "Marcelo Home Improvement",
  "SDCC":      "Southern Dutchess Country Club",
  "HUB":       "Stinson's Hub",
  "Queen City": "Queen City E-Gills",
  "S & S Par-Tee's": "S&S Par-Tee's",
  "Costellos Maverick Pop": "Costello's Maverick Pop",
};

function normalizeTeam(name: string): string {
  return TEAM_NAME_MAP[name] ?? name;
}

// ── Games ──────────────────────────────────────────────────────────────────

export async function getSettledGames(): Promise<SBGame[]> {
  try {
    const q = query(collection(sbDb, "games"), where("status", "==", "settled"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        weekId: data.weekId ?? "",
        homeTeam: normalizeTeam(data.homeTeam ?? ""),
        awayTeam: normalizeTeam(data.awayTeam ?? ""),
        kickoff: data.kickoff?.toDate?.()?.toISOString() ?? null,
        status: data.status,
        result: data.result ?? null,
      } as SBGame;
    });
  } catch {
    return [];
  }
}

export async function getAllGames(): Promise<SBGame[]> {
  try {
    const snap = await getDocs(collection(sbDb, "games"));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        weekId: data.weekId ?? "",
        homeTeam: normalizeTeam(data.homeTeam ?? ""),
        awayTeam: normalizeTeam(data.awayTeam ?? ""),
        kickoff: data.kickoff?.toDate?.()?.toISOString() ?? null,
        status: data.status,
        result: data.result ?? null,
      } as SBGame;
    }).sort((a, b) => (a.kickoff ?? "").localeCompare(b.kickoff ?? ""));
  } catch {
    return [];
  }
}

// ── Standings (computed from settled games) ────────────────────────────────

export async function getStandingsFromSportsbook(): Promise<SBStanding[]> {
  const games = await getSettledGames();
  const map: Record<string, SBStanding> = {};

  function ensure(team: string) {
    if (!map[team]) map[team] = { team, wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0, winPct: 0 };
    return map[team];
  }

  for (const g of games) {
    if (!g.result) continue;
    const { homeScore, awayScore } = g.result;
    const home = ensure(g.homeTeam);
    const away = ensure(g.awayTeam);

    home.pointsFor     += homeScore;
    home.pointsAgainst += awayScore;
    away.pointsFor     += awayScore;
    away.pointsAgainst += homeScore;

    if (homeScore > awayScore)      { home.wins++;   away.losses++; }
    else if (awayScore > homeScore) { away.wins++;   home.losses++; }
    else                            { home.ties++;   away.ties++; }
  }

  return Object.values(map)
    .map((s) => {
      const g = s.wins + s.losses + s.ties;
      return { ...s, winPct: g === 0 ? 0 : s.wins / g };
    })
    .sort((a, b) => b.winPct - a.winPct || b.pointsFor - a.pointsFor);
}

// ── Players / Rosters ─────────────────────────────────────────────────────

export async function getPlayersFromSportsbook(): Promise<SBPlayer[]> {
  try {
    const snap = await getDocs(collection(sbDb, "players"));
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      team: normalizeTeam(d.data().team ?? ""),
    })) as SBPlayer[];
  } catch {
    return [];
  }
}

// ── Stats (from gameStatSnapshots) ────────────────────────────────────────

export async function getStatsFromSportsbook(): Promise<SBStatLine[]> {
  try {
  const snap = await getDocs(collection(sbDb, "gameStatSnapshots"));
  const totals: Record<string, SBStatLine> = {};

  for (const doc of snap.docs) {
    const data = doc.data();
    const playerStats: SBStatLine[] = data.playerStats ?? [];

    for (const p of playerStats) {
      const team = normalizeTeam((p as unknown as { team?: string }).team ?? "");
      if (!totals[p.id]) {
        totals[p.id] = {
          id: p.id, name: p.name, team, jersey: p.jersey ?? null,
          passAtt: 0, passCmp: 0, passYds: 0, passTDs: 0, passInt: 0,
          rushAtt: 0, rushYds: 0, rushTDs: 0,
          recTgt: 0,  recRec: 0,  recYds: 0,  recTDs: 0,
          defInt: 0,  defPBU: 0,  defSacks: 0, defPulls: 0,
          defFF: 0,   defFR: 0,   defTDs: 0,   defTFL: 0,
        };
      }
      const t = totals[p.id];
      t.passAtt  += p.passAtt  ?? 0; t.passCmp  += p.passCmp  ?? 0;
      t.passYds  += p.passYds  ?? 0; t.passTDs  += p.passTDs  ?? 0;
      t.passInt  += p.passInt  ?? 0;
      t.rushAtt  += p.rushAtt  ?? 0; t.rushYds  += p.rushYds  ?? 0;
      t.rushTDs  += p.rushTDs  ?? 0;
      t.recTgt   += p.recTgt   ?? 0; t.recRec   += p.recRec   ?? 0;
      t.recYds   += p.recYds   ?? 0; t.recTDs   += p.recTDs   ?? 0;
      t.defInt   += p.defInt   ?? 0; t.defPBU   += p.defPBU   ?? 0;
      t.defSacks += p.defSacks ?? 0; t.defPulls += p.defPulls ?? 0;
      t.defFF    += p.defFF    ?? 0; t.defFR    += p.defFR    ?? 0;
      t.defTDs   += p.defTDs   ?? 0; t.defTFL   += p.defTFL   ?? 0;
    }
  }

  return Object.values(totals).sort(
    (a, b) => (b.passTDs + b.rushTDs + b.recTDs) - (a.passTDs + a.rushTDs + a.recTDs)
  );
  } catch {
    return [];
  }
}
