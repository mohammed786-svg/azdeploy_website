"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import OutstandingBalanceTable, { type OutstandingPage } from "@/components/hq/OutstandingBalanceTable";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";

type PendingSummary = {
  todayDate: string;
  previousDate: string;
  todayPendingInr: number;
  previousPendingInr: number;
  todayRows: number;
  previousRows: number;
};

type PendingPage = OutstandingPage & { summary?: PendingSummary };

function fmtInr(v: number) {
  return `INR ${Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function HqFeesPendingFullPage() {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PendingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const url = useMemo(
    () =>
      hqListUrl("/api/hq/stats/outstanding-breakdown", {
        page,
        pageSize: 25,
        search: search || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        sort: "createdAt_desc",
      }),
    [page, search, dateFrom, dateTo]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const d = await hqFetch<PendingPage>(url);
      setData(d);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="min-h-screen bg-[#050508] text-[#e8eef5]">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Collections</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Fees pending — detail view</h1>
            <p className="mt-1 text-sm text-[#94a3b8]">Full-screen table with filters and pagination (no sidebar).</p>
          </div>
          <Link
            href="/hq"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:bg-white/[0.08]"
          >
            Back to dashboard
          </Link>
        </header>

        {data?.summary ? (
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="text-[10px] font-mono uppercase text-amber-200/80">Current date ({data.summary.todayDate})</p>
              <p className="mt-1 text-lg font-bold text-amber-100 tabular-nums">{fmtInr(data.summary.todayPendingInr)}</p>
              <p className="mt-1 text-xs text-amber-100/80">{data.summary.todayRows} pending installment rows</p>
            </div>
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4">
              <p className="text-[10px] font-mono uppercase text-sky-200/80">Previous date ({data.summary.previousDate})</p>
              <p className="mt-1 text-lg font-bold text-sky-100 tabular-nums">{fmtInr(data.summary.previousPendingInr)}</p>
              <p className="mt-1 text-xs text-sky-100/80">{data.summary.previousRows} pending installment rows</p>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-white/[0.06] bg-[#07070c]/80 p-4 sm:p-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="block min-w-0 flex-1 basis-[220px]">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Search</span>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Student, invoice, installment..."
                className="mt-1.5 block w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Due from</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className="mt-1.5 block w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Due to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className="mt-1.5 block w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setDateFrom("");
                setDateTo("");
                setPage(1);
              }}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:bg-white/5"
            >
              Clear
            </button>
          </div>
        </div>

        {err ? (
          <p className="text-sm text-amber-400/90 font-mono" role="alert">
            {err}
          </p>
        ) : null}

        <OutstandingBalanceTable data={data} loading={loading} onPageChange={setPage} />
      </div>
    </div>
  );
}
