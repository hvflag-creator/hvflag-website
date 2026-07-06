import { getCoachAllTimeRecords, TEAM_RECORDS } from "@/lib/team-records";

export const revalidate = 3600;

function groupBySeason() {
  const order: string[] = [];
  const map: Record<string, { seasonName: string; teams: typeof TEAM_RECORDS }> = {};
  for (const r of TEAM_RECORDS) {
    if (!map[r.seasonId]) {
      map[r.seasonId] = { seasonName: r.seasonName, teams: [] };
      order.push(r.seasonId);
    }
    map[r.seasonId].teams.push(r);
  }
  return order.map((id) => map[id]);
}

export default function CoachesPage() {
  const allTime = getCoachAllTimeRecords();
  const seasons = groupBySeason();

  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Coaches
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            All-time records for every HVFF coach · WinterBash 2022 – present
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        {/* All-Time Records */}
        <section>
          <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-4">
            All-Time Records
          </h2>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  <th className="text-left px-4 py-3 font-display font-bold uppercase tracking-wide text-xs">Coach</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs">Seasons</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs">W</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs">L</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs hidden sm:table-cell">PCT</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs hidden md:table-cell">PO W</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs hidden md:table-cell">PO L</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs">Titles</th>
                </tr>
              </thead>
              <tbody>
                {allTime.map((c) => {
                  const g = c.wins + c.losses + c.ties;
                  const pct = g === 0 ? ".000" : (c.wins / g).toFixed(3).replace(/^0/, "");
                  return (
                    <tr
                      key={c.coach}
                      className="border-t transition-colors hover:bg-white/5"
                      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-base">{c.coach}</span>
                          {c.titles > 0 && (
                            <span
                              className="text-xs font-display font-bold px-1.5 py-0.5 rounded"
                              style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}
                            >
                              {c.titles}x champ
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center tabular-nums" style={{ color: "var(--muted)" }}>{c.seasons}</td>
                      <td className="px-3 py-3 text-center font-display font-bold">{c.wins}</td>
                      <td className="px-3 py-3 text-center font-display font-bold">{c.losses}</td>
                      <td className="px-3 py-3 text-center tabular-nums hidden sm:table-cell" style={{ color: "var(--muted)" }}>{pct}</td>
                      <td className="px-3 py-3 text-center tabular-nums hidden md:table-cell" style={{ color: "var(--muted)" }}>{c.playoffWins}</td>
                      <td className="px-3 py-3 text-center tabular-nums hidden md:table-cell" style={{ color: "var(--muted)" }}>{c.playoffLosses}</td>
                      <td className="px-3 py-3 text-center">
                        {c.titles > 0 ? (
                          <span className="font-display font-black" style={{ color: "var(--gold)" }}>{c.titles}</span>
                        ) : (
                          <span style={{ color: "var(--muted)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
            W/L = regular season · PO = playoffs · PCT = Win % · Titles = league championships
          </p>
        </section>

        {/* Season-by-Season */}
        <section>
          <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-6">
            Season by Season
          </h2>
          <div className="space-y-8">
            {seasons.map(({ seasonName, teams }) => (
              <div key={seasonName}>
                <h3
                  className="font-display font-black text-lg uppercase tracking-wide mb-3"
                  style={{ color: "var(--gold)" }}
                >
                  {seasonName}
                </h3>
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "var(--surface2)" }}>
                        <th className="text-left px-4 py-2 font-display font-bold uppercase tracking-wide text-xs">Coach</th>
                        <th className="text-left px-4 py-2 font-display font-bold uppercase tracking-wide text-xs">Team</th>
                        <th className="text-center px-3 py-2 font-display font-bold uppercase tracking-wide text-xs">W</th>
                        <th className="text-center px-3 py-2 font-display font-bold uppercase tracking-wide text-xs">L</th>
                        <th className="text-center px-3 py-2 font-display font-bold uppercase tracking-wide text-xs hidden sm:table-cell">PO W</th>
                        <th className="text-center px-3 py-2 font-display font-bold uppercase tracking-wide text-xs hidden sm:table-cell">PO L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...teams]
                        .sort((a, b) => b.wins - a.wins)
                        .map((t) => (
                          <tr
                            key={t.coach + t.teamName}
                            className="border-t transition-colors hover:bg-white/5"
                            style={{
                              borderColor: "var(--border)",
                              background: t.champion ? "rgba(245,200,66,0.05)" : "var(--surface)",
                            }}
                          >
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold">{t.coach}</span>
                                {t.champion && (
                                  <span
                                    className="text-xs font-display font-bold px-1.5 py-0.5 rounded"
                                    style={{ background: "rgba(245,200,66,0.2)", color: "var(--gold)" }}
                                  >
                                    Champ
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2.5" style={{ color: "var(--muted)" }}>{t.teamName}</td>
                            <td className="px-3 py-2.5 text-center font-display font-bold">{t.wins}</td>
                            <td className="px-3 py-2.5 text-center font-display font-bold">{t.losses}</td>
                            <td className="px-3 py-2.5 text-center tabular-nums hidden sm:table-cell" style={{ color: "var(--muted)" }}>
                              {t.playoffWins ?? "—"}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums hidden sm:table-cell" style={{ color: "var(--muted)" }}>
                              {t.playoffLosses ?? "—"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
