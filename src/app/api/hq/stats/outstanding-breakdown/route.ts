import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { flattenPendingInstallments } from "@/lib/hq-financial-helpers";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

function mapNodes(val: Record<string, Record<string, unknown>> | null): Record<string, unknown>[] {
  if (!val) return [];
  return Object.keys(val).map((id) => ({ id, ...(val[id] as object) }));
}

/** Paginated installment-level rows still owed (same data as Reports “Fees pending” snapshot). */
export async function GET(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ items: [], total: 0, page: 1, pageSize: 20, totalPages: 1 });
  }
  try {
    const q: ListQuery = parseListQuery(request.nextUrl.searchParams, "createdAt_desc");
    const db = getAdminDatabase();
    const snap = await db.ref("hq/invoices").once("value");
    const invoices = mapNodes(snap.val() as Record<string, Record<string, unknown>> | null);
    let rows = flattenPendingInstallments(invoices);
    const dir = q.sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => dir * (a.outstanding - b.outstanding));
    const all = rows.map((r) => ({ ...r }) as Record<string, unknown>);
    return NextResponse.json(paginateSlice(all, q));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
