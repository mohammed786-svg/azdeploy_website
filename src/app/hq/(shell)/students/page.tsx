"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import { maskStudentId } from "@/lib/student-id-mask";
import HqListToolbar from "@/components/hq/HqListToolbar";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";

function formatBalance(currency: string, amount: number): string {
  const cur = (currency || "INR").toUpperCase();
  const n = Number(amount) || 0;
  const formatted = n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (cur === "INR") return `₹${formatted}`;
  return `${cur} ${formatted}`;
}

type Student = {
  id: string;
  serial?: number;
  fullName: string;
  email: string;
  phone: string;
  currentBatchName?: string | null;
  currentBatchId?: string | null;
  batchTimingLabel?: string | null;
  status?: string;
  updatedAt?: number;
  /** Unpaid invoice total — same basis as student profile billing hint */
  balanceOutstanding?: number;
  balanceCurrency?: string;
};

type PageData = {
  items: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqStudentsPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("updatedAt_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/students", {
        page,
        pageSize,
        search: debouncedSearch,
        sort,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      const res = await hqFetch<PageData>(url);
      setData(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sort, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submitDelete(password: string) {
    if (!deleteId) return;
    await hqFetch(`/api/hq/students/${deleteId}`, {
      method: "DELETE",
      body: JSON.stringify({ confirmPassword: password }),
    });
    setDeleteId(null);
    await load();
  }

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Roster</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">All students</h1>
        <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
          <strong className="text-white/90">Click a student name</strong> for full profile (fees, invoices, receipts). Balance column is unpaid
          invoice total (same as the profile billing hint). Delete requires HQ password.
        </p>
      </header>

      <HqListToolbar
        search={search}
        onSearchChange={setSearch}
        sortValue={sort}
        onSortChange={(v) => {
          setSort(v);
          setPage(1);
        }}
        sortOptions={[
          { value: "updatedAt_desc", label: "Recently updated" },
          { value: "updatedAt_asc", label: "Oldest first" },
          { value: "serial_asc", label: "Student ID 1→9" },
          { value: "serial_desc", label: "Student ID 9→1" },
          { value: "fullName_asc", label: "Name A→Z" },
          { value: "email_asc", label: "Email A→Z" },
        ]}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={(v) => {
          setDateFrom(v);
          setPage(1);
        }}
        onDateToChange={(v) => {
          setDateTo(v);
          setPage(1);
        }}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

      {loading ? (
        <p className="text-[#64748b] font-mono text-sm">Loading…</p>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase text-[#64748b]">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3 whitespace-nowrap">ID</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Current batch</th>
                <th className="px-4 py-3">Timing</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Balance due</th>
                  <th className="px-4 py-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-[#64748b] font-mono text-sm">
                      No students match filters.
                    </td>
                  </tr>
                ) : (
                  items.map((s) => {
                    const bal = Number(s.balanceOutstanding) || 0;
                    const cur = s.balanceCurrency ?? "INR";
                    const hasDue = bal > 0.005;
                    return (
                      <tr key={s.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <Link
                            href={`/hq/students/${s.id}`}
                            className="text-white font-medium hover:text-[#7dd3fc] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3fc]/50 rounded"
                          >
                            {s.fullName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className="text-sm font-mono font-semibold text-[#fde68a] tabular-nums">
                            {maskStudentId(typeof s.serial === "number" ? s.serial : null)}
                          </span>
                          <div
                            className="text-[10px] font-mono text-[#64748b] mt-1 break-all max-w-[200px]"
                            title={s.id}
                          >
                            {s.id}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[#94a3b8]">
                          <div className="whitespace-nowrap">{s.email}</div>
                          <div className="text-xs text-[#64748b]">{s.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-[#94a3b8]">{s.currentBatchName || "—"}</td>
                        <td className="px-4 py-3 text-[#94a3b8]">{s.batchTimingLabel || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] font-mono text-[#cbd5e1]">
                            {s.status ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-mono text-sm tabular-nums ${hasDue ? "text-amber-200/95 font-semibold" : "text-emerald-300/85"}`}
                            title="Unpaid total on invoices (installments not marked paid, or full invoice if no installments)"
                          >
                            {formatBalance(cur, bal)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setDeleteId(s.id)}
                            className="text-[11px] font-mono text-red-400/80 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmPasswordModal
        open={deleteId != null}
        title="Delete student"
        message="Removes the student record. Enter HQ password."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={submitDelete}
      />
    </div>
  );
}
