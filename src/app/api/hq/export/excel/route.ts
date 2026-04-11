import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { buildHqExportWorkbook } from "@/lib/hq-excel-workbook";

function mapNodes(val: Record<string, Record<string, unknown>> | null): Record<string, unknown>[] {
  if (!val) return [];
  return Object.keys(val).map((id) => ({ id, ...(val[id] as object) }));
}

/** Full HQ export: one .xlsx with a sheet per collection (students, invoices, receipts, …). */
export async function GET(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  try {
    const db = getAdminDatabase();
    const [st, inv, rec, onb, enq, bat, fee, exp] = await Promise.all([
      db.ref("hq/students").once("value"),
      db.ref("hq/invoices").once("value"),
      db.ref("hq/receipts").once("value"),
      db.ref("hq/onboarding").once("value"),
      db.ref("enquiries").once("value"),
      db.ref("hq/batches").once("value"),
      db.ref("hq/feeStructures").once("value"),
      db.ref("hq/expenses").once("value"),
    ]);

    const buf = buildHqExportWorkbook({
      students: mapNodes(st.val() as Record<string, Record<string, unknown>> | null),
      invoices: mapNodes(inv.val() as Record<string, Record<string, unknown>> | null),
      receipts: mapNodes(rec.val() as Record<string, Record<string, unknown>> | null),
      onboarding: mapNodes(onb.val() as Record<string, Record<string, unknown>> | null),
      enquiries: mapNodes(enq.val() as Record<string, Record<string, unknown>> | null),
      batches: mapNodes(bat.val() as Record<string, Record<string, unknown>> | null),
      feeStructures: mapNodes(fee.val() as Record<string, Record<string, unknown>> | null),
      expenses: mapNodes(exp.val() as Record<string, Record<string, unknown>> | null),
    });

    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `hq-export-${stamp}.xlsx`;

    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
