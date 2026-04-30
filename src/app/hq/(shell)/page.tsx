"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hqDownloadBlob, hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqDashboardCharts from "@/components/hq/HqDashboardCharts";
import HqModal from "@/components/hq/HqModal";
import OutstandingBalanceTable, { type OutstandingPage } from "@/components/hq/OutstandingBalanceTable";

type Stats = {
  enquiries: number;
  students: number;
  onboardingPending: number;
  openInvoiceTotal: number;
  outstandingToCollectInr: number;
  expensesTotalInr: number;
  receiptsTotalInr: number;
};

type PublicStudentCounter = {
  configured: boolean;
  today: string;
  displayCount: number;
  seatsLeft: number;
  batchCapacity: number;
  totalAvailableSeats: number;
  totalSeatsRemaining: number;
  anchorDate: string;
  countAtAnchor: number;
  uniqueVisitors?: number;
};

type PendingReminderSummary = {
  todayDate: string;
  previousDate: string;
  todayPendingInr: number;
  previousPendingInr: number;
  todayRows: number;
  previousRows: number;
};

function currentDaySlot(d = new Date()): "morning" | "evening" | "night" | null {
  const h = d.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 16 && h < 20) return "evening";
  if (h >= 20 || h < 2) return "night";
  return null;
}

function slotLabel(slot: "morning" | "evening" | "night"): string {
  if (slot === "morning") return "Morning";
  if (slot === "evening") return "Evening";
  return "Night";
}

export default function HqDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [counter, setCounter] = useState<PublicStudentCounter | null>(null);
  const [counterInput, setCounterInput] = useState("");
  const [batchCapInput, setBatchCapInput] = useState("");
  const [totalAvailInput, setTotalAvailInput] = useState("");
  const [counterSaving, setCounterSaving] = useState(false);
  const [counterErr, setCounterErr] = useState("");
  const [err, setErr] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportErr, setExportErr] = useState("");

  const [balanceOpen, setBalanceOpen] = useState(false);
  const [balData, setBalData] = useState<OutstandingPage | null>(null);
  const [balLoading, setBalLoading] = useState(false);
  const [pendingReminder, setPendingReminder] = useState<PendingReminderSummary | null>(null);
  const [pendingReminderOpen, setPendingReminderOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<"morning" | "evening" | "night" | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await hqFetch<Stats>("/api/hq/stats");
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const slot = currentDaySlot();
    if (!slot) return;
    const today = new Date().toISOString().slice(0, 10);
    const key = `hq_fees_pending_popup_seen_${today}_${slot}`;
    if (typeof window !== "undefined" && window.localStorage.getItem(key) === "1") return;
    let cancelled = false;
    (async () => {
      try {
        const d = await hqFetch<{ summary?: PendingReminderSummary }>(
          hqListUrl("/api/hq/stats/outstanding-breakdown", { page: 1, pageSize: 5, sort: "createdAt_desc" })
        );
        if (cancelled || !d.summary) return;
        setPendingReminder(d.summary);
        setPendingSlot(slot);
        setPendingReminderOpen(true);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadBalancePage = useCallback(async (page: number) => {
    setBalLoading(true);
    try {
      const url = hqListUrl("/api/hq/stats/outstanding-breakdown", {
        page,
        pageSize: 12,
        sort: "createdAt_desc",
      });
      const d = await hqFetch<OutstandingPage>(url);
      setBalData(d);
    } catch {
      setBalData(null);
    } finally {
      setBalLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!balanceOpen) return;
    void loadBalancePage(1);
  }, [balanceOpen, loadBalancePage]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const c = await hqFetch<PublicStudentCounter>("/api/hq/public-student-count");
        if (!cancelled) {
          setCounter(c);
          setCounterInput(String(c.displayCount));
          setBatchCapInput(String(c.batchCapacity));
          setTotalAvailInput(String(c.totalAvailableSeats));
        }
      } catch {
        if (!cancelled) setCounter(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Overview</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-[#94a3b8] max-w-xl leading-relaxed">
          Live signals from Firebase Realtime Database — enquiries, roster, onboarding, billing, expenses, and balance to
          collect.
        </p>
        {err && (
          <p className="mt-4 text-sm text-red-400/90 font-mono" role="alert">
            {err}
          </p>
        )}
        <div className="mt-4">
          <Link
            href="/hq/fees-pending"
            className="inline-flex items-center rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-amber-200 hover:bg-amber-500/20"
          >
            Full Screen Fees Pending Detail
          </Link>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Link
            href="/hq/enquiries"
            className="block rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#00d4ff]/20 to-transparent to-[#0a0a10]/90 p-5 sm:p-6 hover:border-[#00d4ff]/20 transition-colors group"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Enquiries</p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tabular-nums">{stats?.enquiries ?? "—"}</p>
            <p className="mt-2 text-xs text-[#64748b] group-hover:text-[#94a3b8] transition-colors">From public /enquiry form</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-[#00d4ff]/80 group-hover:text-[#00d4ff]">
              Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Link
            href="/hq/students"
            className="block rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#a78bfa]/20 to-transparent to-[#0a0a10]/90 p-5 sm:p-6 hover:border-[#00d4ff]/20 transition-colors group"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Students</p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tabular-nums">{stats?.students ?? "—"}</p>
            <p className="mt-2 text-xs text-[#64748b] group-hover:text-[#94a3b8] transition-colors">Active records in HQ</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-[#00d4ff]/80 group-hover:text-[#00d4ff]">
              Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="block rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#00d4ff]/12 to-transparent to-[#0a0a10]/90 p-5 sm:p-6">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Homepage unique visitors</p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-[#7dd3fc] tabular-nums">
              {counter?.uniqueVisitors ?? "—"}
            </p>
            <p className="mt-2 text-xs text-[#64748b]">One device counts as one unique visitor</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-[#00d4ff]/80">
              Live from public API
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <Link
            href="/hq/onboarding"
            className="block rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#fbbf24]/15 to-transparent to-[#0a0a10]/90 p-5 sm:p-6 hover:border-[#00d4ff]/20 transition-colors group"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Onboarding queue</p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tabular-nums">{stats?.onboardingPending ?? "—"}</p>
            <p className="mt-2 text-xs text-[#64748b] group-hover:text-[#94a3b8] transition-colors">Pending approvals</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-[#00d4ff]/80 group-hover:text-[#00d4ff]">
              Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          <Link
            href="/hq/receipts"
            className="block rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#34d399]/15 to-transparent to-[#0a0a10]/90 p-5 sm:p-6 hover:border-[#00d4ff]/20 transition-colors group"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Receipts (lifetime)</p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tabular-nums">
              {stats != null ? `₹${Number(stats.receiptsTotalInr).toLocaleString("en-IN")}` : "—"}
            </p>
            <p className="mt-2 text-xs text-[#64748b] group-hover:text-[#94a3b8] transition-colors">Fee payments recorded (INR)</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-[#00d4ff]/80 group-hover:text-[#00d4ff]">
              Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Link
            href="/hq/expenses"
            className="block rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#f87171]/12 to-transparent to-[#0a0a10]/90 p-5 sm:p-6 hover:border-[#f87171]/25 transition-colors group"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Expenses (lifetime)</p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-white tabular-nums">
              {stats != null ? `₹${Number(stats.expensesTotalInr).toLocaleString("en-IN")}` : "—"}
            </p>
            <p className="mt-2 text-xs text-[#64748b] group-hover:text-[#94a3b8] transition-colors">Operational spend (INR)</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-[#fca5a5]/80 group-hover:text-[#fca5a5]">
              Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
          <button
            type="button"
            onClick={() => setBalanceOpen(true)}
            className="w-full text-left rounded-2xl border border-white/[0.06] bg-gradient-to-br from-amber-500/15 to-transparent to-[#0a0a10]/90 p-5 sm:p-6 hover:border-amber-400/30 transition-colors group cursor-pointer"
          >
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Balance to collect</p>
            <p className="mt-3 text-3xl sm:text-4xl font-bold text-amber-200/95 tabular-nums">
              {stats != null ? `₹${Number(stats.outstandingToCollectInr).toLocaleString("en-IN")}` : "—"}
            </p>
            <p className="mt-2 text-xs text-[#64748b] group-hover:text-[#94a3b8] transition-colors">
              Outstanding per installment · Click for details
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-amber-400/90 group-hover:text-amber-300">
              View breakdown <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </button>
        </motion.div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-[#07070c]/80 p-6 sm:p-8 space-y-4">
        <h2 className="text-sm font-semibold text-white">Quick actions</h2>
        <p className="text-xs text-[#64748b] leading-relaxed max-w-2xl">
          Download a single workbook with every HQ table: students, invoices, receipts, onboarding, enquiries, batches,
          fee structures, and expenses. Nested fields (e.g. installments) are stored as JSON text in the cell.
        </p>
        {exportErr && (
          <p className="text-sm text-red-400/90 font-mono" role="alert">
            {exportErr}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={exporting}
            onClick={() => {
              setExportErr("");
              setExporting(true);
              void (async () => {
                try {
                  await hqDownloadBlob("/api/hq/export/excel", "hq-export.xlsx");
                } catch (e) {
                  setExportErr(e instanceof Error ? e.message : "Export failed");
                } finally {
                  setExporting(false);
                }
              })();
            }}
            className="rounded-xl border border-[#fbbf24]/35 bg-[#fbbf24]/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#fcd34d] hover:bg-[#fbbf24]/20 disabled:opacity-50"
          >
            {exporting ? "Preparing…" : "Export all to Excel (.xlsx)"}
          </button>
          <Link
            href="/hq/onboarding"
            className="rounded-xl border border-[#a78bfa]/30 bg-[#a78bfa]/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#c4b5fd] hover:bg-[#a78bfa]/20 inline-flex items-center"
          >
            New onboarding
          </Link>
          <Link
            href="/hq/fees"
            className="rounded-xl border border-[#00d4ff]/25 bg-[#00d4ff]/5 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#7dd3fc] hover:bg-[#00d4ff]/10 inline-flex items-center"
          >
            Add fee structure
          </Link>
          <Link
            href="/hq/invoices"
            className="rounded-xl border border-[#34d399]/25 bg-[#34d399]/5 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#6ee7b7] hover:bg-[#34d399]/10 inline-flex items-center"
          >
            Create invoice
          </Link>
          <Link
            href="/hq/reports"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:bg-white/[0.08] inline-flex items-center"
          >
            Reports
          </Link>
          <Link
            href="/hq/chat"
            className="rounded-xl border border-[#25d366]/35 bg-[#25d366]/10 px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-[#86efac] hover:bg-[#25d366]/20 inline-flex items-center"
          >
            Chat inbox
          </Link>
        </div>
      </div>

      {stats && (
        <HqDashboardCharts
          enquiries={stats.enquiries}
          students={stats.students}
          onboardingPending={stats.onboardingPending}
          receiptsTotalInr={stats.receiptsTotalInr}
          expensesTotalInr={stats.expensesTotalInr}
          outstandingToCollectInr={stats.outstandingToCollectInr}
        />
      )}

      <HqModal open={balanceOpen} onClose={() => setBalanceOpen(false)} title="Balance to collect — details" size="2xl">
        <p className="text-xs text-[#64748b] mb-4">
          Installment-level balances still owed (INR). Same table is available on the Reports page with pagination.
        </p>
        <OutstandingBalanceTable
          data={balData}
          loading={balLoading}
          onPageChange={(p) => void loadBalancePage(p)}
        />
      </HqModal>

      <HqModal
        open={pendingReminderOpen}
        onClose={() => {
          setPendingReminderOpen(false);
          if (pendingSlot && typeof window !== "undefined") {
            const today = new Date().toISOString().slice(0, 10);
            window.localStorage.setItem(`hq_fees_pending_popup_seen_${today}_${pendingSlot}`, "1");
          }
        }}
        title={`Fees pending reminder${pendingSlot ? ` — ${slotLabel(pendingSlot)}` : ""}`}
        size="lg"
      >
        {pendingReminder ? (
          <div className="space-y-4">
            <p className="text-xs text-[#64748b]">
              Daily reminder for current and previous date pending fees. Open full screen detail for filters, table and
              pagination.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                <p className="text-[10px] font-mono uppercase text-amber-200/80">Current ({pendingReminder.todayDate})</p>
                <p className="mt-1 text-lg font-bold text-amber-100 tabular-nums">
                  INR {pendingReminder.todayPendingInr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-xs text-amber-100/80">{pendingReminder.todayRows} rows pending</p>
              </div>
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
                <p className="text-[10px] font-mono uppercase text-sky-200/80">Previous ({pendingReminder.previousDate})</p>
                <p className="mt-1 text-lg font-bold text-sky-100 tabular-nums">
                  INR {pendingReminder.previousPendingInr.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-xs text-sky-100/80">{pendingReminder.previousRows} rows pending</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Link
                href="/hq/fees-pending"
                onClick={() => {
                  setPendingReminderOpen(false);
                  if (pendingSlot && typeof window !== "undefined") {
                    const today = new Date().toISOString().slice(0, 10);
                    window.localStorage.setItem(`hq_fees_pending_popup_seen_${today}_${pendingSlot}`, "1");
                  }
                }}
                className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-xs font-mono uppercase tracking-wider text-amber-200 hover:bg-amber-500/20"
              >
                Open detailed page
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#64748b] font-mono">Loading reminder…</p>
        )}
      </HqModal>

      <div className="rounded-2xl border border-white/[0.06] bg-[#07070c]/80 p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Homepage — students registered</h2>
          <p className="mt-2 text-xs text-[#64748b] leading-relaxed max-w-2xl">
            The public site shows this number on the home HUD. It increases by <strong className="text-[#94a3b8]">1 each calendar day (UTC)</strong> from the saved anchor. Set it to the
            number you want displayed <strong className="text-[#94a3b8]">today</strong>; tomorrow it will be one higher automatically. Starting default when Firebase is first used:{" "}
            <strong className="text-[#94a3b8]">1</strong> anchored to today.
          </p>
          {counter && (
            <p className="mt-3 text-[11px] font-mono text-[#64748b]">
              Today (UTC): {counter.today} · Anchor: {counter.anchorDate} · Base: {counter.countAtAnchor} · Shown:{" "}
              <span className="text-[#00d4ff]">{counter.displayCount}</span> · Batch left: {counter.seatsLeft} · Total
              seats: {counter.totalAvailableSeats} · Program left: {counter.totalSeatsRemaining}
              {counter.uniqueVisitors != null ? ` · Unique devices: ${counter.uniqueVisitors}` : ""}
              {!counter.configured && " · Firebase not configured — counter fixed at 1 on site"}
            </p>
          )}
          {counterErr && (
            <p className="mt-2 text-sm text-red-400/90 font-mono" role="alert">
              {counterErr}
            </p>
          )}
          <form
            className="mt-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setCounterErr("");
              const n = Number(counterInput);
              const bc = batchCapInput.trim() === "" ? undefined : Number(batchCapInput);
              const ta = totalAvailInput.trim() === "" ? undefined : Number(totalAvailInput);
              if (!Number.isFinite(n) || n < 0) {
                setCounterErr("Enter a non-negative number for today’s count.");
                return;
              }
              if (bc !== undefined && (!Number.isFinite(bc) || bc < 1)) {
                setCounterErr("Batch capacity must be at least 1.");
                return;
              }
              if (ta !== undefined && (!Number.isFinite(ta) || ta < 0)) {
                setCounterErr("Total available seats must be zero or positive.");
                return;
              }
              setCounterSaving(true);
              try {
                const body: {
                  displayCountToday: number;
                  batchCapacity?: number;
                  totalAvailableSeats?: number;
                } = { displayCountToday: Math.floor(n) };
                if (bc !== undefined) body.batchCapacity = Math.floor(bc);
                if (ta !== undefined) body.totalAvailableSeats = Math.floor(ta);
                const updated = await hqFetch<PublicStudentCounter & { ok?: boolean }>("/api/hq/public-student-count", {
                  method: "PATCH",
                  body: JSON.stringify(body),
                });
                setCounter({
                  configured: true,
                  today: updated.today,
                  displayCount: updated.displayCount,
                  seatsLeft: updated.seatsLeft,
                  batchCapacity: updated.batchCapacity,
                  totalAvailableSeats: updated.totalAvailableSeats,
                  totalSeatsRemaining: updated.totalSeatsRemaining,
                  anchorDate: updated.anchorDate,
                  countAtAnchor: updated.countAtAnchor,
                });
                setCounterInput(String(updated.displayCount));
                setBatchCapInput(String(updated.batchCapacity));
                setTotalAvailInput(String(updated.totalAvailableSeats));
              } catch (ex) {
                setCounterErr(ex instanceof Error ? ex.message : "Save failed");
              } finally {
                setCounterSaving(false);
              }
            }}
          >
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Displayed count (today, UTC)</span>
              <input
                type="number"
                min={0}
                step={1}
                value={counterInput}
                onChange={(e) => setCounterInput(e.target.value)}
                className="mt-1 block w-full sm:w-40 rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white tabular-nums"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Seats per batch (HUD)</span>
              <input
                type="number"
                min={1}
                step={1}
                value={batchCapInput}
                onChange={(e) => setBatchCapInput(e.target.value)}
                className="mt-1 block w-full sm:w-36 rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white tabular-nums"
                title="Used for BATCH_LEFT on the homepage widget"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Total available seats (program)</span>
              <input
                type="number"
                min={0}
                step={1}
                value={totalAvailInput}
                onChange={(e) => setTotalAvailInput(e.target.value)}
                className="mt-1 block w-full sm:w-40 rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white tabular-nums"
                title="Overall capacity for TOTAL_AVAILABLE / TOTAL_LEFT on the public site"
              />
            </label>
            <button
              type="submit"
              disabled={counterSaving}
              className="rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/35 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#7dd3fc] hover:bg-[#00d4ff]/25 disabled:opacity-50"
            >
              {counterSaving ? "Saving…" : "Save counter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
