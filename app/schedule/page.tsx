import { getAllGames } from "@/lib/sportsbook";
import { getTeams } from "@/lib/firestore";
import TeamLogo from "@/components/TeamLogo";

export const revalidate = 60;

function getTeamMeta(
  sbName: string,
  teams: { name: string; slug: string; color: string }[]
) {
  return (
    teams.find((t) => t.name.toLowerCase() === sbName.toLowerCase()) ??
    teams.find((t) => sbName.toLowerCase().includes(t.slug.replace(/-/g, " "))) ??
    { slug: sbName.toLowerCase().replace(/\s+/g, "-"), color: "#f5c842" }
  );
}

function weekLabel(weekId: string): string {
  const num = weekId.match(/\d+/)?.[0];
  return num ? `Week ${num}` : weekId;
}

export default async function SchedulePage() {
  const [games, teams] = await Promise.all([getAllGames(), getTeams()]);

  // Group by weekId, preserving order from first kickoff in each week
  const weekMap = new Map<string, typeof games>();
  for (const g of games) {
    if (!weekMap.has(g.weekId)) weekMap.set(g.weekId, []);
    weekMap.get(g.weekId)!.push(g);
  }

  // Sort weeks by the earliest kickoff in that week
  const weeks = [...weekMap.entries()].sort(([, a], [, b]) => {
    const aFirst = a[0]?.kickoff ?? "";
    const bFirst = b[0]?.kickoff ?? "";
    return aFirst.localeCompare(bFirst);
  });

  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Schedule
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Summer 2026 Season</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {games.length === 0 ? (
          <div
            className="rounded-lg p-12 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="font-display font-black text-2xl uppercase mb-2" style={{ color: "var(--gold)" }}>Coming Soon</div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              The Summer 2026 schedule will be posted here once finalized.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {weeks.map(([weekId, weekGames]) => (
              <div key={weekId}>
                <h2 className="font-display font-black text-xl uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-sm" style={{ background: "var(--gold)", color: "#0d0f14" }}>
                    {weekLabel(weekId)}
                  </span>
                </h2>
                <div className="flex flex-col gap-3">
                  {weekGames.map((game) => {
                    const home = getTeamMeta(game.homeTeam, teams);
                    const away = getTeamMeta(game.awayTeam, teams);
                    const isSettled = game.status === "settled";
                    const isLive = game.status === "live";
                    const kickoff = game.kickoff ? new Date(game.kickoff) : null;

                    return (
                      <div
                        key={game.id}
                        className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                        style={{ background: "var(--surface)", border: `1px solid ${isLive ? "var(--gold)" : "var(--border)"}` }}
                      >
                        {/* Date / time */}
                        <div className="text-xs w-36 flex-shrink-0" style={{ color: "var(--muted)" }}>
                          {kickoff ? (
                            <>
                              {kickoff.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York" })}
                              {" · "}
                              {kickoff.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })}
                            </>
                          ) : (
                            "TBD"
                          )}
                        </div>

                        {/* Matchup */}
                        <div className="flex-1 grid grid-cols-3 items-center gap-2 text-center">
                          {/* Away */}
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-display font-bold text-sm text-right leading-tight">{game.awayTeam}</span>
                            <TeamLogo slug={away.slug} name={game.awayTeam} color={away.color} size={28} />
                          </div>

                          {/* Score or vs */}
                          {isSettled && game.result ? (
                            <div className="font-display font-black text-xl" style={{ color: "var(--gold)" }}>
                              {game.result.awayScore} &ndash; {game.result.homeScore}
                            </div>
                          ) : isLive ? (
                            <div className="font-display font-black text-sm animate-pulse" style={{ color: "var(--gold)" }}>
                              LIVE
                            </div>
                          ) : (
                            <div className="font-display font-semibold text-sm uppercase tracking-widest" style={{ color: "var(--muted)" }}>vs</div>
                          )}

                          {/* Home */}
                          <div className="flex items-center justify-start gap-2">
                            <TeamLogo slug={home.slug} name={game.homeTeam} color={home.color} size={28} />
                            <span className="font-display font-bold text-sm text-left leading-tight">{game.homeTeam}</span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex-shrink-0">
                          {isLive ? (
                            <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase animate-pulse" style={{ background: "rgba(245,200,66,0.2)", color: "var(--gold)" }}>Live</span>
                          ) : isSettled ? (
                            <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase" style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}>Final</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase" style={{ background: "rgba(255,255,255,0.05)", color: "var(--muted)" }}>Upcoming</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
