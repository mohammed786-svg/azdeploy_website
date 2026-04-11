"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { hqDownloadBlob, hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import OutstandingBalanceTable, { type OutstandingPage } from "@/components/hq/OutstandingBalanceTable";

type ReportSummary = {
  range: { dateFrom: string | null; dateTo: string | null };
  onboardingCount: number;
  studentsNewCount: number;
  studentsTotal: number;
  invoicesInPeriodCount?: number;
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

const SECTIONS: { id: string; label: string; hint: string }[] = [
  { id: "summary", label: "Summary KPIs", hint: "Key totals for the Excel file" },
  { id: "onboarding", label: "Onboarding", hint: "Rows created in the date range" },
  { id: "students", label: "Students (new)", hint: "Student records created in the range" },
  { id: "fees_pending", label: "Fees pending", hint: "Open balances per installment (snapshot)" },
  {
    id: "invoices",
    label: "Invoices (operational)",
    hint: "Invoices issued in range: totals, collected, balance, lines",
  },
  {
    id: "invoices_ca",
    label: "Invoices CA (GST)",
    hint: "Same invoices — GST / SAC / taxable value / balances for CA",
  },
  { id: "receipts", label: "Receipts", hint: "Payments received in the range" },
  { id: "expenses", label: "Expenses", hint: "Spend in the range" },
  { id: "not_enrolled", label: "Not enrolled", hint: "Active students with no batch (snapshot)" },
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

export default function HqReportsPage() {
  const [{ dateFrom, dateTo }, setRange] = useState(defaultRange);
  const [include, setInclude] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTIONS.map((s) => [s.id, true]))
  );
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [err, setErr] = useState("");
  const [balPage, setBalPage] = useState(1);
  const [balData, setBalData] = useState<OutstandingPage | null>(null);
  const [balLoading, setBalLoading] = useState(false);

  const summaryUrl = useMemo(() => {
    return hqListUrl("/api/hq/reports/summary", {
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
  }, [dateFrom, dateTo]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await hqFetch<ReportSummary>(summaryUrl);
      setSummary(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [summaryUrl]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBalLoading(true);
      try {
        const url = hqListUrl("/api/hq/stats/outstanding-breakdown", {
          page: balPage,
          pageSize: 10,
          sort: "createdAt_desc",
        });
        const d = await hqFetch<OutstandingPage>(url);
        if (!cancelled) setBalData(d);
      } catch {
        if (!cancelled) setBalData(null);
      } finally {
        if (!cancelled) setBalLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [balPage]);

  function toggleAll(on: boolean) {
    setInclude(Object.fromEntries(SECTIONS.map((s) => [s.id, on])));
  }

  async function onExport() {
    const keys = SECTIONS.filter((s) => include[s.id]).map((s) => s.id);
    if (keys.length === 0) {
      setErr("Select at least one section to export.");
      return;
    }
    setExporting(true);
    setErr("");
    try {
      const q = hqListUrl("/api/hq/reports/export", {
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        include: keys.join(","),
      });
      await hqDownloadBlob(q, "hq-report.xlsx");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  const kpis = summary
    ? [
        { label: "Onboarding (period)", value: String(summary.onboardingCount), tone: "text-[#a78bfa]" },
        { label: "New students (period)", value: String(summary.studentsNewCount), tone: "text-[#7dd3fc]" },
        { label: "Total students", value: String(summary.studentsTotal), tone: "text-white" },
        {
          label: "Invoices issued (period)",
          value: String(summary.invoicesInPeriodCount ?? 0),
          tone: "text-cyan-300/90",
        },
        { label: "Fees outstanding", value: fmtInr(summary.feesPendingTotalInr), tone: "text-amber-300/90" },
        { label: "Fees collected (period)", value: fmtInr(summary.feesCollectedInr), tone: "text-emerald-300/90" },
        { label: "Revenue — receipts (period)", value: fmtInr(summary.revenueInr), tone: "text-emerald-300/90" },
        { label: "Expenses (period)", value: fmtInr(summary.expensesTotalInr), tone: "text-rose-300/90" },
        { label: "Net (revenue − expenses)", value: fmtInr(summary.netInr), tone: "text-white font-semibold" },
        { label: "Receipts # / INR", value: `${summary.receiptsCount} · ${fmtInr(summary.receiptsTotalInr)}`, tone: "text-[#94a3b8]" },
        { label: "Expenses count", value: String(summary.expensesCount), tone: "text-[#94a3b8]" },
        {
          label: "Onboarded, not enrolled",
          value: String(summary.onboardedNotEnrolledCount),
          tone: "text-orange-300/90",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Analytics</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Reports</h1>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
            Filter by date range, review KPIs, then export selected sections to Excel. Fees pending and “not enrolled”
            are live snapshots; other metrics respect the range when noted.
          </p>
        </div>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">From</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setRange((r) => ({ ...r, dateFrom: e.target.value }))}
              className="mt-1.5 block rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">To</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setRange((r) => ({ ...r, dateTo: e.target.value }))}
              className="mt-1.5 block rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-xl border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#7dd3fc] hover:bg-[#00d4ff]/20"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setRange({ dateFrom: "", dateTo: "" })}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:bg-white/5"
          >
            Clear dates (all time)
          </button>
        </div>

        <div>
          <p className="text-[10px] font-mono uppercase text-[#64748b] mb-2">Excel export — include sheets</p>
          <div className="flex flex-wrap gap-2 mb-2">
            <button type="button" onClick={() => toggleAll(true)} className="text-[11px] font-mono text-[#64748b] hover:text-white underline">
              Select all
            </button>
            <span className="text-[#334155]">·</span>
            <button type="button" onClick={() => toggleAll(false)} className="text-[11px] font-mono text-[#64748b] hover:text-white underline">
              Clear
            </button>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {SECTIONS.map((s) => (
              <label
                key={s.id}
                className={`flex gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors ${
                  include[s.id] ? "border-[#a78bfa]/35 bg-[#a78bfa]/10" : "border-white/[0.06] bg-black/20"
                }`}
              >
                <input
                  type="checkbox"
                  checked={include[s.id] ?? false}
                  onChange={(e) => setInclude((prev) => ({ ...prev, [s.id]: e.target.checked }))}
                  className="mt-0.5 rounded border-white/20"
                />
                <span>
                  <span className="block text-sm text-white">{s.label}</span>
                  <span className="block text-[11px] text-[#64748b] mt-0.5">{s.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            disabled={exporting}
            onClick={() => void onExport()}
            className="rounded-xl border border-[#fbbf24]/35 bg-[#fbbf24]/10 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#fcd34d] hover:bg-[#fbbf24]/20 disabled:opacity-50"
          >
            {exporting ? "Preparing…" : "Export to Excel (.xlsx)"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-[#64748b] font-mono text-sm">Loading metrics…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-white/[0.06] bg-black/30 px-4 py-4">
              <p className="text-[10px] font-mono uppercase text-[#64748b]">{k.label}</p>
              <p className={`mt-2 text-lg tabular-nums ${k.tone}`}>{k.value}</p>
            </div>
          ))}
        </div>
      )}

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Balance to collect (installments)</h2>
          <p className="mt-1 text-xs text-[#64748b] max-w-2xl">
            Same installment-level breakdown as the dashboard detail modal. Not filtered by the report date range — it is
            a live snapshot of amounts still owed.
          </p>
        </div>
        <OutstandingBalanceTable
          data={balData}
          loading={balLoading}
          onPageChange={(p) => setBalPage(p)}
          emptyMessage="No outstanding installments — all caught up."
        />
      </section>
    </div>
  );
}
