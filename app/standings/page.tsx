import { getStandings } from "@/lib/firestore";
import TeamLogo from "@/components/TeamLogo";

export const revalidate = 60;

export default async function StandingsPage() {
  const teams = await getStandings();

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
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => {
                const games = team.wins + team.losses + team.ties;
                const pct = games === 0 ? ".000" : (team.wins / games).toFixed(3).replace(/^0/, "");
                const diff = team.pointsFor - team.pointsAgainst;
                return (
                  <tr
                    key={team.id}
                    className="border-t transition-colors hover:bg-white/5"
                    style={{ borderColor: "var(--border)", background: i === 0 ? "rgba(245,200,66,0.05)" : "var(--surface)" }}
                  >
                    <td className="px-4 py-3" style={{ color: i === 0 ? "var(--gold)" : "var(--muted)" }}>{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <TeamLogo slug={team.slug} name={team.name} color={team.color} size={28} />
                        <span className="font-display font-bold">{team.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center font-display font-bold">{team.wins}</td>
                    <td className="px-3 py-3 text-center font-display font-bold">{team.losses}</td>
                    <td className="px-3 py-3 text-center font-display font-bold">{team.ties}</td>
                    <td className="px-3 py-3 text-center tabular-nums hidden sm:table-cell" style={{ color: "var(--muted)" }}>{pct}</td>
                    <td className="px-3 py-3 text-center tabular-nums hidden md:table-cell" style={{ color: "var(--muted)" }}>{team.pointsFor}</td>
                    <td className="px-3 py-3 text-center tabular-nums hidden md:table-cell" style={{ color: "var(--muted)" }}>{team.pointsAgainst}</td>
                    <td
                      className="px-3 py-3 text-center tabular-nums hidden md:table-cell font-semibold"
                      style={{ color: diff > 0 ? "#22c55e" : diff < 0 ? "#ef4444" : "var(--muted)" }}
                    >
                      {diff > 0 ? "+" : ""}{diff}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          PCT = Win percentage · PF = Points for · PA = Points against · DIFF = Point differential
        </p>
      </div>
    </div>
  );
}
