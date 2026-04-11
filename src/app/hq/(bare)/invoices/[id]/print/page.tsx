"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { amountInWordsINR } from "@/lib/amount-in-words";
import { INVOICE_ORG } from "@/lib/invoice-org";
import A4PrintShell from "@/components/hq/A4PrintShell";
import { PrintLogoBlack } from "@/components/hq/PrintLogoBlack";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";

type Inst = {
  id: string;
  label: string;
  amount: number;
  dueDate?: string;
  paid?: boolean;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
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

function formatMoney(n: number, currency: string) {
  return `${currency} ${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

export default function InvoicePrintPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<Invoice | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const data = await hqFetch<{ item: Invoice }>(`/api/hq/invoices/${id}`);
    setItem(data.item);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let c = false;
    (async () => {
      try {
        await load();
      } catch (e) {
        if (!c) setErr(e instanceof Error ? e.message : "Failed");
      }
    })();
    return () => {
      c = true;
    };
  }, [id, load]);

  useEffect(() => {
    if (!item) return;
    const prev = document.title;
    const name = sanitizeForPdfFilename(item.studentName || "Customer");
    const num = sanitizeForPdfFilename(item.invoiceNumber || item.id);
    document.title = `${name} — Invoice ${num}`;
    return () => {
      document.title = prev;
    };
  }, [item]);

  if (err || !item) {
    return (
      <A4PrintShell>
        <p className="text-red-700 text-sm">{err || "Loading…"}</p>
        <Link href="/hq/invoices" className="text-blue-700 text-sm print:hidden mt-4 inline-block">
          Back
        </Link>
      </A4PrintShell>
    );
  }

  const created = item.createdAt ? new Date(item.createdAt) : new Date();
  const taxAmt = Number(item.taxAmount ?? 0);
  const taxPct = Number(item.taxPercent ?? 0);
  const hasGst = taxAmt > 0 && taxPct > 0;
  /** Intra-state Karnataka: CGST + SGST each half of headline rate. */
  const halfRate = hasGst ? taxPct / 2 : 0;
  const halfTax = hasGst ? taxAmt / 2 : 0;
  const sac = INVOICE_ORG.defaultSac;

  return (
    <A4PrintShell>
      <div className="print:hidden mb-4 flex flex-wrap gap-2 text-sm">
        <Link href={`/hq/invoices/${id}`} className="text-blue-700 underline">
          ← Back to invoice
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded border border-neutral-400 px-3 py-1 text-neutral-800 hover:bg-neutral-100"
        >
          Print / Save as PDF
        </button>
      </div>

      <header className="border-b-2 border-neutral-900 pb-4 mb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 min-w-0">
            <div className="shrink-0">
              <PrintLogoBlack className="h-14 sm:h-16 w-[240px] max-w-[min(100%,240px)] min-h-[3.5rem]" />
            </div>
            <div className="min-w-0 text-sm text-neutral-800">
              <h1 className="text-lg font-bold text-neutral-900 leading-tight">{INVOICE_ORG.legalName}</h1>
              <p className="text-[10px] uppercase tracking-wide text-neutral-500 mt-0.5">Tax invoice (GST)</p>
              {INVOICE_ORG.addressLines.map((line) => (
                <p key={line} className="mt-1 leading-snug">
                  {line}
                </p>
              ))}
              <p className="mt-2 text-xs">
                <span className="text-neutral-500">State:</span> {INVOICE_ORG.state}{" "}
                <span className="text-neutral-400">({INVOICE_ORG.stateCode})</span>
              </p>
              <div className="mt-2 space-y-0.5 text-xs">
                <p>
                  <span className="text-neutral-500">GSTIN:</span>{" "}
                  {INVOICE_ORG.gstin ? (
                    <span className="font-mono font-semibold">{INVOICE_ORG.gstin}</span>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )}
                </p>
                {INVOICE_ORG.pan ? (
                  <p>
                    <span className="text-neutral-500">PAN:</span>{" "}
                    <span className="font-mono">{INVOICE_ORG.pan}</span>
                  </p>
                ) : null}
              </div>
              <p className="mt-2 text-xs text-neutral-700">
                <span className="text-neutral-500">Contact:</span> {INVOICE_ORG.phones.join(" · ")}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right text-sm shrink-0 border border-neutral-200 rounded p-3 bg-neutral-50 print:bg-white">
            <p className="text-[9px] uppercase tracking-wider text-neutral-500">Invoice no.</p>
            <p className="font-mono font-semibold text-neutral-900 text-lg">{item.invoiceNumber}</p>
            <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-3">Invoice date</p>
            <p className="font-mono text-neutral-900">
              {created.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
            {item.dueDate && (
              <>
                <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-2">Due date</p>
                <p className="font-mono text-neutral-900">{item.dueDate}</p>
              </>
            )}
            <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-2">Place of supply</p>
            <p className="text-neutral-900">{INVOICE_ORG.placeOfSupply}</p>
            <p className="text-[9px] uppercase tracking-wider text-neutral-500 mt-2">Reverse charge</p>
            <p className="text-neutral-900">No</p>
            <p className="text-[9px] uppercase text-neutral-500 mt-2">Status: {item.status}</p>
          </div>
        </div>
      </header>

      <section className="mb-5">
        <p className="text-[9px] uppercase tracking-wider text-neutral-500">Details of receiver (bill to)</p>
        <p className="text-base font-semibold text-neutral-900 mt-1">{item.studentName}</p>
        <p className="text-xs text-neutral-600 mt-1">
          Place of supply for this invoice: {INVOICE_ORG.placeOfSupply} (State code {INVOICE_ORG.stateCode})
        </p>
      </section>

      <table className="w-full text-xs border-collapse border border-neutral-900 mb-4">
        <thead>
          <tr className="bg-neutral-100 print:bg-neutral-100 border-b border-neutral-900">
            <th className="border border-neutral-300 py-2 px-2 text-left w-8">#</th>
            <th className="border border-neutral-300 py-2 px-2 text-left">Description of supply</th>
            <th className="border border-neutral-300 py-2 px-2 text-center w-20 whitespace-nowrap">SAC</th>
            <th className="border border-neutral-300 py-2 px-2 text-right w-28 whitespace-nowrap">
              Taxable value ({item.currency})
            </th>
          </tr>
        </thead>
        <tbody>
          {item.lineItems.map((line, i) => (
            <tr key={i}>
              <td className="border border-neutral-200 py-2 px-2 text-neutral-600">{i + 1}</td>
              <td className="border border-neutral-200 py-2 px-2 text-neutral-900">{line.description}</td>
              <td className="border border-neutral-200 py-2 px-2 text-center font-mono text-neutral-800">{sac}</td>
              <td className="border border-neutral-200 py-2 px-2 text-right font-mono tabular-nums">
                {Number(line.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-sm space-y-1 mb-4">
        <div className="flex justify-end border-t border-neutral-300 pt-2">
          <div className="w-full max-w-sm space-y-1 font-mono text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-neutral-600">Total taxable value</span>
              <span className="tabular-nums">{formatMoney(item.subtotal, item.currency)}</span>
            </div>
            {hasGst ? (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">
                    CGST @ {halfRate.toFixed(2)}% <span className="text-neutral-400">(intra-state)</span>
                  </span>
                  <span className="tabular-nums">{formatMoney(halfTax, item.currency)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-600">
                    SGST @ {halfRate.toFixed(2)}% <span className="text-neutral-400">(intra-state)</span>
                  </span>
                  <span className="tabular-nums">{formatMoney(halfTax, item.currency)}</span>
                </div>
                <p className="text-[10px] text-neutral-500 pt-1 leading-snug">
                  CGST/SGST split assumes intra-state supply in Karnataka. Inter-state supplies typically require IGST
                  @ {taxPct}% — verify with your tax advisor.
                </p>
              </>
            ) : (
              <p className="text-[10px] text-neutral-500 pt-1">
                No GST charged on this invoice (nil / exempt / not applicable — confirm classification with your CA).
              </p>
            )}
            <div className="flex justify-between gap-4 pt-2 border-t border-neutral-900 font-bold text-base text-neutral-900">
              <span>Invoice total</span>
              <span className="tabular-nums">{formatMoney(item.total, item.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded border border-neutral-300 bg-neutral-50 print:bg-white p-3 mb-5 text-sm">
        <p className="text-[9px] uppercase tracking-wider text-neutral-500 mb-1">Amount in words</p>
        <p className="text-neutral-900 font-medium leading-relaxed">{amountInWordsINR(Number(item.total))}</p>
      </section>

      {(item.installments?.length ?? 0) > 0 && (
        <section className="border border-neutral-200 rounded p-3 mb-5">
          <p className="text-[9px] uppercase tracking-wider text-neutral-500 mb-2">Installment schedule</p>
          <ul className="text-sm space-y-1">
            {item.installments.map((x) => (
              <li key={x.id} className="flex justify-between gap-2 border-b border-neutral-100 last:border-0 pb-1">
                <span className="text-neutral-800">
                  {x.label}
                  {x.dueDate && <span className="text-neutral-500"> · due {x.dueDate}</span>}
                </span>
                <span className="font-mono tabular-nums">
                  {item.currency} {Number(x.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  {x.paid ? <span className="text-emerald-700 text-xs ml-1">Paid</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {item.notes && (
        <section className="text-sm text-neutral-600 mb-4">
          <p className="text-[9px] uppercase text-neutral-500">Remarks / terms</p>
          <p className="mt-1 whitespace-pre-wrap">{item.notes}</p>
        </section>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between gap-8 pt-6 border-t border-neutral-200 text-sm">
        <div className="text-xs text-neutral-600 max-w-md">
          <p className="font-semibold text-neutral-800">Declaration</p>
          <p className="mt-1 leading-relaxed">
            We declare that the particulars above are true and correct and that the taxable value and tax amounts
            have been determined under the Central Goods and Services Tax Act, 2017 and applicable State GST law,
            where applicable.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-600">For {INVOICE_ORG.legalName}</p>
          <div className="mt-12 border-t border-neutral-400 inline-block min-w-[180px] pt-1">
            <p className="text-[10px] text-neutral-500">Authorised signatory</p>
          </div>
        </div>
      </div>

      <footer className="pt-6 mt-6 border-t border-neutral-200 text-center text-[9px] text-neutral-500 leading-relaxed">
        <p>
          Computer-generated document · SAC {sac} · {INVOICE_ORG.phones.join(" · ")}
        </p>
      </footer>
    </A4PrintShell>
  );
}
