import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { createExpenseRecord } from "@/lib/hq-expense-create";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

type Row = Record<string, unknown> & {
  id: string;
  expenseNumber?: string;
  title?: string;
  amount?: number;
  category?: string;
  vendor?: string;
  spentAt?: number;
  createdAt?: number;
};

function rowText(r: Row): string {
  return [r.expenseNumber, r.title, r.category, r.vendor, String(r.amount)].filter(Boolean).join(" ").toLowerCase();
}

function filterRows(items: Row[], q: ListQuery): Row[] {
  let out = items;
  if (q.search) out = out.filter((r) => rowText(r).includes(q.search));
  if (q.dateFromMs != null || q.dateToMs != null) {
    out = out.filter((r) => {
      const t = Number(r.spentAt) || Number(r.createdAt) || 0;
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
    if (q.sortField === "amount") {
      return dir * ((Number(a.amount) || 0) - (Number(b.amount) || 0));
    }
    if (q.sortField === "title") {
      return dir * String(a.title ?? "").localeCompare(String(b.title ?? ""));
    }
    const ta = Number(a.spentAt) || Number(a.createdAt) || 0;
    const tb = Number(b.spentAt) || Number(b.createdAt) || 0;
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
    const q = parseListQuery(request.nextUrl.searchParams, "spentAt_desc");
    const db = getAdminDatabase();
    const snap = await db.ref("hq/expenses").once("value");
    const val = snap.val() as Record<string, Record<string, unknown>> | null;
    let items: Row[] = val ? Object.keys(val).map((id) => ({ id, ...(val[id] as object) } as Row)) : [];
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
    const title = String(body.title ?? "").trim();
    const amount = Number(body.amount);
    if (!title || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "title and positive amount are required" }, { status: 400 });
    }
    let spentAtMs = Date.now();
    if (body.spentAt) {
      const d = new Date(String(body.spentAt));
      if (!Number.isNaN(d.getTime())) spentAtMs = d.getTime();
    }
    const { id, expenseNumber } = await createExpenseRecord({
      title,
      amount,
      currency: body.currency ? String(body.currency) : "INR",
      category: body.category ? String(body.category).trim() : "",
      vendor: body.vendor ? String(body.vendor).trim() : "",
      notes: body.notes ? String(body.notes) : "",
      spentAtMs,
    });
    const snap = await getAdminDatabase().ref(`hq/expenses/${id}`).once("value");
    return NextResponse.json({ item: { id, expenseNumber, ...(snap.val() as object) } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
