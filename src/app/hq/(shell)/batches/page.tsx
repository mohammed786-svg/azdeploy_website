"use client";

import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";

type Batch = {
  id: string;
  name: string;
  code: string;
  startDate?: string;
  endDate?: string;
  capacity?: number | null;
  notes?: string;
  updatedAt?: number;
};

type PageData = {
  items: Batch[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqBatchesPage() {
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editCap, setEditCap] = useState("");
  const [editNotes, setEditNotes] = useState("");
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
      const url = hqListUrl("/api/hq/batches", {
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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await hqFetch("/api/hq/batches", {
        method: "POST",
        body: JSON.stringify({
          name,
          code,
          startDate,
          endDate,
          capacity: capacity ? Number(capacity) : null,
          notes,
        }),
      });
      setName("");
      setCode("");
      setStartDate("");
      setEndDate("");
      setCapacity("");
      setNotes("");
      setCreateOpen(false);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(b: Batch) {
    setEditId(b.id);
    setEditName(b.name);
    setEditCode(b.code);
    setEditStart(b.startDate ?? "");
    setEditEnd(b.endDate ?? "");
    setEditCap(b.capacity != null ? String(b.capacity) : "");
    setEditNotes(b.notes ?? "");
    setEditPassword("");
    setEditOpen(true);
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId || !editPassword.trim()) {
      setErr("Password required to save edits.");
      return;
    }
    setEditSaving(true);
    setErr("");
    try {
      await hqFetch(`/api/hq/batches/${editId}`, {
        method: "PATCH",
        body: JSON.stringify({
          confirmPassword: editPassword,
          name: editName,
          code: editCode,
          startDate: editStart,
          endDate: editEnd,
          capacity: editCap ? Number(editCap) : null,
          notes: editNotes,
        }),
      });
      setEditOpen(false);
      setEditId(null);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Update failed");
    } finally {
      setEditSaving(false);
    }
  }

  async function submitDelete(password: string) {
    if (!deleteId) return;
    await hqFetch(`/api/hq/batches/${deleteId}`, {
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
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Schedule</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Batch settings</h1>
          <p className="mt-2 text-sm text-[#94a3b8]">Edit and delete require your HQ password.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="shrink-0 rounded-xl bg-[#00d4ff]/20 border border-[#00d4ff]/50 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#7dd3fc] hover:bg-[#00d4ff]/30"
        >
          New batch
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
          { value: "code_asc", label: "Code A→Z" },
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

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="New batch" size="lg">
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
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Capacity</span>
              <input
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                type="number"
                min={0}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Start</span>
              <input
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">End</span>
              <input
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Notes</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y min-h-[72px]"
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
              className="rounded-xl bg-[#00d4ff]/20 border border-[#00d4ff]/50 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-[#7dd3fc] hover:bg-[#00d4ff]/30 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save batch"}
            </button>
          </div>
        </form>
      </HqModal>

      {loading ? (
        <p className="text-[#64748b] font-mono text-sm">Loading…</p>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase text-[#64748b]">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Window</th>
                <th className="px-4 py-3">Cap</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-[#64748b] text-center font-mono text-sm">
                    No batches match filters.
                  </td>
                </tr>
              ) : (
                items.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-[#a78bfa]">{b.code}</td>
                    <td className="px-4 py-3 text-white">{b.name}</td>
                    <td className="px-4 py-3 text-[#94a3b8] whitespace-nowrap">
                      {b.startDate || "—"} → {b.endDate || "—"}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8]">{b.capacity ?? "—"}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(b)}
                        className="text-[11px] font-mono text-[#7dd3fc] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(b.id)}
                        className="text-[11px] font-mono text-red-400/80 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <HqModal open={editOpen} onClose={() => setEditOpen(false)} title="Edit batch" size="lg">
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
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="text-[10px] text-[#64748b]">Start</span>
                <input
                  type="date"
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="text-[10px] text-[#64748b]">End</span>
                <input
                  type="date"
                  value={editEnd}
                  onChange={(e) => setEditEnd(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2"
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">Capacity</span>
              <input
                value={editCap}
                onChange={(e) => setEditCap(e.target.value)}
                type="number"
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">Notes</span>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[10px] text-[#64748b]">HQ password *</span>
              <input
                type="password"
                autoComplete="current-password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-amber-500/30 bg-black/50 px-3 py-2"
                required
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-xs text-[#94a3b8]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editSaving}
                className="rounded-lg bg-[#00d4ff]/20 border border-[#00d4ff]/50 px-4 py-2 text-xs text-[#7dd3fc] disabled:opacity-50"
              >
                {editSaving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
      </HqModal>

      <ConfirmPasswordModal
        open={deleteId != null}
        title="Delete batch"
        message="This cannot be undone. Enter HQ password."
        confirmLabel="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={submitDelete}
      />
    </div>
  );
}
