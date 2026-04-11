"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";

type Expense = {
  id: string;
  expenseNumber: string;
  title: string;
  amount: number;
  currency: string;
  category?: string;
  vendor?: string;
  notes?: string;
  spentAt?: number;
  createdAt?: number;
};

type PageData = {
  items: Expense[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const CATEGORIES = ["", "Rent", "Salary", "Marketing", "Utilities", "Software", "Travel", "Other"];

export default function HqExpensesPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("spentAt_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [vendor, setVendor] = useState("");
  const [spentAt, setSpentAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [editRow, setEditRow] = useState<Expense | null>(null);
  const [eTitle, setETitle] = useState("");
  const [eAmount, setEAmount] = useState("");
  const [eCategory, setECategory] = useState("");
  const [eVendor, setEVendor] = useState("");
  const [eSpentAt, setESpentAt] = useState("");
  const [eNotes, setENotes] = useState("");
  const [ePassword, setEPassword] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/expenses", {
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

  function openEdit(x: Expense) {
    setEditRow(x);
    setETitle(x.title ?? "");
    setEAmount(String(x.amount ?? ""));
    setECategory(x.category ?? "");
    setEVendor(x.vendor ?? "");
    setENotes(x.notes ?? "");
    setEPassword("");
    const ms = x.spentAt ?? x.createdAt;
    setESpentAt(ms ? new Date(ms).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !amount) return;
    setSaving(true);
    setErr("");
    try {
      await hqFetch("/api/hq/expenses", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          category: category || undefined,
          vendor: vendor || undefined,
          spentAt,
          notes: notes || undefined,
        }),
      });
      setTitle("");
      setAmount("");
      setCategory("");
      setVendor("");
      setNotes("");
      setCreateOpen(false);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  async function onEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editRow || !ePassword.trim()) {
      setErr("HQ password required to save.");
      return;
    }
    setEditSaving(true);
    setErr("");
    try {
      await hqFetch(`/api/hq/expenses/${editRow.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: eTitle.trim(),
          amount: Number(eAmount),
          category: eCategory,
          vendor: eVendor,
          notes: eNotes,
          spentAt: eSpentAt,
          confirmPassword: ePassword,
        }),
      });
      setEditRow(null);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setEditSaving(false);
    }
  }

  async function submitDelete(password: string) {
    if (!deleteId) return;
    await hqFetch(`/api/hq/expenses/${deleteId}`, {
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
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Finance</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Expenses</h1>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
            Operational spend for AZ Deploy Academy. Totals roll into <strong className="text-white/90">Reports</strong>{" "}
            and Excel exports.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="shrink-0 rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15"
        >
          Add expense
        </button>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="New expense" size="lg">
        <form onSubmit={onCreate} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Title *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
                required
              />
            </label>
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
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Spent on</span>
              <input
                value={spentAt}
                onChange={(e) => setSpentAt(e.target.value)}
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c || "none"} value={c}>
                    {c || "—"}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Vendor</span>
              <input
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y"
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
              disabled={saving}
              className="rounded-xl bg-white/10 border border-white/20 px-6 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </HqModal>

      <HqModal open={editRow != null} onClose={() => setEditRow(null)} title="Edit expense" size="lg">
        <form onSubmit={onEditSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <p className="sm:col-span-2 text-xs font-mono text-[#64748b]">{editRow?.expenseNumber}</p>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Title *</span>
              <input
                value={eTitle}
                onChange={(e) => setETitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
                required
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Amount *</span>
              <input
                value={eAmount}
                onChange={(e) => setEAmount(e.target.value)}
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
                required
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Spent on</span>
              <input
                value={eSpentAt}
                onChange={(e) => setESpentAt(e.target.value)}
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Category</span>
              <select
                value={eCategory}
                onChange={(e) => setECategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c || "none"} value={c}>
                    {c || "—"}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Vendor</span>
              <input
                value={eVendor}
                onChange={(e) => setEVendor(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Notes</span>
              <textarea
                value={eNotes}
                onChange={(e) => setENotes(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">HQ password *</span>
              <input
                type="password"
                value={ePassword}
                onChange={(e) => setEPassword(e.target.value)}
                autoComplete="off"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
                required
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditRow(null)}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs text-[#94a3b8] hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={editSaving}
              className="rounded-xl bg-white/10 border border-white/20 px-6 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15 disabled:opacity-50"
            >
              {editSaving ? "Saving…" : "Save changes"}
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
          { value: "spentAt_desc", label: "Newest spend" },
          { value: "spentAt_asc", label: "Oldest spend" },
          { value: "total_desc", label: "Amount high → low" },
          { value: "total_asc", label: "Amount low → high" },
          { value: "title_asc", label: "Title A→Z" },
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
                <th className="px-4 py-3">Expense</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Spent</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#64748b] font-mono text-sm">
                    No expenses.{" "}
                    <Link href="/hq/reports" className="text-[#7dd3fc] hover:underline">
                      View reports
                    </Link>
                  </td>
                </tr>
              ) : (
                items.map((x) => (
                  <tr key={x.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-[#fbbf24]/90">{x.expenseNumber}</td>
                    <td className="px-4 py-3 text-white">{x.title}</td>
                    <td className="px-4 py-3 text-[#94a3b8]">
                      {x.currency} {Number(x.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8]">{x.category || "—"}</td>
                    <td className="px-4 py-3 text-[#64748b] text-xs font-mono">
                      {x.spentAt
                        ? new Date(x.spentAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(x)}
                          className="text-[11px] font-mono text-[#7dd3fc] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(x.id)}
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
        title="Delete expense"
        message="Enter HQ password."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={submitDelete}
      />
    </div>
  );
}
