"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";

type Batch = { id: string; name: string; code: string };
type Fee = { id: string; name: string; code: string };
type Onboarding = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  batchId: string;
  feeStructureId?: string | null;
  gender?: string;
  status: string;
  createdAt?: number;
  studentId?: string;
};

type PageData = {
  items: Onboarding[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqOnboardingPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [batchId, setBatchId] = useState("");
  const [feeStructureId, setFeeStructureId] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [notes, setNotes] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);

  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadRefs = useCallback(async () => {
    const [b, f] = await Promise.all([
      hqFetch<{ items: Batch[] }>(hqListUrl("/api/hq/batches", { page: 1, pageSize: 500, sort: "code_asc" })),
      hqFetch<{ items: Fee[] }>(hqListUrl("/api/hq/fee-structures", { page: 1, pageSize: 500, sort: "code_asc" })),
    ]);
    setBatches(b.items ?? []);
    setFees(f.items ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/onboarding", {
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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await hqFetch("/api/hq/onboarding", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          email,
          phone,
          batchId,
          feeStructureId: feeStructureId || null,
          degree,
          college,
          gender: gender || "",
          notes,
        }),
      });
      setFullName("");
      setEmail("");
      setPhone("");
      setBatchId("");
      setFeeStructureId("");
      setDegree("");
      setCollege("");
      setGender("");
      setNotes("");
      setCreateOpen(false);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function submitAction(password: string) {
    if (!actionId || !action) return;
    await hqFetch(`/api/hq/onboarding/${actionId}`, {
      method: "PATCH",
      body: JSON.stringify({ action, confirmPassword: password }),
    });
    setAction(null);
    setActionId(null);
    await load();
  }

  const items = data?.items ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Intake</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">New student onboarding</h1>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
            Approve / reject requires HQ password.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="shrink-0 rounded-xl bg-[#34d399]/15 border border-[#34d399]/40 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#6ee7b7] hover:bg-[#34d399]/25"
        >
          New onboarding
        </button>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create onboarding" size="lg">
        <form onSubmit={onCreate} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Full name *</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Email *</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Phone *</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Gender</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
            >
              <option value="">—</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Batch *</span>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              required
            >
              <option value="">Select batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.code} — {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Fee structure (optional)</span>
            <select
              value={feeStructureId}
              onChange={(e) => setFeeStructureId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
            >
              <option value="">None</option>
              {fees.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} — {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Degree</span>
            <input value={degree} onChange={(e) => setDegree(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm" />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">College</span>
            <input value={college} onChange={(e) => setCollege(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm" />
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
            disabled={saving}
            className="rounded-xl bg-[#34d399]/15 border border-[#34d399]/40 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-[#6ee7b7] hover:bg-[#34d399]/25 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Submit onboarding"}
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
          { value: "fullName_asc", label: "Name A→Z" },
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
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-[#64748b] font-mono text-sm py-6 text-center rounded-2xl border border-dashed border-white/10">
              No records match filters.
            </p>
          ) : (
            items.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl border border-white/[0.06] bg-[#07070c]/60 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div>
                  <p className="text-white font-semibold">{o.fullName}</p>
                  <p className="text-sm text-[#94a3b8] mt-1">
                    {o.email} · {o.phone}
                    {o.gender ? (
                      <span className="text-[#64748b]">
                        {" "}
                        ·{" "}
                        {o.gender === "prefer_not_say"
                          ? "Prefer not to say"
                          : o.gender.charAt(0).toUpperCase() + o.gender.slice(1)}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-[#64748b] font-mono mt-2">
                    Batch: {batches.find((b) => b.id === o.batchId)?.code ?? o.batchId}
                    {o.feeStructureId ? ` · Fee: ${fees.find((f) => f.id === o.feeStructureId)?.code ?? ""}` : ""}
                  </p>
                  <p className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                        o.status === "pending"
                          ? "border-amber-400/40 text-amber-200/90"
                          : o.status === "approved"
                            ? "border-emerald-400/40 text-emerald-200/90"
                            : "border-red-400/30 text-red-200/80"
                      }`}
                    >
                      {o.status}
                    </span>
                    {o.studentId && (
                      <Link
                        href={`/hq/students/${o.studentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-[10px] font-mono text-[#a78bfa] hover:underline"
                      >
                        Open student profile
                      </Link>
                    )}
                  </p>
                </div>
                {o.status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActionId(o.id);
                        setAction("approve");
                      }}
                      className="rounded-xl bg-emerald-500/15 border border-emerald-400/40 px-4 py-2 text-[11px] font-mono uppercase text-emerald-200 hover:bg-emerald-500/25"
                    >
                      Approve → student
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActionId(o.id);
                        setAction("reject");
                      }}
                      className="rounded-xl border border-white/10 px-4 py-2 text-[11px] font-mono uppercase text-[#94a3b8] hover:bg-white/5"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <ConfirmPasswordModal
        open={action != null && actionId != null}
        title={action === "approve" ? "Approve onboarding" : "Reject onboarding"}
        message="Enter HQ password to confirm."
        confirmLabel={action === "approve" ? "Approve" : "Reject"}
        onClose={() => {
          setAction(null);
          setActionId(null);
        }}
        onConfirm={submitAction}
      />
    </div>
  );
}
