"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";
import HqListToolbar from "@/components/hq/HqListToolbar";
import ConfirmPasswordModal from "@/components/hq/ConfirmPasswordModal";
import { kidzzyMediaUrl } from "@/lib/kidzzy";

type Product = {
  id: string;
  slug: string;
  title: string;
  pageCount: number;
  priceInr: number;
  coverImageUrl: string;
  pdfAssetPath: string;
  thumbnailPath?: string;
  samplePdfPath?: string;
  hasSample?: boolean;
  previewImages?: string[];
  isActive: boolean;
};

type PageData = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function HqKidzzyPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("sortOrder_asc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const url = hqListUrl("/api/hq/kidzzy/products", {
        page,
        pageSize,
        search: debouncedSearch,
        sort,
      });
      setData(await hqFetch<PageData>(url));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  async function regeneratePreviews(id: string) {
    setPreviewingId(id);
    setErr("");
    try {
      await hqFetch(`/api/hq/kidzzy/products/${id}/regenerate-previews`, { method: "POST" });
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Preview generation failed");
    } finally {
      setPreviewingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Kidzzy printables</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Open a product to edit details and review thumbnail / page previews like the storefront.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/hq/kidzzy/customers"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-[#cbd5e1] hover:bg-white/5"
          >
            Customers & orders
          </Link>
          <Link
            href="/hq/kidzzy/new"
            className="rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] px-4 py-2 text-sm font-semibold text-white"
          >
            + New printable
          </Link>
        </div>
      </div>

      {err ? <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</p> : null}

      <HqListToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={[
          { value: "sortOrder_asc", label: "Sort order" },
          { value: "createdAt_desc", label: "Newest" },
          { value: "title_asc", label: "Title A–Z" },
          { value: "pricePaise_asc", label: "Price" },
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
              <th className="px-4 py-3 font-medium">Preview</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Pages</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Assets</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#94a3b8]">
                  Loading…
                </td>
              </tr>
            ) : !data?.items?.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#94a3b8]">
                  No Kidzzy products yet.{" "}
                  <Link href="/hq/kidzzy/new" className="text-[#00d4ff] hover:underline">
                    Create one
                  </Link>
                </td>
              </tr>
            ) : (
              data.items.map((p) => {
                const thumb = kidzzyMediaUrl(p.coverImageUrl || p.thumbnailPath);
                return (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/hq/kidzzy/${p.id}`} className="block h-14 w-10 overflow-hidden rounded bg-black/40">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt="" className="h-full w-full object-cover object-top" />
                        ) : (
                          <span className="flex h-full items-center justify-center text-[10px] text-[#64748b]">—</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/hq/kidzzy/${p.id}`} className="font-medium text-white hover:text-[#00d4ff]">
                        {p.title}
                      </Link>
                      <p className="text-xs text-[#64748b]">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[#cbd5e1]">{p.pageCount}</td>
                    <td className="px-4 py-3 text-[#cbd5e1]">₹{p.priceInr}</td>
                    <td className="px-4 py-3 text-xs text-[#94a3b8]">
                      <div>PDF: {p.pdfAssetPath ? "✓" : "—"}</div>
                      <div>Previews: {p.thumbnailPath || p.previewImages?.length ? "✓" : "—"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          p.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-neutral-500/20 text-neutral-300"
                        }`}
                      >
                        {p.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/hq/kidzzy/${p.id}`} className="text-xs text-[#00d4ff] hover:underline">
                          Open
                        </Link>
                        <button
                          type="button"
                          disabled={!p.pdfAssetPath || previewingId === p.id}
                          onClick={() => void regeneratePreviews(p.id)}
                          className="text-xs text-amber-300 hover:underline disabled:opacity-40"
                        >
                          {previewingId === p.id ? "Building…" : "Rebuild"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(p.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmPasswordModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete product"
        message="This removes the product from the Kidzzy catalog."
        onConfirm={async (confirmPassword) => {
          if (!deleteId) return;
          await hqFetch(`/api/hq/kidzzy/products/${deleteId}`, {
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
