// Contact / join-the-league form submissions.
// Saved to the `contactSubmissions` collection (Firestore, via the admin SDK — the
// collection is locked to clients in firestore.rules) and emailed to the league.

export const SUBJECTS = ["player", "sponsor", "general", "media"] as const;
export type Subject = (typeof SUBJECTS)[number];
export const POSITION_CODES = ["QB", "OL", "DL", "WR", "RB", "CB", "S"] as const;

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  subject: Subject;
  message: string;
  positions: string[];
  business: { name: string; type: string; link: string };
  mediaLink: string;
};

export type ContactSubmission = ContactInput & {
  id: string;
  createdAt: string; // ISO
  handled: boolean;
};

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Validate + normalise an untrusted request body. Returns null if it isn't a real submission. */
export function parseContactInput(body: unknown): ContactInput | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const subject = SUBJECTS.find((s) => s === b.subject);
  const name = clip(b.name, 100);
  const email = clip(b.email, 200);
  const message = clip(b.message, 4000);
  if (!subject || !name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  const biz = (b.business && typeof b.business === "object" ? b.business : {}) as Record<string, unknown>;
  const positions = Array.isArray(b.positions)
    ? [...new Set(b.positions.filter((p): p is string => typeof p === "string" && (POSITION_CODES as readonly string[]).includes(p)))]
    : [];
  return {
    name,
    email,
    phone: clip(b.phone, 40),
    subject,
    message,
    positions: subject === "player" ? positions : [],
    business: subject === "sponsor"
      ? { name: clip(biz.name, 200), type: clip(biz.type, 200), link: clip(biz.link, 300) }
      : { name: "", type: "", link: "" },
    mediaLink: subject === "media" ? clip(b.mediaLink, 300) : "",
  };
}

const SUBJECT_LABEL: Record<Subject, string> = {
  player: "Wants to play",
  sponsor: "Sponsorship inquiry",
  general: "General question",
  media: "Media / photography",
};

/** Plain-text body for the alert email. */
export function emailText(s: ContactInput): string {
  const lines = [
    `${SUBJECT_LABEL[s.subject]}`,
    "",
    `Name:  ${s.name}`,
    `Email: ${s.email}`,
    `Phone: ${s.phone || "(not given)"}`,
  ];
  if (s.subject === "player") lines.push(`Positions: ${s.positions.join(", ") || "(none picked)"}`);
  if (s.subject === "sponsor") {
    lines.push(`Business: ${s.business.name}`, `What they do: ${s.business.type || "-"}`, `Website/IG: ${s.business.link || "-"}`);
  }
  if (s.subject === "media" && s.mediaLink) lines.push(`Work: ${s.mediaLink}`);
  lines.push("", s.message, "", "— View and manage all sign-ups: https://hvflag.com/admin/signups");
  return lines.join("\n");
}

export const NOTIFY_TO = "hvflag@gmail.com";

/**
 * Email the league. Uses Resend when RESEND_API_KEY is set; otherwise does nothing
 * (the submission is still saved and visible in the admin Sign-ups page).
 * Never throws — an email hiccup must not lose the submission.
 */
export async function notifyByEmail(s: ContactInput): Promise<"sent" | "skipped" | "failed"> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "skipped";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "HVFF Website <onboarding@resend.dev>",
        to: [NOTIFY_TO],
        reply_to: s.email,
        subject: `New HVFF sign-up: ${SUBJECT_LABEL[s.subject]} — ${s.name}`,
        text: emailText(s),
      }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
