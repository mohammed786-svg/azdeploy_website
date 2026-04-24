"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import { maskStudentId } from "@/lib/student-id-mask";
import A4PrintShell from "@/components/hq/A4PrintShell";
import { PrintLogoBlack } from "@/components/hq/PrintLogoBlack";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";

type HistoryEntry = { batchId: string; batchName: string; enrolledAt: number; leftAt?: number };

type Student = {
  id: string;
  serial?: number;
  fullName?: string;
  profileImageUrl?: string;
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

function fmtDate(ms?: number) {
  if (ms == null) return "—";
  return new Date(ms).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
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

export default function StudentProfilePrintPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [student, setStudent] = useState<Student | null>(null);
  const [fee, setFee] = useState<FeeStructure | null>(null);
  const [invoices, setInvoices] = useState<Inv[]>([]);
  const [receipts, setReceipts] = useState<Rcpt[]>([]);
  const [onboarding, setOnboarding] = useState<Onb[]>([]);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
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
        hqFetch<{ items: Inv[] }>(
          hqListUrl("/api/hq/invoices", { page: 1, pageSize: 100, sort: "createdAt_desc", studentId: id })
        ),
        hqFetch<{ items: Rcpt[] }>(
          hqListUrl("/api/hq/receipts", { page: 1, pageSize: 100, sort: "receivedAt_desc", studentId: id })
        ),
        hqFetch<{ items: Onb[] }>(
          hqListUrl("/api/hq/onboarding", { page: 1, pageSize: 50, sort: "createdAt_desc", studentId: id })
        ),
      ]);
      setInvoices(invRes.items ?? []);
      setReceipts(recRes.items ?? []);
      setOnboarding(onRes.items ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
      setStudent(null);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!student) return;
    const prev = document.title;
    const name = sanitizeForPdfFilename(student.fullName || "Student");
    const idPart =
      typeof student.serial === "number"
        ? String(student.serial)
        : sanitizeForPdfFilename(student.id).slice(0, 16);
    document.title = `${name} — Student profile ${idPart}`;
    return () => {
      document.title = prev;
    };
  }, [student]);

  if (err || !student) {
    return (
      <A4PrintShell>
        <p className="text-red-700 text-sm">{err || "Loading…"}</p>
        <Link href={id ? `/hq/students/${id}` : "/hq/students"} className="text-blue-700 text-sm print:hidden mt-4 inline-block">
          Back
        </Link>
      </A4PrintShell>
    );
  }

  const printedAt = new Date();

  return (
    <A4PrintShell>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            .student-print-block { break-inside: avoid; page-break-inside: avoid; }
            .student-print-table thead { display: table-header-group; }
            .student-print-table tr { break-inside: avoid; }
            .student-print-outer { border: none !important; box-shadow: none !important; }
            .student-print-table th, .student-print-table td { padding-top: 3px !important; padding-bottom: 3px !important; }
            .student-print-compact-gap { margin-bottom: 8px !important; }
            .student-print-outer, .student-print-outer * { color: #000 !important; }
            .student-print-table, .student-print-table th, .student-print-table td { border-color: #000 !important; }
            .student-print-outer [class*="text-neutral-"],
            .student-print-outer [class*="text-amber-"] { color: #000 !important; }
          }
        `,
        }}
      />

      <div className="print:hidden mb-4 flex flex-wrap gap-2 text-sm">
        <Link href={`/hq/students/${id}`} className="text-blue-700 underline">
          ← Back to profile
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded border border-neutral-400 px-3 py-1 text-neutral-800 hover:bg-neutral-100"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="student-print-outer border border-neutral-300 rounded-sm print:border-0 student-print-block">
        <header className="border-b border-neutral-900 pb-2 mb-2 student-print-compact-gap">
          <div className="flex flex-col sm:flex-row sm:items-start gap-2 justify-between">
            <PrintLogoBlack className="h-10 w-[190px] max-w-full min-h-[2.5rem] hq-print-logo" />
            <div className="text-right text-xs text-neutral-600">
              <p className="font-semibold uppercase tracking-wide text-neutral-800">Student profile</p>
              <p className="mt-0.5">Record export</p>
            </div>
          </div>
        </header>

        <section className="student-print-block mb-3 student-print-compact-gap">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-neutral-900 leading-tight">{student.fullName ?? "—"}</h1>
              <p className="mt-1 text-[11px] font-semibold text-neutral-800">
                Student ID · {maskStudentId(typeof student.serial === "number" ? student.serial : null)}
              </p>
            </div>
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-300 bg-neutral-100">
              {student.profileImageUrl ? (
                <img
                  src={student.profileImageUrl}
                  alt={`${student.fullName ?? "Student"} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] font-mono text-neutral-500">
                  No photo
                </div>
              )}
            </div>
          </div>
          <dl className="mt-2 grid gap-1 text-[11px] text-neutral-800">
            {student.email && (
              <div className="flex gap-2">
                <dt className="text-neutral-500 w-28 shrink-0">Email</dt>
                <dd className="break-all">{student.email}</dd>
              </div>
            )}
            {student.phone && (
              <div className="flex gap-2">
                <dt className="text-neutral-500 w-28 shrink-0">Phone</dt>
                <dd>{student.phone}</dd>
              </div>
            )}
            {student.gender && (
              <div className="flex gap-2">
                <dt className="text-neutral-500 w-28 shrink-0">Gender</dt>
                <dd>{formatGenderLabel(student.gender)}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-neutral-500 w-28 shrink-0">Address</dt>
              <dd>{student.city || "—"}</dd>
            </div>
            {(student.degree || student.college) && (
              <div className="flex gap-2">
                <dt className="text-neutral-500 w-28 shrink-0">Education</dt>
                <dd>{[student.degree, student.college].filter(Boolean).join(" · ")}</dd>
              </div>
            )}
            {student.passoutYear && (
              <div className="flex gap-2">
                <dt className="text-neutral-500 w-28 shrink-0">Pass-out</dt>
                <dd>{student.passoutYear}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-neutral-500 w-28 shrink-0">Status</dt>
              <dd className="uppercase text-xs font-mono tracking-wide">{student.status ?? "—"}</dd>
            </div>
            {student.currentBatchName && (
              <div className="flex gap-2">
                <dt className="text-neutral-500 w-28 shrink-0">Batch</dt>
                <dd>{student.currentBatchName}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="student-print-block mb-3 pb-2 border-b border-neutral-200 student-print-compact-gap">
          <h2 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wide mb-1">Fee structure</h2>
          {fee ? (
            <p className="text-[11px] text-neutral-800">
              <span className="font-mono font-semibold">{fee.code}</span> — {fee.name} · {fee.currency}{" "}
              {Number(fee.totalAmount).toLocaleString("en-IN")}
            </p>
          ) : student.feeStructureId ? (
            <p className="text-[11px] text-amber-800">Linked fee ID not found (may have been deleted).</p>
          ) : (
            <p className="text-[11px] text-neutral-500">No fee structure linked.</p>
          )}
        </section>

        <section className="mb-3 student-print-compact-gap">
          <h2 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wide mb-1">Invoices</h2>
          <table className="student-print-table w-full text-left text-[10pt] border border-neutral-300">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-300">
                <th className="px-2 py-1 font-semibold">Invoice</th>
                <th className="px-2 py-1 font-semibold">Total</th>
                <th className="px-2 py-1 font-semibold">Status</th>
                <th className="px-2 py-1 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 py-3 text-neutral-500 text-center">
                    No invoices for this student.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-neutral-200">
                    <td className="px-2 py-1.5 font-mono">{inv.invoiceNumber}</td>
                    <td className="px-2 py-1.5">
                      {inv.currency} {Number(inv.total).toLocaleString("en-IN")}
                    </td>
                    <td className="px-2 py-1.5">{inv.status}</td>
                    <td className="px-2 py-1.5 text-neutral-600">{fmtDate(inv.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="mb-3 student-print-compact-gap">
          <h2 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wide mb-1">Receipts</h2>
          <table className="student-print-table w-full text-left text-[10pt] border border-neutral-300">
            <thead>
              <tr className="bg-neutral-100 border-b border-neutral-300">
                <th className="px-2 py-1 font-semibold">Receipt</th>
                <th className="px-2 py-1 font-semibold">Amount</th>
                <th className="px-2 py-1 font-semibold">Purpose</th>
                <th className="px-2 py-1 font-semibold">Received</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 py-3 text-neutral-500 text-center">
                    No receipts for this student.
                  </td>
                </tr>
              ) : (
                receipts.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-200">
                    <td className="px-2 py-1.5 font-mono">{r.receiptNumber}</td>
                    <td className="px-2 py-1.5">
                      {r.currency} {Number(r.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-2 py-1.5 max-w-[52mm] break-words">{r.purpose}</td>
                    <td className="px-2 py-1.5 text-neutral-600 whitespace-nowrap">{fmtDate(r.receivedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="student-print-block mb-3 pb-2 border-b border-neutral-200 student-print-compact-gap">
          <h2 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wide mb-1">Onboarding</h2>
          {onboarding.length === 0 ? (
            <p className="text-sm text-neutral-500">No onboarding records linked.</p>
          ) : (
            <ul className="space-y-1.5 text-[11px] text-neutral-800">
              {onboarding.map((o) => (
                <li key={o.id} className="border border-neutral-200 rounded p-1.5">
                  {o.fullName && <p className="mt-0.5 font-medium">{o.fullName}</p>}
                  <p className="mt-0.5">
                    <span className="text-neutral-500">Status:</span> {o.status ?? "—"}
                  </p>
                  {o.createdAt != null && (
                    <p className="text-[10px] text-neutral-600 mt-0.5">Created · {fmtDate(o.createdAt)}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="student-print-block mb-2 student-print-compact-gap">
          <h2 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wide mb-1">Batch history</h2>
          {(student.batchHistory ?? []).length === 0 ? (
            <p className="text-sm text-neutral-500">No history entries.</p>
          ) : (
            <ul className="space-y-1 text-[10px] text-neutral-800 font-mono">
              {student.batchHistory!.map((h) => (
                <li key={`${h.batchId}-${h.enrolledAt}`} className="border-l-2 border-neutral-300 pl-2">
                  {h.batchName || h.batchId} · enrolled {new Date(h.enrolledAt).toLocaleString("en-IN")}
                  {h.leftAt != null && <span> · left {new Date(h.leftAt).toLocaleString("en-IN")}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="pt-2 border-t border-neutral-200 text-[8.5pt] text-neutral-500">
          <p>
            Exported {printedAt.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })} · AZ Deploy Academy
          </p>
        </footer>
      </div>
    </A4PrintShell>
  );
}
