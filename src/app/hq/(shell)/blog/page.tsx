"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import HqModal from "@/components/hq/HqModal";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  publishedAt?: number;
  updatedAt?: number;
  createdAt?: number;
};

type PageData = {
  items: BlogRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqBlogListPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("publishedAt_desc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/blog", {
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
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sort, dateFrom, dateTo]);

  useEffect(() => {
    void load();
  }, [load]);

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setErr("");
    try {
      await hqFetch(`/api/hq/blog/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  const items = data?.items ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Content</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Blog posts</h1>
          <p className="mt-2 text-sm text-[#94a3b8] max-w-2xl">
            Create and publish articles. Public site reads from <span className="font-mono text-[#a78bfa]/90">hq/blogPosts</span>{" "}
            in Realtime Database.
          </p>
        </div>
        <Link
          href="/hq/blog/new"
          className="shrink-0 rounded-xl bg-white/10 border border-white/20 px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15 text-center"
        >
          New post
        </Link>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

      <HqListToolbar
        search={search}
        onSearchChange={setSearch}
        sortValue={sort}
        onSortChange={(v) => {
          setSort(v);
          setPage(1);
        }}
        sortOptions={[
          { value: "publishedAt_desc", label: "Newest publish / update" },
          { value: "publishedAt_asc", label: "Oldest first" },
          { value: "title_asc", label: "Title A→Z" },
          { value: "title_desc", label: "Title Z→A" },
          { value: "updatedAt_desc", label: "Recently updated" },
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

      {loading ? (
        <p className="text-[#64748b] font-mono text-sm">Loading…</p>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase text-[#64748b]">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#64748b] font-mono text-sm">
                    No posts yet.{" "}
                    <Link href="/hq/blog/new" className="text-[#7dd3fc] hover:underline">
                      Create one
                    </Link>
                  </td>
                </tr>
              ) : (
                items.map((x) => (
                  <tr key={x.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white max-w-[200px] truncate" title={x.title}>
                      {x.title}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#94a3b8] max-w-[140px] truncate">{x.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          x.published ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-[#64748b]"
                        }`}
                      >
                        {x.published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#64748b] text-xs font-mono">
                      {x.published && x.publishedAt
                        ? new Date(x.publishedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#64748b] text-xs font-mono">
                      {x.updatedAt
                        ? new Date(x.updatedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/hq/blog/${x.id}`} className="text-[11px] font-mono text-[#7dd3fc] hover:underline">
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(x.id)}
                          className="text-[11px] font-mono text-red-400/80 hover:underline"
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
      )}

      <HqModal open={deleteId != null} onClose={() => setDeleteId(null)} title="Delete post" size="md">
        <p className="text-sm text-[#94a3b8]">This removes the post from the database. This cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={() => setDeleteId(null)}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs text-[#94a3b8] hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => void confirmDelete()}
            className="rounded-xl bg-red-500/20 border border-red-500/40 px-4 py-2 text-xs font-mono text-red-300 hover:bg-red-500/30 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </HqModal>
    </div>
  );
}
