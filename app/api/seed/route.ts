import { NextResponse } from "next/server";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const TEAMS = [
  { id: "ss-par-tees", name: "S&S Par-Tee's", slug: "ss-par-tees", color: "#a87c3e", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "costellos-maverick-pop", name: "Costello's Maverick Pop", slug: "costellos-maverick-pop", color: "#f77f00", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "beacon-bikes", name: "Beacon Bikes", slug: "beacon-bikes", color: "#c9a84c", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "queen-city-e-gills", name: "Queen City E-Gills", slug: "queen-city-e-gills", color: "#1e3a8a", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "cutncoat", name: "CutNCoat", slug: "cutncoat", color: "#cd7f5b", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "marcelo-home-improvement", name: "Marcelo Home Improvement", slug: "marcelo-home-improvement", color: "#3b3dca", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "stinsons-hub", name: "Stinson's Hub", slug: "stinsons-hub", color: "#22c55e", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
  { id: "southern-dutchess-cc", name: "Southern Dutchess Country Club", slug: "southern-dutchess-cc", color: "#1a6b3c", wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0 },
];

// Old team IDs from last season to clean up
const OLD_TEAM_IDS = ["marcelos", "ss", "st-roccos", "costellos"];

const SEASON = {
  id: "winterbash-25-26",
  name: "Winterbash '25–26",
  isActive: true,
};

export async function GET() {
  // Delete old season team documents
  for (const id of OLD_TEAM_IDS) {
    await deleteDoc(doc(db, "teams", id));
  }

  // Write season
  const { id: seasonId, ...seasonData } = SEASON;
  await setDoc(doc(db, "seasons", seasonId), seasonData);

  // Write all 8 current teams
  for (const team of TEAMS) {
    const { id, ...data } = team;
    await setDoc(doc(db, "teams", id), data);
  }

  return NextResponse.json({ message: "Seeded successfully!", teams: TEAMS.length });
}
