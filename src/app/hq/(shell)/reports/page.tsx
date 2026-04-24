"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { hqDownloadBlob, hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import { maskStudentId } from "@/lib/student-id-mask";

type ReportKey =
  | "onboarding"
  | "students"
  | "invoices"
  | "receipts"
  | "expenses"
  | "fees_pending"
  | "attendance"
  | "attendance_students";
type ReportFormat = "csv" | "excel" | "pdf";

export type RowLink = {
  onboardingId?: string | null;
  studentId?: string | null;
  invoiceId?: string | null;
  receiptId?: string | null;
  expenseId?: string | null;
  sessionId?: string | null;
};

type ReportTableResponse = {
  report: string;
  columns: string[];
  totals?: { rows?: number; amountInr?: number };
  items: Record<string, unknown>[];
  rowLinks?: RowLink[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const REPORTS: { key: ReportKey; label: string; hint: string; statusOptions?: { value: string; label: string }[] }[] = [
  {
    key: "onboarding",
    label: "Onboarding",
    hint: "Leads with degree, college, notes — open a row for full edit",
    statusOptions: [
      { value: "", label: "All status" },
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
  },
  {
    key: "students",
    label: "Students",
    hint: "Roster in date range — link opens full student profile",
    statusOptions: [
      { value: "", label: "All status" },
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" },
      { value: "completed", label: "Completed" },
      { value: "dropped", label: "Dropped" },
    ],
  },
  {
    key: "invoices",
    label: "Invoices",
    hint: "Balances per invoice — view opens invoice HQ screen",
    statusOptions: [
      { value: "", label: "All status" },
      { value: "unpaid", label: "Unpaid" },
      { value: "partial", label: "Partial" },
      { value: "paid", label: "Paid" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  { key: "receipts", label: "Receipts", hint: "Payments — use Detail export for full row context" },
  {
    key: "expenses",
    label: "Expenses",
    hint: "Spend by category",
    statusOptions: [
      { value: "", label: "All status" },
      { value: "paid", label: "Paid" },
      { value: "pending", label: "Pending" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  {
    key: "fees_pending",
    label: "Fees Pending",
    hint: "Clubbed by student — outstanding INR per learner; detail export lists every open installment line",
  },
  {
    key: "attendance",
    label: "Attendance (by day)",
    hint: "Sessions clubbed per calendar date — Detail export needs a session id (from Session IDs, first id)",
  },
  {
    key: "attendance_students",
    label: "Attendance (by student)",
    hint: "Roll-up per learner; Detail export = every dated mark for that student",
    statusOptions: [
      { value: "", label: "All student status" },
      { value: "active", label: "Active" },
      { value: "paused", label: "Paused" },
      { value: "completed", label: "Completed" },
      { value: "dropped", label: "Dropped" },
    ],
  },
];

function defaultRange() {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 30);
  return { dateFrom: from.toISOString().slice(0, 10), dateTo: to.toISOString().slice(0, 10) };
}

function fmtInr(n: number) {
  return `INR ${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parseMoneyLike(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const s = String(v ?? "").replace(/[^0-9.\-]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function primaryViewHref(report: ReportKey, link: RowLink | undefined): string | null {
  if (!link) return null;
  if (report === "onboarding" && link.onboardingId) return `/hq/onboarding?focus=${encodeURIComponent(link.onboardingId)}`;
  if ((report === "students" || report === "attendance_students" || report === "fees_pending") && link.studentId)
    return `/hq/students/${link.studentId}`;
  if (report === "invoices" && link.invoiceId) return `/hq/invoices/${link.invoiceId}`;
  return null;
}

function detailLinkForRow(report: ReportKey, link: RowLink | undefined, row: Record<string, unknown>): RowLink {
  const base = { ...link } as RowLink;
  if (report === "attendance" && !base.sessionId) {
    const raw = String(row["Session IDs"] ?? "");
    const first = raw.split(",")[0]?.trim();
    if (first) base.sessionId = first;
  }
  return base;
}

function isStudentIdColumn(col: string): boolean {
  const c = col.trim().toLowerCase();
  return c === "student id" || c === "student_id" || c === "studentid";
}

type BatchOpt = { id: string; code: string; name: string };

export default function HqReportsPage() {
  const [{ dateFrom, dateTo }, setRange] = useState(defaultRange);
  const [activeReport, setActiveReport] = useState<ReportKey>("onboarding");
  const [mobileReportOpen, setMobileReportKey] = useState<ReportKey>("onboarding");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [reportBatchId, setReportBatchId] = useState("");
  const [batches, setBatches] = useState<BatchOpt[]>([]);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState<ReportTableResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [err, setErr] = useState("");
  const activeReportMeta = REPORTS.find((r) => r.key === activeReport) || REPORTS[0];
  const showAmountFooter = ["fees_pending", "invoices", "receipts", "expenses"].includes(activeReport);
  const fallbackOutstanding =
    activeReport === "fees_pending" && tableData
      ? tableData.items.reduce((sum, row) => {
          const key = tableData.columns.find((c) => /outstanding|pending/i.test(c));
          return sum + (key ? parseMoneyLike(row[key]) : 0);
        }, 0)
      : 0;
  const amountTotal =
    typeof tableData?.totals?.amountInr === "number"
      ? tableData.totals.amountInr
      : activeReport === "fees_pending"
        ? fallbackOutstanding
        : null;

  useEffect(() => {
    if (activeReport !== "attendance_students") return;
    (async () => {
      try {
        const b = await hqFetch<{ items: { id: string; code: string; name: string }[] }>(
          hqListUrl("/api/hq/batches", { page: 1, pageSize: 500, sort: "code_asc" })
        );
        setBatches((b.items ?? []).map((x) => ({ id: x.id, code: x.code, name: x.name })));
      } catch {
        setBatches([]);
      }
    })();
  }, [activeReport]);

  const tableUrl = useMemo(
    () =>
      hqListUrl("/api/hq/reports/table", {
        report: activeReport,
        page,
        pageSize: 20,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        search: search || undefined,
        status: status || undefined,
        batchId: activeReport === "attendance_students" && reportBatchId ? reportBatchId : undefined,
      }),
    [activeReport, page, dateFrom, dateTo, search, status, reportBatchId]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await hqFetch<ReportTableResponse>(tableUrl);
      setTableData(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
      setTableData(null);
    } finally {
      setLoading(false);
    }
  }, [tableUrl]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
    setReportBatchId("");
  }, [activeReport]);

  useEffect(() => {
    setMobileReportKey(activeReport);
  }, [activeReport]);

  async function onExport(format: ReportFormat) {
    setExporting(true);
    setErr("");
    try {
      const q = hqListUrl("/api/hq/reports/export", {
        report: activeReport,
        format,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        search: search || undefined,
        status: status || undefined,
        batchId: activeReport === "attendance_students" && reportBatchId ? reportBatchId : undefined,
      });
      const fallback = `hq-${activeReport}.${format === "excel" ? "xlsx" : format}`;
      await hqDownloadBlob(q, fallback);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  async function onExportRowDetail(format: ReportFormat, rowIndex: number) {
    const link = tableData?.rowLinks?.[rowIndex];
    const row = tableData?.items[rowIndex];
    if (!row) return;
    const merged = detailLinkForRow(activeReport, link, row);
    setExporting(true);
    setErr("");
    try {
      const ext = format === "excel" ? "xlsx" : format;
      const q = hqListUrl("/api/hq/reports/export", {
        report: activeReport,
        format,
        detail: 1,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        studentId: merged.studentId || undefined,
        onboardingId: merged.onboardingId || undefined,
        invoiceId: merged.invoiceId || undefined,
        receiptId: merged.receiptId || undefined,
        expenseId: merged.expenseId || undefined,
        sessionId: merged.sessionId || undefined,
      });
      await hqDownloadBlob(q, `hq-${activeReport}-detail-${rowIndex}.${ext}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Detail export failed");
    } finally {
      setExporting(false);
    }
  }

  const rowLinks = tableData?.rowLinks ?? [];

  return (
    <div className="flex min-h-0 flex-col gap-4 md:gap-6 max-w-[100vw] overflow-x-hidden pb-6">
      <header className="shrink-0 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Analytics</p>
          <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-white">Reports</h1>
          <p className="mt-2 text-xs sm:text-sm text-[#94a3b8] max-w-2xl">
            Fits your viewport: scroll inside the table. Use <strong className="text-white/90">View</strong> for profiles and{" "}
            <strong className="text-white/90">Detail</strong> for full line-item PDF / Excel / CSV exports.
          </p>
        </div>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono shrink-0" role="alert">
          {err}
        </p>
      )}

      <label className="md:hidden shrink-0 block rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2">
        <span className="text-[10px] font-mono uppercase text-[#64748b]">Report</span>
        <select
          value={mobileReportOpen}
          onChange={(e) => {
            const k = e.target.value as ReportKey;
            setMobileReportKey(k);
            setActiveReport(k);
          }}
          className="mt-1 block w-full rounded-lg border border-white/10 bg-black/60 py-2 text-sm text-white"
        >
          {REPORTS.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,260px)_1fr] lg:grid-cols-[minmax(0,220px)_1fr] gap-3 md:gap-5">
        <aside className="hidden md:flex min-h-0 max-h-[calc(100dvh-10rem)] flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 sm:p-3 overflow-y-auto overscroll-contain">
          {REPORTS.map((r) => {
            const active = r.key === activeReport;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setActiveReport(r.key)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors mb-1.5 last:mb-0 ${
                  active ? "border-[#a78bfa]/35 bg-[#a78bfa]/10" : "border-white/[0.06] bg-black/20 hover:bg-black/30"
                }`}
              >
                <p className="text-sm text-white leading-snug">{r.label}</p>
                <p className="mt-1 text-[10px] sm:text-[11px] text-[#64748b] leading-relaxed">{r.hint}</p>
              </button>
            );
          })}
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5 md:p-6 max-h-[calc(100dvh-7rem)] md:max-h-[calc(100dvh-6.5rem)]">
          <div className="shrink-0">
            <h2 className="text-base font-semibold text-white">{activeReportMeta.label}</h2>
            <p className="mt-1 text-xs text-[#64748b]">{activeReportMeta.hint}</p>
          </div>

          {activeReport === "fees_pending" && amountTotal != null && !loading ? (
            <div className="mt-4 shrink-0 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
              <p className="text-[10px] font-mono uppercase text-amber-200/80">Total outstanding (filtered)</p>
              <p className="mt-1 text-lg sm:text-xl font-bold tabular-nums text-amber-100">{fmtInr(amountTotal)}</p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-end gap-3 sm:gap-4 shrink-0">
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setRange((r) => ({ ...r, dateFrom: e.target.value }))}
                className="mt-1.5 block w-full max-w-[11rem] rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setRange((r) => ({ ...r, dateTo: e.target.value }))}
                className="mt-1.5 block w-full max-w-[11rem] rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block min-w-0 flex-1 basis-[200px]">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  activeReport === "attendance_students"
                    ? "Student name, email, phone, batch…"
                    : "Name, invoice, phone, category..."
                }
                className="mt-1.5 block w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
              />
            </label>
            {activeReport === "attendance_students" ? (
              <label className="block min-w-0 flex-1 basis-[180px]">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Batch</span>
                <select
                  value={reportBatchId}
                  onChange={(e) => {
                    setReportBatchId(e.target.value);
                    setPage(1);
                  }}
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
                >
                  <option value="">All batches</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            {activeReportMeta.statusOptions ? (
              <label className="block min-w-0 flex-1 basis-[160px]">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Status</span>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
                >
                  {activeReportMeta.statusOptions.map((opt) => (
                    <option key={opt.value || "all"} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-xl border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#7dd3fc] hover:bg-[#00d4ff]/20"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                setRange({ dateFrom: "", dateTo: "" });
                setSearch("");
                setStatus("");
                setPage(1);
              }}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:bg-white/5"
            >
              Clear
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 shrink-0">
            <button
              type="button"
              disabled={exporting}
              onClick={() => void onExport("csv")}
              className="rounded-xl border border-[#22d3ee]/35 bg-[#22d3ee]/10 px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#67e8f9] hover:bg-[#22d3ee]/20 disabled:opacity-50"
            >
              {exporting ? "…" : "All CSV"}
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={() => void onExport("excel")}
              className="rounded-xl border border-[#fbbf24]/35 bg-[#fbbf24]/10 px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#fcd34d] hover:bg-[#fbbf24]/20 disabled:opacity-50"
            >
              All Excel
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={() => void onExport("pdf")}
              className="rounded-xl border border-[#a78bfa]/35 bg-[#a78bfa]/10 px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#c4b5fd] hover:bg-[#a78bfa]/20 disabled:opacity-50"
            >
              All PDF
            </button>
          </div>

          <div className="mt-4 min-h-0 flex-1 flex flex-col rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
            {loading ? (
              <p className="px-4 py-6 text-[#64748b] font-mono text-sm">Loading table…</p>
            ) : !tableData || tableData.items.length === 0 ? (
              <p className="px-4 py-6 text-[#64748b] font-mono text-sm">No rows found for selected filters.</p>
            ) : (
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain -webkit-overflow-scrolling-touch">
                <table className="min-w-[640px] w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-[#0c0c12]/95 backdrop-blur-sm border-b border-white/[0.08]">
                    <tr>
                      <th className="px-2 py-2 text-left text-[10px] uppercase font-mono text-[#94a3b8] whitespace-nowrap sticky left-0 bg-[#0c0c12]/95 z-20 border-r border-white/[0.06]">
                        Actions
                      </th>
                      {tableData.columns.map((col) => (
                        <th
                          key={col}
                          className="px-2 py-2 text-left text-[10px] uppercase font-mono text-[#94a3b8] whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.items.map((row, idx) => {
                      const href = primaryViewHref(activeReport, rowLinks[idx]);
                      return (
                        <tr key={idx} className="border-t border-white/[0.04] hover:bg-white/[0.03] align-top">
                          <td className="px-2 py-2 text-[11px] sticky left-0 bg-[#050508]/90 z-[1] border-r border-white/[0.05]">
                            <div className="flex flex-col gap-1 min-w-[7.5rem]">
                              {href ? (
                                <Link
                                  href={href}
                                  className="text-[#7dd3fc] hover:underline font-medium"
                                >
                                  View
                                </Link>
                              ) : (
                                <span className="text-[#475569]">—</span>
                              )}
                              <div className="flex flex-wrap gap-1">
                                <button
                                  type="button"
                                  disabled={exporting}
                                  onClick={() => void onExportRowDetail("pdf", idx)}
                                  className="text-[10px] text-[#c4b5fd] hover:underline disabled:opacity-40"
                                >
                                  PDF
                                </button>
                                <button
                                  type="button"
                                  disabled={exporting}
                                  onClick={() => void onExportRowDetail("excel", idx)}
                                  className="text-[10px] text-[#fcd34d] hover:underline disabled:opacity-40"
                                >
                                  XLSX
                                </button>
                                <button
                                  type="button"
                                  disabled={exporting}
                                  onClick={() => void onExportRowDetail("csv", idx)}
                                  className="text-[10px] text-[#67e8f9] hover:underline disabled:opacity-40"
                                >
                                  CSV
                                </button>
                              </div>
                            </div>
                          </td>
                          {tableData.columns.map((col) => (
                            <td
                              key={`${idx}-${col}`}
                              className={`px-2 py-2 text-[#dbe4ee] max-w-[220px] sm:max-w-none ${
                                col.includes("Outstanding") || col.includes("Pending") ? "tabular-nums text-amber-200/90 font-medium" : ""
                              } ${col === "Notes" ? "whitespace-normal break-words" : "whitespace-nowrap"}`}
                            >
                              {isStudentIdColumn(col) ? maskStudentId(row[col]) : String(row[col] ?? "")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 shrink-0 pt-1 border-t border-white/[0.04]">
            <p className="text-xs text-[#94a3b8] font-mono">
              Rows: {tableData?.total ?? 0}
              {showAmountFooter && amountTotal != null
                ? ` · Sum: ${fmtInr(amountTotal)}`
                : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!tableData || tableData.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#94a3b8] disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs font-mono text-[#94a3b8]">
                {tableData?.page ?? 1} / {tableData?.totalPages ?? 1}
              </span>
              <button
                type="button"
                disabled={!tableData || (tableData.page ?? 1) >= (tableData.totalPages ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#94a3b8] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
