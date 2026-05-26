import { collection, getDocs, doc, getDoc, setDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Team, Player, Game, PlayerStats, Season } from "./types";

// ── Teams ─────────────────────────────────────────────────────────────────────

export async function getTeams(): Promise<Team[]> {
  try {
    const snap = await getDocs(collection(db, "teams"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Team));
  } catch {
    // Firestore rules may require auth; return empty so pages fall back to
    // slug-based team data (e.g. from FlagBucks) without crashing the build.
    return [];
  }
}

export async function getTeamById(id: string): Promise<Team | undefined> {
  const snap = await getDoc(doc(db, "teams", id));
  if (!snap.exists()) return undefined;
  return { id: snap.id, ...snap.data() } as Team;
}

export async function getStandings(): Promise<Team[]> {
  const teams = await getTeams();
  return teams.sort((a, b) => {
    const aG = a.wins + a.losses;
    const bG = b.wins + b.losses;
    const aPct = aG === 0 ? 0 : a.wins / aG;
    const bPct = bG === 0 ? 0 : b.wins / bG;
    if (bPct !== aPct) return bPct - aPct;
    return b.pointsFor - a.pointsFor;
  });
}

// ── Players ───────────────────────────────────────────────────────────────────

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const q = query(collection(db, "players"), where("teamId", "==", teamId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Player));
}

// ── Games ─────────────────────────────────────────────────────────────────────

export async function getGames(): Promise<Game[]> {
  try {
    const snap = await getDocs(collection(db, "games"));
    const games = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Game));
    // Sort in JS to avoid needing a Firestore composite index
    return games.sort(
      (a, b) => (a.week ?? 0) - (b.week ?? 0) || (a.date ?? "").localeCompare(b.date ?? "")
    );
  } catch {
    return [];
  }
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getStatsByTeam(teamId: string): Promise<PlayerStats[]> {
  const q = query(collection(db, "stats"), where("teamId", "==", teamId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as PlayerStats);
}

export async function getAllStats(): Promise<PlayerStats[]> {
  const snap = await getDocs(collection(db, "stats"));
  return snap.docs.map((d) => d.data() as PlayerStats);
}

// ── Shop Config ───────────────────────────────────────────────────────────────

export async function getShopConfig(): Promise<{ enabledProductIds: string[] }> {
  try {
    const snap = await getDoc(doc(db, "config", "shop"));
    if (!snap.exists()) return { enabledProductIds: [] };
    return snap.data() as { enabledProductIds: string[] };
  } catch {
    return { enabledProductIds: [] };
  }
}

export async function setShopConfig(enabledProductIds: string[]): Promise<void> {
  await setDoc(doc(db, "config", "shop"), { enabledProductIds });
}

// ── Seasons ───────────────────────────────────────────────────────────────────

export async function getActiveSeason(): Promise<Season | undefined> {
  const q = query(collection(db, "seasons"), where("isActive", "==", true));
  const snap = await getDocs(q);
  if (snap.empty) return undefined;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Season;
}
