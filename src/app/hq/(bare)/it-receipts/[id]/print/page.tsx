"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { amountInWordsINR } from "@/lib/amount-in-words";
import { SERVICE_ORG } from "@/lib/invoice-org";
import { buildReceiptWhatsAppMessage } from "@/lib/hq-whatsapp";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";
import A4PrintShell from "@/components/hq/A4PrintShell";
import PrintShareActions from "@/components/hq/PrintShareActions";
import EditReceiptBar from "@/components/hq/EditReceiptBar";
import { PrintLogoBlack } from "@/components/hq/PrintLogoBlack";

type Receipt = {
  id: string;
  receiptNumber: string;
  invoiceNumber?: string;
  customerName: string;
  customerCompany?: string;
  customerMobile?: string;
  customerAddress?: string;
  amount: number;
  currency: string;
  purpose?: string;
  paymentMethod?: string;
  referenceNo?: string;
  notes?: string;
  receivedAt?: string;
};

export default function ItReceiptPrintPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<Receipt | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const data = await hqFetch<{ item: Receipt }>(`/api/hq/service-receipts/${id}`);
    setItem(data.item);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        await load();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed");
      }
    })();
  }, [id, load]);

  useEffect(() => {
    if (!item) return;
    const prev = document.title;
    document.title = `${sanitizeForPdfFilename(item.customerName)} — ${item.receiptNumber}`;
    return () => {
      document.title = prev;
    };
  }, [item]);

  const printUrl = useMemo(() => {
    if (typeof window === "undefined" || !item) return "";
    return `${window.location.origin}/hq/it-receipts/${item.id}/print`;
  }, [item]);

  const waMessage = useMemo(() => {
    if (!item) return "";
    return buildReceiptWhatsAppMessage({
      customerName: item.customerName,
      receiptNumber: item.receiptNumber,
      amount: item.amount,
      currency: item.currency,
      printUrl,
    });
  }, [item, printUrl]);

  if (err || !item) {
    return (
      <A4PrintShell>
        <p className="text-red-700">{err || "Loading…"}</p>
      </A4PrintShell>
    );
  }

  const when = item.receivedAt ? new Date(item.receivedAt) : new Date();

  return (
    <A4PrintShell>
      <EditReceiptBar
        apiPath={`/api/hq/service-receipts/${id}`}
        receivedAt={item.receivedAt}
        amount={item.amount}
        currency={item.currency}
        onSaved={(patch) =>
          setItem((prev) =>
            prev
              ? {
                  ...prev,
                  ...(patch.receivedAt != null ? { receivedAt: patch.receivedAt } : {}),
                  ...(patch.amount != null ? { amount: patch.amount } : {}),
                }
              : prev
          )
        }
      />
      <PrintShareActions
        backHref="/hq/it-receipts"
        backLabel="← IT receipts"
        mobile={item.customerMobile}
        whatsappMessage={waMessage}
      />

      <header className="text-center border-b border-neutral-300 pb-6 mb-8">
        <div className="flex justify-center mb-3">
          <PrintLogoBlack align="center" className="h-16 w-[260px]" />
        </div>
        <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-500">{SERVICE_ORG.legalName}</p>
        <h1 className="text-2xl font-bold text-neutral-900 mt-2">PAYMENT RECEIPT</h1>
        <p className="text-xs text-neutral-600 mt-2">{SERVICE_ORG.addressLines[0]}</p>
        <p className="text-xs text-neutral-600">{SERVICE_ORG.phones.join(" · ")}</p>
        <p className="text-xs text-neutral-600">{SERVICE_ORG.website}</p>
      </header>

      <div className="flex justify-between mb-8 text-sm">
        <div>
          <p className="text-[9px] uppercase text-neutral-500">Receipt no.</p>
          <p className="font-mono font-semibold text-lg">{item.receiptNumber}</p>
          {item.invoiceNumber ? (
            <p className="text-xs text-neutral-600 mt-1">Invoice: {item.invoiceNumber}</p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase text-neutral-500">Date</p>
          <p className="font-mono">{when.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
        </div>
      </div>

      <div className="mb-8 text-sm space-y-1">
        <p>
          <span className="text-neutral-500">Received from:</span>{" "}
          <span className="font-semibold">{item.customerName}</span>
        </p>
        {item.customerCompany ? <p className="text-neutral-700">{item.customerCompany}</p> : null}
        {item.customerMobile ? <p className="text-neutral-600">Mob: {item.customerMobile}</p> : null}
        {item.customerAddress ? <p className="text-neutral-600 whitespace-pre-wrap">{item.customerAddress}</p> : null}
      </div>

      <div className="border border-neutral-400 rounded-lg p-6 mb-8 text-center bg-neutral-50">
        <p className="text-xs uppercase text-neutral-500">Amount received</p>
        <p className="text-3xl font-bold text-neutral-900 mt-1">
          {item.currency} {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-neutral-700 mt-2">{amountInWordsINR(item.amount)}</p>
      </div>

      <table className="w-full text-sm mb-8">
        <tbody>
          <tr className="border-b border-neutral-200">
            <td className="py-2 text-neutral-500 w-40">Purpose</td>
            <td className="py-2">{item.purpose || "IT services"}</td>
          </tr>
          <tr className="border-b border-neutral-200">
            <td className="py-2 text-neutral-500">Payment mode</td>
            <td className="py-2">{item.paymentMethod || "—"}</td>
          </tr>
          {item.referenceNo ? (
            <tr className="border-b border-neutral-200">
              <td className="py-2 text-neutral-500">Reference</td>
              <td className="py-2 font-mono">{item.referenceNo}</td>
            </tr>
          ) : null}
        </tbody>
      </table>

      {item.notes ? <p className="text-xs text-neutral-600 mb-6">Notes: {item.notes}</p> : null}

      <footer className="text-center text-xs text-neutral-500 border-t border-neutral-300 pt-6">
        <p>This receipt acknowledges payment received by {SERVICE_ORG.legalName}.</p>
        <p className="mt-1">{SERVICE_ORG.website}</p>
        <p className="mt-2">Authorized signatory</p>
      </footer>
    </A4PrintShell>
  );
}
