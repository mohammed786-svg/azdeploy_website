import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";
import { allocateNextStudentSerial, backfillMissingStudentSerials } from "@/lib/hq-student-serial";
import { aggregateOutstandingPendingByStudent } from "@/lib/hq-financial-helpers";

type Row = Record<string, unknown> & {
  id: string;
  /** Human-readable sequential id (1, 2, 3, …) */
  serial?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  college?: string;
  degree?: string;
  updatedAt?: number;
  createdAt?: number;
};

function rowText(r: Row): string {
  return [r.fullName, r.email, r.phone, r.college, r.degree, r.serial != null ? String(r.serial) : ""]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
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
    if (q.sortField === "fullName") return dir * String(a.fullName ?? "").localeCompare(String(b.fullName ?? ""));
    if (q.sortField === "email") return dir * String(a.email ?? "").localeCompare(String(b.email ?? ""));
    if (q.sortField === "serial") {
      return dir * ((Number(a.serial) || 0) - (Number(b.serial) || 0));
    }
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
    await backfillMissingStudentSerials(db);
    const [snap, invSnap] = await Promise.all([
      db.ref("hq/students").once("value"),
      db.ref("hq/invoices").once("value"),
    ]);
    const val = snap.val() as Record<string, Record<string, unknown>> | null;
    const balanceByStudent = aggregateOutstandingPendingByStudent(
      invSnap.val() as Record<string, Record<string, unknown>> | null
    );
    let items: Row[] = val
      ? Object.keys(val).map((id) => {
          const row = { id, ...(val[id] as object) } as Row;
          const bal = balanceByStudent[id];
          return {
            ...row,
            balanceOutstanding: bal?.outstandingPending ?? 0,
            balanceCurrency: bal?.currency ?? "INR",
          };
        })
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
    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: "Full name, email, and phone are required" }, { status: 400 });
    }
    const db = getAdminDatabase();
    await backfillMissingStudentSerials(db);
    const serial = await allocateNextStudentSerial(db);
    const ref = db.ref("hq/students").push();
    const id = ref.key!;
    const now = Date.now();
    const batchId = body.currentBatchId ? String(body.currentBatchId) : "";
    let batchName = "";
    let batchHistory: object[] = [];
    if (batchId) {
      const bSnap = await db.ref(`hq/batches/${batchId}`).once("value");
      if (bSnap.exists()) {
        const b = bSnap.val() as { name?: string };
        batchName = String(b.name ?? "");
        batchHistory = [
          {
            batchId,
            batchName,
            enrolledAt: now,
          },
        ];
      }
    }
    const payload = {
      id,
      serial,
      fullName,
      email,
      phone,
      degree: body.degree ? String(body.degree) : "",
      college: body.college ? String(body.college) : "",
      passoutYear: body.passoutYear ? String(body.passoutYear) : "",
      city: body.city ? String(body.city) : "",
      gender: body.gender !== undefined && body.gender !== null ? String(body.gender).trim() : "",
      currentBatchId: batchId || null,
      currentBatchName: batchName || null,
      batchHistory,
      feeStructureId: body.feeStructureId ? String(body.feeStructureId) : null,
      enquiryId: body.enquiryId ? String(body.enquiryId) : null,
      status: (body.status as string) || "active",
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
