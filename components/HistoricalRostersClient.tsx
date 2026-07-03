"use client";

import { useState, useMemo } from "react";
import type { HistoricalSeason } from "@/lib/historical-stats";

type Props = {
  seasons: HistoricalSeason[];
};

export default function HistoricalRostersClient({ seasons }: Props) {
  const seasonsWithData = seasons.filter((s) => s.stats.length > 0);
  const [seasonId, setSeasonId] = useState<string>(seasonsWithData[seasonsWithData.length - 1]?.id ?? "");

  const selected = useMemo(
    () => seasons.find((s) => s.id === seasonId),
    [seasons, seasonId]
  );

  // Group players by team, alphabetically within each team
  const teams = useMemo(() => {
    if (!selected) return [];
    const map: Record<string, string[]> = {};
    for (const stat of selected.stats) {
      const team = stat.teamName || "— No Team Listed —";
      if (!map[team]) map[team] = [];
      if (!map[team].includes(stat.playerName)) map[team].push(stat.playerName);
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([team, players]) => ({ team, players: players.sort((a, b) => a.localeCompare(b)) }));
  }, [selected]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Season selector */}
      <div className="mb-10">
        <p className="text-xs font-display font-bold uppercase tracking-widest mb-3" style={{ color: "var(--muted)" }}>Season</p>
        <div className="flex flex-wrap gap-2">
          {seasonsWithData.map((s) => (
            <button
              key={s.id}
              onClick={() => setSeasonId(s.id)}
              className="px-4 py-2 rounded font-display font-semibold text-sm uppercase tracking-wide transition-all"
              style={{
                background: seasonId === s.id ? "var(--gold)" : "var(--surface)",
                color: seasonId === s.id ? "#0d0f14" : "var(--muted)",
                border: seasonId === s.id ? "none" : "1px solid var(--border)",
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {!selected || teams.length === 0 ? (
        <div className="rounded-lg p-16 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="font-display font-black text-2xl uppercase mb-2" style={{ color: "var(--gold)" }}>No Data Yet</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Roster data for this season hasn't been entered yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(({ team, players }) => (
            <div
              key={team}
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
            >
              {/* Team header */}
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "var(--gold)", borderBottomWidth: 2, background: "rgba(245,200,66,0.06)" }}
              >
                <h2 className="font-display font-black text-lg uppercase tracking-wide leading-none">
                  {team}
                </h2>
                <span className="text-xs" style={{ color: "var(--muted)" }}>{players.length} player{players.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Player list */}
              <ul>
                {players.map((name, i) => (
                  <li
                    key={name}
                    className="px-4 py-2 text-sm font-semibold border-t"
                    style={{
                      borderColor: "var(--border)",
                      background: i % 2 === 0 ? "var(--surface)" : "var(--surface2)",
                    }}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs" style={{ color: "var(--muted)" }}>
        {selected?.name} · {teams.reduce((n, t) => n + t.players.length, 0)} total players
      </p>
    </div>
  );
}
