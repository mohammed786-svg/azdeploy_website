"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { INVOICE_ORG } from "@/lib/invoice-org";
import A4PrintShell from "@/components/hq/A4PrintShell";
import { PrintLogoBlack } from "@/components/hq/PrintLogoBlack";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";

type Receipt = {
  id: string;
  receiptNumber: string;
  studentName: string;
  amount: number;
  currency: string;
  purpose: string;
  paymentMethod?: string;
  notes?: string;
  receivedAt?: number;
  createdAt?: number;
};

export default function ReceiptPrintPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<Receipt | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const data = await hqFetch<{ item: Receipt }>(`/api/hq/receipts/${id}`);
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
    const name = sanitizeForPdfFilename(item.studentName || "Student");
    const num = sanitizeForPdfFilename(item.receiptNumber || item.id);
    document.title = `${name} — Receipt ${num}`;
    return () => {
      document.title = prev;
    };
  }, [item]);

  if (err || !item) {
    return (
      <A4PrintShell>
        <p className="text-red-700">{err || "Loading…"}</p>
        <Link href="/hq/receipts" className="text-blue-700 text-sm print:hidden mt-4 inline-block">
          Back
        </Link>
      </A4PrintShell>
    );
  }

  const when = item.receivedAt ? new Date(item.receivedAt) : item.createdAt ? new Date(item.createdAt) : new Date();

  return (
    <A4PrintShell>
      <div className="print:hidden mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/hq/receipts" className="text-blue-700 underline">
          ← Receipts
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded border border-neutral-400 px-3 py-1 text-neutral-800 hover:bg-neutral-100"
        >
          Print / Save as PDF
        </button>
      </div>

      <header className="text-center border-b border-neutral-300 pb-6 mb-8">
        <div className="flex justify-center mb-3">
          <PrintLogoBlack
            align="center"
            className="h-16 sm:h-[72px] w-[260px] max-w-full min-h-[4rem]"
          />
        </div>
        <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-500">AZ Deploy Academy</p>
        <h1 className="text-2xl font-bold text-neutral-900 mt-2">PAYMENT RECEIPT</h1>
        <div className="text-xs text-neutral-600 mt-3 max-w-lg mx-auto leading-relaxed space-y-1">
          {INVOICE_ORG.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="pt-1">
            <span className="text-neutral-500">Contact:</span> {INVOICE_ORG.phones.join(" · ")}
          </p>
        </div>
      </header>

      <div className="flex justify-between items-start gap-4 mb-8 text-sm">
        <div>
          <p className="text-[9px] uppercase text-neutral-500">Receipt no.</p>
          <p className="font-mono font-semibold text-lg text-neutral-900">{item.receiptNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase text-neutral-500">Date</p>
          <p className="font-mono text-neutral-900">
            {when.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>

      <section className="mb-6">
        <p className="text-[9px] uppercase text-neutral-500">Received from</p>
        <p className="text-lg font-semibold text-neutral-900 mt-1">{item.studentName}</p>
      </section>

      <div className="rounded border-2 border-neutral-900 p-6 mb-8 text-center">
        <p className="text-[9px] uppercase tracking-wider text-neutral-500">Amount received</p>
        <p className="text-3xl font-bold text-neutral-900 mt-2 tabular-nums">
          {item.currency}{" "}
          {Number(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <table className="w-full text-sm mb-6">
        <tbody>
          <tr className="border-b border-neutral-200">
            <td className="py-2 text-neutral-500 w-1/3">Purpose</td>
            <td className="py-2 text-neutral-900 font-medium">{item.purpose}</td>
          </tr>
          {item.paymentMethod ? (
            <tr className="border-b border-neutral-200">
              <td className="py-2 text-neutral-500">Payment method</td>
              <td className="py-2 text-neutral-900">{item.paymentMethod}</td>
            </tr>
          ) : null}
        </tbody>
      </table>

      {item.notes && (
        <section className="text-sm text-neutral-600 mb-6">
          <p className="text-[9px] uppercase text-neutral-500">Notes</p>
          <p className="mt-1 whitespace-pre-wrap">{item.notes}</p>
        </section>
      )}

      <footer className="pt-8 border-t border-neutral-200 text-center text-[9px] text-neutral-500 leading-relaxed space-y-1">
        <p>{INVOICE_ORG.legalName}</p>
        <p>{INVOICE_ORG.phones.join(" · ")}</p>
        <p className="text-neutral-400">Computer-generated receipt</p>
      </footer>
    </A4PrintShell>
  );
}
