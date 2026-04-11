import type { Database } from "firebase-admin/database";
import { parseListQuery } from "@/lib/hq-list-query";
import { invoiceOutstandingTotal } from "@/lib/hq-financial-helpers";

export function parseReportDateRange(searchParams: URLSearchParams): ReportDateRange {
  const q = parseListQuery(searchParams);
  return { dateFromMs: q.dateFromMs, dateToMs: q.dateToMs };
}

export type ReportDateRange = {
  dateFromMs: number | null;
  dateToMs: number | null;
};

function inRange(t: number, range: ReportDateRange): boolean {
  if (!t) return false;
  if (range.dateFromMs != null && t < range.dateFromMs) return false;
  if (range.dateToMs != null && t > range.dateToMs) return false;
  return true;
}

export type ReportSummary = {
  range: { dateFrom: string | null; dateTo: string | null };
  onboardingCount: number;
  studentsNewCount: number;
  studentsTotal: number;
  /** Invoices with createdAt in the selected period */
  invoicesInPeriodCount: number;
  feesPendingTotalInr: number;
  feesCollectedInr: number;
  revenueInr: number;
  expensesTotalInr: number;
  netInr: number;
  receiptsCount: number;
  receiptsTotalInr: number;
  expensesCount: number;
  onboardedNotEnrolledCount: number;
};

function mapNodes(val: Record<string, Record<string, unknown>> | null): Record<string, unknown>[] {
  if (!val) return [];
  return Object.keys(val).map((id) => ({ id, ...(val[id] as object) }));
}

export async function computeReportSummary(
  db: Database,
  range: ReportDateRange,
  rangeLabels: { dateFrom: string | null; dateTo: string | null }
): Promise<ReportSummary> {
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

  const onboardingCount = onboarding.filter((r) => inRange(Number(r.createdAt) || 0, range)).length;

  const studentsNewCount = students.filter((r) => inRange(Number(r.createdAt) || 0, range)).length;
  const studentsTotal = students.length;

  const invoicesInPeriodCount = invoices.filter((r) => inRange(Number(r.createdAt) || 0, range)).length;

  let feesPendingTotalInr = 0;
  for (const inv of invoices) {
    const cur = String(inv.currency ?? "INR").toUpperCase();
    if (cur !== "INR") continue;
    feesPendingTotalInr += invoiceOutstandingTotal(inv as Parameters<typeof invoiceOutstandingTotal>[0]);
  }

  const receiptsInRange = receipts.filter((r) => {
    const t = Number(r.receivedAt) || Number(r.createdAt) || 0;
    return inRange(t, range);
  });
  const receiptsCount = receiptsInRange.length;
  let receiptsTotalInr = 0;
  for (const r of receiptsInRange) {
    if (String(r.currency ?? "INR").toUpperCase() !== "INR") continue;
    receiptsTotalInr += Number(r.amount) || 0;
  }

  const expensesInRange = expenses.filter((r) => {
    const t = Number(r.spentAt) || Number(r.createdAt) || 0;
    return inRange(t, range);
  });
  const expensesCount = expensesInRange.length;
  let expensesTotalInr = 0;
  for (const x of expensesInRange) {
    if (String(x.currency ?? "INR").toUpperCase() !== "INR") continue;
    expensesTotalInr += Number(x.amount) || 0;
  }

  const revenueInr = receiptsTotalInr;
  const feesCollectedInr = receiptsTotalInr;
  const netInr = revenueInr - expensesTotalInr;

  const onboardedNotEnrolledCount = students.filter((s) => {
    const st = String(s.status ?? "active").toLowerCase();
    if (st !== "active") return false;
    const bid = s.currentBatchId;
    return bid == null || String(bid).trim() === "";
  }).length;

  return {
    range: rangeLabels,
    onboardingCount,
    studentsNewCount,
    studentsTotal,
    invoicesInPeriodCount,
    feesPendingTotalInr,
    feesCollectedInr,
    revenueInr,
    expensesTotalInr,
    netInr,
    receiptsCount,
    receiptsTotalInr,
    expensesCount,
    onboardedNotEnrolledCount,
  };
}

export function filterRowsByDate(
  rows: Record<string, unknown>[],
  field: "createdAt" | "receivedAt" | "spentAt",
  range: ReportDateRange
): Record<string, unknown>[] {
  return rows.filter((r) => {
    const t =
      field === "createdAt"
        ? Number(r.createdAt) || 0
        : Number(r[field]) || Number(r.createdAt) || 0;
    return inRange(t, range);
  });
}
