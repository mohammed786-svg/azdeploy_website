import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { createReceiptRecord } from "@/lib/hq-receipt-create";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

type Row = Record<string, unknown> & {
  id: string;
  receiptNumber?: string;
  studentId?: string;
  studentName?: string;
  amount?: number;
  purpose?: string;
  receivedAt?: number;
  createdAt?: number;
};

function rowText(r: Row): string {
  return [r.receiptNumber, r.studentName, r.purpose, String(r.amount)].filter(Boolean).join(" ").toLowerCase();
}

function filterRows(items: Row[], q: ListQuery): Row[] {
  let out = items;
  if (q.studentId) out = out.filter((r) => String(r.studentId ?? "") === q.studentId);
  if (q.search) out = out.filter((r) => rowText(r).includes(q.search));
  if (q.dateFromMs != null || q.dateToMs != null) {
    out = out.filter((r) => {
      const t = Number(r.receivedAt) || Number(r.createdAt) || 0;
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
    if (q.sortField === "total" || q.sortField === "totalAmount") {
      return dir * ((Number(a.amount) || 0) - (Number(b.amount) || 0));
    }
    if (q.sortField === "fullName" || q.sortField === "studentName") {
      return dir * String(a.studentName ?? "").localeCompare(String(b.studentName ?? ""));
    }
    const ta = Number(a.receivedAt) || Number(a.createdAt) || 0;
    const tb = Number(b.receivedAt) || Number(b.createdAt) || 0;
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
    const q = parseListQuery(request.nextUrl.searchParams, "receivedAt_desc");
    const db = getAdminDatabase();
    const snap = await db.ref("hq/receipts").once("value");
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
    const studentId = String(body.studentId ?? "").trim();
    const amount = Number(body.amount);
    const purpose = String(body.purpose ?? "Fee payment").trim();
    if (!studentId || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "studentId and positive amount are required" }, { status: 400 });
    }
    const db = getAdminDatabase();
    const stSnap = await db.ref(`hq/students/${studentId}`).once("value");
    if (!stSnap.exists()) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    const st = stSnap.val() as { fullName?: string };
    const studentName = String(st.fullName ?? "");
    let receivedAtMs = Date.now();
    if (body.receivedAt) {
      const d = new Date(String(body.receivedAt));
      if (!Number.isNaN(d.getTime())) receivedAtMs = d.getTime();
    }
    const { id, receiptNumber } = await createReceiptRecord({
      studentId,
      studentName,
      amount,
      currency: body.currency ? String(body.currency) : "INR",
      purpose,
      paymentMethod: body.paymentMethod ? String(body.paymentMethod) : "",
      invoiceId: body.invoiceId ? String(body.invoiceId) : null,
      installmentId: body.installmentId ? String(body.installmentId) : null,
      notes: body.notes ? String(body.notes) : "",
      receivedAtMs,
    });
    const snap = await db.ref(`hq/receipts/${id}`).once("value");
    const payload = snap.val();
    return NextResponse.json({ item: { id, ...payload } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
