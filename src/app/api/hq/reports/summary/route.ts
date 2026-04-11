import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { computeReportSummary, parseReportDateRange } from "@/lib/hq-report-metrics";

export async function GET(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  try {
    const sp = request.nextUrl.searchParams;
    const range = parseReportDateRange(sp);
    const dateFrom = sp.get("dateFrom") || "";
    const dateTo = sp.get("dateTo") || "";
    const db = getAdminDatabase();
    const summary = await computeReportSummary(db, range, {
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    });
    return NextResponse.json(summary);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
