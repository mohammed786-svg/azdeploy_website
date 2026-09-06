"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";
import type { WorkshopCertificate } from "@/lib/workshop-certificate-types";

type PageData = {
  items: WorkshopCertificate[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqWorkshopCertificatesPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("createdAt_desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/workshop-certificates", {
        page,
        pageSize,
        search: debouncedSearch,
        sort,
      });
      const res = await hqFetch<PageData>(url);
      setData(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyLink(item: WorkshopCertificate) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}${item.publicUrl}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setErr("Could not copy link");
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-[#e8eef5]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#7c3aed]/15 blur-[100px]" />
        <div className="absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-[#00d4ff]/10 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-[1480px] space-y-6 px-4 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#64748b]">Workshops</p>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Workshop certificates</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#94a3b8]">
              Create participation certificates and share a unique download link with each student.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/hq"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:bg-white/[0.08]"
            >
              Back to dashboard
            </Link>
            <Link
              href="/hq/workshop-certificates/new"
              className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-white"
            >
              + New certificate
            </Link>
          </div>
        </header>

        {err ? (
          <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
            {err}
          </p>
        ) : null}

        <HqListToolbar
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          sortValue={sort}
          onSortChange={setSort}
          sortOptions={[
            { value: "createdAt_desc", label: "Newest first" },
            { value: "createdAt_asc", label: "Oldest first" },
            { value: "studentName_asc", label: "Student A–Z" },
            { value: "workshopDate_desc", label: "Workshop date" },
          ]}
          dateFrom=""
          dateTo=""
          onDateFromChange={() => {}}
          onDateToChange={() => {}}
          showDateRange={false}
          page={page}
          pageSize={pageSize}
          total={data?.total ?? 0}
          totalPages={data?.totalPages ?? 1}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
        />

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[#94a3b8]">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Workshop</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Venue</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#94a3b8]">
                    Loading…
                  </td>
                </tr>
              ) : !data?.items?.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#94a3b8]">
                    No certificates yet.{" "}
                    <Link href="/hq/workshop-certificates/new" className="text-[#00d4ff] hover:underline">
                      Create one
                    </Link>
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{item.studentName}</td>
                    <td className="px-4 py-3 text-[#cbd5e1]">{item.workshopTitle}</td>
                    <td className="px-4 py-3 text-[#cbd5e1]">{item.workshopDate || "—"}</td>
                    <td className="px-4 py-3 text-[#cbd5e1]">{item.venue || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          item.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-neutral-500/20 text-neutral-300"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => void copyLink(item)}
                          className="text-xs text-[#00d4ff] hover:underline"
                        >
                          {copiedId === item.id ? "Copied!" : "Copy link"}
                        </button>
                        <Link
                          href={`/hq/workshop-certificates/${item.id}/print`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#a78bfa] hover:underline"
                        >
                          Print
                        </Link>
                        <Link
                          href={`/hq/workshop-certificates/${item.id}/edit`}
                          className="text-xs text-[#cbd5e1] hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmPasswordModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete certificate"
        message="This will permanently remove the certificate and its public link."
        onConfirm={async (confirmPassword) => {
          if (!deleteId) return;
          await hqFetch(`/api/hq/workshop-certificates/${deleteId}`, {
            method: "DELETE",
            body: JSON.stringify({ confirmPassword }),
          });
          setDeleteId(null);
          await load();
        }}
      />
    </div>
  );
}
