import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { notifyByEmail, parseContactInput } from "@/lib/contact";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: real people never see/fill this field, bots do. Pretend it worked.
  if (body && typeof body === "object" && (body as Record<string, unknown>).company) {
    return NextResponse.json({ ok: true });
  }

  const input = parseContactInput(body);
  if (!input) return NextResponse.json({ error: "Please fill out the required fields." }, { status: 400 });

  try {
    await getAdminDb().collection("contactSubmissions").add({
      ...input,
      handled: false,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error("[contact] save failed", e);
    return NextResponse.json({ error: "Something went wrong saving your message. Please try again." }, { status: 500 });
  }

  const email = await notifyByEmail(input);
  if (email === "failed") console.error("[contact] email notification failed");
  return NextResponse.json({ ok: true });
}
