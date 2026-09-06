"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { kidzzyMediaUrl } from "@/lib/kidzzy";

type Detail = {
  buyer: {
    email: string;
    buyerName: string;
    buyerPhone: string;
    paidCount: number;
    abandonedCount: number;
    openLeads: number;
    paidInr: number;
    needsFollowUp: boolean;
  };
  orders: Array<{
    id: string;
    orderRef: string;
    productTitle: string;
    coverImageUrl?: string;
    amountInr: number;
    status: string;
    needsFollowUp: boolean;
    paidAt?: string;
    createdAt?: string;
  }>;
  leads: Array<{
    id: string;
    productTitle: string;
    stage: string;
    status: string;
    buyerPhone?: string;
    lastSeenAt?: string;
  }>;
};

function PersonInner() {
  const search = useSearchParams();
  const email = search.get("email") || "";
  const [data, setData] = useState<Detail | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setErr("Missing email");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await hqFetch<Detail>(
          `/api/hq/kidzzy/buyers/detail?email=${encodeURIComponent(email)}`,
        );
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email]);

  if (loading) return <p className="py-16 text-center text-[#94a3b8]">Loading…</p>;
  if (err || !data) return <p className="py-16 text-center text-red-300">{err || "Not found"}</p>;

  const b = data.buyer;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/hq/kidzzy/customers" className="text-xs text-[#94a3b8] hover:text-[#00d4ff]">
          ← Customers
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">{b.buyerName || b.email}</h1>
        <p className="mt-1 text-sm text-[#94a3b8]">{b.email}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-[#94a3b8]">Mobile</p>
          <p className="mt-1 text-lg font-semibold text-white">{b.buyerPhone || "—"}</p>
          {b.buyerPhone ? (
            <a href={`tel:${b.buyerPhone}`} className="mt-2 inline-block text-xs text-[#00d4ff] hover:underline">
              Call for follow-up
            </a>
          ) : null}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-[#94a3b8]">Paid orders</p>
          <p className="mt-1 text-lg font-semibold text-emerald-300">
            {b.paidCount} · ₹{b.paidInr}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-[#94a3b8]">Abandoned</p>
          <p className="mt-1 text-lg font-semibold text-amber-200">{b.abandonedCount}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-[#94a3b8]">Open leads</p>
          <p className="mt-1 text-lg font-semibold text-sky-200">{b.openLeads}</p>
        </div>
      </div>

      {b.needsFollowUp ? (
        <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Needs follow-up — they started checkout or payment but did not complete a purchase.
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Orders</h2>
        {!data.orders.length ? (
          <p className="text-sm text-[#94a3b8]">No orders yet</p>
        ) : (
          data.orders.map((o) => {
            const thumb = kidzzyMediaUrl(o.coverImageUrl);
            return (
              <Link
                key={o.id}
                href={`/hq/kidzzy/orders/${o.id}`}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05]"
              >
                <div className="h-14 w-10 overflow-hidden rounded bg-black/40">
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="h-full w-full object-cover object-top" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{o.productTitle}</p>
                  <p className="text-xs text-[#64748b]">
                    {o.orderRef} · ₹{o.amountInr} · {o.status}
                  </p>
                </div>
                {o.needsFollowUp ? (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-200">Follow up</span>
                ) : null}
              </Link>
            );
          })
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Checkout activity</h2>
        {!data.leads.length ? (
          <p className="text-sm text-[#94a3b8]">No lead events</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-[#94a3b8]">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Stage</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map((l) => (
                  <tr key={l.id} className="border-b border-white/5">
                    <td className="px-4 py-2 text-white">{l.productTitle}</td>
                    <td className="px-4 py-2 text-[#94a3b8]">{l.stage}</td>
                    <td className="px-4 py-2 text-[#94a3b8]">{l.status}</td>
                    <td className="px-4 py-2 text-[#64748b]">{l.lastSeenAt || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function HqKidzzyPersonPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-[#94a3b8]">Loading…</p>}>
      <PersonInner />
    </Suspense>
  );
}
