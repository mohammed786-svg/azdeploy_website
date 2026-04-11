import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { createdMs, parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

export type EnquiryRow = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  degree?: string;
  degreeOther?: string | null;
  college?: string;
  passoutYear?: string;
  city?: string;
  preferredBatch?: string;
  message?: string;
  createdAt?: unknown;
};

function rowText(r: EnquiryRow): string {
  return [
    r.fullName,
    r.email,
    r.phone,
    r.degree,
    r.degreeOther,
    r.college,
    r.city,
    r.message,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function sortEnquiries(items: EnquiryRow[], q: ListQuery): EnquiryRow[] {
  const dir = q.sortDir === "asc" ? 1 : -1;
  const copy = [...items];
  copy.sort((a, b) => {
    if (q.sortField === "email") {
      return dir * String(a.email ?? "").localeCompare(String(b.email ?? ""));
    }
    if (q.sortField === "fullName") {
      return dir * String(a.fullName ?? "").localeCompare(String(b.fullName ?? ""));
    }
    const ta = createdMs(a.createdAt);
    const tb = createdMs(b.createdAt);
    return dir * (ta - tb);
  });
  return copy;
}

function filterEnquiries(items: EnquiryRow[], q: ListQuery): EnquiryRow[] {
  let out = items;
  if (q.search) {
    out = out.filter((r) => rowText(r).includes(q.search));
  }
  if (q.dateFromMs != null || q.dateToMs != null) {
    out = out.filter((r) => {
      const t = createdMs(r.createdAt);
      if (!t) return false;
      if (q.dateFromMs != null && t < q.dateFromMs) return false;
      if (q.dateToMs != null && t > q.dateToMs) return false;
      return true;
    });
  }
  return out;
}

export async function GET(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ items: [] as EnquiryRow[], total: 0, page: 1, pageSize: 20, totalPages: 1 });
  }
  try {
    const q = parseListQuery(request.nextUrl.searchParams, "createdAt_desc");
    const db = getAdminDatabase();
    const snap = await db.ref("enquiries").once("value");
    const val = snap.val() as Record<string, Record<string, unknown>> | null;
    let items: EnquiryRow[] = [];
    if (val) {
      for (const id of Object.keys(val)) {
        const row = val[id];
        items.push({
          id,
          fullName: row.fullName as string | undefined,
          email: row.email as string | undefined,
          phone: row.phone as string | undefined,
          degree: row.degree as string | undefined,
          degreeOther: row.degreeOther as string | null | undefined,
          college: row.college as string | undefined,
          passoutYear: row.passoutYear as string | undefined,
          city: row.city as string | undefined,
          preferredBatch: row.preferredBatch as string | undefined,
          message: row.message as string | undefined,
          createdAt: row.createdAt,
        });
      }
    }
    items = filterEnquiries(items, q);
    items = sortEnquiries(items, q);
    const page = paginateSlice(items, q);
    return NextResponse.json(page);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
