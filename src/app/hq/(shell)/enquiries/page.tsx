"use client";

import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";
import { formatEnquiryDegreeLabel } from "@/lib/enquiry-degree";

type Row = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  degree?: string;
  degreeOther?: string | null;
  college?: string;
  passoutYear?: string;
  city?: string;
  createdAt?: unknown;
};

type PageData = {
  items: Row[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqEnquiriesPage() {
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
  const [viewOpen, setViewOpen] = useState(false);
  const [viewRow, setViewRow] = useState<Row | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/enquiries", {
        page,
        pageSize,
        search: debouncedSearch,
        sort,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      const res = await hqFetch<PageData>(url);
      setData(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sort, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  const items = data?.items ?? [];

  function fmtCreatedAt(raw: unknown): string {
    if (raw == null) return "—";
    const d = new Date(raw as string | number | Date);
    if (Number.isNaN(d.getTime())) return String(raw);
    return d.toLocaleString("en-IN");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Pipeline</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Students enquiry</h1>
        <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
          Public form submissions · search, sort, and filter by created date.
        </p>
      </header>

      <HqListToolbar
        search={search}
        onSearchChange={setSearch}
        sortValue={sort}
        onSortChange={(v) => {
          setSort(v);
          setPage(1);
        }}
        sortOptions={[
          { value: "createdAt_desc", label: "Newest first" },
          { value: "createdAt_asc", label: "Oldest first" },
          { value: "fullName_asc", label: "Name A→Z" },
          { value: "email_asc", label: "Email A→Z" },
        ]}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={(v) => {
          setDateFrom(v);
          setPage(1);
        }}
        onDateToChange={(v) => {
          setDateTo(v);
          setPage(1);
        }}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n);
          setPage(1);
        }}
      />

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}
      {loading ? (
        <p className="text-[#64748b] font-mono text-sm">Loading…</p>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#07070c]/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-[#64748b]">
                  <th className="px-4 py-3 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 whitespace-nowrap">Degree</th>
                  <th className="px-4 py-3 whitespace-nowrap">College</th>
                  <th className="px-4 py-3 whitespace-nowrap">Pass-out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[#64748b] font-mono text-sm">
                      No rows match your filters.
                    </td>
                  </tr>
                ) : (
                  items.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-white font-medium">
                        <button
                          type="button"
                          onClick={() => {
                            setViewRow(r);
                            setViewOpen(true);
                          }}
                          className="hover:underline text-left"
                        >
                          {r.fullName ?? "—"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">{r.email ?? "—"}</td>
                      <td className="px-4 py-3 text-[#94a3b8] whitespace-nowrap">{r.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-[#94a3b8] max-w-[220px]">
                        {formatEnquiryDegreeLabel(r.degree ?? "", r.degreeOther)}
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8] max-w-[200px] truncate" title={r.college}>
                        {r.college ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">{r.passoutYear ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <HqModal open={viewOpen} onClose={() => setViewOpen(false)} title="Enquiry details" size="lg">
        {!viewRow ? (
          <p className="text-sm text-[#64748b] font-mono">No record selected.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <p><span className="text-[#64748b]">Name:</span> {viewRow.fullName || "—"}</p>
            <p><span className="text-[#64748b]">Email:</span> {viewRow.email || "—"}</p>
            <p><span className="text-[#64748b]">Phone:</span> {viewRow.phone || "—"}</p>
            <p><span className="text-[#64748b]">Pass-out:</span> {viewRow.passoutYear || "—"}</p>
            <p className="sm:col-span-2"><span className="text-[#64748b]">Degree:</span> {formatEnquiryDegreeLabel(viewRow.degree ?? "", viewRow.degreeOther)}</p>
            <p className="sm:col-span-2"><span className="text-[#64748b]">College:</span> {viewRow.college || "—"}</p>
            <p className="sm:col-span-2"><span className="text-[#64748b]">City/Address:</span> {viewRow.city || "—"}</p>
            <p className="sm:col-span-2"><span className="text-[#64748b]">Created at:</span> {fmtCreatedAt(viewRow.createdAt)}</p>
          </div>
        )}
      </HqModal>
    </div>
  );
}
