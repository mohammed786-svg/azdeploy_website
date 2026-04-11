import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

type Row = Record<string, unknown> & {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: string;
  studentId?: string;
  createdAt?: number;
};

function rowText(r: Row): string {
  return [r.fullName, r.email, r.phone, r.status].filter(Boolean).join(" ").toLowerCase();
}

function filterRows(items: Row[], q: ListQuery): Row[] {
  let out = items;
  if (q.studentId) out = out.filter((r) => String(r.studentId ?? "") === q.studentId);
  if (q.search) out = out.filter((r) => rowText(r).includes(q.search));
  if (q.dateFromMs != null || q.dateToMs != null) {
    out = out.filter((r) => {
      const t = Number(r.createdAt) || 0;
      if (!t) return false;
      if (q.dateFromMs != null && t < q.dateFromMs) return false;
      if (q.dateToMs != null && t > q.dateToMs) return false;
      return true;
    });
  }
  return out;
}

function sortRows(items: Row[], q: ListQuery): Row[] {
  const dir = q.sortDir === "asc" ? 1 : -1;
  const copy = [...items];
  copy.sort((a, b) => {
    if (q.sortField === "fullName") return dir * String(a.fullName ?? "").localeCompare(String(b.fullName ?? ""));
    if (q.sortField === "email") return dir * String(a.email ?? "").localeCompare(String(b.email ?? ""));
    const ta = Number(a.createdAt) || 0;
    const tb = Number(b.createdAt) || 0;
    return dir * (ta - tb);
  });
  return copy;
}

export async function GET(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ items: [], total: 0, page: 1, pageSize: 20, totalPages: 1 });
  }
  try {
    const q = parseListQuery(request.nextUrl.searchParams, "createdAt_desc");
    const db = getAdminDatabase();
    const snap = await db.ref("hq/onboarding").once("value");
    const val = snap.val() as Record<string, Record<string, unknown>> | null;
    let items: Row[] = val
      ? Object.keys(val).map((id) => ({ id, ...(val[id] as object) } as Row))
      : [];
    items = filterRows(items, q);
    items = sortRows(items, q);
    return NextResponse.json(paginateSlice(items, q));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const batchId = String(body.batchId ?? "").trim();
    if (!fullName || !email || !phone || !batchId) {
      return NextResponse.json({ error: "Full name, email, phone, and batch are required" }, { status: 400 });
    }
    const db = getAdminDatabase();
    const ref = db.ref("hq/onboarding").push();
    const id = ref.key!;
    const now = Date.now();
    const payload = {
      id,
      fullName,
      email,
      phone,
      batchId,
      feeStructureId: body.feeStructureId ? String(body.feeStructureId) : null,
      degree: body.degree ? String(body.degree) : "",
      college: body.college ? String(body.college) : "",
      gender: body.gender !== undefined && body.gender !== null ? String(body.gender).trim() : "",
      notes: body.notes ? String(body.notes) : "",
      status: "pending",
      createdAt: now,
      studentId: null as string | null,
    };
    await ref.set(payload);
    return NextResponse.json({ item: payload });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
