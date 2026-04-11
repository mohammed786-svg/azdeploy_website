"use client";

export type StudentBillingSummary = {
  currency: string;
  outstandingPending: number;
  nextDueDate: string | null;
  totalReceiptsRecorded: number;
};

export function StudentBillingHint({
  loading,
  data,
}: {
  loading: boolean;
  data: StudentBillingSummary | null;
}) {
  if (!loading && !data) return null;

  if (loading) {
    return (
      <div className="sm:col-span-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
        <p className="text-xs text-[#64748b] font-mono">Loading balance…</p>
      </div>
    );
  }

  if (!data) return null;

  const hasOutstanding = data.outstandingPending > 0;
  const fmt = (n: number) =>
    `${data.currency} ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="sm:col-span-2 rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-sm">
      <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">This student — before you save</p>
      <p className="text-[#e8eef5]">
        <span className="text-[#94a3b8]">Pending amount / old balance (unpaid on invoices): </span>
        <span className={`font-mono font-semibold tabular-nums ${hasOutstanding ? "text-amber-200/95" : "text-emerald-300/90"}`}>
          {fmt(data.outstandingPending)}
        </span>
        {!hasOutstanding && <span className="text-[#64748b] text-xs ml-2">— none</span>}
      </p>
      {hasOutstanding && data.nextDueDate && (
        <p className="text-[#94a3b8]">
          Next due date:{" "}
          <span className="text-white font-mono">
            {new Date(`${data.nextDueDate}T12:00:00`).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </p>
      )}
      <p className="text-[#64748b] text-xs border-t border-white/[0.06] pt-2 mt-1">
        Total payments recorded (receipts):{" "}
        <span className="font-mono text-[#cbd5e1]">{fmt(data.totalReceiptsRecorded)}</span>
      </p>
    </div>
  );
}
