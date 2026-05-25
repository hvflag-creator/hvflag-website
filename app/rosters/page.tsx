import { getTeams, getPlayersByTeam } from "@/lib/firestore";
import TeamLogo from "@/components/TeamLogo";

export const revalidate = 60;

export default async function RostersPage() {
  const teams = await getTeams();

  // Fetch all rosters in parallel
  const rosters = await Promise.all(
    teams.map(async (team) => ({
      team,
      players: await getPlayersByTeam(team.id),
    }))
  );

  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> Rosters
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Winterbash &apos;25–26 Season</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Team anchor links */}
        <div className="flex flex-wrap gap-2 mb-10">
          {teams.map((team) => (
            <a
              key={team.id}
              href={`#${team.slug}`}
              className="px-4 py-1.5 rounded font-display font-semibold text-sm uppercase tracking-wide transition-colors hover:text-white"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
            >
              {team.name}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-10">
          {rosters.map(({ team, players }) => (
            <div key={team.id} id={team.slug} className="scroll-mt-20">
              <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: `2px solid ${team.color}` }}>
                <TeamLogo slug={team.slug} name={team.name} color={team.color} size={44} />
                <div>
                  <h2 className="font-display font-black text-2xl uppercase tracking-wide leading-none">{team.name}</h2>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{players.length} players</span>
                </div>
              </div>

              {players.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--muted)" }}>Roster not yet posted.</p>
              ) : (
                <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "var(--surface2)" }}>
                        <th className="text-left px-4 py-2 font-display font-bold uppercase text-xs tracking-wide w-12">#</th>
                        <th className="text-left px-4 py-2 font-display font-bold uppercase text-xs tracking-wide">Name</th>
                        <th className="text-left px-4 py-2 font-display font-bold uppercase text-xs tracking-wide hidden sm:table-cell">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player, i) => (
                        <tr
                          key={player.id}
                          className="border-t"
                          style={{ borderColor: "var(--border)", background: i % 2 === 0 ? "var(--surface)" : "var(--surface2)" }}
                        >
                          <td className="px-4 py-2 font-display font-bold tabular-nums" style={{ color: "var(--muted)" }}>
                            {player.number ?? "—"}
                          </td>
                          <td className="px-4 py-2 font-semibold">{player.name}</td>
                          <td className="px-4 py-2 text-xs uppercase tracking-wide hidden sm:table-cell" style={{ color: "var(--muted)" }}>
                            {player.position ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
