"use client";

import { useState, useMemo } from "react";
import type { SeasonStat, HistoricalSeason } from "@/lib/historical-stats";

type ComputedRow = SeasonStat & {
  playerName: string;
  teamName: string;
  touchdowns: number;
  passCmpPct: string;
  rushYPC: string;
  recCatchPct: string;
};

function compute(r: SeasonStat): ComputedRow {
  return {
    ...r,
    touchdowns: r.passTDs + r.rushTDs + r.recTDs + r.defTDs,
    passCmpPct:  r.passAtt > 0 ? ((r.passCmp / r.passAtt) * 100).toFixed(1) : "0.0",
    rushYPC:     r.rushAtt > 0 ? (r.rushYds / r.rushAtt).toFixed(1) : "0.0",
    recCatchPct: r.recTgt  > 0 ? ((r.recRec / r.recTgt)  * 100).toFixed(1) : "0.0",
  };
}

function aggregate(rows: SeasonStat[]): SeasonStat[] {
  const map: Record<string, SeasonStat> = {};
  for (const r of rows) {
    const key = r.playerName.trim().toLowerCase();
    if (!map[key]) {
      map[key] = { ...r };
    } else {
      const t = map[key];
      t.passAtt  += r.passAtt;  t.passCmp  += r.passCmp;
      t.passYds  += r.passYds;  t.passTDs  += r.passTDs;  t.passInt  += r.passInt;
      t.rushAtt  += r.rushAtt;  t.rushYds  += r.rushYds;  t.rushTDs  += r.rushTDs;
      t.recTgt   += r.recTgt;   t.recRec   += r.recRec;   t.recYds   += r.recYds;   t.recTDs  += r.recTDs;
      t.defInt   += r.defInt;   t.defPBU   += r.defPBU;   t.defSacks += r.defSacks; t.defPulls += r.defPulls;
      t.defFF    += r.defFF;    t.defFR    += r.defFR;    t.defTDs   += r.defTDs;   t.defTFL  += r.defTFL;
      t.fgMade   += r.fgMade;
      t.pancakes += r.pancakes;
      t.teamName  = r.teamName; // keep most recent team
    }
  }
  return Object.values(map);
}

type Category = "passing" | "rushing" | "receiving" | "defense" | "kicking";

const CATEGORIES: {
  id: Category;
  label: string;
  filter: (r: ComputedRow) => boolean;
  defaultSort: string;
  leaderStats: { key: string; label: string }[];
  cols: { key: string; label: string; title: string }[];
}[] = [
  {
    id: "passing", label: "Passing",
    filter: (r) => r.passAtt > 0 || r.passYds > 0 || r.passTDs > 0,
    defaultSort: "passYds",
    leaderStats: [
      { key: "passYds",    label: "Pass Yards" },
      { key: "passTDs",    label: "Pass TDs" },
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
    id: "rushing", label: "Rushing",
    filter: (r) => r.rushAtt > 0 || r.rushYds > 0 || r.rushTDs > 0,
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
    id: "receiving", label: "Receiving",
    filter: (r) => r.recTgt > 0 || r.recRec > 0 || r.recYds > 0,
    defaultSort: "recYds",
    leaderStats: [
      { key: "recYds", label: "Rec Yards" },
      { key: "recTDs", label: "Rec TDs" },
      { key: "recRec", label: "Receptions" },
    ],
    cols: [
      { key: "recYds", label: "YDS", title: "Receiving Yards" },
      { key: "recRec", label: "REC", title: "Receptions" },
      { key: "recTDs", label: "TD",  title: "Receiving Touchdowns" },
    ],
  },
  {
    id: "defense", label: "Defense",
    filter: (r) => r.defPulls + r.defInt + r.defPBU + r.defSacks + r.defTDs + r.defTFL + r.pancakes > 0,
    defaultSort: "defPulls",
    leaderStats: [
      { key: "defPulls", label: "Flag Pulls" },
      { key: "defInt",   label: "Interceptions" },
      { key: "defPBU",   label: "Pass Breakups" },
    ],
    cols: [
      { key: "defPulls", label: "PULLS",  title: "Flag Pulls" },
      { key: "defInt",   label: "INT",    title: "Interceptions" },
      { key: "defPBU",   label: "PBU",    title: "Pass Breakups" },
      { key: "defSacks", label: "SACKS",  title: "Sacks" },
      { key: "defTFL",   label: "TFL",    title: "Tackles For Loss" },
      { key: "defFF",    label: "FF",     title: "Forced Fumbles" },
      { key: "defFR",    label: "FR",     title: "Fumble Recoveries" },
      { key: "defTDs",   label: "DEF TD",   title: "Defensive Touchdowns" },
      { key: "pancakes", label: "PANCAKES", title: "Pancakes (legacy)" },
    ],
  },
  {
    id: "kicking", label: "Kicking",
    filter: (r) => r.fgMade > 0,
    defaultSort: "fgMade",
    leaderStats: [
      { key: "fgMade", label: "Field Goals" },
    ],
    cols: [
      { key: "fgMade", label: "FGM", title: "Field Goals Made" },
    ],
  },
];

function getVal(row: ComputedRow, key: string): number {
  const v = (row as Record<string, unknown>)[key];
  return typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : 0;
}

type Props = {
  historicalSeasons: HistoricalSeason[];
  currentSeasonId: string;
  currentSeasonName: string;
  currentSeasonStats: SeasonStat[];
};

export default function AllTimeStatsClient({
  historicalSeasons,
  currentSeasonId,
  currentSeasonName,
  currentSeasonStats,
}: Props) {
  const [seasonId, setSeasonId]   = useState<string>("all-time");
  const [category, setCategory]   = useState<Category>("passing");
  const [sortKey, setSortKey]     = useState("passYds");
  const [teamFilter, setTeamFilter] = useState("all");

  const allSeasons = useMemo(() => [
    ...historicalSeasons,
    { id: currentSeasonId, name: currentSeasonName, stats: currentSeasonStats },
  ], [historicalSeasons, currentSeasonId, currentSeasonName, currentSeasonStats]);

  // Raw rows for the selected view
  const rawRows = useMemo(() => {
    if (seasonId === "all-time") {
      return aggregate(allSeasons.flatMap((s) => s.stats));
    }
    return allSeasons.find((s) => s.id === seasonId)?.stats ?? [];
  }, [seasonId, allSeasons]);

  const computed = useMemo(() => rawRows.map(compute), [rawRows]);
  const teams = useMemo(() => [...new Set(rawRows.map((r) => r.teamName))].sort(), [rawRows]);

  const cat = CATEGORIES.find((c) => c.id === category)!;

  function switchCategory(id: Category) {
    const next = CATEGORIES.find((c) => c.id === id)!;
    setCategory(id);
    setSortKey(next.defaultSort);
    setTeamFilter("all");
  }

  function switchSeason(id: string) {
    setSeasonId(id);
    setTeamFilter("all");
  }

  const filtered = useMemo(() => {
    let list = computed.filter(cat.filter);
    if (teamFilter !== "all") list = list.filter((r) => r.teamName === teamFilter);
    return list.sort((a, b) => getVal(b, sortKey) - getVal(a, sortKey));
  }, [computed, cat, teamFilter, sortKey]);

  const leaderRows = useMemo(() => computed.filter(cat.filter), [computed, cat]);

  const hasStats = allSeasons.some((s) => s.stats.length > 0);
  const currentViewHasData = rawRows.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Season selector ── */}
      <div className="mb-8">
        <p className="text-xs font-display font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>Season</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => switchSeason("all-time")}
            className="px-4 py-2 rounded font-display font-bold text-sm uppercase tracking-wide transition-all"
            style={{
              background: seasonId === "all-time" ? "var(--gold)" : "var(--surface)",
              color: seasonId === "all-time" ? "#0d0f14" : "var(--muted)",
              border: seasonId === "all-time" ? "none" : "1px solid var(--border)",
            }}
          >
            All Time
          </button>
          {allSeasons.map((s) => (
            <button
              key={s.id}
              onClick={() => switchSeason(s.id)}
              className="px-4 py-2 rounded font-display font-semibold text-sm uppercase tracking-wide transition-all"
              style={{
                background: seasonId === s.id ? "rgba(245,200,66,0.15)" : "var(--surface)",
                color: seasonId === s.id ? "var(--gold)" : "var(--muted)",
                border: seasonId === s.id ? "1px solid var(--gold)" : "1px solid var(--border)",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty state for seasons with no data yet ── */}
      {!currentViewHasData ? (
        <div className="rounded-lg p-16 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="font-display font-black text-2xl uppercase mb-2" style={{ color: "var(--gold)" }}>
            {seasonId === "all-time" && !hasStats ? "No Historical Data Yet" : "Coming Soon"}
          </div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {seasonId === "all-time"
              ? "Stats for past seasons are being added. Check back soon."
              : "Stats for this season haven't been entered yet."}
          </p>
        </div>
      ) : (
        <>
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
                  <div className="font-display font-black text-2xl">{String(val)}</div>
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
              No {cat.label.toLowerCase()} stats for this selection.
            </div>
          ) : (
            <div className="rounded-lg overflow-x-auto" style={{ border: "1px solid var(--border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--surface2)" }}>
                    <th className="text-center px-3 py-3 font-display font-bold uppercase text-xs tracking-wide w-8" style={{ color: "var(--muted)" }}>RK</th>
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
                  {filtered.map((row, i) => (
                    <tr
                      key={`${row.playerName}-${i}`}
                      className="border-t hover:bg-white/5 transition-colors"
                      style={{
                        borderColor: "var(--border)",
                        background: i === 0 ? "rgba(245,200,66,0.04)" : "var(--surface)",
                      }}
                    >
                      <td className="px-3 py-2.5 text-center tabular-nums text-xs font-bold" style={{ color: "var(--muted)" }}>
                        {i + 1}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{row.playerName}</span>
                          {i === 0 && teamFilter === "all" && (
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
                        return (
                          <td
                            key={col.key}
                            className="px-3 py-2.5 text-center tabular-nums font-display font-bold"
                            style={{ color: sortKey === col.key ? "var(--gold)" : "var(--text)" }}
                          >
                            {String(val ?? 0)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
            {seasonId === "all-time"
              ? "All-time totals across all HVFF seasons · Click column headers or leader cards to re-rank"
              : "Click column headers or leader cards to re-rank"}
          </p>
        </>
      )}
    </div>
  );
}
