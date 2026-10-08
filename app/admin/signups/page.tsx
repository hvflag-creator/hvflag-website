"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactSubmission } from "@/lib/contact";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "player", label: "Players" },
  { id: "sponsor", label: "Sponsors" },
  { id: "media", label: "Media" },
  { id: "general", label: "Questions" },
] as const;

const TYPE_LABEL: Record<string, string> = {
  player: "Wants to play",
  sponsor: "Sponsor",
  media: "Media",
  general: "Question",
};

const HIGH_DEMAND = new Set(["QB", "OL", "DL"]);

function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function AdminSignupsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  useEffect(() => {
    fetch("/api/admin/signups")
      .then(async (r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        if (!r.ok) throw new Error("Couldn't load sign-ups.");
        return r.json();
      })
      .then((data) => { if (data) setRows(data.submissions); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  async function setHandled(id: string, handled: boolean) {
    setRows((cur) => cur.map((r) => (r.id === id ? { ...r, handled } : r)));
    const res = await fetch("/api/admin/signups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, handled }),
    });
    if (!res.ok) setRows((cur) => cur.map((r) => (r.id === id ? { ...r, handled: !handled } : r)));
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete the sign-up from ${name}? This can't be undone.`)) return;
    const res = await fetch("/api/admin/signups", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setRows((cur) => cur.filter((r) => r.id !== id));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const newCount = rows.filter((r) => !r.handled).length;
  const shown = useMemo(
    () => rows.filter((r) => (filter === "all" ? true : filter === "new" ? !r.handled : r.subject === filter)),
    [rows, filter]
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div>
          <h1 className="font-display font-black text-xl uppercase tracking-wide" style={{ color: "var(--gold)" }}>Sign-ups</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {rows.length} total · {newCount} new
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded" style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
            ← Shop Manager
          </a>
          <button onClick={logout} className="text-xs px-3 py-1.5 rounded" style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
            Log Out
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="text-xs px-3 py-1.5 rounded font-semibold"
              style={{
                background: filter === f.id ? "var(--gold)" : "var(--surface2)",
                color: filter === f.id ? "#0d0f14" : "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: "var(--muted)" }}>Loading sign-ups...</div>
        ) : error ? (
          <div className="text-center py-20" style={{ color: "#f87171" }}>{error}</div>
        ) : shown.length === 0 ? (
          <div className="text-center py-20" style={{ color: "var(--muted)" }}>
            {rows.length === 0 ? "No sign-ups yet. They'll show up here when someone fills out the Join the League form." : "Nothing in this view."}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {shown.map((r) => (
              <div
                key={r.id}
                className="rounded-lg p-4"
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${r.handled ? "var(--border)" : "rgba(245,200,66,0.45)"}`,
                  opacity: r.handled ? 0.7 : 1,
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-black text-lg">{r.name}</span>
                      <span className="text-[10px] font-display font-bold uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ background: "rgba(245,200,66,0.15)", color: "var(--gold)" }}>
                        {TYPE_LABEL[r.subject] ?? r.subject}
                      </span>
                      {!r.handled && (
                        <span className="text-[10px] font-display font-bold uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ background: "var(--gold)", color: "#0d0f14" }}>New</span>
                      )}
                    </div>
                    <div className="text-sm mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <a href={`mailto:${r.email}`} className="hover:underline" style={{ color: "var(--gold)" }}>{r.email}</a>
                      {r.phone ? (
                        <a href={`tel:${r.phone}`} className="hover:underline" style={{ color: "var(--gold)" }}>{r.phone}</a>
                      ) : (
                        <span style={{ color: "var(--muted)" }}>no phone given</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{fmtDate(r.createdAt)}</span>
                    <button
                      onClick={() => setHandled(r.id, !r.handled)}
                      className="text-xs px-3 py-1.5 rounded font-semibold"
                      style={{ background: r.handled ? "var(--surface2)" : "var(--gold)", color: r.handled ? "var(--text)" : "#0d0f14", border: "1px solid var(--border)" }}
                    >
                      {r.handled ? "Mark as new" : "Mark handled ✓"}
                    </button>
                    <button
                      onClick={() => remove(r.id, r.name)}
                      title="Delete this sign-up"
                      className="text-xs px-2.5 py-1.5 rounded"
                      style={{ color: "#f87171", border: "1px solid var(--border)" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {r.subject === "player" && r.positions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {r.positions.map((p) => (
                      <span
                        key={p}
                        className="text-xs font-display font-bold px-2 py-0.5 rounded"
                        style={HIGH_DEMAND.has(p) ? { background: "var(--gold)", color: "#0d0f14" } : { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" }}
                      >
                        {p}{HIGH_DEMAND.has(p) ? " 🔥" : ""}
                      </span>
                    ))}
                  </div>
                )}

                {r.subject === "sponsor" && (r.business.name || r.business.type || r.business.link) && (
                  <div className="text-sm mt-3 rounded p-3" style={{ background: "var(--surface2)" }}>
                    <div><span style={{ color: "var(--muted)" }}>Business: </span><b>{r.business.name || "—"}</b></div>
                    {r.business.type && <div><span style={{ color: "var(--muted)" }}>What they do: </span>{r.business.type}</div>}
                    {r.business.link && <div><span style={{ color: "var(--muted)" }}>Website / IG: </span>{r.business.link}</div>}
                  </div>
                )}

                {r.subject === "media" && r.mediaLink && (
                  <div className="text-sm mt-3"><span style={{ color: "var(--muted)" }}>Their work: </span>{r.mediaLink}</div>
                )}

                <p className="text-sm mt-3 whitespace-pre-wrap" style={{ color: "var(--text)" }}>{r.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
