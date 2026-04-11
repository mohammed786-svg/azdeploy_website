import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { aggregateOutstandingPendingByStudent } from "@/lib/hq-financial-helpers";

type Ctx = { params: Promise<{ id: string }> };

type Inst = { id?: string; amount?: unknown; dueDate?: string; paid?: boolean };

/**
 * Outstanding = unpaid installment amounts across invoices; if an invoice has no installments,
 * count full invoice total when status is not paid/draft. (Same rollup as HQ students list.)
 */
export async function GET(request: NextRequest, ctx: Ctx) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({
      currency: "INR",
      outstandingPending: 0,
      nextDueDate: null,
      totalReceiptsRecorded: 0,
    });
  }
  const { id: studentId } = await ctx.params;
  try {
    const db = getAdminDatabase();
    const [invSnap, recSnap] = await Promise.all([
      db.ref("hq/invoices").once("value"),
      db.ref("hq/receipts").once("value"),
    ]);

    let nextDue: string | null = null;

    const invVal = invSnap.val() as Record<string, Record<string, unknown>> | null;
    const rollup = aggregateOutstandingPendingByStudent(invVal)[studentId];
    let pendingTotal = rollup?.outstandingPending ?? 0;
    let currency = rollup?.currency ?? "INR";

    if (invVal) {
      for (const invId of Object.keys(invVal)) {
        const inv = invVal[invId];
        if (String(inv.studentId ?? "") !== studentId) continue;
        const c = String(inv.currency ?? "INR").toUpperCase();
        if (c) currency = c;
        const total = Number(inv.total) || 0;
        const status = String(inv.status ?? "").toLowerCase();
        const insts = inv.installments as Inst[] | undefined;

        if (Array.isArray(insts) && insts.length > 0) {
          for (const x of insts) {
            if (!x.paid) {
              const d = x.dueDate ? String(x.dueDate).slice(0, 10) : "";
              if (d && (!nextDue || d < nextDue)) nextDue = d;
            }
          }
        } else if (status !== "paid" && status !== "draft") {
          const dd = inv.dueDate ? String(inv.dueDate).slice(0, 10) : "";
          if (dd && (!nextDue || dd < nextDue)) nextDue = dd;
        }
      }
    }

    let totalReceipts = 0;
    const recVal = recSnap.val() as Record<string, Record<string, unknown>> | null;
    if (recVal) {
      for (const rid of Object.keys(recVal)) {
        const r = recVal[rid];
        if (String(r.studentId ?? "") !== studentId) continue;
        totalReceipts += Number(r.amount) || 0;
      }
    }

    return NextResponse.json({
      currency,
      outstandingPending: Math.round(Number(pendingTotal) * 100) / 100,
      nextDueDate: nextDue,
      totalReceiptsRecorded: Math.round(totalReceipts * 100) / 100,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
