"use client";

import { useState } from "react";

export type StatRow = {
  playerId: string;
  playerName: string;
  teamName: string;
  jersey: number | string | null;
  // Totals
  touchdowns: number;
  // Passing
  passAtt: number;
  passCmp: number;
  passYds: number;
  passTDs: number;
  passInt: number;
  // Rushing
  rushAtt: number;
  rushYds: number;
  rushTDs: number;
  // Receiving
  recTgt: number;
  recRec: number;
  recYds: number;
  recTDs: number;
  // Defense
  defInt: number;
  defPBU: number;
  defSacks: number;
  defPulls: number;
  defTDs: number;
};

const STAT_COLS = [
  { key: "touchdowns", label: "TD", title: "Total Touchdowns" },
  { key: "passYds",    label: "PASS YDS", title: "Passing Yards" },
  { key: "rushYds",    label: "RUSH YDS", title: "Rushing Yards" },
  { key: "recYds",     label: "REC YDS",  title: "Receiving Yards" },
  { key: "defInt",     label: "INT",      title: "Defensive Interceptions" },
  { key: "defPulls",   label: "FLAGS",    title: "Flag Pulls" },
] as const;

type SortKey = (typeof STAT_COLS)[number]["key"];

function StatsTable({
  rows,
  sortKey,
  onSort,
}: {
  rows: StatRow[];
  sortKey: SortKey;
  onSort: (k: SortKey) => void;
}) {
  if (rows.length === 0) {
    return (
      <div
        className="rounded-lg p-10 text-center text-sm"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
      >
        Stats not yet posted for this season.
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-x-auto" style={{ border: "1px solid var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--surface2)" }}>
            <th className="text-left px-4 py-3 font-display font-bold uppercase text-xs tracking-wide">Player</th>
            <th className="text-left px-4 py-3 font-display font-bold uppercase text-xs tracking-wide hidden sm:table-cell" style={{ color: "var(--muted)" }}>Team</th>
            {STAT_COLS.map((col) => (
              <th
                key={col.key}
                className="px-3 py-3 font-display font-bold uppercase text-xs tracking-wide text-center cursor-pointer hover:text-white transition-colors"
                style={{ color: col.key === sortKey ? "var(--gold)" : "var(--muted)" }}
                onClick={() => onSort(col.key)}
                title={col.title}
              >
                {col.label}
                {col.key === sortKey && " ↓"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((stat, i) => (
            <tr
              key={stat.playerId}
              className="border-t hover:bg-white/5 transition-colors"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <td className="px-4 py-2.5">
                <span className="font-semibold">{stat.playerName}</span>
                {i === 0 && (
                  <span
                    className="ml-2 text-xs px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}
                  >
                    Leader
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-xs hidden sm:table-cell" style={{ color: "var(--muted)" }}>
                {stat.teamName}
              </td>
              {STAT_COLS.map((col) => (
                <td
                  key={col.key}
                  className="px-3 py-2.5 text-center tabular-nums font-display font-bold"
                  style={{ color: col.key === sortKey ? "var(--gold)" : "var(--text)" }}
                >
                  {stat[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StatsClient({
  rows,
  teams,
}: {
  rows: StatRow[];
  teams: string[];
}) {
  const [activeTeam, setActiveTeam] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("touchdowns");

  const filtered = activeTeam === "all"
    ? rows
    : rows.filter((r) => r.teamName === activeTeam);

  const sorted = [...filtered].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Team filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTeam("all")}
          className="px-4 py-1.5 rounded font-display font-semibold text-sm uppercase tracking-wide transition-colors"
          style={{
            background: activeTeam === "all" ? "var(--gold)" : "var(--surface)",
            color: activeTeam === "all" ? "#0d0f14" : "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          All Players
        </button>
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => setActiveTeam(team)}
            className="px-4 py-1.5 rounded font-display font-semibold text-sm uppercase tracking-wide transition-colors"
            style={{
              background: activeTeam === team ? "rgba(245,200,66,0.2)" : "var(--surface)",
              color: activeTeam === team ? "var(--gold)" : "var(--muted)",
              border: activeTeam === team ? "1px solid var(--gold)" : "1px solid var(--border)",
            }}
          >
            {team}
          </button>
        ))}
      </div>

      <StatsTable rows={sorted} sortKey={sortKey} onSort={setSortKey} />

      <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
        Live stats from HVFF FlagBucks · TD = Total Touchdowns · Click any column header to sort
      </p>
    </div>
  );
}
