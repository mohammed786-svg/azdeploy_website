import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { buildReportExportWorkbook, type ReportExportSheets } from "@/lib/hq-excel-workbook";
import { flattenPendingInstallments } from "@/lib/hq-financial-helpers";
import { toInvoiceReportRowCa, toInvoiceReportRowNormal } from "@/lib/hq-invoice-report-rows";
import { computeReportSummary, filterRowsByDate, parseReportDateRange } from "@/lib/hq-report-metrics";

function mapNodes(val: Record<string, Record<string, unknown>> | null): Record<string, unknown>[] {
  if (!val) return [];
  return Object.keys(val).map((id) => ({ id, ...(val[id] as object) }));
}

const ALL_KEYS = [
  "summary",
  "onboarding",
  "students",
  "fees_pending",
  "invoices",
  "invoices_ca",
  "receipts",
  "expenses",
  "not_enrolled",
] as const;

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
    const rawInclude = sp.get("include") ?? "";
    const tokens = rawInclude.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const include = new Set<string>(tokens.length > 0 ? tokens : [...ALL_KEYS]);

    const db = getAdminDatabase();
    const [onbSnap, stSnap, invSnap, recSnap, expSnap] = await Promise.all([
      db.ref("hq/onboarding").once("value"),
      db.ref("hq/students").once("value"),
      db.ref("hq/invoices").once("value"),
      db.ref("hq/receipts").once("value"),
      db.ref("hq/expenses").once("value"),
    ]);

    const onboarding = mapNodes(onbSnap.val() as Record<string, Record<string, unknown>> | null);
    const students = mapNodes(stSnap.val() as Record<string, Record<string, unknown>> | null);
    const invoices = mapNodes(invSnap.val() as Record<string, Record<string, unknown>> | null);
    const receipts = mapNodes(recSnap.val() as Record<string, Record<string, unknown>> | null);
    const expenses = mapNodes(expSnap.val() as Record<string, Record<string, unknown>> | null);

    const summaryMetrics = await computeReportSummary(db, range, {
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    });

    const parts: Partial<ReportExportSheets> = {};

    if (include.has("summary")) {
      const s = summaryMetrics;
      parts.summary = [
        { metric: "Period from", value: s.range.dateFrom ?? "All dates" },
        { metric: "Period to", value: s.range.dateTo ?? "All dates" },
        { metric: "Onboarding (applications in period)", value: s.onboardingCount },
        { metric: "New students (created in period)", value: s.studentsNewCount },
        { metric: "Total students (all time)", value: s.studentsTotal },
        { metric: "Invoices issued (created in period)", value: s.invoicesInPeriodCount },
        { metric: "Fees outstanding (INR, all open invoices)", value: s.feesPendingTotalInr },
        { metric: "Fees collected (INR, in period)", value: s.feesCollectedInr },
        { metric: "Revenue — fee receipts (INR, in period)", value: s.revenueInr },
        { metric: "Expenses (INR, in period)", value: s.expensesTotalInr },
        { metric: "Net (revenue − expenses, INR)", value: s.netInr },
        { metric: "Receipts count (in period)", value: s.receiptsCount },
        { metric: "Receipts total (INR, in period)", value: s.receiptsTotalInr },
        { metric: "Expenses count (in period)", value: s.expensesCount },
        { metric: "Active students, no batch (onboarded, not enrolled)", value: s.onboardedNotEnrolledCount },
      ] as Record<string, unknown>[];
    }

    if (include.has("onboarding")) {
      parts.onboarding = filterRowsByDate(onboarding, "createdAt", range);
    }
    if (include.has("students")) {
      parts.studentsNew = filterRowsByDate(students, "createdAt", range);
    }
    if (include.has("fees_pending")) {
      parts.feesPending = flattenPendingInstallments(invoices).map(
        (r) => ({ ...r }) as Record<string, unknown>
      );
    }

    const invoicesInPeriod = filterRowsByDate(invoices, "createdAt", range);
    if (include.has("invoices")) {
      parts.invoicesNormal = invoicesInPeriod.map((inv) => toInvoiceReportRowNormal(inv));
    }
    if (include.has("invoices_ca")) {
      parts.invoicesCa = invoicesInPeriod.map((inv) => toInvoiceReportRowCa(inv));
    }

    if (include.has("receipts")) {
      parts.receipts = filterRowsByDate(receipts, "receivedAt", range);
    }
    if (include.has("expenses")) {
      parts.expenses = filterRowsByDate(expenses, "spentAt", range);
    }
    if (include.has("not_enrolled")) {
      parts.notEnrolled = students.filter((s) => {
        const st = String(s.status ?? "active").toLowerCase();
        if (st !== "active") return false;
        const bid = s.currentBatchId;
        return bid == null || String(bid).trim() === "";
      });
    }

    const buf = buildReportExportWorkbook(parts);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `hq-report-${stamp}.xlsx`;

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
