"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";
import { StudentBillingHint, type StudentBillingSummary } from "@/components/hq/StudentBillingHint";

type Student = { id: string; fullName: string };
type Fee = { id: string; name: string; code: string };
type Invoice = {
  id: string;
  invoiceNumber: string;
  studentId?: string;
  studentName: string;
  total: number;
  currency: string;
  status: string;
  createdAt?: number;
};

type PageData = {
  items: Invoice[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqInvoicesPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("createdAt_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [studentId, setStudentId] = useState("");
  const [feeStructureId, setFeeStructureId] = useState("");
  const [taxPercent, setTaxPercent] = useState("0");
  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [billingSummary, setBillingSummary] = useState<StudentBillingSummary | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadRefs = useCallback(async () => {
    const [st, f] = await Promise.all([
      hqFetch<{ items: Student[] }>(hqListUrl("/api/hq/students", { page: 1, pageSize: 500, sort: "fullName_asc" })),
      hqFetch<{ items: Fee[] }>(hqListUrl("/api/hq/fee-structures", { page: 1, pageSize: 500, sort: "name_asc" })),
    ]);
    setStudents(st.items ?? []);
    setFees(f.items ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/invoices", {
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
    void loadRefs();
  }, [loadRefs]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!createOpen || !studentId) {
      setBillingSummary(null);
      setBillingLoading(false);
      return;
    }
    let cancelled = false;
    setBillingLoading(true);
    (async () => {
      try {
        const d = await hqFetch<StudentBillingSummary>(`/api/hq/students/${studentId}/billing-summary`);
        if (!cancelled) setBillingSummary(d);
      } catch {
        if (!cancelled) setBillingSummary(null);
      } finally {
        if (!cancelled) setBillingLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [createOpen, studentId]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!studentId || !feeStructureId) {
      setErr("Select student and fee structure");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      await hqFetch("/api/hq/invoices", {
        method: "POST",
        body: JSON.stringify({
          studentId,
          feeStructureId,
          taxPercent: Number(taxPercent) || 0,
          baseDate,
          status: "sent",
        }),
      });
      setStudentId("");
      setFeeStructureId("");
      setTaxPercent("0");
      setCreateOpen(false);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  const items = data?.items ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Billing</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Invoices & billing</h1>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
            Use <strong className="text-white/90">A4 print view</strong> for PDF — only the document is printed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="shrink-0 rounded-xl bg-[#fbbf24]/15 border border-[#fbbf24]/40 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#fde68a] hover:bg-[#fbbf24]/25"
        >
          New invoice
        </button>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="New invoice from fee structure" size="lg">
        <form onSubmit={onCreate} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Student *</span>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
                required
              >
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName}
                  </option>
                ))}
              </select>
            </label>
            {studentId ? <StudentBillingHint loading={billingLoading} data={billingSummary} /> : null}
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Fee structure *</span>
              <select
                value={feeStructureId}
                onChange={(e) => setFeeStructureId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
                required
              >
                <option value="">Select structure</option>
                {fees.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.code} — {f.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Tax %</span>
              <input
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Schedule base date</span>
              <input
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs text-[#94a3b8] hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || students.length === 0 || fees.length === 0}
              className="rounded-xl bg-[#fbbf24]/15 border border-[#fbbf24]/40 px-6 py-2 text-xs font-mono uppercase tracking-wider text-[#fde68a] hover:bg-[#fbbf24]/25 disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create invoice"}
            </button>
          </div>
        </form>
      </HqModal>

      <HqListToolbar
        search={search}
        onSearchChange={setSearch}
        sortValue={sort}
        onSortChange={(v) => {
          setSort(v);
          setPage(1);
        }}
        sortOptions={[
          { value: "createdAt_desc", label: "Newest" },
          { value: "createdAt_asc", label: "Oldest" },
          { value: "total_desc", label: "Total high → low" },
          { value: "total_asc", label: "Total low → high" },
          { value: "invoiceNumber_asc", label: "Invoice # A→Z" },
          { value: "studentName_asc", label: "Student A→Z" },
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

      {loading ? (
        <p className="text-[#64748b] font-mono text-sm">Loading…</p>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase text-[#64748b]">
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[#64748b] font-mono text-sm">
                    No invoices match filters.
                  </td>
                </tr>
              ) : (
                items.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/hq/invoices/${inv.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[#7dd3fc] hover:underline"
                      >
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-white">
                      {inv.studentId ? (
                        <Link
                          href={`/hq/students/${inv.studentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-[#e8eef5]"
                        >
                          {inv.studentName}
                        </Link>
                      ) : (
                        inv.studentName
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8]">
                      {inv.currency} {Number(inv.total).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] font-mono text-[#cbd5e1]">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/hq/invoices/${inv.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-[#a78bfa] hover:underline"
                        >
                          Manage
                        </Link>
                        <Link
                          href={`/hq/invoices/${inv.id}/print`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-[#34d399] hover:underline"
                        >
                          A4 PDF
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
