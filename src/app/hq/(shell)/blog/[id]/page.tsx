"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import type { BlogPostRecord } from "@/lib/hq-blog-types";

type Item = { id: string } & BlogPostRecord;

export default function HqBlogEditPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  async function onCoverImageUpload(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Please upload an image file.");
      return;
    }
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErr("Image size must be under 5MB.");
      return;
    }
    setUploadingCover(true);
    setErr("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await hqFetch<{ url: string }>(
        "/api/hq/uploads/blog-image",
        { method: "POST", body: form },
        { successMessage: "Cover image uploaded." }
      );
      if (!res?.url) throw new Error("Upload failed");
      setCoverImageUrl(res.url);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Cover image upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await hqFetch<{ item: Item }>(`/api/hq/blog/${id}`);
      const p = res.item;
      setTitle(p.title ?? "");
      setSlug(p.slug ?? "");
      setExcerpt(p.excerpt ?? "");
      setBody(p.body ?? "");
      setCoverImageUrl(p.coverImageUrl ?? "");
      setPublished(Boolean(p.published));
      setAuthorName(p.authorName ?? "AZ Deploy Academy");
      setSeoTitle(p.seoTitle ?? "");
      setSeoDescription(p.seoDescription ?? "");
      setKeywords(p.keywords ?? "");
      if (p.publishedAt) {
        const d = new Date(p.publishedAt);
        const pad = (n: number) => String(n).padStart(2, "0");
        setPublishedAt(
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
        );
      } else {
        setPublishedAt("");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !body.trim()) {
      setErr("Title, excerpt, and body are required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      await hqFetch(`/api/hq/blog/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          body: body.trim(),
          coverImageUrl: coverImageUrl.trim(),
          published,
          publishedAt: published && publishedAt ? publishedAt : undefined,
          authorName: authorName.trim(),
          seoTitle: seoTitle.trim(),
          seoDescription: seoDescription.trim(),
          keywords: keywords.trim(),
        }),
      });
      router.refresh();
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading && !title) {
    return (
      <div className="max-w-4xl">
        <p className="text-[#64748b] font-mono text-sm">Loading…</p>
      </div>
    );
  }

  const publicUrl = slug ? `/blog/${encodeURIComponent(slug)}` : "";

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Content</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">Edit post</h1>
        {publicUrl && published && (
          <p className="mt-2 text-sm text-[#94a3b8]">
            Public:{" "}
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[#7dd3fc] hover:underline"
            >
              {publicUrl}
            </a>
          </p>
        )}
        <Link href="/hq/blog" className="inline-block mt-4 text-xs font-mono text-[#7dd3fc] hover:underline">
          ← Back to list
        </Link>
      </header>

      {err && (
        <p className="text-sm text-amber-400/90 font-mono" role="alert">
          {err}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-white/[0.06] bg-[#07070c]/60 p-5 sm:p-8">
        <div className="grid gap-6">
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Title *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">URL slug *</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm font-mono"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Excerpt *</span>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Body (Markdown) *</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={18}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm font-mono resize-y min-h-[280px]"
              required
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Cover image URL</span>
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void onCoverImageUpload(e.target.files?.[0] ?? null)}
                className="block text-xs text-[#94a3b8] file:mr-3 file:rounded-lg file:border file:border-white/15 file:bg-white/5 file:px-3 file:py-1.5 file:text-[11px] file:font-mono file:text-[#cbd5e1] hover:file:bg-white/10"
              />
              {uploadingCover ? <span className="text-xs text-[#94a3b8] font-mono">Uploading…</span> : null}
            </div>
            {coverImageUrl ? (
              <img src={coverImageUrl} alt="Cover preview" className="mt-3 h-28 w-full rounded-xl border border-white/10 object-cover" />
            ) : null}
          </label>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-white/20"
              />
              <span className="text-sm text-[#e8eef5]">Published</span>
            </label>
            {published && (
              <label className="block">
                <span className="text-[10px] font-mono uppercase text-[#64748b]">Publish date</span>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="mt-1 rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-sm"
                />
              </label>
            )}
          </div>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Author display name</span>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
            />
          </label>
          <div className="border-t border-white/[0.06] pt-6 space-y-4">
            <p className="text-[10px] font-mono uppercase text-[#64748b] tracking-wider">SEO</p>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">SEO title</span>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">SEO description</span>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm resize-y"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">Keywords (comma-separated)</span>
              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/hq/blog"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-xs text-[#94a3b8] hover:bg-white/5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-white/10 border border-white/20 px-8 py-2.5 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
