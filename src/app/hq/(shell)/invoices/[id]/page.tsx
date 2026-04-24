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
  amountReceived?: number;
  /** Outstanding on this installment (after allocating invoice payments FIFO). */
  installmentRemaining?: number;
  dueDate?: string;
  paid?: boolean;
  paidAt?: string;
  payments?: { amount: number; paymentMethod: string; paidAt: string; note?: string }[];
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
  paidAmount?: number;
  dueAmount?: number;
  /** total − paidAmount (authoritative cap for new payments). */
  balanceRemaining?: number;
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
  const [payMax, setPayMax] = useState(0);
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

  function installmentReceived(inst: Inst): number {
    const due = Number(inst.amount) || 0;
    if (inst.installmentRemaining != null) {
      const rem = Math.max(0, Number(inst.installmentRemaining));
      return Math.max(0, due - rem);
    }
    if (inst.amountReceived != null) {
      return Number(inst.amountReceived) || 0;
    }
    return (inst.payments ?? []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  }

  function invoiceBalanceRemaining(inv: Invoice): number {
    if (inv.balanceRemaining != null && Number.isFinite(Number(inv.balanceRemaining))) {
      return Math.max(0, Number(inv.balanceRemaining));
    }
    return Math.max(0, Number(inv.total) - Number(inv.paidAmount ?? 0));
  }

  function clampPayAmountField(raw: string, cap: number): string {
    if (cap <= 0) return raw;
    const t = raw.trim();
    if (t === "" || t === ".") return raw;
    const n = Number(t);
    if (!Number.isFinite(n)) return raw;
    if (n > cap) return String(Math.round(cap * 100) / 100);
    if (n < 0) return "0";
    return raw;
  }

  function normalizePayAmountOnBlur(cap: number) {
    if (cap <= 0) return;
    const t = payAmount.trim();
    if (t === "" || t === ".") return;
    const n = Number(t);
    if (!Number.isFinite(n)) return;
    const clamped = Math.min(Math.max(n, 0.01), cap);
    if (Math.abs(clamped - n) > 1e-9) {
      setPayAmount(String(Math.round(clamped * 100) / 100));
    }
  }

  function openPayModal(inst: Inst) {
    if (!item) return;
    const due = Number(inst.amount) || 0;
    const received = installmentReceived(inst);
    const instRem =
      inst.installmentRemaining != null
        ? Math.max(0, Number(inst.installmentRemaining))
        : Math.max(0, due - received);
    const invBal = invoiceBalanceRemaining(item);
    const maxPay = Math.round(Math.min(instRem, invBal) * 100) / 100;
    setPayMax(maxPay);
    setPayAmount(maxPay > 0 ? String(maxPay) : "0");
    setPayMethod("Cash");
    setPayNote("");
    setPayPassword("");
    setPayErr("");
    setMarkInst(inst);
  }

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!markInst || !item) return;
    const amt = Number(payAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setPayErr("Enter a positive amount.");
      return;
    }
    const cap = payMax > 0 ? payMax : 0;
    if (cap > 0 && amt > cap + 0.02) {
      setPayErr(
        `Amount cannot exceed ${item.currency} ${cap.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (installment outstanding or invoice balance).`
      );
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
  const collectedAmt = Number(item.paidAmount ?? 0);
  const balanceAmt = Number(
    item.balanceRemaining ?? item.dueAmount ?? Math.max(0, item.total - (item.paidAmount ?? 0))
  );
  const statusNorm = (item.status ?? "").toLowerCase();
  const statusStyles: Record<string, string> = {
    paid: "border-emerald-400/50 bg-emerald-500/15 text-emerald-200",
    partial: "border-amber-400/45 bg-amber-500/12 text-amber-100",
    unpaid: "border-slate-400/40 bg-slate-500/10 text-slate-200",
    cancelled: "border-red-400/40 bg-red-500/10 text-red-200",
  };
  const statusClass = statusStyles[statusNorm] ?? "border-white/15 bg-white/5 text-[#e2e8f0]";

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
            <p className="mt-3">
              <span
                className={`inline-flex items-center rounded-lg border px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider ${statusClass}`}
              >
                Status · {item.status}
              </span>
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:items-end">
              <div className="flex w-full max-w-[280px] flex-col gap-2 sm:items-stretch">
                <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/[0.12] px-3 py-2.5 text-left shadow-[0_0_24px_-8px_rgba(52,211,153,0.35)]">
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-200/80">Collected</p>
                  <p className="mt-1 text-base font-semibold tabular-nums tracking-tight text-emerald-100">
                    {item.currency}{" "}
                    {collectedAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-xl border border-amber-400/35 bg-amber-500/[0.1] px-3 py-2.5 text-left shadow-[0_0_24px_-8px_rgba(251,191,36,0.3)]">
                  <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-amber-200/85">Balance due</p>
                  <p className="mt-1 text-base font-semibold tabular-nums tracking-tight text-amber-50">
                    {item.currency}{" "}
                    {balanceAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
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

        <section className="mt-6 rounded-xl border border-white/[0.08] bg-black/25 p-4 sm:p-5">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] mb-3">Fee breakdown</p>
          <div className="space-y-2 text-sm">
            {item.lineItems.map((line, i) => (
              <div key={i} className="flex justify-between gap-4 text-[#cbd5e1]">
                <span>{line.description}</span>
                <span className="font-mono tabular-nums shrink-0">
                  {item.currency} {Number(line.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            {Number(item.taxAmount ?? 0) > 0.005 && (
              <div className="flex justify-between gap-4 text-[#94a3b8] text-xs">
                <span>
                  Tax
                  {item.taxPercent != null && Number(item.taxPercent) > 0
                    ? ` (${Number(item.taxPercent).toLocaleString("en-IN")}%)`
                    : null}
                </span>
                <span className="font-mono tabular-nums shrink-0">
                  {item.currency}{" "}
                  {Number(item.taxAmount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-4 pt-2 border-t border-white/10 font-mono text-[#e2e8f0]">
              <span className="uppercase text-[11px] tracking-wide text-[#94a3b8]">Invoice total</span>
              <span className="tabular-nums font-semibold text-white">
                {item.currency} {Number(item.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between gap-4 rounded-lg border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-2">
              <span className="text-[11px] font-mono uppercase tracking-wide text-emerald-200/90">Paid so far</span>
              <span className="font-mono tabular-nums font-semibold text-emerald-100">
                {item.currency} {collectedAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between gap-4 rounded-lg border border-amber-500/25 bg-amber-500/[0.08] px-3 py-2">
              <span className="text-[11px] font-mono uppercase tracking-wide text-amber-100/95">Remaining</span>
              <span className="font-mono tabular-nums font-semibold text-amber-50">
                {item.currency} {balanceAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </section>

        {(item.installments?.length ?? 0) > 0 && (
          <section className="mt-6 rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <p className="text-[10px] font-mono uppercase text-[#64748b] mb-2">Installments</p>
            <ul className="space-y-2 text-sm">
              {item.installments.map((x) => {
                const due = Number(x.amount) || 0;
                const received = installmentReceived(x);
                const instOut =
                  x.installmentRemaining != null
                    ? Math.max(0, Number(x.installmentRemaining))
                    : Math.max(0, due - received);
                const showProgress = !x.paid && received > 0.005;
                return (
                  <li key={x.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <div className="text-[#cbd5e1]">
                      <span>
                        {x.label}
                        {x.dueDate && <span className="text-[#64748b]"> · due {x.dueDate}</span>}
                      </span>
                      {!x.paid && (
                        <p className="text-[10px] font-mono text-[#94a3b8] mt-0.5">
                          Outstanding {item.currency}{" "}
                          {instOut.toLocaleString("en-IN", { minimumFractionDigits: 2 })} on this installment
                          <span className="text-[#64748b]">
                            {" "}
                            · Invoice balance {item.currency}{" "}
                            {invoiceBalanceRemaining(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </p>
                      )}
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
            <p className="text-[11px] font-mono text-[#94a3b8] leading-relaxed">
              Maximum you can record here:{" "}
              <span className="text-amber-200/90">
                {item.currency}{" "}
                {payMax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>{" "}
              (lesser of this installment&apos;s outstanding and the invoice balance).
            </p>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">
                Amount received ({item.currency}) — cannot exceed maximum above
              </span>
              <input
                type="number"
                inputMode="decimal"
                min={payMax > 0 ? 0.01 : 0}
                max={payMax > 0 ? payMax : undefined}
                step="0.01"
                value={payAmount}
                onChange={(e) => setPayAmount(clampPayAmountField(e.target.value, payMax))}
                onBlur={() => normalizePayAmountOnBlur(payMax)}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm text-white tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                required
                disabled={payMax <= 0}
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
                disabled={paySaving || payMax <= 0}
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
