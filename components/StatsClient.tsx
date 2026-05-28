"use client";

import { useState, useMemo } from "react";

export type StatRow = {
  playerId: string;
  playerName: string;
  teamName: string;
  jersey: number | string | null;
  touchdowns: number;
  passAtt: number; passCmp: number; passYds: number; passTDs: number; passInt: number;
  rushAtt: number; rushYds: number; rushTDs: number;
  recTgt: number;  recRec: number;  recYds: number;  recTDs: number;
  defInt: number;  defPBU: number;  defSacks: number; defPulls: number; defTDs: number;
};

type ComputedRow = StatRow & {
  passCmpPct: string;
  rushYPC: string;
  recCatchPct: string;
};

function compute(r: StatRow): ComputedRow {
  return {
    ...r,
    passCmpPct: r.passAtt > 0 ? ((r.passCmp / r.passAtt) * 100).toFixed(1) : "0.0",
    rushYPC:    r.rushAtt > 0 ? (r.rushYds / r.rushAtt).toFixed(1) : "0.0",
    recCatchPct: r.recTgt > 0 ? ((r.recRec / r.recTgt) * 100).toFixed(1) : "0.0",
  };
}

type Category = "passing" | "rushing" | "receiving" | "defense";

const CATEGORIES: {
  id: Category;
  label: string;
  filter: (r: StatRow) => boolean;
  defaultSort: string;
  leaderStats: { key: string; label: string }[];
  cols: { key: string; label: string; title: string }[];
}[] = [
  {
    id: "passing",
    label: "Passing",
    filter: (r) => r.passAtt > 0,
    defaultSort: "passYds",
    leaderStats: [
      { key: "passYds", label: "Pass Yards" },
      { key: "passTDs", label: "Pass TDs" },
      { key: "passCmpPct", label: "Completion %" },
    ],
    cols: [
      { key: "passYds",    label: "YDS",  title: "Passing Yards" },
      { key: "passCmp",    label: "CMP",  title: "Completions" },
      { key: "passAtt",    label: "ATT",  title: "Pass Attempts" },
      { key: "passCmpPct", label: "CMP%", title: "Completion %" },
      { key: "passTDs",    label: "TD",   title: "Passing Touchdowns" },
      { key: "passInt",    label: "INT",  title: "Interceptions Thrown" },
    ],
  },
  {
    id: "rushing",
    label: "Rushing",
    filter: (r) => r.rushAtt > 0,
    defaultSort: "rushYds",
    leaderStats: [
      { key: "rushYds", label: "Rush Yards" },
      { key: "rushTDs", label: "Rush TDs" },
      { key: "rushYPC", label: "Yards / Carry" },
    ],
    cols: [
      { key: "rushYds", label: "YDS", title: "Rushing Yards" },
      { key: "rushAtt", label: "ATT", title: "Rush Attempts" },
      { key: "rushYPC", label: "YPC", title: "Yards Per Carry" },
      { key: "rushTDs", label: "TD",  title: "Rushing Touchdowns" },
    ],
  },
  {
    id: "receiving",
    label: "Receiving",
    filter: (r) => r.recTgt > 0,
    defaultSort: "recYds",
    leaderStats: [
      { key: "recYds",     label: "Rec Yards" },
      { key: "recTDs",     label: "Rec TDs" },
      { key: "recCatchPct", label: "Catch %" },
    ],
    cols: [
      { key: "recYds",     label: "YDS",  title: "Receiving Yards" },
      { key: "recRec",     label: "REC",  title: "Receptions" },
      { key: "recTgt",     label: "TGT",  title: "Targets" },
      { key: "recCatchPct", label: "CTH%", title: "Catch %" },
      { key: "recTDs",     label: "TD",   title: "Receiving Touchdowns" },
    ],
  },
  {
    id: "defense",
    label: "Defense",
    filter: (r) => r.defPulls + r.defInt + r.defPBU + r.defSacks + r.defTDs > 0,
    defaultSort: "defPulls",
    leaderStats: [
      { key: "defPulls", label: "Flag Pulls" },
      { key: "defInt",   label: "Interceptions" },
      { key: "defPBU",   label: "Pass Breakups" },
    ],
    cols: [
      { key: "defPulls", label: "PULLS", title: "Flag Pulls" },
      { key: "defInt",   label: "INT",   title: "Interceptions" },
      { key: "defPBU",   label: "PBU",   title: "Pass Breakups" },
      { key: "defSacks", label: "SACKS", title: "Sacks" },
      { key: "defTDs",   label: "DEF TD", title: "Defensive Touchdowns" },
    ],
  },
];

function getVal(row: ComputedRow, key: string): number {
  const v = (row as Record<string, unknown>)[key];
  return typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
}

export default function StatsClient({ rows }: { rows: StatRow[] }) {
  const [category, setCategory] = useState<Category>("passing");
  const [sortKey, setSortKey] = useState("passYds");
  const [teamFilter, setTeamFilter] = useState("all");

  const computed = useMemo(() => rows.map(compute), [rows]);
  const teams = useMemo(() => [...new Set(rows.map((r) => r.teamName))].sort(), [rows]);

  const cat = CATEGORIES.find((c) => c.id === category)!;

  // When switching category, reset sort to the default for that category
  function switchCategory(id: Category) {
    const next = CATEGORIES.find((c) => c.id === id)!;
    setCategory(id);
    setSortKey(next.defaultSort);
  }

  const filtered = useMemo(() => {
    let list = computed.filter(cat.filter);
    if (teamFilter !== "all") list = list.filter((r) => r.teamName === teamFilter);
    return list.sort((a, b) => getVal(b, sortKey) - getVal(a, sortKey));
  }, [computed, cat, teamFilter, sortKey]);

  // Leader cards use ALL players (no team filter) so leaders are always league-wide
  const leaderRows = useMemo(
    () => computed.filter(cat.filter),
    [computed, cat]
  );

  if (rows.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>No stats posted yet — check back after Week 1.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Category tabs ── */}
      <div className="flex gap-1 mb-8 p-1 rounded-lg w-fit" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => switchCategory(c.id)}
            className="px-5 py-2 rounded font-display font-bold text-sm uppercase tracking-wide transition-all"
            style={{
              background: category === c.id ? "var(--gold)" : "transparent",
              color: category === c.id ? "#0d0f14" : "var(--muted)",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Leader cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {cat.leaderStats.map(({ key, label }) => {
          const sorted = [...leaderRows].sort((a, b) => getVal(b, key) - getVal(a, key));
          const leader = sorted[0];
          if (!leader) return null;
          const val = (leader as Record<string, unknown>)[key];
          const display = typeof val === "string" ? val : String(val);
          return (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className="rounded-lg p-4 text-left transition-all hover:scale-[1.01]"
              style={{
                background: sortKey === key ? "rgba(245,200,66,0.1)" : "var(--surface)",
                border: sortKey === key ? "1px solid var(--gold)" : "1px solid var(--border)",
              }}
            >
              <div className="text-xs font-display font-bold uppercase tracking-widest mb-2" style={{ color: "var(--gold)" }}>
                {label} Leader
              </div>
              <div className="font-display font-black text-2xl">{display}</div>
              <div className="font-semibold text-sm mt-0.5">{leader.playerName}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{leader.teamName}</div>
            </button>
          );
        })}
      </div>

      {/* ── Team filter ── */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setTeamFilter("all")}
          className="px-3 py-1 rounded font-display font-semibold text-xs uppercase tracking-wide transition-colors"
          style={{
            background: teamFilter === "all" ? "var(--gold)" : "var(--surface)",
            color: teamFilter === "all" ? "#0d0f14" : "var(--muted)",
            border: "1px solid var(--border)",
          }}
        >
          All Teams
        </button>
        {teams.map((t) => (
          <button
            key={t}
            onClick={() => setTeamFilter(t)}
            className="px-3 py-1 rounded font-display font-semibold text-xs uppercase tracking-wide transition-colors"
            style={{
              background: teamFilter === t ? "rgba(245,200,66,0.15)" : "var(--surface)",
              color: teamFilter === t ? "var(--gold)" : "var(--muted)",
              border: teamFilter === t ? "1px solid var(--gold)" : "1px solid var(--border)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Sortable table ── */}
      {filtered.length === 0 ? (
        <div className="rounded-lg p-10 text-center text-sm" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
          No {cat.label.toLowerCase()} stats for this team yet.
        </div>
      ) : (
        <div className="rounded-lg overflow-x-auto" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--surface2)" }}>
                <th className="text-left px-3 py-3 font-display font-bold uppercase text-xs tracking-wide w-8 text-center" style={{ color: "var(--muted)" }}>RK</th>
                <th className="text-left px-4 py-3 font-display font-bold uppercase text-xs tracking-wide">Player</th>
                <th className="text-left px-4 py-3 font-display font-bold uppercase text-xs tracking-wide hidden sm:table-cell" style={{ color: "var(--muted)" }}>Team</th>
                {cat.cols.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => setSortKey(col.key)}
                    title={col.title}
                    className="px-3 py-3 font-display font-bold uppercase text-xs tracking-wide text-center cursor-pointer select-none whitespace-nowrap"
                    style={{ color: sortKey === col.key ? "var(--gold)" : "var(--muted)" }}
                  >
                    {col.label}{sortKey === col.key ? " ↓" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const isLeader = i === 0;
                return (
                  <tr
                    key={row.playerId}
                    className="border-t hover:bg-white/5 transition-colors"
                    style={{
                      borderColor: "var(--border)",
                      background: isLeader ? "rgba(245,200,66,0.04)" : "var(--surface)",
                    }}
                  >
                    <td className="px-3 py-2.5 text-center tabular-nums text-xs font-bold" style={{ color: "var(--muted)" }}>
                      {i + 1}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{row.playerName}</span>
                        {isLeader && teamFilter === "all" && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}>
                            #1
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs hidden sm:table-cell" style={{ color: "var(--muted)" }}>
                      {row.teamName}
                    </td>
                    {cat.cols.map((col) => {
                      const val = (row as Record<string, unknown>)[col.key];
                      const display = typeof val === "number" || typeof val === "string" ? String(val) : "—";
                      return (
                        <td
                          key={col.key}
                          className="px-3 py-2.5 text-center tabular-nums font-display font-bold"
                          style={{ color: sortKey === col.key ? "var(--gold)" : "var(--text)" }}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
        Live stats from HVFF FlagBucks · Click a column header or leader card to re-rank
      </p>
    </div>
  );
}
