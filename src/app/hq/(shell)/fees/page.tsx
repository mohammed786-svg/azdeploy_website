"use client";

import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";

type Inst = { id: string; label: string; amount: number; dueOffsetDays: number };

type FeeStructure = {
  id: string;
  name: string;
  code: string;
  description?: string;
  totalAmount: number;
  currency: string;
  installments: Inst[];
  updatedAt?: number;
};

type PageData = {
  items: FeeStructure[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const emptyInst = (): Inst => ({
  id: "",
  label: "",
  amount: 0,
  dueOffsetDays: 0,
});

export default function HqFeesPage() {
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

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [instRows, setInstRows] = useState<Inst[]>([emptyInst()]);
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editTotal, setEditTotal] = useState("");
  const [editCurrency, setEditCurrency] = useState("INR");
  const [editInst, setEditInst] = useState<Inst[]>([]);
  const [editPassword, setEditPassword] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/fee-structures", {
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

  function addRow() {
    setInstRows((r) => [...r, emptyInst()]);
  }

  function updateRow(i: number, patch: Partial<Inst>) {
    setInstRows((rows) => rows.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const installments = instRows
        .filter((x) => x.label.trim() || x.amount > 0)
        .map((x, i) => ({
          label: x.label.trim() || `Installment ${i + 1}`,
          amount: Number(x.amount) || 0,
          dueOffsetDays: Number(x.dueOffsetDays) || 30 * i,
        }));
      await hqFetch("/api/hq/fee-structures", {
        method: "POST",
        body: JSON.stringify({
          name,
          code,
          description,
          totalAmount: Number(totalAmount),
          currency,
          installments,
        }),
      });
      setName("");
      setCode("");
      setDescription("");
      setTotalAmount("");
      setInstRows([emptyInst()]);
      setCreateOpen(false);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(fs: FeeStructure) {
    setEditId(fs.id);
    setEditName(fs.name);
    setEditCode(fs.code);
    setEditDesc(fs.description ?? "");
    setEditTotal(String(fs.totalAmount));
    setEditCurrency(fs.currency || "INR");
    setEditInst(fs.installments?.length ? [...fs.installments] : [emptyInst()]);
    setEditPassword("");
    setEditOpen(true);
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId || !editPassword.trim()) {
      setErr("Password required.");
      return;
    }
    setEditSaving(true);
    setErr("");
    try {
      const installments = editInst.map((x, i) => ({
        id: x.id || `inst_${i + 1}`,
        label: x.label.trim() || `Installment ${i + 1}`,
        amount: Number(x.amount) || 0,
        dueOffsetDays: Number(x.dueOffsetDays) || 30 * i,
      }));
      await hqFetch(`/api/hq/fee-structures/${editId}`, {
        method: "PATCH",
        body: JSON.stringify({
          confirmPassword: editPassword,
          name: editName,
          code: editCode,
          description: editDesc,
          totalAmount: Number(editTotal),
          currency: editCurrency,
          installments,
        }),
      });
      setEditOpen(false);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Update failed");
    } finally {
      setEditSaving(false);
    }
  }

  async function submitDelete(password: string) {
    if (!deleteId) return;
    await hqFetch(`/api/hq/fee-structures/${deleteId}`, {
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
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Pricing</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Fee structures</h1>
          <p className="mt-2 text-sm text-[#94a3b8]">Edit and delete require HQ password.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="shrink-0 rounded-xl bg-[#a78bfa]/20 border border-[#a78bfa]/40 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#c4b5fd] hover:bg-[#a78bfa]/30"
        >
          New fee structure
        </button>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

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
          { value: "updatedAt_asc", label: "Oldest update" },
          { value: "name_asc", label: "Name A→Z" },
          { value: "totalAmount_desc", label: "Total high → low" },
          { value: "totalAmount_asc", label: "Total low → high" },
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

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="New fee structure" size="2xl">
        <form onSubmit={onCreate} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Name *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Code *</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm uppercase"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Total (₹) *</span>
            <input
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              type="number"
              min={0}
              step="0.01"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Currency</span>
            <input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm uppercase"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y"
            />
          </label>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono uppercase text-[#64748b]">Installments (optional)</p>
            <button type="button" onClick={addRow} className="text-[11px] font-mono text-[#7dd3fc] hover:underline">
              + Row
            </button>
          </div>
          {instRows.map((row, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-xl border border-white/[0.06] p-3 bg-black/30">
              <label className="sm:col-span-5">
                <span className="text-[10px] text-[#64748b]">Label</span>
                <input
                  value={row.label}
                  onChange={(e) => updateRow(i, { label: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-2 py-2 text-sm"
                />
              </label>
              <label className="sm:col-span-3">
                <span className="text-[10px] text-[#64748b]">Amount</span>
                <input
                  value={row.amount || ""}
                  onChange={(e) => updateRow(i, { amount: Number(e.target.value) })}
                  type="number"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-2 py-2 text-sm"
                />
              </label>
              <label className="sm:col-span-3">
                <span className="text-[10px] text-[#64748b]">Due +days</span>
                <input
                  value={row.dueOffsetDays}
                  onChange={(e) => updateRow(i, { dueOffsetDays: Number(e.target.value) })}
                  type="number"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-2 py-2 text-sm"
                />
              </label>
            </div>
          ))}
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
            className="rounded-xl bg-[#a78bfa]/20 border border-[#a78bfa]/40 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-[#c4b5fd] hover:bg-[#a78bfa]/30 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save structure"}
          </button>
        </div>
        </form>
      </HqModal>

      {loading ? (
        <p className="text-[#64748b] font-mono text-sm">Loading…</p>
      ) : (
        <div className="space-y-4">
          {items.map((fs) => (
            <div
              key={fs.id}
              className="rounded-2xl border border-white/[0.06] bg-[#07070c]/60 p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            >
              <div>
                <p className="text-xs font-mono text-[#a78bfa]">{fs.code}</p>
                <h3 className="text-lg font-semibold text-white mt-1">{fs.name}</h3>
                <p className="text-sm text-[#94a3b8] mt-1">
                  Total {fs.currency} {Number(fs.totalAmount).toLocaleString("en-IN")}
                </p>
                {fs.installments?.length ? (
                  <ul className="mt-3 space-y-1 text-xs text-[#64748b] font-mono">
                    {fs.installments.map((x) => (
                      <li key={x.id}>
                        {x.label}: {fs.currency} {Number(x.amount).toLocaleString("en-IN")} · due +{x.dueOffsetDays}d
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-[#64748b]">Single payment</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" onClick={() => openEdit(fs)} className="text-[11px] font-mono text-[#7dd3fc] hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => setDeleteId(fs.id)} className="text-[11px] font-mono text-red-400/80 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-[#64748b] font-mono text-sm text-center py-8">No structures match filters.</p>
          )}
        </div>
      )}

      <HqModal open={editOpen} onClose={() => setEditOpen(false)} title="Edit fee structure" size="xl">
          <form
            onSubmit={submitEdit}
            className="space-y-4"
          >
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">Name</span>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">Code</span>
              <input
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 uppercase"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">Total</span>
              <input
                value={editTotal}
                onChange={(e) => setEditTotal(e.target.value)}
                type="number"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">Currency</span>
              <input
                value={editCurrency}
                onChange={(e) => setEditCurrency(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">Description</span>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2"
              />
            </label>
            <p className="text-[10px] font-mono text-[#64748b]">Installments</p>
            {editInst.map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                <input
                  value={row.label}
                  onChange={(e) => setEditInst((rows) => rows.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))}
                  className="rounded border border-white/10 bg-black/50 px-2 py-1"
                  placeholder="Label"
                />
                <input
                  type="number"
                  value={row.amount || ""}
                  onChange={(e) => setEditInst((rows) => rows.map((r, j) => (j === i ? { ...r, amount: Number(e.target.value) } : r)))}
                  className="rounded border border-white/10 bg-black/50 px-2 py-1"
                  placeholder="Amount"
                />
                <input
                  type="number"
                  value={row.dueOffsetDays}
                  onChange={(e) => setEditInst((rows) => rows.map((r, j) => (j === i ? { ...r, dueOffsetDays: Number(e.target.value) } : r)))}
                  className="rounded border border-white/10 bg-black/50 px-2 py-1"
                  placeholder="+days"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setEditInst((r) => [...r, emptyInst()])}
              className="text-[11px] font-mono text-[#7dd3fc]"
            >
              + Installment row
            </button>
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">HQ password *</span>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-500/30 bg-black/50 px-3 py-2"
                required
              />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditOpen(false)} className="rounded-lg border border-white/10 px-4 py-2 text-xs text-[#94a3b8]">
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSaving}
                className="rounded-lg bg-[#a78bfa]/20 border border-[#a78bfa]/40 px-4 py-2 text-xs text-[#c4b5fd] disabled:opacity-50"
              >
                {editSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
      </HqModal>

      <ConfirmPasswordModal
        open={deleteId != null}
        title="Delete fee structure"
        message="Enter HQ password."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={submitDelete}
      />
    </div>
  );
}
