import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Team, Player, Game, PlayerStats, Season } from "./types";

// ── Seasons ──────────────────────────────────────────────────────────────────

export async function getActiveSeason(): Promise<Season | null> {
  const q = query(collection(db, "seasons"), where("isActive", "==", true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Season, "id">) };
}

// ── Teams ─────────────────────────────────────────────────────────────────────

export async function getTeams(): Promise<Team[]> {
  const snap = await getDocs(collection(db, "teams"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Team, "id">) }));
}

export async function getStandings(): Promise<Team[]> {
  const teams = await getTeams();
  return teams.sort((a, b) => {
    const aGames = a.wins + a.losses + a.ties;
    const bGames = b.wins + b.losses + b.ties;
    const aPct = aGames === 0 ? 0 : a.wins / aGames;
    const bPct = bGames === 0 ? 0 : b.wins / bGames;
    if (bPct !== aPct) return bPct - aPct;
    return b.pointsFor - a.pointsFor;
  });
}

// ── Players ───────────────────────────────────────────────────────────────────

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const q = query(collection(db, "players"), where("teamId", "==", teamId), orderBy("name"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Player, "id">) }));
}

export async function getAllPlayers(): Promise<Player[]> {
  const snap = await getDocs(collection(db, "players"));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Player, "id">) }));
}

// ── Games ─────────────────────────────────────────────────────────────────────

export async function getGames(seasonId?: string): Promise<Game[]> {
  const q = seasonId
    ? query(collection(db, "games"), where("season", "==", seasonId), orderBy("week"), orderBy("date"))
    : query(collection(db, "games"), orderBy("week"), orderBy("date"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      date: data.date instanceof Timestamp ? data.date.toDate().toISOString() : data.date,
    } as Game;
  });
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export async function getStatsByTeam(teamId: string): Promise<PlayerStats[]> {
  const q = query(collection(db, "stats"), where("teamId", "==", teamId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ ...(d.data() as PlayerStats) }));
}

export async function getAllStats(): Promise<PlayerStats[]> {
  const snap = await getDocs(collection(db, "stats"));
  return snap.docs.map((d) => ({ ...(d.data() as PlayerStats) }));
}

// ── Seed helpers (run once to populate Firestore) ────────────────────────────

export async function seedTeams(teams: Team[]): Promise<void> {
  for (const team of teams) {
    const { id, ...data } = team;
    await setDoc(doc(db, "teams", id), data);
  }
}

export async function seedSeason(season: Season): Promise<void> {
  const { id, ...data } = season;
  await setDoc(doc(db, "seasons", id), data);
}
