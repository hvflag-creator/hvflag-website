import Link from "next/link";
import { getTeams } from "@/lib/firestore";
import { getAllGames } from "@/lib/sportsbook";
import TeamLogo from "@/components/TeamLogo";
import SponsorsSection from "@/components/SponsorsSection";
import PlayoffBracket from "@/components/PlayoffBracket";

export const revalidate = 60; // refresh data every 60 seconds

export default async function HomePage() {
  const [teams, allGames] = await Promise.all([getTeams(), getAllGames()]);

  // Build a map of weekId → sequential week number (sorted chronologically)
  const weekIds = [...new Set(allGames.map((g) => g.weekId))].sort((a, b) => {
    const aKick = allGames.find((g) => g.weekId === a)?.kickoff ?? "";
    const bKick = allGames.find((g) => g.weekId === b)?.kickoff ?? "";
    return aKick.localeCompare(bKick);
  });
  const weekNumber = (weekId: string) => `Week ${weekIds.indexOf(weekId) + 1}`;

  const upcomingGames = allGames.filter((g) => g.status === "open" || g.status === "live").slice(0, 3);
  const recentGames = allGames.filter((g) => g.status === "settled").slice(-3).reverse();

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0d0f14 0%, #1a1f2e 50%, #0d0f14 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "var(--gold)" }} />

        <div className="max-w-6xl mx-auto px-4 text-center flex flex-col items-center gap-2 py-4">
          <div
            className="inline-block px-4 py-1 rounded-full text-xs font-display font-semibold uppercase tracking-widest"
            style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)", border: "1px solid rgba(245,200,66,0.3)" }}
          >
            Summer 2026 · Season Complete
          </div>

          <img
            src="/hvff-logo.png"
            alt="HVFF – Hudson Valley Flag Football"
            className="w-56 sm:w-72 md:w-[380px] block drop-shadow-2xl"
            style={{ objectFit: "contain" }}
          />

          <div>
            <p className="text-base sm:text-lg font-display font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
              Hudson Valley Flag Football
            </p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Beacon, NY · Est. 2019 · Non-profit community league
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/schedule"
              className="px-6 py-3 rounded font-display font-bold text-sm uppercase tracking-wide transition-transform hover:scale-105"
              style={{ background: "var(--gold)", color: "#0d0f14" }}
            >
              View Schedule
            </Link>
            <Link
              href="/standings"
              className="px-6 py-3 rounded font-display font-bold text-sm uppercase tracking-wide transition-transform hover:scale-105"
              style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              Standings
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded font-display font-bold text-sm uppercase tracking-wide transition-transform hover:scale-105"
              style={{ background: "transparent", color: "var(--gold)", border: "1px solid rgba(245,200,66,0.4)" }}
            >
              Join the League
            </Link>
          </div>
        </div>
      </section>

      {/* Champion banner */}
      <section
        className="py-8 border-b text-center"
        style={{
          background: "linear-gradient(135deg, rgba(245,200,66,0.1) 0%, rgba(245,200,66,0.04) 100%)",
          borderColor: "rgba(245,200,66,0.25)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="inline-block px-3 py-0.5 rounded-full text-xs font-display font-bold uppercase tracking-widest mb-2"
            style={{ background: "rgba(245,200,66,0.2)", color: "var(--gold)", border: "1px solid rgba(245,200,66,0.4)" }}
          >
            Summer 2026 Champions
          </div>
          <div className="font-display font-black text-5xl uppercase tracking-tight">
            S&amp;S Par-Tee&apos;s
          </div>
          <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Coach Jack · 3&times; HVFF Champion
          </div>
        </div>
      </section>

      {/* Playoff bracket */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <PlayoffBracket />
      </div>

      {/* Season snapshot */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Teams", value: String(teams.length), sub: "Summer 2026" },
            { label: "Seasons", value: "6+", sub: "Years of competition" },
            { label: "Location", value: "Beacon", sub: "New York" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-6 text-center"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="font-display font-black text-4xl" style={{ color: "var(--gold)" }}>
                {stat.value}
              </div>
              <div className="font-display font-bold text-lg uppercase tracking-wide mt-1">{stat.label}</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Teams grid */}
        <div className="mb-16">
          <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-6 flex items-center gap-3">
            <span style={{ color: "var(--gold)" }}>—</span> Teams
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {teams.map((team) => (
              <Link
                key={team.id}
                href={`/rosters#${team.slug}`}
                className="rounded-lg p-4 flex flex-col items-center gap-2 text-center transition-transform hover:scale-[1.02]"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                <TeamLogo slug={team.slug} name={team.name} color={team.color} size={56} />
                <span className="font-display font-bold text-xs uppercase tracking-wide leading-tight">{team.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Games preview */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-4 flex items-center gap-3">
              <span style={{ color: "var(--gold)" }}>—</span> Upcoming Games
            </h2>
            {upcomingGames.length === 0 ? (
              <div
                className="rounded-lg p-6 text-center text-sm"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
              >
                Schedule coming soon
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {upcomingGames.map((game) => {
                  const kickoff = game.kickoff ? new Date(game.kickoff) : null;
                  return (
                    <div key={game.id} className="rounded-lg p-4" style={{ background: "var(--surface)", border: `1px solid ${game.status === "live" ? "var(--gold)" : "var(--border)"}` }}>
                      <div className="text-xs mb-2 flex items-center gap-2" style={{ color: "var(--muted)" }}>
                        <span>{weekNumber(game.weekId)}</span>
                        {kickoff && (
                          <>
                            <span>&middot;</span>
                            <span>{kickoff.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "America/New_York" })}</span>
                          </>
                        )}
                        {game.status === "live" && (
                          <span className="px-1.5 py-0.5 rounded text-xs font-bold uppercase animate-pulse" style={{ background: "rgba(245,200,66,0.2)", color: "var(--gold)" }}>Live</span>
                        )}
                      </div>
                      <div className="font-display font-bold text-base">
                        {game.awayTeam} <span style={{ color: "var(--muted)" }}>vs</span> {game.homeTeam}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Link href="/schedule" className="inline-block mt-3 text-sm font-semibold" style={{ color: "var(--gold)" }}>
              Full schedule →
            </Link>
          </div>

          <div>
            <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-4 flex items-center gap-3">
              <span style={{ color: "var(--gold)" }}>—</span> Recent Results
            </h2>
            {recentGames.length === 0 ? (
              <div
                className="rounded-lg p-6 text-center text-sm"
                style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
              >
                No results yet
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {recentGames.map((game) => (
                  <div key={game.id} className="rounded-lg p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>{weekNumber(game.weekId)} · Final</div>
                    <div className="flex items-center justify-between font-display font-bold text-base">
                      <span className="truncate flex-1">{game.awayTeam}</span>
                      <span className="tabular-nums px-3 flex-shrink-0" style={{ color: "var(--gold)" }}>
                        {game.result?.awayScore} &ndash; {game.result?.homeScore}
                      </span>
                      <span className="truncate flex-1 text-right">{game.homeTeam}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/standings" className="inline-block mt-3 text-sm font-semibold" style={{ color: "var(--gold)" }}>
              Full standings →
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <SponsorsSection />

      {/* About blurb */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="font-display font-black text-3xl uppercase tracking-wide mb-3">
              Building the <span style={{ color: "var(--gold)" }}>Flag Family</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              HVFF is a non-profit sports league based in Beacon, NY, dedicated to providing a platform
              for athletes and building community. We run two seasons a year — summer and winter — and
              are proud to partner with the local businesses that are the backbone of our community.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/about"
              className="px-5 py-2.5 rounded font-display font-bold text-sm uppercase tracking-wide"
              style={{ background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
            >
              About Us
            </Link>
            <a
              href="https://www.instagram.com/hvflag/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded font-display font-bold text-sm uppercase tracking-wide"
              style={{ background: "var(--gold)", color: "#0d0f14" }}
            >
              @hvflagfootball
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
