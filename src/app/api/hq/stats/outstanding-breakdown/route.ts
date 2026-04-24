import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { flattenPendingInstallments } from "@/lib/hq-financial-helpers";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

function mapNodes(val: Record<string, Record<string, unknown>> | null): Record<string, unknown>[] {
  if (!val) return [];
  return Object.keys(val).map((id) => ({ id, ...(val[id] as object) }));
}

function dueDateMs(raw: string): number | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const isoLike = /^\d{4}-\d{2}-\d{2}/.test(trimmed) ? `${trimmed.slice(0, 10)}T00:00:00` : trimmed;
  const ms = new Date(isoLike).getTime();
  return Number.isFinite(ms) ? ms : null;
}

function dayIso(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
    const allRows = flattenPendingInstallments(invoices);
    const totalsByStudent = allRows.reduce<Record<string, number>>((acc, r) => {
      const k = r.studentName.trim().toLowerCase();
      if (!k) return acc;
      acc[k] = (acc[k] ?? 0) + (Number(r.outstanding) || 0);
      return acc;
    }, {});
    let rows = allRows.map((r) => {
      const k = r.studentName.trim().toLowerCase();
      const ownOutstanding = Number(r.outstanding) || 0;
      const studentTotal = totalsByStudent[k] ?? ownOutstanding;
      return {
        ...r,
        studentOutstandingTotal: Math.round(studentTotal * 100) / 100,
      };
    });
    if (q.search) {
      const s = q.search;
      rows = rows.filter(
        (r) =>
          r.studentName.toLowerCase().includes(s) ||
          r.invoiceNumber.toLowerCase().includes(s) ||
          r.installmentLabel.toLowerCase().includes(s)
      );
    }
    if (q.dateFromMs != null || q.dateToMs != null) {
      rows = rows.filter((r) => {
        const dm = dueDateMs(r.dueDate);
        if (dm == null) return false;
        if (q.dateFromMs != null && dm < q.dateFromMs) return false;
        if (q.dateToMs != null && dm > q.dateToMs) return false;
        return true;
      });
    }
    const dir = q.sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => dir * (a.outstanding - b.outstanding));
    const all = rows.map((r) => ({ ...r }) as Record<string, unknown>);
    const now = new Date();
    const today = dayIso(now.getTime());
    const prev = new Date(now);
    prev.setDate(prev.getDate() - 1);
    const previousDate = dayIso(prev.getTime());
    const sumFor = (iso: string) =>
      allRows
        .filter((r) => String(r.dueDate ?? "").slice(0, 10) === iso)
        .reduce((s, r) => s + (Number((r as { outstanding?: number }).outstanding) || 0), 0);
    const countFor = (iso: string) => allRows.filter((r) => String(r.dueDate ?? "").slice(0, 10) === iso).length;
    const paged = paginateSlice(all, q);
    return NextResponse.json({
      ...paged,
      summary: {
        todayDate: today,
        previousDate,
        todayPendingInr: Math.round(sumFor(today) * 100) / 100,
        previousPendingInr: Math.round(sumFor(previousDate) * 100) / 100,
        todayRows: countFor(today),
        previousRows: countFor(previousDate),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
