"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";
import { StudentBillingHint, type StudentBillingSummary } from "@/components/hq/StudentBillingHint";

type Student = { id: string; fullName: string };

type Receipt = {
  id: string;
  receiptNumber: string;
  studentId?: string;
  studentName: string;
  amount: number;
  currency: string;
  purpose: string;
  paymentMethod?: string;
  receivedAt?: number;
  createdAt?: number;
};

type PageData = {
  items: Receipt[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqReceiptsPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("receivedAt_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("Fee payment");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [receivedAt, setReceivedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [billingSummary, setBillingSummary] = useState<StudentBillingSummary | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadStudents = useCallback(async () => {
    const st = await hqFetch<{ items: Student[] }>(hqListUrl("/api/hq/students", { page: 1, pageSize: 500, sort: "fullName_asc" }));
    setStudents(st.items ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/receipts", {
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
    void loadStudents();
  }, [loadStudents]);

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
    if (!studentId || !amount) {
      setErr("Student and amount required");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      await hqFetch("/api/hq/receipts", {
        method: "POST",
        body: JSON.stringify({
          studentId,
          amount: Number(amount),
          purpose,
          paymentMethod: paymentMethod.trim() || "Cash",
          receivedAt,
          notes,
        }),
      });
      setAmount("");
      setNotes("");
      setCreateOpen(false);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function submitDelete(password: string) {
    if (!deleteId) return;
    await hqFetch(`/api/hq/receipts/${deleteId}`, {
      method: "DELETE",
      body: JSON.stringify({ confirmPassword: password }),
    });
    setDeleteId(null);
    await load();
  }

  const items = data?.items ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Payments</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Receipts</h1>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
            White A4 receipt: open <strong className="text-white/90">A4 PDF</strong> — print saves only the document.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPaymentMethod("Cash");
            setCreateOpen(true);
          }}
          className="shrink-0 rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15"
        >
          Record payment
        </button>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="Record payment" size="lg">
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
                <option value="">Select</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName}
                  </option>
                ))}
              </select>
            </label>
            {studentId ? <StudentBillingHint loading={billingLoading} data={billingSummary} /> : null}
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Amount (INR) *</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
                required
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Received on</span>
              <input
                value={receivedAt}
                onChange={(e) => setReceivedAt(e.target.value)}
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Purpose</span>
              <input
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Payment type</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank transfer">Bank transfer</option>
                <option value="NEFT / RTGS">NEFT / RTGS</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Notes</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y" />
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
              disabled={saving || students.length === 0}
              className="rounded-xl bg-white/10 border border-white/20 px-6 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create receipt"}
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
          { value: "receivedAt_desc", label: "Newest payment" },
          { value: "receivedAt_asc", label: "Oldest payment" },
          { value: "total_desc", label: "Amount high → low" },
          { value: "total_asc", label: "Amount low → high" },
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
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#64748b] font-mono text-sm">
                    No receipts.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-[#a78bfa]">{r.receiptNumber}</td>
                    <td className="px-4 py-3 text-white">
                      {r.studentId ? (
                        <Link
                          href={`/hq/students/${r.studentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {r.studentName}
                        </Link>
                      ) : (
                        r.studentName
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8]">
                      {r.currency} {Number(r.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8] max-w-[200px] truncate" title={r.purpose}>
                      {r.purpose}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8] text-xs font-mono whitespace-nowrap">
                      {r.paymentMethod ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/hq/receipts/${r.id}/print`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-emerald-400 hover:underline"
                        >
                          A4 PDF
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(r.id)}
                          className="text-[11px] font-mono text-red-400/80 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmPasswordModal
        open={deleteId != null}
        title="Delete receipt"
        message="Enter HQ password."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={submitDelete}
      />
    </div>
  );
}
