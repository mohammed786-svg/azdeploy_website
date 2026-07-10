"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import { SERVICE_ORG } from "@/lib/invoice-org";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";

export type ServiceLineItem = {
  description: string;
  quantity: string;
  unitPrice: string;
};

export type ServiceInvoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerCompany?: string;
  customerMobile?: string;
  total: number;
  advanceAmount?: number;
  balanceDue?: number;
  currency: string;
  status: string;
  applyGst?: boolean;
  issuedAt?: string;
  createdAt?: string;
};

type PageData = {
  items: ServiceInvoice[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const EMPTY_LINE: ServiceLineItem = { description: "", quantity: "1", unitPrice: "" };

function lineTotal(line: ServiceLineItem): number {
  const q = Number(line.quantity) || 0;
  const p = Number(line.unitPrice) || 0;
  return Math.round(q * p * 100) / 100;
}

function computeTotals(lines: ServiceLineItem[], applyGst: boolean, taxPercent: number) {
  const subtotal = Math.round(lines.reduce((s, l) => s + lineTotal(l), 0) * 100) / 100;
  const taxAmount = applyGst && taxPercent > 0 ? Math.round(subtotal * taxPercent) / 100 : 0;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;
  return { subtotal, taxAmount, total };
}

export default function ItInvoicesPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("createdAt_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [companyName, setCompanyName] = useState(SERVICE_ORG.legalName);
  const [companyAddress, setCompanyAddress] = useState(SERVICE_ORG.addressLines.join(", "));
  const [companyGstin, setCompanyGstin] = useState(SERVICE_ORG.gstin);
  const [applyGst, setApplyGst] = useState(false);
  const [taxPercent, setTaxPercent] = useState("18");
  const [lineItems, setLineItems] = useState<ServiceLineItem[]>([
    { description: "Website development", quantity: "1", unitPrice: "" },
  ]);
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [advancePaymentMethod, setAdvancePaymentMethod] = useState("UPI");
  const [notes, setNotes] = useState("");
  const [issuedAt, setIssuedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueAt, setDueAt] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const totals = useMemo(
    () => computeTotals(lineItems, applyGst, Number(taxPercent) || 0),
    [lineItems, applyGst, taxPercent]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/service-invoices", {
        page,
        pageSize,
        search: debouncedSearch,
        sort,
      });
      const res = await hqFetch<PageData>(url);
      setData(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setCustomerName("");
    setCustomerCompany("");
    setCustomerMobile("");
    setCustomerAddress("");
    setCompanyName(SERVICE_ORG.legalName);
    setCompanyAddress(SERVICE_ORG.addressLines.join(", "));
    setCompanyGstin(SERVICE_ORG.gstin);
    setApplyGst(false);
    setTaxPercent("18");
    setLineItems([{ description: "Website development", quantity: "1", unitPrice: "" }]);
    setAdvanceAmount("");
    setNotes("");
    setIssuedAt(new Date().toISOString().slice(0, 10));
    setDueAt("");
  }

  async function createInvoice(e: React.FormEvent) {
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
      if (!customerName.trim()) throw new Error("Customer name is required");
      if (!items.length) throw new Error("Add at least one service line");

      const res = await hqFetch<{ item: { id: string } }>("/api/hq/service-invoices", {
        method: "POST",
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerCompany: customerCompany.trim(),
          customerMobile: customerMobile.trim(),
          customerAddress: customerAddress.trim(),
          companyName: companyName.trim(),
          companyAddress: companyAddress.trim(),
          companyGstin: applyGst ? companyGstin.trim() : "",
          applyGst,
          taxPercent: Number(taxPercent) || 18,
          lineItems: items,
          advanceAmount: advanceAmount ? Number(advanceAmount) : 0,
          advancePaymentMethod,
          notes: notes.trim(),
          issuedAt,
          dueAt: dueAt || null,
        }),
      });
      setCreateOpen(false);
      resetForm();
      await load();
      if (res.item?.id) window.location.href = `/hq/it-invoices/${res.item.id}/print`;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#64748b]">IT Services</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Client invoices</h1>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
            Websites, mobile apps, AI automation, ERP & CRM — optional GST, editable services, advance & balance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/hq/it-receipts"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#cbd5e1] hover:bg-white/5"
          >
            IT receipts
          </Link>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-xl bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white"
          >
            New invoice
          </button>
        </div>
      </div>

      {err ? <p className="text-amber-400 text-sm">{err}</p> : null}

      <HqListToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        sortValue={sort}
        sortOptions={[
          { value: "createdAt_desc", label: "Newest" },
          { value: "createdAt_asc", label: "Oldest" },
          { value: "total_desc", label: "Amount high" },
          { value: "invoiceNumber_asc", label: "Invoice #" },
        ]}
        onSortChange={setSort}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        showDateRange={false}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
        total={data?.total ?? 0}
      />

      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-[#94a3b8] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Balance</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-[#64748b]">
                  Loading…
                </td>
              </tr>
            ) : null}
            {!loading && (data?.items?.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-[#64748b]">
                  No IT invoices yet.
                </td>
              </tr>
            ) : null}
            {(data?.items ?? []).map((inv) => (
              <tr key={inv.id} className="border-t border-white/[0.06] hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-mono text-white">{inv.invoiceNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-white">{inv.customerName}</p>
                  {inv.customerCompany ? <p className="text-xs text-[#64748b]">{inv.customerCompany}</p> : null}
                </td>
                <td className="px-4 py-3 text-white">
                  {inv.currency} {inv.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-[#cbd5e1]">
                  {(inv.balanceDue ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 capitalize text-[#94a3b8]">{inv.status}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/hq/it-invoices/${inv.id}`} className="text-[#00d4ff] hover:underline text-xs">
                    Edit
                  </Link>
                  <Link href={`/hq/it-invoices/${inv.id}/print`} className="text-[#a78bfa] hover:underline text-xs">
                    PDF
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="New IT services invoice">
        <form onSubmit={createInvoice} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-[#94a3b8]">
              Customer name *
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-[#94a3b8]">
              Company / business
              <input
                value={customerCompany}
                onChange={(e) => setCustomerCompany(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-[#94a3b8]">
              Mobile
              <input
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-[#94a3b8] sm:col-span-2">
              Address
              <textarea
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              />
            </label>
          </div>

          <div className="rounded-xl border border-white/10 p-3 space-y-3">
            <p className="text-xs font-semibold text-[#cbd5e1] uppercase tracking-wide">Your company (on invoice)</p>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
            />
            <textarea
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              rows={2}
              placeholder="Address"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm text-[#cbd5e1]">
              <input type="checkbox" checked={applyGst} onChange={(e) => setApplyGst(e.target.checked)} />
              Apply GST on this invoice
            </label>
            {applyGst ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  value={companyGstin}
                  onChange={(e) => setCompanyGstin(e.target.value)}
                  placeholder="GSTIN"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm font-mono"
                />
                <input
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  placeholder="GST %"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-[#cbd5e1] uppercase tracking-wide">Services</p>
              <button
                type="button"
                onClick={() => setLineItems((p) => [...p, { ...EMPTY_LINE }])}
                className="text-xs text-[#00d4ff]"
              >
                + Add line
              </button>
            </div>
            {lineItems.map((line, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_72px_100px_80px_32px] items-end">
                <input
                  value={line.description}
                  onChange={(e) =>
                    setLineItems((p) => p.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))
                  }
                  placeholder="Service description"
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
                />
                <input
                  value={line.quantity}
                  onChange={(e) =>
                    setLineItems((p) => p.map((x, j) => (j === i ? { ...x, quantity: e.target.value } : x)))
                  }
                  placeholder="Qty"
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm"
                />
                <input
                  value={line.unitPrice}
                  onChange={(e) =>
                    setLineItems((p) => p.map((x, j) => (j === i ? { ...x, unitPrice: e.target.value } : x)))
                  }
                  placeholder="Rate"
                  className="rounded-lg border border-white/10 bg-black/40 px-2 py-2 text-sm"
                />
                <span className="text-xs text-[#94a3b8] py-2">{lineTotal(line).toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => setLineItems((p) => p.filter((_, j) => j !== i))}
                  className="text-red-400 text-lg"
                  aria-label="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            <p className="text-sm text-[#94a3b8] text-right">
              Subtotal: INR {totals.subtotal.toFixed(2)}
              {applyGst ? ` · GST: ${totals.taxAmount.toFixed(2)}` : ""} ·{" "}
              <span className="text-white font-semibold">Total: INR {totals.total.toFixed(2)}</span>
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-[#94a3b8]">
              Advance received (optional)
              <input
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
                type="number"
                min={0}
                step="0.01"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              />
            </label>
            {advanceAmount ? (
              <label className="block text-xs text-[#94a3b8]">
                Advance payment method
                <select
                  value={advancePaymentMethod}
                  onChange={(e) => setAdvancePaymentMethod(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                >
                  {["Cash", "UPI", "Bank transfer", "Cheque", "Card"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="block text-xs text-[#94a3b8]">
              Issue date
              <input
                type="date"
                value={issuedAt}
                onChange={(e) => setIssuedAt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-[#94a3b8]">
              Due date (optional)
              <input
                type="date"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Notes (optional)"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#7c3aed] py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create & open PDF"}
          </button>
        </form>
      </HqModal>
    </div>
  );
}
