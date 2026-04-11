import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

export type InstallmentInput = { id?: string; label: string; amount: number; dueOffsetDays?: number };

type Row = Record<string, unknown> & {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  totalAmount?: number;
  updatedAt?: number;
  createdAt?: number;
};

function rowText(r: Row): string {
  return [r.name, r.code, String(r.totalAmount), String(r.description ?? "")].filter(Boolean).join(" ").toLowerCase();
}

function filterRows(items: Row[], q: ListQuery): Row[] {
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

function sortRows(items: Row[], q: ListQuery): Row[] {
  const dir = q.sortDir === "asc" ? 1 : -1;
  const copy = [...items];
  copy.sort((a, b) => {
    if (q.sortField === "name") return dir * String(a.name ?? "").localeCompare(String(b.name ?? ""));
    if (q.sortField === "code") return dir * String(a.code ?? "").localeCompare(String(b.code ?? ""));
    if (q.sortField === "totalAmount") return dir * ((Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0));
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
    const snap = await db.ref("hq/feeStructures").once("value");
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
    const name = String(body.name ?? "").trim();
    const code = String(body.code ?? "").trim().toUpperCase();
    const totalAmount = Number(body.totalAmount);
    if (!name || !code || Number.isNaN(totalAmount)) {
      return NextResponse.json({ error: "Name, code, and totalAmount are required" }, { status: 400 });
    }
    const rawInst = Array.isArray(body.installments) ? body.installments : [];
    const installments: { id: string; label: string; amount: number; dueOffsetDays: number }[] = rawInst.map(
      (x: InstallmentInput, i: number) => ({
        id: typeof x.id === "string" && x.id ? x.id : `inst_${i + 1}`,
        label: String(x.label ?? `Installment ${i + 1}`),
        amount: Number(x.amount) || 0,
        dueOffsetDays: x.dueOffsetDays != null ? Number(x.dueOffsetDays) : 30 * i,
      })
    );
    const db = getAdminDatabase();
    const ref = db.ref("hq/feeStructures").push();
    const id = ref.key!;
    const now = Date.now();
    const payload = {
      id,
      name,
      code,
      description: body.description ? String(body.description) : "",
      totalAmount,
      currency: body.currency ? String(body.currency).toUpperCase() : "INR",
      installments,
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
