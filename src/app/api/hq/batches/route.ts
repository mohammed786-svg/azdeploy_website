import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { createdMs, parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

type BatchRow = Record<string, unknown> & { id: string; name?: string; code?: string; updatedAt?: number; createdAt?: number; notes?: string };

function rowText(r: BatchRow): string {
  return [r.name, r.code, r.notes].filter(Boolean).join(" ").toLowerCase();
}

function filterBatches(items: BatchRow[], q: ListQuery): BatchRow[] {
  let out = items;
  if (q.search) out = out.filter((r) => rowText(r).includes(q.search));
  if (q.dateFromMs != null || q.dateToMs != null) {
    out = out.filter((r) => {
      const t = Number(r.updatedAt) || Number(r.createdAt) || 0;
      if (!t) return false;
      if (q.dateFromMs != null && t < q.dateFromMs) return false;
      if (q.dateToMs != null && t > q.dateToMs) return false;
      return true;
    });
  }
  return out;
}

function sortBatches(items: BatchRow[], q: ListQuery): BatchRow[] {
  const dir = q.sortDir === "asc" ? 1 : -1;
  const copy = [...items];
  copy.sort((a, b) => {
    if (q.sortField === "name") return dir * String(a.name ?? "").localeCompare(String(b.name ?? ""));
    if (q.sortField === "code") return dir * String(a.code ?? "").localeCompare(String(b.code ?? ""));
    const ta = Number(a.updatedAt) || Number(a.createdAt) || 0;
    const tb = Number(b.updatedAt) || Number(b.createdAt) || 0;
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
    const q = parseListQuery(request.nextUrl.searchParams, "updatedAt_desc");
    const db = getAdminDatabase();
    const snap = await db.ref("hq/batches").once("value");
    const val = snap.val() as Record<string, Record<string, unknown>> | null;
    let items: BatchRow[] = val
      ? Object.keys(val).map((id) => ({ id, ...(val[id] as object) } as BatchRow))
      : [];
    items = filterBatches(items, q);
    items = sortBatches(items, q);
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
    const name = String(body.name ?? "").trim();
    const code = String(body.code ?? "").trim().toUpperCase();
    if (!name || !code) {
      return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
    }
    const db = getAdminDatabase();
    const ref = db.ref("hq/batches").push();
    const id = ref.key!;
    const now = Date.now();
    const payload = {
      id,
      name,
      code,
      startDate: body.startDate ? String(body.startDate) : "",
      endDate: body.endDate ? String(body.endDate) : "",
      capacity: body.capacity != null ? Number(body.capacity) : null,
      notes: body.notes ? String(body.notes) : "",
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(payload);
    return NextResponse.json({ item: payload });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
