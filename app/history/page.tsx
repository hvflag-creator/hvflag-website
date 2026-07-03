import { HISTORICAL_SEASONS } from "@/lib/historical-stats";
import HistoricalRostersClient from "@/components/HistoricalRostersClient";

export const revalidate = 3600;

export default function HistoryPage() {
  return (
    <div>
      <div className="border-b py-10" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display font-black text-5xl uppercase tracking-tight">
            <span style={{ color: "var(--gold)" }}>—</span> History
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Team rosters from every HVFF season
          </p>
        </div>
      </div>

      <HistoricalRostersClient seasons={HISTORICAL_SEASONS} />
    </div>
  );
}
