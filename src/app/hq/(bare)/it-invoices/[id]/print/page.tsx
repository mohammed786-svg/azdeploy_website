"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { amountInWordsINR } from "@/lib/amount-in-words";
import { SERVICE_ORG } from "@/lib/invoice-org";
import { buildInvoiceWhatsAppMessage } from "@/lib/hq-whatsapp";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";
import A4PrintShell from "@/components/hq/A4PrintShell";
import PrintShareActions from "@/components/hq/PrintShareActions";
import { PrintLogoBlack } from "@/components/hq/PrintLogoBlack";

type Invoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerCompany?: string;
  customerMobile?: string;
  customerAddress?: string;
  companyName?: string;
  companyAddress?: string;
  companyGstin?: string;
  applyGst?: boolean;
  taxPercent?: number;
  subtotal?: number;
  taxAmount?: number;
  total: number;
  advanceAmount?: number;
  balanceDue?: number;
  currency: string;
  notes?: string;
  issuedAt?: string;
  dueAt?: string;
  lineItems: { description: string; quantity: number; unitPrice: number; amount: number }[];
};

function formatMoney(n: number, currency: string) {
  return `${currency} ${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function formatDate(raw?: string) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ItInvoicePrintPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<Invoice | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const data = await hqFetch<{ item: Invoice }>(`/api/hq/service-invoices/${id}`);
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
    document.title = `${sanitizeForPdfFilename(item.customerName)} — ${item.invoiceNumber}`;
    return () => {
      document.title = prev;
    };
  }, [item]);

  const printUrl = useMemo(() => {
    if (typeof window === "undefined" || !item) return "";
    return `${window.location.origin}/hq/it-invoices/${item.id}/print`;
  }, [item]);

  const waMessage = useMemo(() => {
    if (!item) return "";
    return buildInvoiceWhatsAppMessage({
      customerName: item.customerName,
      invoiceNumber: item.invoiceNumber,
      total: item.total,
      currency: item.currency,
      balanceDue: item.balanceDue,
      printUrl,
    });
  }, [item, printUrl]);

  if (err || !item) {
    return (
      <A4PrintShell>
        <p className="text-red-700 text-sm">{err || "Loading…"}</p>
      </A4PrintShell>
    );
  }

  const orgName = item.companyName?.trim() || SERVICE_ORG.legalName;
  const orgAddress = item.companyAddress?.trim() || SERVICE_ORG.addressLines.join(", ");
  const gstin = item.companyGstin?.trim() || SERVICE_ORG.gstin;
  const hasGst = Boolean(item.applyGst) && Number(item.taxAmount) > 0;
  const halfRate = hasGst ? Number(item.taxPercent || 0) / 2 : 0;
  const halfTax = hasGst ? Number(item.taxAmount) / 2 : 0;
  const sac = SERVICE_ORG.defaultSac;

  return (
    <A4PrintShell>
      <PrintShareActions
        backHref="/hq/it-invoices"
        backLabel="← IT invoices"
        mobile={item.customerMobile}
        whatsappMessage={waMessage}
      />

      <header className="border-b-2 border-neutral-900 pb-4 mb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <PrintLogoBlack align="left" className="h-20 w-[260px] object-left" />
            <h1 className="text-lg font-bold text-neutral-900 mt-2">{orgName}</h1>
            <p className="text-[10px] uppercase tracking-wide text-neutral-500">{SERVICE_ORG.servicesTagline}</p>
            <p className="text-sm text-neutral-700 mt-1 leading-snug">{orgAddress}</p>
            <p className="text-xs text-neutral-600 mt-2">{SERVICE_ORG.phones.join(" · ")}</p>
            <p className="text-xs text-neutral-600">{SERVICE_ORG.website}</p>
            {hasGst && gstin ? (
              <p className="text-xs mt-1">
                <span className="text-neutral-500">GSTIN:</span>{" "}
                <span className="font-mono font-semibold">{gstin}</span>
              </p>
            ) : null}
          </div>
          <div className="text-right text-sm">
            <p className="text-[10px] uppercase text-neutral-500">{hasGst ? "Tax Invoice" : "Invoice"}</p>
            <p className="font-mono font-bold text-xl text-neutral-900">{item.invoiceNumber}</p>
            <p className="mt-2 text-xs text-neutral-600">Date: {formatDate(item.issuedAt)}</p>
            {item.dueAt ? <p className="text-xs text-neutral-600">Due: {formatDate(item.dueAt)}</p> : null}
          </div>
        </div>
      </header>

      <section className="grid sm:grid-cols-2 gap-6 mb-6 text-sm">
        <div>
          <p className="text-[10px] uppercase font-semibold text-neutral-500 mb-1">Bill to</p>
          <p className="font-semibold text-neutral-900">{item.customerName}</p>
          {item.customerCompany ? <p className="text-neutral-700">{item.customerCompany}</p> : null}
          {item.customerMobile ? <p className="text-neutral-600">Mob: {item.customerMobile}</p> : null}
          {item.customerAddress ? <p className="text-neutral-600 whitespace-pre-wrap mt-1">{item.customerAddress}</p> : null}
        </div>
        {hasGst ? (
          <div className="text-right sm:text-left sm:justify-self-end">
            <p className="text-[10px] uppercase text-neutral-500">Place of supply</p>
            <p className="text-neutral-800">{SERVICE_ORG.placeOfSupply}</p>
          </div>
        ) : null}
      </section>

      <table className="w-full text-sm border-collapse mb-4">
        <thead>
          <tr className="border-y border-neutral-400 bg-neutral-100">
            <th className="text-left py-2 px-2 font-semibold">#</th>
            <th className="text-left py-2 px-2 font-semibold">Description of service</th>
            {hasGst ? <th className="text-center py-2 px-2 font-semibold w-16">SAC</th> : null}
            <th className="text-right py-2 px-2 font-semibold w-16">Qty</th>
            <th className="text-right py-2 px-2 font-semibold w-24">Rate</th>
            <th className="text-right py-2 px-2 font-semibold w-28">Amount</th>
          </tr>
        </thead>
        <tbody>
          {item.lineItems.map((line, i) => (
            <tr key={i} className="border-b border-neutral-200">
              <td className="py-2 px-2 text-neutral-600">{i + 1}</td>
              <td className="py-2 px-2">{line.description}</td>
              {hasGst ? <td className="py-2 px-2 text-center text-xs font-mono">{sac}</td> : null}
              <td className="py-2 px-2 text-right">{line.quantity}</td>
              <td className="py-2 px-2 text-right">{line.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              <td className="py-2 px-2 text-right font-medium">{line.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-6">
        <div className="w-full max-w-xs text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span>{formatMoney(item.subtotal ?? item.total, item.currency)}</span>
          </div>
          {hasGst ? (
            <>
              <div className="flex justify-between text-xs">
                <span>CGST @ {halfRate}%</span>
                <span>{formatMoney(halfTax, item.currency)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>SGST @ {halfRate}%</span>
                <span>{formatMoney(halfTax, item.currency)}</span>
              </div>
            </>
          ) : null}
          <div className="flex justify-between font-bold text-base border-t border-neutral-400 pt-2">
            <span>Total</span>
            <span>{formatMoney(item.total, item.currency)}</span>
          </div>
          {(item.advanceAmount ?? 0) > 0 ? (
            <div className="flex justify-between text-emerald-800">
              <span>Advance received</span>
              <span>{formatMoney(item.advanceAmount ?? 0, item.currency)}</span>
            </div>
          ) : null}
          {(item.balanceDue ?? 0) > 0 ? (
            <div className="flex justify-between font-semibold text-amber-900">
              <span>Balance due</span>
              <span>{formatMoney(item.balanceDue ?? 0, item.currency)}</span>
            </div>
          ) : null}
        </div>
      </div>

      <p className="text-xs text-neutral-700 mb-4">
        <span className="font-semibold">Amount in words:</span> {amountInWordsINR(item.total)}
      </p>

      {item.notes ? (
        <p className="text-xs text-neutral-600 border-t border-neutral-200 pt-3 mb-4">
          <span className="font-semibold">Notes:</span> {item.notes}
        </p>
      ) : null}

      <footer className="text-[10px] text-neutral-500 border-t border-neutral-300 pt-4 mt-auto">
        <p>Thank you for your business. For support: {SERVICE_ORG.phones[0]} · {SERVICE_ORG.website}</p>
        <p className="mt-1">This is a computer-generated invoice.</p>
      </footer>
    </A4PrintShell>
  );
}
