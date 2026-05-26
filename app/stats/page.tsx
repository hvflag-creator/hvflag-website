"use client";

import { useState } from "react";
import { TEAMS, getStatsByTeam, getAllTimeLeaders } from "@/lib/data";

const STAT_COLS = [
  { key: "touchdowns", label: "TD", title: "Touchdowns" },
  { key: "passYards", label: "PASS YDS", title: "Passing Yards" },
  { key: "rushYards", label: "RUSH YDS", title: "Rushing Yards" },
  { key: "recYards", label: "REC YDS", title: "Receiving Yards" },
  { key: "interceptions", label: "INT", title: "Interceptions" },
  { key: "flagPulls", label: "FLAGS", title: "Flag Pulls" },
] as const;

type StatKey = (typeof STAT_COLS)[number]["key"];

function StatsTable({
  rows,
  sortKey,
  onSort,
}: {
  rows: ReturnType<typeof getAllTimeLeaders>;
  sortKey: StatKey;
  onSort: (k: StatKey) => void;
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

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<"all-time" | string>("all-time");
  const [sortKey, setSortKey] = useState<StatKey>("touchdowns");

  const rows =
    activeTab === "all-time"
      ? [...getAllTimeLeaders()].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number))
      : [...getStatsByTeam(activeTab)].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));

  return (
    <div>
      <div
        className="border-b py-10"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Stats
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Summer 2026 · Click a column header to sort</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab("all-time")}
            className="px-4 py-1.5 rounded font-display font-semibold text-sm uppercase tracking-wide transition-colors"
            style={{
              background: activeTab === "all-time" ? "var(--gold)" : "var(--surface)",
              color: activeTab === "all-time" ? "#0d0f14" : "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            All Players
          </button>
          {TEAMS.map((team) => (
            <button
              key={team.id}
              onClick={() => setActiveTab(team.id)}
              className="px-4 py-1.5 rounded font-display font-semibold text-sm uppercase tracking-wide transition-colors"
              style={{
                background: activeTab === team.id ? team.color : "var(--surface)",
                color: activeTab === team.id ? "#fff" : "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {team.name}
            </button>
          ))}
        </div>

        <StatsTable rows={rows} sortKey={sortKey} onSort={setSortKey} />
      </div>
    </div>
  );
}
