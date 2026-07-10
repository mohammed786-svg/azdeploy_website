"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";

type ServiceInvoice = { id: string; invoiceNumber: string; customerName: string; balanceDue?: number; total: number };
type Receipt = {
  id: string;
  receiptNumber: string;
  customerName: string;
  invoiceNumber?: string;
  amount: number;
  currency: string;
  purpose?: string;
  paymentMethod?: string;
  receivedAt?: string;
};

type PageData = { items: Receipt[]; total: number; page: number; pageSize: number; totalPages: number };

export default function ItReceiptsPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [invoices, setInvoices] = useState<ServiceInvoice[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("receivedAt_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [serviceInvoiceId, setServiceInvoiceId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("IT services payment");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");
  const [receivedAt, setReceivedAt] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadInvoices = useCallback(async () => {
    const res = await hqFetch<{ items: ServiceInvoice[] }>(
      hqListUrl("/api/hq/service-invoices", { page: 1, pageSize: 200, sort: "createdAt_desc" })
    );
    setInvoices(res.items ?? []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/service-receipts", { page, pageSize, search: debouncedSearch, sort });
      const res = await hqFetch<PageData>(url);
      setData(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sort]);

  useEffect(() => {
    void loadInvoices();
  }, [loadInvoices]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!serviceInvoiceId) return;
    const inv = invoices.find((i) => i.id === serviceInvoiceId);
    if (inv) {
      setCustomerName(inv.customerName);
      if (!amount && inv.balanceDue != null && inv.balanceDue > 0) setAmount(String(inv.balanceDue));
      setPurpose(`Payment for ${inv.invoiceNumber}`);
    }
  }, [serviceInvoiceId, invoices, amount]);

  async function createReceipt(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const res = await hqFetch<{ item: { id: string } }>("/api/hq/service-receipts", {
        method: "POST",
        body: JSON.stringify({
          serviceInvoiceId: serviceInvoiceId || null,
          customerName: customerName.trim(),
          customerMobile: customerMobile.trim(),
          customerAddress: customerAddress.trim(),
          amount: Number(amount),
          purpose,
          paymentMethod,
          referenceNo,
          notes,
          receivedAt,
        }),
      });
      setCreateOpen(false);
      await load();
      if (res.item?.id) window.location.href = `/hq/it-receipts/${res.item.id}/print`;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#64748b]">IT Services</p>
          <h1 className="mt-2 text-2xl font-bold text-white">Payment receipts</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/hq/it-invoices" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#cbd5e1]">
            IT invoices
          </Link>
          <button type="button" onClick={() => setCreateOpen(true)} className="rounded-xl bg-[#7c3aed] px-4 py-2 text-sm font-semibold">
            New receipt
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
          { value: "receivedAt_desc", label: "Newest" },
          { value: "amount_desc", label: "Amount high" },
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
              <th className="px-4 py-3">Receipt</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(data?.items ?? []).map((r) => (
              <tr key={r.id} className="border-t border-white/[0.06]">
                <td className="px-4 py-3 font-mono text-white">{r.receiptNumber}</td>
                <td className="px-4 py-3 text-white">{r.customerName}</td>
                <td className="px-4 py-3 text-[#94a3b8]">{r.invoiceNumber || "—"}</td>
                <td className="px-4 py-3 text-white">
                  {r.currency} {r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/hq/it-receipts/${r.id}/print`} className="text-[#a78bfa] text-xs hover:underline">
                    PDF / WhatsApp
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HqModal open={createOpen} onClose={() => setCreateOpen(false)} title="Record payment receipt">
        <form onSubmit={createReceipt} className="space-y-3">
          <label className="block text-xs text-[#94a3b8]">
            Link to invoice (optional)
            <select
              value={serviceInvoiceId}
              onChange={(e) => setServiceInvoiceId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
            >
              <option value="">— Standalone receipt —</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.customerName} (bal {inv.balanceDue ?? 0})
                </option>
              ))}
            </select>
          </label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Customer name *" className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          <input value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} placeholder="Mobile" className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          <input value={amount} onChange={(e) => setAmount(e.target.value)} required type="number" min={0.01} step="0.01" placeholder="Amount *" className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Purpose" className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm">
            {["Cash", "UPI", "Bank transfer", "Cheque", "Card"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} placeholder="Reference / UTR (optional)" className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          <label className="block text-xs text-[#94a3b8]">
            Received date (shown on PDF)
            <input type="date" value={receivedAt} onChange={(e) => setReceivedAt(e.target.value)} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm" />
          </label>
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#7c3aed] py-2 text-sm font-semibold disabled:opacity-50">
            {saving ? "Saving…" : "Create & open PDF"}
          </button>
        </form>
      </HqModal>
    </div>
  );
}
