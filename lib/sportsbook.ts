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
  streak: string;
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
    if (!map[team]) map[team] = { team, wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0, winPct: 0, streak: "" };
    return map[team];
  }

  function ensureH2H(teamA: string, teamB: string) {
    if (!h2h[teamA]) h2h[teamA] = {};
    if (!h2h[teamA][teamB]) h2h[teamA][teamB] = { wins: 0, losses: 0, ties: 0 };
    return h2h[teamA][teamB];
  }

  // Sort games chronologically so streak is computed in the right order
  const sortedGames = [...games].sort((a, b) => (a.kickoff ?? "").localeCompare(b.kickoff ?? ""));
  const teamResults: Record<string, ("W" | "L" | "T")[]> = {};

  for (const g of sortedGames) {
    if (!g.result) continue;
    const { homeScore, awayScore } = g.result;
    const home = ensure(g.homeTeam);
    const away = ensure(g.awayTeam);

    if (!teamResults[g.homeTeam]) teamResults[g.homeTeam] = [];
    if (!teamResults[g.awayTeam]) teamResults[g.awayTeam] = [];

    home.pointsFor     += homeScore;
    home.pointsAgainst += awayScore;
    away.pointsFor     += awayScore;
    away.pointsAgainst += homeScore;

    const homeRec = ensureH2H(g.homeTeam, g.awayTeam);
    const awayRec = ensureH2H(g.awayTeam, g.homeTeam);

    if (homeScore > awayScore) {
      home.wins++; away.losses++; homeRec.wins++; awayRec.losses++;
      teamResults[g.homeTeam].push("W"); teamResults[g.awayTeam].push("L");
    } else if (awayScore > homeScore) {
      away.wins++; home.losses++; awayRec.wins++; homeRec.losses++;
      teamResults[g.awayTeam].push("W"); teamResults[g.homeTeam].push("L");
    } else {
      home.ties++; away.ties++; homeRec.ties++; awayRec.ties++;
      teamResults[g.homeTeam].push("T"); teamResults[g.awayTeam].push("T");
    }
  }

  function computeStreak(results: ("W" | "L" | "T")[]): string {
    if (results.length === 0) return "—";
    const last = results[results.length - 1];
    let count = 0;
    for (let i = results.length - 1; i >= 0 && results[i] === last; i--) count++;
    return `${last}${count}`;
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
      return { ...s, winPct: g === 0 ? 0 : s.wins / g, streak: computeStreak(teamResults[s.team] ?? []) };
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
  const jerseyNum = typeof jersey === "string" ? (parseInt(jersey, 10) || null) : (jersey ?? null);
  return {
    id, name, team, jersey: jerseyNum,
    passAtt: 0, passCmp: 0, passYds: 0, passTDs: 0, passInt: 0,
    rushAtt: 0, rushYds: 0, rushTDs: 0,
    recTgt: 0,  recRec: 0,  recYds: 0,  recTDs: 0,
    defInt: 0,  defPBU: 0,  defSacks: 0, defPulls: 0,
    defFF: 0,   defFR: 0,   defTDs: 0,   defTFL: 0,
    fgMade: 0,
  };
}

function sortedStatLines(totals: Record<string, SBStatLine>): SBStatLine[] {
  return Object.values(totals).sort(
    (a, b) => (b.passTDs + b.rushTDs + b.recTDs) - (a.passTDs + a.rushTDs + a.recTDs)
  );
}

export async function getStatsByPhase(): Promise<{ regular: SBStatLine[]; playoffs: SBStatLine[] }> {
  try {
    // Build playerName → team map from the players collection (mirrors FlagBucks approach)
    const playerSnap = await getDocs(collection(sbDb, "players"));
    const nameToTeamMap: Record<string, string> = {};
    for (const doc of playerSnap.docs) {
      const data = doc.data();
      if (data.name) nameToTeamMap[data.name as string] = normalizeTeam(data.team ?? "");
    }

    const snap = await getDocs(collection(sbDb, "gameStatSnapshots"));
    const regularTotals: Record<string, SBStatLine> = {};
    const playoffTotals: Record<string, SBStatLine> = {};

    const n = (v: unknown): number => (typeof v === "number" ? v : 0);

    for (const doc of snap.docs) {
      const data = doc.data();
      const weekId: string = data.weekId ?? "";
      const totals = weekId.startsWith("playoffs-") ? playoffTotals : regularTotals;

      for (const p of (data.playerStats ?? []) as Array<Record<string, unknown>>) {
        if (!p.name) continue; // mirrors FlagBucks: if (!ps.name) continue
        const name = p.name as string;
        const team = nameToTeamMap[name] ?? normalizeTeam((p.team as string | undefined) ?? "");
        if (!totals[name]) totals[name] = blankStatLine("", name, team, p.jersey as number | string | null | undefined);
        const t = totals[name];
        t.passAtt  += n(p.passAtt);  t.passCmp  += n(p.passCmp);
        t.passYds  += n(p.passYds);  t.passTDs  += n(p.passTDs);  t.passInt  += n(p.passInt);
        t.rushAtt  += n(p.rushAtt);  t.rushYds  += n(p.rushYds);  t.rushTDs  += n(p.rushTDs);
        t.recTgt   += n(p.recTgt);   t.recRec   += n(p.recRec);
        t.recYds   += n(p.recYds);   t.recTDs   += n(p.recTDs);
        t.defInt   += n(p.defInt);   t.defPBU   += n(p.defPBU);
        t.defSacks += n(p.defSacks); t.defPulls += n(p.defPulls);
        t.defFF    += n(p.defFF);    t.defFR    += n(p.defFR);
        t.defTDs   += n(p.defTDs);   t.defTFL   += n(p.defTFL);
        t.fgMade   += n(p.fgMade);
      }
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
