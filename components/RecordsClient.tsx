"use client";

import { useState } from "react";
import type { SeasonRecords, RecordCategory } from "@/lib/records";

type Tab = "all" | "regular" | "playoff";

const TAB_LABELS: Record<Tab, string> = {
  all:     "All-Time",
  regular: "Regular Season",
  playoff: "Playoffs",
};

const medals = ["🥇", "🥈", "🥉"];

type Props = {
  allRecords:     SeasonRecords;
  regularRecords: SeasonRecords;
  playoffRecords: SeasonRecords;
  categories: RecordCategory[];
};

export default function RecordsClient({ allRecords, regularRecords, playoffRecords, categories }: Props) {
  const [tab, setTab] = useState<Tab>("all");

  const records =
    tab === "regular" ? regularRecords :
    tab === "playoff" ? playoffRecords :
    allRecords;

  const groups = [
    { key: "offense" as const, label: "Offense" },
    { key: "defense" as const, label: "Defense" },
    { key: "special" as const, label: "Special Teams" },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-4 flex gap-1 pt-2">
          {(["all", "regular", "playoff"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 font-display font-bold text-xs uppercase tracking-widest rounded-t transition-colors"
              style={{
                color:      tab === t ? "var(--gold)" : "var(--muted)",
                background: tab === t ? "var(--surface2)" : "transparent",
                borderBottom: tab === t ? "2px solid var(--gold)" : "2px solid transparent",
              }}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
        {groups.map(({ key, label }) => {
          const cats = categories.filter((c) => c.group === key);
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
                        {top ? (
                          <>
                            <div className="mt-1 flex items-baseline gap-2">
                              <span className="font-display font-black text-3xl" style={{ color: "var(--gold)" }}>
                                {top.value.toLocaleString()}
                              </span>
                              <span className="font-semibold text-sm truncate">{top.playerName}</span>
                            </div>
                            <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
                              {top.seasonName}{top.teamName ? ` · ${top.teamName}` : ""}
                            </p>
                          </>
                        ) : (
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
    </>
  );
}
