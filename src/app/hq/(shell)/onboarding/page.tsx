"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";

type Batch = { id: string; name: string; code: string };
type Fee = { id: string; name: string; code: string };
type BatchTiming = { id: string; batchId: string; label: string; startTime: string; endTime: string; active: boolean };
type Onboarding = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  batchId: string;
  feeStructureId?: string | null;
  batchTimingId?: string | null;
  batchTimingLabel?: string;
  degree?: string;
  college?: string;
  address?: string;
  notes?: string;
  gender?: string;
  status: string;
  profileImageUrl?: string;
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
  const searchParams = useSearchParams();
  const focusLoaded = useRef<string | null>(null);
  const [data, setData] = useState<PageData | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [timings, setTimings] = useState<BatchTiming[]>([]);
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
  const [batchTimingId, setBatchTimingId] = useState("");
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [gender, setGender] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<Onboarding | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadRefs = useCallback(async () => {
    const [b, f, t] = await Promise.all([
      hqFetch<{ items: Batch[] }>(hqListUrl("/api/hq/batches", { page: 1, pageSize: 500, sort: "code_asc" })),
      hqFetch<{ items: Fee[] }>(hqListUrl("/api/hq/fee-structures", { page: 1, pageSize: 500, sort: "code_asc" })),
      hqFetch<{ items: BatchTiming[] }>(hqListUrl("/api/hq/batch-timings", { page: 1, pageSize: 1000, sort: "label_asc" })),
    ]);
    setBatches(b.items ?? []);
    setFees(f.items ?? []);
    setTimings((t.items ?? []).filter((x) => x.active !== false));
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

  async function onProfileImageChange(file: File | null) {
    if (!file) {
      setProfileImageUrl("");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErr("Please upload an image file.");
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErr("Image size must be under 2MB.");
      return;
    }
    setSaving(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await hqFetch<{ url: string }>(
        "/api/hq/uploads/profile-image",
        { method: "POST", body: form },
        { successMessage: "Profile image uploaded." }
      );
      if (!res?.url) throw new Error("Upload failed");
      setErr("");
      setProfileImageUrl(res.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setSaving(false);
    }
  }

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
          batchTimingId: batchTimingId || null,
          degree,
          college,
          address,
          gender: gender || "",
          profileImageUrl,
          notes,
        }),
      });
      setFullName("");
      setEmail("");
      setPhone("");
      setBatchId("");
      setFeeStructureId("");
      setBatchTimingId("");
      setDegree("");
      setCollege("");
      setAddress("");
      setGender("");
      setProfileImageUrl("");
      setNotes("");
      setCreateOpen(false);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function openEditModal(item: Onboarding) {
    setEditId(item.id);
    setFullName(item.fullName || "");
    setEmail(item.email || "");
    setPhone(item.phone || "");
    setBatchId(item.batchId || "");
    setFeeStructureId(item.feeStructureId || "");
    setBatchTimingId(item.batchTimingId || "");
    setDegree(item.degree || "");
    setCollege(item.college || "");
    setAddress(item.address || "");
    setGender(item.gender || "");
    setProfileImageUrl(item.profileImageUrl || "");
    setNotes(item.notes || "");
    setEditOpen(true);
  }

  useEffect(() => {
    const fid = searchParams.get("focus");
    if (!fid || focusLoaded.current === fid) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await hqFetch<{ item: Onboarding }>(`/api/hq/onboarding/${fid}`);
        if (cancelled || !res?.item) return;
        focusLoaded.current = fid;
        openEditModal(res.item);
      } catch {
        /* invalid id or network */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  async function onEditSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setSaving(true);
    setErr("");
    try {
      await hqFetch(`/api/hq/onboarding/${editId}`, {
        method: "PATCH",
        body: JSON.stringify({
          fullName,
          email,
          phone,
          batchId,
          feeStructureId: feeStructureId || null,
          batchTimingId: batchTimingId || null,
          degree,
          college,
          address,
          gender: gender || "",
          profileImageUrl,
          notes,
        }),
      });
      setEditOpen(false);
      setEditId(null);
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Update failed");
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
  const batchCodeById = new Map(batches.map((b) => [b.id, b.code]));
  const feeCodeById = new Map(fees.map((f) => [f.id, f.code]));

  function openViewModal(item: Onboarding) {
    setViewItem(item);
    setViewOpen(true);
  }

  function genderLabel(raw?: string) {
    if (!raw) return "—";
    return raw === "prefer_not_say" ? "Prefer not to say" : raw.charAt(0).toUpperCase() + raw.slice(1);
  }

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
          <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <p className="text-[10px] font-mono uppercase text-[#64748b]">Profile picture</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-white/5">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Student profile preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-mono text-[#64748b]">
                    No photo
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => void onProfileImageChange(e.target.files?.[0] ?? null)}
                  className="block text-xs text-[#94a3b8] file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-white/5 file:px-3 file:py-1.5 file:text-[11px] file:font-mono file:text-[#cbd5e1] hover:file:bg-white/10"
                />
                {profileImageUrl ? (
                  <button
                    type="button"
                    onClick={() => setProfileImageUrl("")}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-mono uppercase text-[#94a3b8] hover:bg-white/5"
                  >
                    Remove photo
                  </button>
                ) : null}
              </div>
            </div>
          </div>
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
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Batch timing (optional)</span>
            <select
              value={batchTimingId}
              onChange={(e) => setBatchTimingId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
            >
              <option value="">None</option>
              {timings
                .filter((t) => t.batchId === batchId)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({t.startTime} - {t.endTime})
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
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Address</span>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y" />
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

      <HqModal open={editOpen} onClose={() => setEditOpen(false)} title="Edit onboarding" size="lg">
        <form onSubmit={onEditSave} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <p className="text-[10px] font-mono uppercase text-[#64748b]">Profile picture</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-full border border-white/10 bg-white/5">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Student profile preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-mono text-[#64748b]">
                    No photo
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => void onProfileImageChange(e.target.files?.[0] ?? null)}
                  className="block text-xs text-[#94a3b8] file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-white/5 file:px-3 file:py-1.5 file:text-[11px] file:font-mono file:text-[#cbd5e1] hover:file:bg-white/10"
                />
                {profileImageUrl ? (
                  <button
                    type="button"
                    onClick={() => setProfileImageUrl("")}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-mono uppercase text-[#94a3b8] hover:bg-white/5"
                  >
                    Remove photo
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Full name *</span>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm" required />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Email *</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm" required />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Phone *</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm" required />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Gender</span>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm">
              <option value="">—</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Batch *</span>
            <select value={batchId} onChange={(e) => setBatchId(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm" required>
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
            <select value={feeStructureId} onChange={(e) => setFeeStructureId(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm">
              <option value="">None</option>
              {fees.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} — {f.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Batch timing (optional)</span>
            <select value={batchTimingId} onChange={(e) => setBatchTimingId(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm">
              <option value="">None</option>
              {timings
                .filter((t) => t.batchId === batchId)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({t.startTime} - {t.endTime})
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
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Address</span>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y" />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Notes</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y" />
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => setEditOpen(false)} className="rounded-xl border border-white/10 px-4 py-2 text-xs text-[#94a3b8] hover:bg-white/5">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-xl bg-[#34d399]/15 border border-[#34d399]/40 px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-[#6ee7b7] hover:bg-[#34d399]/25 disabled:opacity-50">
            {saving ? "Saving…" : "Update onboarding"}
          </button>
        </div>
        </form>
      </HqModal>

      <HqModal open={viewOpen} onClose={() => setViewOpen(false)} title="Onboarding details" size="lg">
        {!viewItem ? (
          <p className="text-sm text-[#64748b] font-mono">No data.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                {viewItem.profileImageUrl ? (
                  <img src={viewItem.profileImageUrl} alt={`${viewItem.fullName} profile`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-mono text-[#64748b]">N/A</div>
                )}
              </div>
              <div>
                <p className="text-white font-semibold">{viewItem.fullName || "—"}</p>
                <p className="text-xs text-[#94a3b8] mt-1">{viewItem.email || "—"} · {viewItem.phone || "—"}</p>
                <p className="mt-2">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                    viewItem.status === "pending"
                      ? "border-amber-400/40 text-amber-200/90"
                      : viewItem.status === "approved"
                        ? "border-emerald-400/40 text-emerald-200/90"
                        : "border-red-400/30 text-red-200/80"
                  }`}>
                    {viewItem.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <p><span className="text-[#64748b]">Batch:</span> {(batchCodeById.get(viewItem.batchId || "") ?? viewItem.batchId) || "—"}</p>
              <p><span className="text-[#64748b]">Fee:</span> {viewItem.feeStructureId ? feeCodeById.get(viewItem.feeStructureId) ?? viewItem.feeStructureId : "—"}</p>
              <p><span className="text-[#64748b]">Timing:</span> {viewItem.batchTimingLabel || "—"}</p>
              <p><span className="text-[#64748b]">Gender:</span> {genderLabel(viewItem.gender)}</p>
              <p><span className="text-[#64748b]">Degree:</span> {viewItem.degree || "—"}</p>
              <p><span className="text-[#64748b]">College:</span> {viewItem.college || "—"}</p>
              <p className="sm:col-span-2"><span className="text-[#64748b]">Address:</span> {viewItem.address || "—"}</p>
              <p className="sm:col-span-2 whitespace-pre-wrap break-words"><span className="text-[#64748b]">Notes:</span> {viewItem.notes || "—"}</p>
            </div>
          </div>
        )}
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
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
          {items.length === 0 ? (
            <p className="text-[#64748b] font-mono text-sm py-6 text-center rounded-2xl border border-dashed border-white/10">
              No records match filters.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase text-[#64748b]">
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Batch</th>
                    <th className="px-4 py-3">Fee</th>
                    <th className="px-4 py-3">Timing</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {items.map((o) => (
                    <tr key={o.id} className="hover:bg-white/[0.02] align-top">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                            {o.profileImageUrl ? (
                              <img src={o.profileImageUrl} alt={`${o.fullName} profile`} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-mono text-[#64748b]">N/A</div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{o.fullName}</p>
                            <p className="text-xs text-[#64748b]">Gender: {genderLabel(o.gender)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">
                        <p>{o.email || "—"}</p>
                        <p className="text-xs text-[#64748b] mt-1">{o.phone || "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8] font-mono">{(batchCodeById.get(o.batchId || "") ?? o.batchId) || "—"}</td>
                      <td className="px-4 py-3 text-[#94a3b8] font-mono">{o.feeStructureId ? feeCodeById.get(o.feeStructureId) ?? o.feeStructureId : "—"}</td>
                      <td className="px-4 py-3 text-[#94a3b8]">{o.batchTimingLabel || "—"}</td>
                      <td className="px-4 py-3">
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
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openViewModal(o)}
                            className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-mono text-[#cbd5e1] hover:bg-white/5"
                          >
                            View
                          </button>
                          {o.status === "pending" ? (
                            <button
                              type="button"
                              onClick={() => openEditModal(o)}
                              className="rounded-lg border border-sky-300/30 bg-sky-500/10 px-3 py-1.5 text-[11px] font-mono text-sky-200 hover:bg-sky-500/20"
                            >
                              Edit
                            </button>
                          ) : null}
                          {o.status === "pending" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActionId(o.id);
                                setAction("approve");
                              }}
                              className="rounded-lg bg-emerald-500/15 border border-emerald-400/40 px-3 py-1.5 text-[11px] font-mono text-emerald-200 hover:bg-emerald-500/25"
                            >
                              Approve
                            </button>
                          ) : null}
                          {o.status === "pending" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActionId(o.id);
                                setAction("reject");
                              }}
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-mono text-[#94a3b8] hover:bg-white/5"
                            >
                              Reject
                            </button>
                          ) : null}
                          {o.studentId ? (
                            <Link
                              href={`/hq/students/${o.studentId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-[#a78bfa]/30 bg-[#a78bfa]/10 px-3 py-1.5 text-[11px] font-mono text-[#c4b5fd] hover:bg-[#a78bfa]/20"
                            >
                              Student
                            </Link>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
