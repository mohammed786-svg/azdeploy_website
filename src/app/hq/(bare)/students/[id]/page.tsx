"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqModal from "@/components/hq/HqModal";

type HistoryEntry = { batchId: string; batchName: string; enrolledAt: number; leftAt?: number };

type Student = {
  id: string;
  serial?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  degree?: string;
  college?: string;
  passoutYear?: string;
  city?: string;
  gender?: string;
  status?: string;
  currentBatchId?: string | null;
  currentBatchName?: string | null;
  feeStructureId?: string | null;
  batchHistory?: HistoryEntry[];
  createdAt?: number;
  updatedAt?: number;
};

type FeeStructure = {
  id: string;
  name: string;
  code: string;
  totalAmount: number;
  currency: string;
};

type Inv = {
  id: string;
  invoiceNumber: string;
  total: number;
  currency: string;
  status: string;
  createdAt?: number;
};

type Rcpt = {
  id: string;
  receiptNumber: string;
  amount: number;
  currency: string;
  purpose: string;
  receivedAt?: number;
};

type Onb = {
  id: string;
  fullName?: string;
  status?: string;
  createdAt?: number;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050508] text-[#e8eef5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 pb-16">{children}</div>
    </div>
  );
}

function formatGenderLabel(raw: string | undefined | null): string {
  if (!raw) return "";
  const m: Record<string, string> = {
    female: "Female",
    male: "Male",
    other: "Other",
    prefer_not_say: "Prefer not to say",
  };
  return m[raw] ?? raw;
}

export default function HqStudentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [student, setStudent] = useState<Student | null>(null);
  const [fee, setFee] = useState<FeeStructure | null>(null);
  const [invoices, setInvoices] = useState<Inv[]>([]);
  const [receipts, setReceipts] = useState<Rcpt[]>([]);
  const [onboarding, setOnboarding] = useState<Onb[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editErr, setEditErr] = useState("");
  const [editBatches, setEditBatches] = useState<{ id: string; name: string }[]>([]);
  const [editFees, setEditFees] = useState<{ id: string; name: string; code: string }[]>([]);
  const [efullName, setEfullName] = useState("");
  const [eemail, setEemail] = useState("");
  const [ephone, setEphone] = useState("");
  const [edegree, setEdegree] = useState("");
  const [ecollege, setEcollege] = useState("");
  const [epassoutYear, setEpassoutYear] = useState("");
  const [ecity, setEcity] = useState("");
  const [egender, setEgender] = useState("");
  const [estatus, setEstatus] = useState("active");
  const [ebatchId, setEbatchId] = useState("");
  const [efeeId, setEfeeId] = useState("");
  const [ePassword, setEPassword] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErr("");
    try {
      const stRes = await hqFetch<{ item: Student }>(`/api/hq/students/${id}`);
      const st = stRes.item;
      setStudent(st);

      const fid = st.feeStructureId ? String(st.feeStructureId) : "";
      if (fid) {
        try {
          const fRes = await hqFetch<{ item: FeeStructure }>(`/api/hq/fee-structures/${fid}`);
          setFee(fRes.item);
        } catch {
          setFee(null);
        }
      } else {
        setFee(null);
      }

      const [invRes, recRes, onRes] = await Promise.all([
        hqFetch<{ items: Inv[] }>(hqListUrl("/api/hq/invoices", { page: 1, pageSize: 100, sort: "createdAt_desc", studentId: id })),
        hqFetch<{ items: Rcpt[] }>(hqListUrl("/api/hq/receipts", { page: 1, pageSize: 100, sort: "receivedAt_desc", studentId: id })),
        hqFetch<{ items: Onb[] }>(hqListUrl("/api/hq/onboarding", { page: 1, pageSize: 50, sort: "createdAt_desc", studentId: id })),
      ]);
      setInvoices(invRes.items ?? []);
      setReceipts(recRes.items ?? []);
      setOnboarding(onRes.items ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const [b, f] = await Promise.all([
          hqFetch<{ items: { id: string; name?: string }[] }>(
            hqListUrl("/api/hq/batches", { page: 1, pageSize: 100, sort: "name_asc" })
          ),
          hqFetch<{ items: { id: string; name?: string; code?: string }[] }>(
            hqListUrl("/api/hq/fee-structures", { page: 1, pageSize: 100, sort: "name_asc" })
          ),
        ]);
        if (cancelled) return;
        setEditBatches((b.items ?? []).map((x) => ({ id: x.id, name: x.name ?? x.id })));
        setEditFees((f.items ?? []).map((x) => ({ id: x.id, name: x.name ?? "", code: x.code ?? "" })));
      } catch {
        /* dropdowns stay empty */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function openEditModal() {
    if (!student) return;
    setEfullName(student.fullName ?? "");
    setEemail(student.email ?? "");
    setEphone(student.phone ?? "");
    setEdegree(student.degree ?? "");
    setEcollege(student.college ?? "");
    setEpassoutYear(student.passoutYear ?? "");
    setEcity(student.city ?? "");
    setEgender(student.gender ?? "");
    setEstatus((student.status ?? "active").trim() || "active");
    setEbatchId(student.currentBatchId ?? "");
    setEfeeId(student.feeStructureId ?? "");
    setEPassword("");
    setEditErr("");
    setEditOpen(true);
  }

  if (loading) {
    return (
      <Shell>
        <p className="text-[#64748b] font-mono text-sm py-20 text-center">Loading student…</p>
      </Shell>
    );
  }

  if (err || !student) {
    return (
      <Shell>
        <div className="space-y-4">
          <p className="text-red-400/90 font-mono text-sm">{err || "Not found"}</p>
          <Link href="/hq/students" className="text-[#7dd3fc] text-sm font-mono hover:underline">
            ← All students
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <Link href="/hq/students" className="text-[11px] font-mono text-[#7dd3fc] hover:underline">
            ← All students
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openEditModal()}
              className="text-[11px] font-mono text-[#a78bfa] hover:underline"
            >
              Edit student
            </button>
            <Link
              href={`/hq/students/${id}/print`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-emerald-400 hover:underline"
            >
              A4 PDF
            </Link>
            <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest">HQ · Student profile</p>
          </div>
        </div>

        <header>
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Student profile</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{student.fullName ?? "—"}</h1>
          <p className="mt-2 text-lg font-mono font-semibold text-[#fde68a] tabular-nums">
            Student ID · {typeof student.serial === "number" ? student.serial : "—"}
          </p>
          <p className="mt-1 text-[10px] font-mono text-[#64748b] break-all max-w-full" title={student.id}>
            Record key · {student.id}
          </p>
          <div className="mt-4 text-sm text-[#94a3b8] space-y-1">
            <p>{student.email}</p>
            <p>{student.phone}</p>
            {student.gender ? <p className="text-[#94a3b8]">Gender · {formatGenderLabel(student.gender)}</p> : null}
            {(student.degree || student.college) && (
              <p>
                {[student.degree, student.college].filter(Boolean).join(" · ")}
              </p>
            )}
            <p>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] font-mono text-[#cbd5e1]">
                {student.status ?? "—"}
              </span>
              {student.currentBatchName && (
                <span className="ml-2 text-[#64748b] font-mono text-xs">Batch: {student.currentBatchName}</span>
              )}
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-white/[0.06] bg-[#07070c]/80 p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Fee structure</h2>
          {fee ? (
            <p className="text-[#94a3b8] text-sm">
              <span className="font-mono text-[#a78bfa]">{fee.code}</span> — {fee.name} · {fee.currency}{" "}
              {Number(fee.totalAmount).toLocaleString("en-IN")}
            </p>
          ) : student.feeStructureId ? (
            <p className="text-amber-400/80 text-sm font-mono">Linked fee ID not found (may have been deleted).</p>
          ) : (
            <p className="text-[#64748b] text-sm font-mono">No fee structure linked.</p>
          )}
        </section>

        <section className="rounded-2xl border border-white/[0.06] overflow-hidden">
          <h2 className="text-sm font-semibold text-white px-4 py-3 border-b border-white/[0.06]">Invoices</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] font-mono uppercase text-[#64748b] border-b border-white/[0.06]">
                <th className="px-4 py-2">Invoice</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-[#64748b] font-mono text-sm">
                    No invoices for this student.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-[#7dd3fc]">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-[#94a3b8]">
                      {inv.currency} {Number(inv.total).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8]">{inv.status}</td>
                    <td className="px-4 py-3 text-right">
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
                        className="ml-3 text-[11px] font-mono text-emerald-400 hover:underline"
                      >
                        A4 PDF
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-white/[0.06] overflow-hidden">
          <h2 className="text-sm font-semibold text-white px-4 py-3 border-b border-white/[0.06]">Receipts</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] font-mono uppercase text-[#64748b] border-b border-white/[0.06]">
                <th className="px-4 py-2">Receipt</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Purpose</th>
                <th className="px-4 py-2 text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-[#64748b] font-mono text-sm">
                    No receipts for this student.
                  </td>
                </tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-[#a78bfa]">{r.receiptNumber}</td>
                    <td className="px-4 py-3 text-[#94a3b8]">
                      {r.currency} {Number(r.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-[#94a3b8] max-w-[220px] truncate" title={r.purpose}>
                      {r.purpose}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/hq/receipts/${r.id}/print`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-emerald-400 hover:underline"
                      >
                        A4 PDF
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-[#07070c]/60 p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Onboarding</h2>
          {onboarding.length === 0 ? (
            <p className="text-[#64748b] font-mono text-sm">No onboarding records linked (or created before student link).</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {onboarding.map((o) => (
                <li key={o.id} className="flex flex-wrap justify-between gap-2 text-[#94a3b8]">
                  <span className="font-mono text-xs text-[#64748b]">{o.id.slice(0, 10)}…</span>
                  <span>{o.status}</span>
                  {o.createdAt && (
                    <span className="text-[#64748b] text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-white/[0.06] bg-[#07070c]/60 p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Batch history</h2>
          {(student.batchHistory ?? []).length === 0 ? (
            <p className="text-[#64748b] font-mono text-sm">No history entries.</p>
          ) : (
            <ul className="space-y-2 text-xs text-[#94a3b8] font-mono">
              {student.batchHistory!.map((h) => (
                <li key={`${h.batchId}-${h.enrolledAt}`}>
                  {h.batchName || h.batchId} · enrolled {new Date(h.enrolledAt).toLocaleString()}
                  {h.leftAt != null && <span className="text-amber-200/80"> · left {new Date(h.leftAt).toLocaleString()}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <HqModal open={editOpen} onClose={() => setEditOpen(false)} title="Edit student" size="lg">
        <p className="text-xs text-[#64748b] mb-4">
          Student ID · {typeof student.serial === "number" ? student.serial : "—"} (read-only) · Record key ·{" "}
          <span className="font-mono text-[#94a3b8]">{student.id}</span>
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Full name</span>
            <input
              value={efullName}
              onChange={(e) => setEfullName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Email</span>
            <input
              type="email"
              value={eemail}
              onChange={(e) => setEemail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Phone</span>
            <input
              value={ephone}
              onChange={(e) => setEphone(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Gender</span>
            <select
              value={egender}
              onChange={(e) => setEgender(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            >
              <option value="">—</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_say">Prefer not to say</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Degree / course</span>
            <input
              value={edegree}
              onChange={(e) => setEdegree(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">College</span>
            <input
              value={ecollege}
              onChange={(e) => setEcollege(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Pass-out year</span>
            <input
              value={epassoutYear}
              onChange={(e) => setEpassoutYear(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">City</span>
            <input
              value={ecity}
              onChange={(e) => setEcity(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Status</span>
            <input
              value={estatus}
              onChange={(e) => setEstatus(e.target.value)}
              placeholder="e.g. active"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Current batch</span>
            <select
              value={ebatchId}
              onChange={(e) => setEbatchId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            >
              <option value="">— None —</option>
              {editBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Fee structure</span>
            <select
              value={efeeId}
              onChange={(e) => setEfeeId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            >
              <option value="">— None —</option>
              {editFees.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code ? `${f.code} — ${f.name}` : f.name || f.id}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">HQ password (required to save)</span>
            <input
              type="password"
              autoComplete="current-password"
              value={ePassword}
              onChange={(e) => setEPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
            />
          </label>
        </div>
        {editErr && (
          <p className="mt-3 text-sm text-amber-400/90 font-mono" role="alert">
            {editErr}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            onClick={() => setEditOpen(false)}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-mono uppercase text-[#94a3b8] hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={editSaving}
            onClick={() => {
              setEditErr("");
              const fn = efullName.trim();
              const em = eemail.trim();
              const ph = ephone.trim();
              if (!fn || !em || !ph) {
                setEditErr("Full name, email, and phone are required.");
                return;
              }
              if (!ePassword.trim()) {
                setEditErr("Enter your HQ password to save.");
                return;
              }
              setEditSaving(true);
              void (async () => {
                try {
                  await hqFetch<{ item: Student }>(`/api/hq/students/${id}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                      confirmPassword: ePassword,
                      fullName: fn,
                      email: em,
                      phone: ph,
                      degree: edegree,
                      college: ecollege,
                      passoutYear: epassoutYear,
                      city: ecity,
                      gender: egender,
                      status: estatus.trim() || "active",
                      currentBatchId: ebatchId || null,
                      feeStructureId: efeeId || null,
                    }),
                  });
                  setEditOpen(false);
                  await load();
                } catch (e) {
                  setEditErr(e instanceof Error ? e.message : "Save failed");
                } finally {
                  setEditSaving(false);
                }
              })();
            }}
            className="rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/35 px-4 py-2 text-xs font-mono uppercase text-[#7dd3fc] hover:bg-[#00d4ff]/25 disabled:opacity-50"
          >
            {editSaving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </HqModal>
    </Shell>
  );
}
