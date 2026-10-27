import { HISTORICAL_SEASONS, CURRENT_SEASON_NAME } from "@/lib/historical-stats";
import type { SeasonStat } from "@/lib/historical-stats";
import { RECORD_CATEGORIES, computeRecords } from "@/lib/records";
import { getStatsFromSportsbook } from "@/lib/sportsbook";

export const revalidate = 60;

export default async function RecordsPage() {
  const sbStats = await getStatsFromSportsbook();

  const currentStats: SeasonStat[] = sbStats.map((p) => ({
    playerName: p.name,
    teamName:   p.team,
    passAtt:  p.passAtt,  passCmp:  p.passCmp,  passYds: p.passYds, passTDs: p.passTDs, passInt: p.passInt,
    rushAtt:  p.rushAtt,  rushYds:  p.rushYds,  rushTDs: p.rushTDs,
    recTgt:   p.recTgt,   recRec:   p.recRec,   recYds:  p.recYds,  recTDs:  p.recTDs,
    defInt:   p.defInt,   defPBU:   p.defPBU,   defSacks: p.defSacks, defPulls: p.defPulls,
    defFF:    p.defFF,    defFR:    p.defFR,    defTDs:  p.defTDs,  defTFL:  p.defTFL,
    fgMade:   p.fgMade,  punt10: 0, punt5: 0, pancakes: 0,
  }));

  const records = computeRecords(
    HISTORICAL_SEASONS,
    { name: CURRENT_SEASON_NAME, stats: currentStats },
  );

  const groups = [
    { key: "offense", label: "Offense" },
    { key: "defense", label: "Defense" },
    { key: "special", label: "Special Teams" },
  ] as const;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      {/* Header */}
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> All-Time Records
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Single-season bests · Every season since Winter 2020 · Includes {CURRENT_SEASON_NAME}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
        {groups.map(({ key, label }) => {
          const cats = RECORD_CATEGORIES.filter((c) => c.group === key);
          return (
            <section key={key}>
              <h2
                className="font-display font-black text-2xl uppercase tracking-widest mb-6 pb-2 border-b"
                style={{ color: "var(--gold)", borderColor: "var(--border)" }}
              >
                {label}
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cats.map((cat) => {
                  const entries = records[cat.id] ?? [];
                  const top = entries[0];
                  return (
                    <div
                      key={cat.id}
                      className="rounded-lg overflow-hidden"
                      style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
                    >
                      {/* Card header */}
                      <div
                        className="px-4 py-3 border-b"
                        style={{ background: "var(--surface2)", borderColor: "var(--border)" }}
                      >
                        <p className="font-display font-black text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>
                          {cat.label}
                        </p>
                        {top && (
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="font-display font-black text-3xl" style={{ color: "var(--gold)" }}>
                              {top.value.toLocaleString()}
                            </span>
                            <span className="font-semibold text-sm truncate">{top.playerName}</span>
                          </div>
                        )}
                        {top && (
                          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                            {top.seasonName}{top.teamName ? ` · ${top.teamName}` : ""}
                          </p>
                        )}
                        {!top && (
                          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>No data yet</p>
                        )}
                      </div>

                      {/* Runner-ups */}
                      {entries.length > 1 && (
                        <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                          {entries.slice(1).map((entry, i) => (
                            <li
                              key={`${entry.playerName}-${entry.seasonName}`}
                              className="px-4 py-2 flex items-center gap-2"
                            >
                              <span className="text-sm w-4 flex-shrink-0">{medals[i + 1] ?? ""}</span>
                              <span
                                className="font-display font-black text-sm w-12 flex-shrink-0"
                                style={{ color: i === 0 ? "var(--gold)" : "var(--muted)" }}
                              >
                                {entry.value.toLocaleString()}
                              </span>
                              <div className="min-w-0">
                                <span className="font-semibold text-sm leading-tight truncate block">
                                  {entry.playerName}
                                </span>
                                <span className="text-xs truncate block" style={{ color: "var(--muted)" }}>
                                  {entry.seasonName}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      {cat.note && (
                        <div className="px-4 py-2 border-t" style={{ borderColor: "var(--border)" }}>
                          <p className="text-xs italic" style={{ color: "var(--muted)" }}>{cat.note}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <p className="text-xs text-center pb-4" style={{ color: "var(--muted)" }}>
          Single-season records computed from all available historical data · Every season since Winter 2020
        </p>
      </div>
    </div>
  );
}
