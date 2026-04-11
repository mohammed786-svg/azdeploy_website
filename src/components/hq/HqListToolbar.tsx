"use client";

/** Shared filters + pagination for HQ list pages. */

type SortOption = { value: string; label: string };

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  sortValue: string;
  onSortChange: (v: string) => void;
  sortOptions: SortOption[];
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  showDateRange?: boolean;
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange?: (n: number) => void;
  onApply?: () => void;
};

export default function HqListToolbar({
  search,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  showDateRange = true,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onApply,
}: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/[0.06] bg-[#07070c]/80 p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 items-end">
        <label className="block sm:col-span-2">
          <span className="text-[10px] font-mono uppercase text-[#64748b]">Search</span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type to filter…"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-mono uppercase text-[#64748b]">Sort</span>
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {showDateRange && (
          <>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
              />
            </label>
          </>
        )}
        {onPageSizeChange && (
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {onApply && (
        <button
          type="button"
          onClick={onApply}
          className="rounded-xl border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-4 py-2 text-xs font-mono uppercase text-[#7dd3fc] hover:bg-[#00d4ff]/20"
        >
          Apply filters
        </button>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06] text-xs font-mono text-[#64748b]">
        <span>
          {total} total · page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-[#94a3b8] hover:bg-white/5 disabled:opacity-30"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-[#94a3b8] hover:bg-white/5 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
