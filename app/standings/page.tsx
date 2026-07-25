import { getStandingsFromSportsbook } from "@/lib/sportsbook";
import { getTeams } from "@/lib/firestore";
import TeamLogo from "@/components/TeamLogo";

export const revalidate = 60;

// Map sportsbook team names → slug/color from our teams collection
function getTeamMeta(
  sbName: string,
  teams: { name: string; slug: string; color: string }[]
) {
  return (
    teams.find((t) => t.name.toLowerCase() === sbName.toLowerCase()) ??
    teams.find((t) =>
      sbName.toLowerCase().includes(t.slug.replace(/-/g, " "))
    ) ?? { slug: sbName.toLowerCase().replace(/\s+/g, "-"), color: "#f5c842" }
  );
}

export default async function StandingsPage() {
  const [standings, teams] = await Promise.all([
    getStandingsFromSportsbook(),
    getTeams(),
  ]);

  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Standings
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Summer 2026 Season</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {standings.length === 0 ? (
          <div className="rounded-lg p-12 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Season standings will appear here once games are played.</p>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface2)" }}>
                  <th className="text-left px-4 py-3 font-display font-bold uppercase tracking-wide text-xs w-8">#</th>
                  <th className="text-left px-4 py-3 font-display font-bold uppercase tracking-wide text-xs">Team</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs">W</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs">L</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs">T</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs hidden sm:table-cell">PCT</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs hidden md:table-cell">PF</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs hidden md:table-cell">PA</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs hidden md:table-cell">DIFF</th>
                  <th className="text-center px-3 py-3 font-display font-bold uppercase tracking-wide text-xs hidden sm:table-cell">STRK</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((s, i) => {
                  const meta = getTeamMeta(s.team, teams);
                  const g = s.wins + s.losses + s.ties;
                  const pct = g === 0 ? ".000" : (s.wins / g).toFixed(3).replace(/^0/, "");
                  const diff = s.pointsFor - s.pointsAgainst;
                  return (
                    <tr
                      key={s.team}
                      className="border-t transition-colors hover:bg-white/5"
                      style={{ borderColor: "var(--border)", background: i === 0 ? "rgba(245,200,66,0.05)" : "var(--surface)" }}
                    >
                      <td className="px-4 py-3" style={{ color: i === 0 ? "var(--gold)" : "var(--muted)" }}>{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TeamLogo slug={meta.slug} name={s.team} color={meta.color} size={28} />
                          <span className="font-display font-bold">{s.team}</span>
                          {s.team === "S&S Par-Tee's" && (
                            <span
                              className="text-xs font-display font-bold px-1.5 py-0.5 rounded hidden sm:inline"
                              style={{ background: "rgba(245,200,66,0.2)", color: "var(--gold)" }}
                            >
                              2026 Champs
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-display font-bold">{s.wins}</td>
                      <td className="px-3 py-3 text-center font-display font-bold">{s.losses}</td>
                      <td className="px-3 py-3 text-center font-display font-bold">{s.ties}</td>
                      <td className="px-3 py-3 text-center tabular-nums hidden sm:table-cell" style={{ color: "var(--muted)" }}>{pct}</td>
                      <td className="px-3 py-3 text-center tabular-nums hidden md:table-cell" style={{ color: "var(--muted)" }}>{s.pointsFor}</td>
                      <td className="px-3 py-3 text-center tabular-nums hidden md:table-cell" style={{ color: "var(--muted)" }}>{s.pointsAgainst}</td>
                      <td
                        className="px-3 py-3 text-center tabular-nums hidden md:table-cell font-semibold"
                        style={{ color: diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "var(--muted)" }}
                      >
                        {diff > 0 ? "+" : ""}{diff}
                      </td>
                      <td
                        className="px-3 py-3 text-center font-display font-bold hidden sm:table-cell"
                        style={{
                          color: s.streak.startsWith("W") ? "#22c55e" : s.streak.startsWith("L") ? "#ef4444" : "var(--muted)",
                        }}
                      >
                        {s.streak}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          Live data from HVFF FlagBucks · PCT = Win % · PF = Points For · PA = Points Against · DIFF = Point Differential
        </p>
      </div>
    </div>
  );
}
