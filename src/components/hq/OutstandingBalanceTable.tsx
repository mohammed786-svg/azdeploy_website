"use client";

import Link from "next/link";
import type { PendingInstallmentRow } from "@/lib/hq-financial-helpers";

export type OutstandingPage = {
  items: PendingInstallmentRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type Props = {
  data: OutstandingPage | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
};

export default function OutstandingBalanceTable({ data, loading, onPageChange, emptyMessage }: Props) {
  const items = data?.items ?? [];
  const page = data?.page ?? 1;
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-mono uppercase text-[#64748b]">
          {total} installment{total === 1 ? "" : "s"} with balance
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#94a3b8]">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => onPageChange(page - 1)}
              className="rounded-lg border border-white/10 px-2 py-1 hover:bg-white/5 disabled:opacity-40"
            >
              Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => onPageChange(page + 1)}
              className="rounded-lg border border-white/10 px-2 py-1 hover:bg-white/5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
      {loading ? (
        <p className="px-4 py-8 text-sm text-[#64748b] font-mono text-center">Loading…</p>
      ) : items.length === 0 ? (
        <p className="px-4 py-10 text-sm text-[#64748b] font-mono text-center">{emptyMessage ?? "Nothing outstanding."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase text-[#64748b]">
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Installment</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3 text-right">Outstanding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.map((row, i) => (
                <tr key={`${row.invoiceId}-${row.installmentLabel}-${i}`} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-[#a78bfa]">
                    <Link href={`/hq/invoices/${row.invoiceId}`} className="hover:underline">
                      {row.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-white">{row.studentName}</td>
                  <td className="px-4 py-3 text-[#94a3b8]">{row.installmentLabel}</td>
                  <td className="px-4 py-3 text-[#64748b] text-xs font-mono">{row.dueDate || "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-amber-300/90">
                    {row.currency} {Number(row.outstanding).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
