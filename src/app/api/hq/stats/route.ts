import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { invoiceOutstandingTotal } from "@/lib/hq-financial-helpers";

export async function GET(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      {
        enquiries: 0,
        students: 0,
        onboardingPending: 0,
        openInvoiceTotal: 0,
        outstandingToCollectInr: 0,
        expensesTotalInr: 0,
        receiptsTotalInr: 0,
      },
      { status: 200 }
    );
  }
  try {
    const db = getAdminDatabase();
    const [enqSnap, stSnap, onSnap, invSnap, recSnap, expSnap] = await Promise.all([
      db.ref("enquiries").once("value"),
      db.ref("hq/students").once("value"),
      db.ref("hq/onboarding").once("value"),
      db.ref("hq/invoices").once("value"),
      db.ref("hq/receipts").once("value"),
      db.ref("hq/expenses").once("value"),
    ]);
    const enquiries = enqSnap.val();
    const enquiryCount = enquiries ? Object.keys(enquiries).length : 0;
    const students = stSnap.val();
    const studentCount = students ? Object.keys(students).length : 0;
    const onboarding = onSnap.val();
    let onboardingPending = 0;
    if (onboarding) {
      for (const k of Object.keys(onboarding)) {
        const o = onboarding[k] as { status?: string };
        if (o?.status === "pending") onboardingPending += 1;
      }
    }
    const invoices = invSnap.val();
    let openInvoiceTotal = 0;
    let outstandingToCollectInr = 0;
    if (invoices) {
      for (const k of Object.keys(invoices)) {
        const inv = invoices[k] as { status?: string; total?: number; currency?: string; installments?: unknown[] };
        const st = inv?.status;
        if (st && st !== "paid" && st !== "draft") {
          openInvoiceTotal += Number(inv.total) || 0;
        }
        if (String(inv?.currency ?? "INR").toUpperCase() === "INR") {
          outstandingToCollectInr += invoiceOutstandingTotal(inv);
        }
      }
    }

    const receipts = recSnap.val() as Record<string, { amount?: number; currency?: string }> | null;
    let receiptsTotalInr = 0;
    if (receipts) {
      for (const k of Object.keys(receipts)) {
        const r = receipts[k];
        if (String(r?.currency ?? "INR").toUpperCase() === "INR") {
          receiptsTotalInr += Number(r?.amount) || 0;
        }
      }
    }

    const expenses = expSnap.val() as Record<string, { amount?: number; currency?: string }> | null;
    let expensesTotalInr = 0;
    if (expenses) {
      for (const k of Object.keys(expenses)) {
        const x = expenses[k];
        if (String(x?.currency ?? "INR").toUpperCase() === "INR") {
          expensesTotalInr += Number(x?.amount) || 0;
        }
      }
    }

    return NextResponse.json({
      enquiries: enquiryCount,
      students: studentCount,
      onboardingPending,
      openInvoiceTotal,
      outstandingToCollectInr,
      expensesTotalInr,
      receiptsTotalInr,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
