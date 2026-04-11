"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";
import HqModal from "@/components/hq/HqModal";

type Inst = {
  id: string;
  label: string;
  amount: number;
  dueDate?: string;
  paid?: boolean;
  paidAt?: number;
  payments?: { amount: number; paymentMethod: string; paidAt: number; note?: string }[];
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  studentId?: string;
  studentName: string;
  lineItems: { description: string; amount: number }[];
  subtotal: number;
  taxPercent?: number;
  taxAmount?: number;
  total: number;
  currency: string;
  status: string;
  dueDate?: string;
  installments: Inst[];
  notes?: string;
  createdAt?: number;
};

export default function HqInvoiceDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<Invoice | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [markInst, setMarkInst] = useState<Inst | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Cash");
  const [payNote, setPayNote] = useState("");
  const [payPassword, setPayPassword] = useState("");
  const [paySaving, setPaySaving] = useState(false);
  const [payErr, setPayErr] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = useCallback(async () => {
    const data = await hqFetch<{ item: Invoice }>(`/api/hq/invoices/${id}`);
    setItem(data.item);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, load]);

  function openPayModal(inst: Inst) {
    const due = Number(inst.amount) || 0;
    const received = (inst.payments ?? []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const remaining = Math.max(0, due - received);
    setPayAmount(String(remaining > 0 ? Math.round(remaining * 100) / 100 : due));
    setPayMethod("Cash");
    setPayNote("");
    setPayPassword("");
    setPayErr("");
    setMarkInst(inst);
  }

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!markInst) return;
    const amt = Number(payAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setPayErr("Enter a positive amount.");
      return;
    }
    if (!payPassword.trim()) {
      setPayErr("HQ password is required.");
      return;
    }
    setPaySaving(true);
    setPayErr("");
    try {
      await hqFetch(`/api/hq/invoices/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          action: "markPaid",
          installmentId: markInst.id,
          amountPaid: amt,
          paymentMethod: payMethod.trim() || "Cash",
          paymentNote: payNote.trim(),
          confirmPassword: payPassword,
        }),
      });
      setMarkInst(null);
      await load();
    } catch (ex) {
      setPayErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setPaySaving(false);
    }
  }

  async function deleteInvoice(password: string) {
    await hqFetch(`/api/hq/invoices/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ confirmPassword: password }),
    });
    window.location.href = "/hq/invoices";
  }

  if (loading) {
    return (
      <div className="text-[#64748b] font-mono text-sm py-20 text-center">Loading invoice…</div>
    );
  }

  if (err || !item) {
    return (
      <div className="space-y-4">
        <p className="text-red-400/90 font-mono text-sm">{err || "Not found"}</p>
        <Link href="/hq/invoices" className="text-[#7dd3fc] text-sm font-mono hover:underline">
          ← Back to invoices
        </Link>
      </div>
    );
  }

  const created = item.createdAt ? new Date(item.createdAt) : new Date();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/hq/invoices" className="text-[11px] font-mono text-[#7dd3fc] hover:underline">
          ← Invoices
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/hq/invoices/${id}/print`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-mono uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20"
          >
            A4 print / PDF
          </Link>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-mono uppercase tracking-wider text-red-300 hover:bg-red-500/20"
          >
            Delete invoice
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-[720px] rounded-2xl border border-white/[0.08] bg-[#0c0c12] p-6 sm:p-8">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <p className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#64748b]">AZ Deploy Academy</p>
            <h1 className="mt-2 text-xl font-bold text-white">Invoice (manage)</h1>
            <p className="mt-1 text-xs text-[#64748b]">For customer-facing PDF use the A4 print view.</p>
          </div>
          <div className="text-right font-mono text-sm">
            <p className="text-[#7dd3fc] font-semibold text-lg">{item.invoiceNumber}</p>
            <p className="text-[#64748b] mt-2">
              {created.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
            <p className="mt-2 text-xs text-[#94a3b8] uppercase">Status: {item.status}</p>
          </div>
        </header>

        <section className="mt-6">
          <p className="text-[10px] font-mono uppercase text-[#64748b]">Bill to</p>
          <p className="text-lg font-semibold text-white mt-1">{item.studentName}</p>
          {item.studentId && (
            <p className="mt-2">
              <Link
                href={`/hq/students/${item.studentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-[#a78bfa] hover:underline"
              >
                Open student profile (fees, invoices, receipts)
              </Link>
            </p>
          )}
        </section>

        <section className="mt-6 text-sm space-y-2">
          <p className="text-[10px] font-mono uppercase text-[#64748b]">Lines</p>
          <ul className="space-y-1">
            {item.lineItems.map((line, i) => (
              <li key={i} className="flex justify-between gap-2 text-[#cbd5e1]">
                <span>{line.description}</span>
                <span className="font-mono tabular-nums">
                  {item.currency} {Number(line.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-right font-mono text-[#00d4ff] pt-2 border-t border-white/10">
            Total {item.currency} {Number(item.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </section>

        {(item.installments?.length ?? 0) > 0 && (
          <section className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[10px] font-mono uppercase text-[#64748b] mb-2">Installments</p>
            <ul className="space-y-2 text-sm">
              {item.installments.map((x) => {
                const due = Number(x.amount) || 0;
                const received = (x.payments ?? []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
                const showProgress = !x.paid && received > 0;
                return (
                  <li key={x.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <div className="text-[#cbd5e1]">
                      <span>
                        {x.label}
                        {x.dueDate && <span className="text-[#64748b]"> · due {x.dueDate}</span>}
                      </span>
                      {showProgress && (
                        <p className="text-[10px] font-mono text-amber-200/80 mt-0.5">
                          Received {item.currency}{" "}
                          {received.toLocaleString("en-IN", { minimumFractionDigits: 2 })} of{" "}
                          {due.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                      {(x.payments?.length ?? 0) > 0 && (
                        <ul className="mt-1.5 space-y-1 text-[10px] font-mono text-[#64748b]">
                          {x.payments!.map((p, pi) => (
                            <li key={pi}>
                              {item.currency}{" "}
                              {Number(p.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })} · {p.paymentMethod}
                              {p.note ? (
                                <span className="text-[#94a3b8]"> · {p.note}</span>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <span className="font-mono text-white tabular-nums shrink-0">
                      {item.currency} {due.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      {x.paid ? (
                        <span className="ml-2 text-emerald-400 text-xs">Paid</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openPayModal(x)}
                          className="ml-3 rounded-lg border border-white/15 px-2 py-0.5 text-[10px] font-mono uppercase text-[#94a3b8] hover:bg-white/5"
                        >
                          Record payment
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {item.notes && (
          <section className="mt-6 text-sm text-[#94a3b8]">
            <p className="text-[10px] font-mono uppercase text-[#64748b]">Notes</p>
            <p className="mt-1 whitespace-pre-wrap">{item.notes}</p>
          </section>
        )}
      </article>

      <HqModal open={markInst != null} onClose={() => setMarkInst(null)} title="Record payment" size="md">
        {markInst && (
          <form onSubmit={submitPayment} className="space-y-4">
            <p className="text-sm text-[#94a3b8]">
              <span className="text-white font-medium">{markInst.label}</span>
              {markInst.dueDate && <span className="text-[#64748b]"> · due {markInst.dueDate}</span>}
            </p>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Amount received ({item.currency})</span>
              <input
                type="number"
                min={0.01}
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white tabular-nums"
                required
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Payment method</span>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
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
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Note (optional)</span>
              <textarea
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                rows={3}
                placeholder="Reference, UTR, remarks…"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-[#64748b] resize-y"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">HQ password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={payPassword}
                onChange={(e) => setPayPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white"
              />
            </label>
            {payErr && (
              <p className="text-sm text-amber-400/90 font-mono" role="alert">
                {payErr}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMarkInst(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-[#94a3b8] hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={paySaving}
                className="rounded-xl bg-emerald-500/15 border border-emerald-400/40 px-4 py-2 text-xs font-mono uppercase text-emerald-200 hover:bg-emerald-500/25 disabled:opacity-50"
              >
                {paySaving ? "Saving…" : "Save payment"}
              </button>
            </div>
          </form>
        )}
      </HqModal>

      <ConfirmPasswordModal
        open={deleteOpen}
        title="Delete invoice"
        message="This cannot be undone. Enter HQ password."
        confirmLabel="Delete"
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteInvoice}
      />
    </div>
  );
}
