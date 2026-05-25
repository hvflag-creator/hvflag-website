import { getGames, getTeams } from "@/lib/firestore";
import TeamLogo from "@/components/TeamLogo";

export const revalidate = 60;

export default async function SchedulePage() {
  const [games, teams] = await Promise.all([getGames(), getTeams()]);
  const allWeeks = [...new Set(games.map((g) => g.week))].sort((a, b) => a - b);

  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Schedule
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Winterbash &apos;25–26 Season</p>
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
              The Winterbash schedule will be posted here once finalized.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {allWeeks.map((week) => {
              const weekGames = games.filter((g) => g.week === week);
              return (
                <div key={week}>
                  <h2 className="font-display font-black text-xl uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-sm" style={{ background: "var(--gold)", color: "#0d0f14" }}>
                      Week {week}
                    </span>
                  </h2>
                  <div className="flex flex-col gap-3">
                    {weekGames.map((game) => {
                      const home = teams.find((t) => t.id === game.homeTeamId);
                      const away = teams.find((t) => t.id === game.awayTeamId);
                      const dateObj = new Date(game.date);
                      return (
                        <div
                          key={game.id}
                          className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                        >
                          <div className="text-xs w-36 flex-shrink-0" style={{ color: "var(--muted)" }}>
                            {dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            {" · "}
                            {dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </div>
                          <div className="flex-1 grid grid-cols-3 items-center gap-2 text-center">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-display font-bold text-sm text-right leading-tight">{away?.name}</span>
                              {away && <TeamLogo slug={away.slug} name={away.name} color={away.color} size={28} />}
                            </div>
                            {game.isComplete ? (
                              <div className="font-display font-black text-xl" style={{ color: "var(--gold)" }}>
                                {game.awayScore} &ndash; {game.homeScore}
                              </div>
                            ) : (
                              <div className="font-display font-semibold text-sm uppercase tracking-widest" style={{ color: "var(--muted)" }}>vs</div>
                            )}
                            <div className="flex items-center justify-start gap-2">
                              {home && <TeamLogo slug={home.slug} name={home.name} color={home.color} size={28} />}
                              <span className="font-display font-bold text-sm text-left leading-tight">{home?.name}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {game.isComplete ? (
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
