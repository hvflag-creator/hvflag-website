import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import type { ContactSubmission } from "@/lib/contact";

// proxy.ts already guards /api/admin/*, but check again so this route is safe on its own.
function isAdmin(req: NextRequest) {
  const token = req.cookies.get("hvff_admin")?.value;
  return !!token && token === btoa(process.env.ADMIN_PASSWORD ?? "") && !!process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snap = await getAdminDb().collection("contactSubmissions").orderBy("createdAt", "desc").limit(500).get();
  const submissions: ContactSubmission[] = snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      name: x.name ?? "",
      email: x.email ?? "",
      phone: x.phone ?? "",
      subject: x.subject ?? "general",
      message: x.message ?? "",
      positions: x.positions ?? [],
      business: x.business ?? { name: "", type: "", link: "" },
      mediaLink: x.mediaLink ?? "",
      handled: !!x.handled,
      createdAt: x.createdAt?.toDate?.().toISOString() ?? "",
    };
  });
  return NextResponse.json({ submissions });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, handled } = await req.json();
  if (typeof id !== "string" || typeof handled !== "boolean") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  await getAdminDb().collection("contactSubmissions").doc(id).update({ handled });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (typeof id !== "string" || !id) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  await getAdminDb().collection("contactSubmissions").doc(id).delete();
  return NextResponse.json({ ok: true });
}
