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
  fgMade: number;
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

// ── Result overrides for settled games missing a result in Firebase ─────────
// Keyed by Firestore document ID. Only applied when the doc's result is null.
const RESULT_OVERRIDES: Record<string, { homeScore: number; awayScore: number }> = {
  "CDjuybEx1YITXxyKSxxj": { homeScore: 14, awayScore: 35 }, // SF: S&S Par-Tee's 35 – Southern Dutchess CC 14
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
        result: data.result ?? RESULT_OVERRIDES[d.id] ?? null,
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
        result: data.result ?? RESULT_OVERRIDES[d.id] ?? null,
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
  // head-to-head win/loss/tie counts: h2h[teamA][teamB] = { wins, losses, ties } (from teamA's perspective)
  const h2h: Record<string, Record<string, { wins: number; losses: number; ties: number }>> = {};

  function ensure(team: string) {
    if (!map[team]) map[team] = { team, wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0, winPct: 0 };
    return map[team];
  }

  function ensureH2H(teamA: string, teamB: string) {
    if (!h2h[teamA]) h2h[teamA] = {};
    if (!h2h[teamA][teamB]) h2h[teamA][teamB] = { wins: 0, losses: 0, ties: 0 };
    return h2h[teamA][teamB];
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

    const homeRec = ensureH2H(g.homeTeam, g.awayTeam);
    const awayRec = ensureH2H(g.awayTeam, g.homeTeam);

    if (homeScore > awayScore)      { home.wins++;   away.losses++;  homeRec.wins++;  awayRec.losses++; }
    else if (awayScore > homeScore) { away.wins++;   home.losses++;  awayRec.wins++;  homeRec.losses++; }
    else                            { home.ties++;   away.ties++;    homeRec.ties++;  awayRec.ties++; }
  }

  // head-to-head win pct between two teams; null if they haven't played
  function h2hWinPct(teamA: string, teamB: string): number | null {
    const rec = h2h[teamA]?.[teamB];
    if (!rec) return null;
    const g = rec.wins + rec.losses + rec.ties;
    if (g === 0) return null;
    return (rec.wins + rec.ties * 0.5) / g;
  }

  return Object.values(map)
    .map((s) => {
      const g = s.wins + s.losses + s.ties;
      return { ...s, winPct: g === 0 ? 0 : s.wins / g };
    })
    .sort((a, b) => {
      if (b.winPct !== a.winPct) return b.winPct - a.winPct;

      const aVsB = h2hWinPct(a.team, b.team);
      const bVsA = h2hWinPct(b.team, a.team);
      if (aVsB !== null && bVsA !== null && aVsB !== bVsA) {
        return bVsA - aVsB;
      }

      const aDiff = a.pointsFor - a.pointsAgainst;
      const bDiff = b.pointsFor - b.pointsAgainst;
      return bDiff - aDiff;
    });
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

function blankStatLine(id: string, name: string, team: string, jersey: number | string | null | undefined): SBStatLine {
  return {
    id, name, team, jersey: jersey ?? null,
    passAtt: 0, passCmp: 0, passYds: 0, passTDs: 0, passInt: 0,
    rushAtt: 0, rushYds: 0, rushTDs: 0,
    recTgt: 0,  recRec: 0,  recYds: 0,  recTDs: 0,
    defInt: 0,  defPBU: 0,  defSacks: 0, defPulls: 0,
    defFF: 0,   defFR: 0,   defTDs: 0,   defTFL: 0,
    fgMade: 0,
  };
}

function accumulateStats(totals: Record<string, SBStatLine>, playerStats: SBStatLine[]) {
  for (const p of playerStats) {
    const team = normalizeTeam((p as unknown as { team?: string }).team ?? "");
    if (!totals[p.id]) totals[p.id] = blankStatLine(p.id, p.name, team, p.jersey);
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
    t.fgMade   += p.fgMade   ?? 0;
  }
}

function sortedStatLines(totals: Record<string, SBStatLine>): SBStatLine[] {
  return Object.values(totals).sort(
    (a, b) => (b.passTDs + b.rushTDs + b.recTDs) - (a.passTDs + a.rushTDs + a.recTDs)
  );
}

export async function getStatsByPhase(): Promise<{ regular: SBStatLine[]; playoffs: SBStatLine[] }> {
  try {
    // Build player-id → team map from the players collection
    const playerSnap = await getDocs(collection(sbDb, "players"));
    const playerTeamMap: Record<string, string> = {};
    for (const doc of playerSnap.docs) {
      const data = doc.data();
      if (data.team) playerTeamMap[doc.id] = normalizeTeam(data.team);
    }

    const snap = await getDocs(collection(sbDb, "gameStatSnapshots"));
    const regularTotals: Record<string, SBStatLine> = {};
    const playoffTotals: Record<string, SBStatLine> = {};

    for (const doc of snap.docs) {
      const data = doc.data();
      const weekId: string = data.weekId ?? "";
      // Patch team onto each player stat from the players collection
      const playerStats: SBStatLine[] = (data.playerStats ?? []).map((p: SBStatLine) => ({
        ...p,
        team: playerTeamMap[p.id] ?? (p as unknown as { team?: string }).team ?? "",
      }));
      accumulateStats(weekId.startsWith("playoffs-") ? playoffTotals : regularTotals, playerStats);
    }

    return { regular: sortedStatLines(regularTotals), playoffs: sortedStatLines(playoffTotals) };
  } catch {
    return { regular: [], playoffs: [] };
  }
}

export async function getStatsFromSportsbook(): Promise<SBStatLine[]> {
  const { regular } = await getStatsByPhase();
  return regular;
}
