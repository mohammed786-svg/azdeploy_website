"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { SERVICE_ORG } from "@/lib/invoice-org";
import type { ServiceLineItem } from "@/app/hq/(shell)/it-invoices/page";

type InvoiceDetail = {
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

function lineTotal(line: ServiceLineItem): number {
  const q = Number(line.quantity) || 0;
  const p = Number(line.unitPrice) || 0;
  return Math.round(q * p * 100) / 100;
}

function computeTotals(lines: ServiceLineItem[], applyGst: boolean, taxPercent: number) {
  const subtotal = Math.round(lines.reduce((s, l) => s + lineTotal(l), 0) * 100) / 100;
  const taxAmount = applyGst && taxPercent > 0 ? Math.round(subtotal * taxPercent) / 100 : 0;
  return { subtotal, taxAmount, total: Math.round((subtotal + taxAmount) * 100) / 100 };
}

export default function ItInvoiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [companyName, setCompanyName] = useState(SERVICE_ORG.legalName);
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyGstin, setCompanyGstin] = useState("");
  const [applyGst, setApplyGst] = useState(false);
  const [taxPercent, setTaxPercent] = useState("18");
  const [lineItems, setLineItems] = useState<ServiceLineItem[]>([]);
  const [notes, setNotes] = useState("");
  const [issuedAt, setIssuedAt] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const totals = useMemo(
    () => computeTotals(lineItems, applyGst, Number(taxPercent) || 0),
    [lineItems, applyGst, taxPercent]
  );

  const load = useCallback(async () => {
    const data = await hqFetch<{ item: InvoiceDetail }>(`/api/hq/service-invoices/${id}`);
    const inv = data.item;
    setInvoiceNumber(inv.invoiceNumber);
    setCustomerName(inv.customerName);
    setCustomerCompany(inv.customerCompany || "");
    setCustomerMobile(inv.customerMobile || "");
    setCustomerAddress(inv.customerAddress || "");
    setCompanyName(inv.companyName || SERVICE_ORG.legalName);
    setCompanyAddress(inv.companyAddress || SERVICE_ORG.addressLines.join(", "));
    setCompanyGstin(inv.companyGstin || "");
    setApplyGst(Boolean(inv.applyGst));
    setTaxPercent(String(inv.taxPercent ?? 18));
    setLineItems(
      (inv.lineItems || []).map((l) => ({
        description: l.description,
        quantity: String(l.quantity),
        unitPrice: String(l.unitPrice),
      }))
    );
    setNotes(inv.notes || "");
    setIssuedAt(inv.issuedAt ? inv.issuedAt.slice(0, 10) : "");
    setDueAt(inv.dueAt ? inv.dueAt.slice(0, 10) : "");
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        await load();
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const items = lineItems
        .filter((l) => l.description.trim())
        .map((l) => ({
          description: l.description.trim(),
          quantity: Number(l.quantity) || 1,
          unitPrice: Number(l.unitPrice) || 0,
          amount: lineTotal(l),
        }));
      await hqFetch(`/api/hq/service-invoices/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          customerName,
          customerCompany,
          customerMobile,
          customerAddress,
          companyName,
          companyAddress,
          companyGstin: applyGst ? companyGstin : "",
          applyGst,
          taxPercent: Number(taxPercent) || 18,
          lineItems: items,
          notes,
          issuedAt,
          dueAt: dueAt || null,
        }),
      });
      router.push(`/hq/it-invoices/${id}/print`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[#64748b]">Loading…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link href="/hq/it-invoices" className="text-sm text-[#00d4ff] hover:underline">
          ← IT invoices
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Edit {invoiceNumber}</h1>
      </div>
      {err ? <p className="text-amber-400 text-sm">{err}</p> : null}
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#0a0a10]/80 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-[#94a3b8] sm:col-span-2">
            Customer name *
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs text-[#94a3b8]">
            Company
            <input value={customerCompany} onChange={(e) => setCustomerCompany(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs text-[#94a3b8]">
            Mobile
            <input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          </label>
          <label className="block text-xs text-[#94a3b8] sm:col-span-2">
            Address
            <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={applyGst} onChange={(e) => setApplyGst(e.target.checked)} />
          Apply GST
        </label>
        {applyGst ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <input value={companyGstin} onChange={(e) => setCompanyGstin(e.target.value)} placeholder="GSTIN" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm font-mono" />
            <input value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} placeholder="GST %" className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          </div>
        ) : null}

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs uppercase text-[#94a3b8]">Services</span>
            <button type="button" onClick={() => setLineItems((p) => [...p, { description: "", quantity: "1", unitPrice: "" }])} className="text-xs text-[#00d4ff]">+ Line</button>
          </div>
          {lineItems.map((line, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_72px_100px_auto]">
              <input value={line.description} onChange={(e) => setLineItems((p) => p.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm" />
              <input value={line.quantity} onChange={(e) => setLineItems((p) => p.map((x, j) => (j === i ? { ...x, quantity: e.target.value } : x)))} className="rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm" />
              <input value={line.unitPrice} onChange={(e) => setLineItems((p) => p.map((x, j) => (j === i ? { ...x, unitPrice: e.target.value } : x)))} className="rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm" />
              <button type="button" onClick={() => setLineItems((p) => p.filter((_, j) => j !== i))} className="text-red-400">×</button>
            </div>
          ))}
          <p className="text-sm text-right text-[#94a3b8]">Total: INR {totals.total.toFixed(2)}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#7c3aed] px-4 py-2 text-sm font-semibold disabled:opacity-50">
            {saving ? "Saving…" : "Save & PDF"}
          </button>
          <Link href={`/hq/it-invoices/${id}/print`} className="rounded-xl border border-white/10 px-4 py-2 text-sm">
            Print only
          </Link>
          <Link href="/hq/it-receipts" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#00d4ff]">
            Record payment →
          </Link>
        </div>
      </form>
    </div>
  );
}
