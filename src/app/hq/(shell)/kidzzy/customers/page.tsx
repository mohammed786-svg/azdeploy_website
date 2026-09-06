"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import { kidzzyMediaUrl } from "@/lib/kidzzy";

type Tab = "buyers" | "orders" | "leads";

type Buyer = {
  email: string;
  buyerName: string;
  buyerPhone: string;
  paidCount: number;
  abandonedCount: number;
  openLeads: number;
  paidInr: number;
  lastActivityAt?: string;
  hasPurchased: boolean;
  needsFollowUp: boolean;
};

type Order = {
  id: string;
  orderRef: string;
  productTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  amountInr: number;
  status: string;
  needsFollowUp: boolean;
  coverImageUrl?: string;
  createdAt?: string;
  paidAt?: string;
};

type Lead = {
  id: string;
  productTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  stage: string;
  status: string;
  needsFollowUp: boolean;
  lastSeenAt?: string;
  orderId?: string;
};

type PageData<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqKidzzyCustomersPage() {
  const [tab, setTab] = useState<Tab>("buyers");
  const [kind, setKind] = useState("all");
  const [orderStatus, setOrderStatus] = useState("");
  const [leadStatus, setLeadStatus] = useState("open");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [buyers, setBuyers] = useState<PageData<Buyer> | null>(null);
  const [orders, setOrders] = useState<PageData<Order> | null>(null);
  const [leads, setLeads] = useState<PageData<Lead> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      if (tab === "buyers") {
        const url = hqListUrl("/api/hq/kidzzy/buyers", {
          page,
          pageSize,
          search: debounced,
          sort: "createdAt_desc",
        });
        const withKind = `${url}${url.includes("?") ? "&" : "?"}kind=${encodeURIComponent(kind)}`;
        setBuyers(await hqFetch<PageData<Buyer>>(withKind));
      } else if (tab === "orders") {
        const url = hqListUrl("/api/hq/kidzzy/orders", {
          page,
          pageSize,
          search: debounced,
          sort: "createdAt_desc",
        });
        const withStatus = orderStatus
          ? `${url}${url.includes("?") ? "&" : "?"}status=${encodeURIComponent(orderStatus)}`
          : url;
        setOrders(await hqFetch<PageData<Order>>(withStatus));
      } else {
        const url = hqListUrl("/api/hq/kidzzy/leads", {
          page,
          pageSize,
          search: debounced,
          sort: "createdAt_desc",
        });
        const withStatus = `${url}${url.includes("?") ? "&" : "?"}status=${encodeURIComponent(leadStatus)}`;
        setLeads(await hqFetch<PageData<Lead>>(withStatus));
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [tab, kind, orderStatus, leadStatus, page, pageSize, debounced]);

  useEffect(() => {
    void load();
  }, [load]);

  const total =
    tab === "buyers" ? buyers?.total : tab === "orders" ? orders?.total : leads?.total;
  const totalPages =
    tab === "buyers" ? buyers?.totalPages : tab === "orders" ? orders?.totalPages : leads?.totalPages;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/hq/kidzzy" className="text-xs text-[#94a3b8] hover:text-[#00d4ff]">
            ← Kidzzy catalog
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-white">Kidzzy customers & orders</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Purchasers, abandoned checkouts, and follow-up leads (mobile is required at checkout).
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["buyers", "People"],
            ["orders", "All orders"],
            ["leads", "Buy clicks / leads"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              tab === id ? "bg-[#7c3aed] text-white" : "border border-white/15 text-[#cbd5e1]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "buyers" ? (
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["purchased", "Purchased"],
            ["abandoned", "Needs follow-up"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setKind(id);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                kind === id ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-[#94a3b8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {tab === "orders" ? (
        <div className="flex flex-wrap gap-2">
          {[
            ["", "All"],
            ["paid", "Paid"],
            ["abandoned", "Didn't complete"],
          ].map(([id, label]) => (
            <button
              key={id || "all"}
              type="button"
              onClick={() => {
                setOrderStatus(id);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                orderStatus === id ? "bg-amber-500/20 text-amber-200" : "bg-white/5 text-[#94a3b8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {tab === "leads" ? (
        <div className="flex flex-wrap gap-2">
          {[
            ["open", "Open"],
            ["abandoned", "Abandoned"],
            ["converted", "Converted"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setLeadStatus(id);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                leadStatus === id ? "bg-sky-500/20 text-sky-200" : "bg-white/5 text-[#94a3b8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {err ? <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</p> : null}

      <HqListToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        sortValue="createdAt_desc"
        onSortChange={() => {}}
        sortOptions={[{ value: "createdAt_desc", label: "Newest" }]}
        dateFrom=""
        dateTo=""
        onDateFromChange={() => {}}
        onDateToChange={() => {}}
        showDateRange={false}
        page={page}
        pageSize={pageSize}
        total={total ?? 0}
        totalPages={totalPages ?? 1}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
        {loading ? (
          <p className="px-4 py-10 text-center text-[#94a3b8]">Loading…</p>
        ) : tab === "buyers" ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[#94a3b8]">
                <th className="px-4 py-3">Person</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Abandoned</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {!buyers?.items?.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#94a3b8]">
                    No people yet
                  </td>
                </tr>
              ) : (
                buyers.items.map((b) => (
                  <tr key={b.email} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{b.buyerName || "—"}</p>
                      <p className="text-xs text-[#64748b]">{b.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#cbd5e1]">{b.buyerPhone || "—"}</td>
                    <td className="px-4 py-3 text-[#cbd5e1]">
                      {b.paidCount} · ₹{b.paidInr}
                    </td>
                    <td className="px-4 py-3 text-[#cbd5e1]">{b.abandonedCount + b.openLeads}</td>
                    <td className="px-4 py-3">
                      {b.needsFollowUp ? (
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-200">Yes</span>
                      ) : (
                        <span className="text-xs text-[#64748b]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/hq/kidzzy/customers/person?email=${encodeURIComponent(b.email)}`}
                        className="text-xs text-[#00d4ff] hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : tab === "orders" ? (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[#94a3b8]">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {!orders?.items?.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#94a3b8]">
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.items.map((o) => {
                  const thumb = kidzzyMediaUrl(o.coverImageUrl);
                  return (
                    <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-8 overflow-hidden rounded bg-black/40">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb} alt="" className="h-full w-full object-cover object-top" />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-medium text-white">{o.productTitle}</p>
                            <p className="text-xs text-[#64748b]">{o.orderRef}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white">{o.buyerName}</p>
                        <p className="text-xs text-[#64748b]">{o.buyerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-[#cbd5e1]">{o.buyerPhone || "—"}</td>
                      <td className="px-4 py-3 text-[#cbd5e1]">₹{o.amountInr}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            o.status === "paid"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-200"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/hq/kidzzy/orders/${o.id}`} className="text-xs text-[#00d4ff] hover:underline">
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[#94a3b8]">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Person</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {!leads?.items?.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#94a3b8]">
                    No leads yet — they appear when someone clicks Buy Now / opens checkout
                  </td>
                </tr>
              ) : (
                leads.items.map((l) => (
                  <tr key={l.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white">{l.productTitle}</td>
                    <td className="px-4 py-3">
                      <p className="text-white">{l.buyerName || "—"}</p>
                      <p className="text-xs text-[#64748b]">{l.buyerEmail || "no email yet"}</p>
                    </td>
                    <td className="px-4 py-3 text-[#cbd5e1]">{l.buyerPhone || "—"}</td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">{l.stage}</td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">{l.status}</td>
                    <td className="px-4 py-3 text-right">
                      {l.buyerEmail ? (
                        <Link
                          href={`/hq/kidzzy/customers/person?email=${encodeURIComponent(l.buyerEmail)}`}
                          className="text-xs text-[#00d4ff] hover:underline"
                        >
                          Open
                        </Link>
                      ) : l.orderId ? (
                        <Link href={`/hq/kidzzy/orders/${l.orderId}`} className="text-xs text-[#00d4ff] hover:underline">
                          Order
                        </Link>
                      ) : (
                        <span className="text-xs text-[#64748b]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
