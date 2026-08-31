"use client";

import { useEffect, useState } from "react";
import { salesFetch } from "@/lib/sales-client";
import { formatInr } from "@/lib/ebooks";

type Dashboard = {
  paidOrders: number;
  pendingOrders: number;
  revenueInr: number;
  estimatedCommissionInr: number;
  commissionBps: number;
  totalClicks: number;
  recentOrders: Array<{
    orderRef: string;
    buyerName: string;
    amountInr: number;
    status: string;
    ebookTitle: string;
    paidAt?: string;
  }>;
};

export default function SalesDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    void salesFetch<Dashboard>("/api/sales/dashboard").then(setData).catch(() => undefined);
  }, []);

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Sales dashboard</h1>
      <p className="mt-2 text-sm text-white/60">Track clicks, paid orders, and revenue from your personal referral links.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Paid orders", value: data?.paidOrders ?? "—" },
          { label: "Link clicks", value: data?.totalClicks ?? "—" },
          { label: "Revenue", value: data ? formatInr(data.revenueInr) : "—" },
          { label: "Est. commission", value: data ? formatInr(data.estimatedCommissionInr) : "—" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 p-5">
            <p className="text-xs font-mono uppercase tracking-wider text-white/50">{c.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#fde68a]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">Recent orders</h2>
        <div className="mt-4 space-y-2">
          {(data?.recentOrders || []).map((o) => (
            <div key={o.orderRef} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm">
              <div>
                <p className="text-white">{o.ebookTitle}</p>
                <p className="text-xs text-white/50">{o.buyerName} · {o.orderRef}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[#fde68a]">{formatInr(o.amountInr)}</p>
                <p className="text-[10px] uppercase text-white/45">{o.status}</p>
              </div>
            </div>
          ))}
          {!data?.recentOrders?.length ? <p className="text-sm text-white/50">No attributed sales yet. Share your link from My links.</p> : null}
        </div>
      </div>
    </div>
  );
}
