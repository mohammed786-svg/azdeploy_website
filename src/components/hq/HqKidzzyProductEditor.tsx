"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import KidzzyProtectedPreview from "@/components/kidzzy/KidzzyProtectedPreview";
import { formatInr, kidzzyMediaUrl } from "@/lib/kidzzy";

export type HqKidzzyProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  productType: string;
  description: string;
  ageMin: number;
  ageMax: number;
  ageLabel?: string;
  tags: string[];
  pageCount: number;
  pricePaise: number;
  priceInr: number;
  coverImageUrl: string;
  coverAccent: string;
  pdfAssetPath: string;
  thumbnailPath?: string;
  samplePdfPath?: string;
  hasSample?: boolean;
  previewImages?: string[];
  isActive: boolean;
  isPurchasable: boolean;
};

type FormState = {
  title: string;
  subtitle: string;
  description: string;
  productType: string;
  ageMin: string;
  ageMax: string;
  tags: string;
  pageCount: string;
  pricePaise: string;
  coverAccent: string;
  coverImageUrl: string;
  pdfAssetPath: string;
  isActive: boolean;
  isPurchasable: boolean;
};

const EMPTY: FormState = {
  title: "",
  subtitle: "",
  description: "",
  productType: "printable",
  ageMin: "3",
  ageMax: "8",
  tags: "Coloring",
  pageCount: "12",
  pricePaise: "19900",
  coverAccent: "#3B82F6",
  coverImageUrl: "",
  pdfAssetPath: "",
  isActive: true,
  isPurchasable: true,
};

function toForm(p?: HqKidzzyProduct | null): FormState {
  if (!p) return { ...EMPTY };
  return {
    title: p.title || "",
    subtitle: p.subtitle || "",
    description: p.description || "",
    productType: p.productType || "printable",
    ageMin: String(p.ageMin ?? 3),
    ageMax: String(p.ageMax ?? 8),
    tags: (p.tags || []).join(", "),
    pageCount: String(p.pageCount || 12),
    pricePaise: String(p.pricePaise || 19900),
    coverAccent: p.coverAccent || "#3B82F6",
    coverImageUrl: p.coverImageUrl || "",
    pdfAssetPath: p.pdfAssetPath || "",
    isActive: p.isActive !== false,
    isPurchasable: p.isPurchasable !== false,
  };
}

export default function HqKidzzyProductEditor({
  mode,
  productId,
}: {
  mode: "create" | "edit";
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [product, setProduct] = useState<HqKidzzyProduct | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [err, setErr] = useState("");
  const [activePreview, setActivePreview] = useState(0);

  useEffect(() => {
    if (mode !== "edit" || !productId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await hqFetch<{ item: HqKidzzyProduct }>(`/api/hq/kidzzy/products/${productId}`);
        if (cancelled) return;
        setProduct(res.item);
        setForm(toForm(res.item));
        setActivePreview(0);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, productId]);

  const previewUrls = useMemo(() => {
    const fromApi = (product?.previewImages || []).map(kidzzyMediaUrl).filter(Boolean);
    if (fromApi.length) return fromApi;
    const cover = kidzzyMediaUrl(form.coverImageUrl || product?.thumbnailPath);
    return cover ? [cover] : [];
  }, [product, form.coverImageUrl]);

  const hero = previewUrls[activePreview] || kidzzyMediaUrl(form.coverImageUrl);
  const priceInr = Math.floor(Number(form.pricePaise || 0) / 100);

  async function uploadPdf(file: File) {
    setUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await hqFetch<{ path: string }>("/api/hq/kidzzy/upload-pdf", {
        method: "POST",
        body: fd,
      });
      setForm((f) => ({ ...f, pdfAssetPath: res.path }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "PDF upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function uploadCover(file: File) {
    setUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await hqFetch<{ url: string }>("/api/hq/kidzzy/upload-cover", {
        method: "POST",
        body: fd,
      });
      setForm((f) => ({ ...f, coverImageUrl: res.url }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Cover upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.title.trim()) {
      setErr("Title is required");
      return;
    }
    setSaving(true);
    setErr("");
    const body = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      productType: form.productType,
      ageMin: Number(form.ageMin) || 3,
      ageMax: Number(form.ageMax) || 12,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      pageCount: Number(form.pageCount) || 10,
      pricePaise: Number(form.pricePaise) || 19900,
      coverAccent: form.coverAccent,
      coverImageUrl: form.coverImageUrl,
      pdfAssetPath: form.pdfAssetPath,
      isActive: form.isActive,
      isPurchasable: form.isPurchasable,
    };
    try {
      if (mode === "edit" && productId) {
        const res = await hqFetch<{ item: HqKidzzyProduct }>(`/api/hq/kidzzy/products/${productId}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        setProduct(res.item);
        setForm(toForm(res.item));
      } else {
        const res = await hqFetch<{ item: HqKidzzyProduct }>("/api/hq/kidzzy/products", {
          method: "POST",
          body: JSON.stringify(body),
        });
        router.replace(`/hq/kidzzy/${res.item.id}`);
        return;
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function rebuild() {
    if (!productId) return;
    setRebuilding(true);
    setErr("");
    try {
      const res = await hqFetch<{ item: HqKidzzyProduct }>(
        `/api/hq/kidzzy/products/${productId}/regenerate-previews`,
        { method: "POST" },
      );
      setProduct(res.item);
      setForm(toForm(res.item));
      setActivePreview(0);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Preview rebuild failed");
    } finally {
      setRebuilding(false);
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-[#94a3b8]">Loading product…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/hq/kidzzy" className="text-xs text-[#94a3b8] hover:text-[#00d4ff]">
            ← Back to list
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-white">
            {mode === "create" ? "New printable" : "Edit printable"}
          </h1>
          {product?.slug ? <p className="mt-1 text-sm text-[#64748b]">{product.slug}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "edit" && product?.slug ? (
            <a
              href={`/kidzzy/printables/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-white/15 px-3 py-2 text-sm text-[#cbd5e1] hover:bg-white/5"
            >
              View storefront
            </a>
          ) : null}
          {mode === "edit" && form.pdfAssetPath ? (
            <button
              type="button"
              disabled={rebuilding}
              onClick={() => void rebuild()}
              className="rounded border border-amber-400/40 px-3 py-2 text-sm text-amber-200 disabled:opacity-50"
            >
              {rebuilding ? "Building previews…" : "Rebuild previews"}
            </button>
          ) : null}
          <button
            type="button"
            disabled={saving || uploading}
            onClick={() => void save()}
            className="rounded bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </button>
        </div>
      </div>

      {err ? <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</p> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Storefront-style preview */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">Storefront preview</p>
          <p className="mt-1 text-xs text-[#64748b]">
            Same protected sample view customers see — no download / share; screenshots black out when possible.
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl bg-[#fafafa] p-4 text-slate-900">
            <KidzzyProtectedPreview className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
              <div
                className="relative flex aspect-[4/3] items-center justify-center"
                style={{ background: `linear-gradient(145deg, ${form.coverAccent}25, #fff)` }}
              >
                {hero ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={hero}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-contain object-top"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : (
                  <div className="px-6 text-center">
                    <p className="text-4xl">📘</p>
                    <p className="mt-2 text-sm font-bold text-slate-600">Upload PDF & rebuild previews</p>
                  </div>
                )}
                {(product?.hasSample || previewUrls.length > 0) && (
                  <span className="absolute left-3 top-3 rounded bg-rose-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
                    Free sample
                  </span>
                )}
              </div>
            </KidzzyProtectedPreview>

            {previewUrls.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {previewUrls.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActivePreview(i)}
                    className={`h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 ${
                      i === activePreview ? "border-blue-600" : "border-slate-200"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" draggable={false} className="h-full w-full object-cover object-top" />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-4">
              <h2 className="text-xl font-black text-slate-900">{form.title || "Untitled printable"}</h2>
              {form.subtitle ? <p className="mt-1 text-sm text-slate-600">{form.subtitle}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-rose-100 px-2.5 py-1 font-bold text-rose-700">
                  Ages {form.ageMin}–{form.ageMax}
                </span>
                <span className="text-slate-500">{form.pageCount} pages</span>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900">{formatInr(priceInr)}</p>
            </div>
          </div>

          {product ? (
            <div className="mt-4 grid gap-2 text-xs text-[#94a3b8] sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="font-semibold text-[#cbd5e1]">Thumbnail</p>
                <p className="mt-1 break-all">{product.thumbnailPath || "—"}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="font-semibold text-[#cbd5e1]">Preview pages</p>
                <p className="mt-1">{product.previewImages?.length || 0} image(s)</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="font-semibold text-[#cbd5e1]">Sample PDF (HQ only)</p>
                <p className="mt-1 break-all">{product.samplePdfPath || "—"}</p>
                <p className="mt-1 text-[10px] text-amber-200/80">Not downloadable on the public site</p>
              </div>
            </div>
          ) : null}
        </section>

        {/* Form */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">Product details</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="text-[#94a3b8]">Title *</span>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-[#94a3b8]">Subtitle</span>
              <input
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-[#94a3b8]">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#94a3b8]">Age min</span>
              <input
                value={form.ageMin}
                onChange={(e) => setForm((f) => ({ ...f, ageMin: e.target.value }))}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#94a3b8]">Age max</span>
              <input
                value={form.ageMax}
                onChange={(e) => setForm((f) => ({ ...f, ageMax: e.target.value }))}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#94a3b8]">Page count</span>
              <input
                value={form.pageCount}
                onChange={(e) => {
                  const pageCount = e.target.value;
                  const n = Number(pageCount) || 0;
                  setForm((f) => ({
                    ...f,
                    pageCount,
                    pricePaise: n >= 20 ? "29900" : "19900",
                  }));
                }}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#94a3b8]">Price</span>
              <select
                value={form.pricePaise}
                onChange={(e) => setForm((f) => ({ ...f, pricePaise: e.target.value }))}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
              >
                <option value="19900">₹199</option>
                <option value="29900">₹299</option>
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-[#94a3b8]">Tags (comma separated)</span>
              <input
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
                placeholder="Coloring, Alphabet"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#94a3b8]">Cover accent</span>
              <input
                type="color"
                value={form.coverAccent}
                onChange={(e) => setForm((f) => ({ ...f, coverAccent: e.target.value }))}
                className="mt-1 h-10 w-full rounded border border-white/15 bg-black/30"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[#94a3b8]">Type</span>
              <select
                value={form.productType}
                onChange={(e) => setForm((f) => ({ ...f, productType: e.target.value }))}
                className="mt-1 w-full rounded border border-white/15 bg-black/30 px-3 py-2 text-white"
              >
                <option value="printable">Printable</option>
                <option value="storybook">Storybook</option>
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-[#94a3b8]">Upload PDF *</span>
              <input
                type="file"
                accept="application/pdf"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadPdf(file);
                }}
                className="mt-1 w-full text-sm text-[#cbd5e1]"
              />
              {form.pdfAssetPath ? (
                <p className="mt-1 break-all text-xs text-emerald-300">{form.pdfAssetPath}</p>
              ) : null}
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-[#94a3b8]">Cover image override (optional)</span>
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadCover(file);
                }}
                className="mt-1 w-full text-sm text-[#cbd5e1]"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-[#cbd5e1]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Active on store
            </label>
            <label className="flex items-center gap-2 text-sm text-[#cbd5e1]">
              <input
                type="checkbox"
                checked={form.isPurchasable}
                onChange={(e) => setForm((f) => ({ ...f, isPurchasable: e.target.checked }))}
              />
              Purchasable
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
