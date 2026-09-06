"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { kidzzyMediaUrl } from "@/lib/kidzzy";

type Order = {
  id: string;
  orderRef: string;
  productTitle: string;
  productSlug: string;
  pageCount: number;
  coverImageUrl: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  amountInr: number;
  status: string;
  needsFollowUp: boolean;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  hasInvoice: boolean;
  paidAt?: string;
  createdAt?: string;
};

export default function HqKidzzyOrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<Order | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await hqFetch<{ item: Order }>(`/api/hq/kidzzy/orders/${id}`);
        if (!cancelled) setItem(res.item);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="py-16 text-center text-[#94a3b8]">Loading…</p>;
  if (err || !item) return <p className="py-16 text-center text-red-300">{err || "Not found"}</p>;

  const thumb = kidzzyMediaUrl(item.coverImageUrl);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/hq/kidzzy/customers" className="text-xs text-[#94a3b8] hover:text-[#00d4ff]">
          ← Customers & orders
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Order {item.orderRef}</h1>
      </div>

      {item.needsFollowUp ? (
        <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Payment not completed — call {item.buyerPhone || "the buyer"} to follow up.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex gap-4">
            <div className="h-28 w-20 overflow-hidden rounded-lg bg-black/40">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="h-full w-full object-cover object-top" />
              ) : null}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{item.productTitle}</p>
              <p className="mt-1 text-sm text-[#94a3b8]">
                {item.pageCount} pages · ₹{item.amountInr}
              </p>
              <p className="mt-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    item.status === "paid"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-200"
                  }`}
                >
                  {item.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-2 text-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">Buyer</p>
          <p className="text-white">{item.buyerName}</p>
          <p className="text-[#cbd5e1]">{item.buyerEmail}</p>
          <p className="text-[#cbd5e1]">
            {item.buyerPhone || "No phone"}{" "}
            {item.buyerPhone ? (
              <a href={`tel:${item.buyerPhone}`} className="text-[#00d4ff] hover:underline">
                Call
              </a>
            ) : null}
          </p>
          <Link
            href={`/hq/kidzzy/customers/person?email=${encodeURIComponent(item.buyerEmail)}`}
            className="inline-block text-xs text-[#00d4ff] hover:underline"
          >
            View all activity for this person
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-[#94a3b8] space-y-1">
        <p>Created: {item.createdAt || "—"}</p>
        <p>Paid at: {item.paidAt || "—"}</p>
        <p>Razorpay order: {item.razorpayOrderId || "—"}</p>
        <p>Razorpay payment: {item.razorpayPaymentId || "—"}</p>
        <p>Invoice: {item.hasInvoice ? "Generated" : "Not yet"}</p>
      </div>
    </div>
  );
}
