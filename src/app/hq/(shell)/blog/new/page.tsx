"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { hqFetch } from "@/lib/hq-client";

export default function HqBlogNewPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [authorName, setAuthorName] = useState("AZ Deploy Academy");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !body.trim()) {
      setErr("Title, excerpt, and body are required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const res = await hqFetch<{ item: { id: string } }>("/api/hq/blog", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          excerpt: excerpt.trim(),
          body: body.trim(),
          coverImageUrl: coverImageUrl.trim() || undefined,
          published,
          publishedAt: published && publishedAt ? publishedAt : undefined,
          authorName: authorName.trim() || undefined,
          seoTitle: seoTitle.trim() || undefined,
          seoDescription: seoDescription.trim() || undefined,
          keywords: keywords.trim() || undefined,
        }),
      });
      router.push(`/hq/blog/${res.item.id}`);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <p className="text-[10px] font-mono text-[#64748b] tracking-[0.35em] uppercase">Content</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white">New blog post</h1>
        <p className="mt-2 text-sm text-[#94a3b8]">
          Markdown supported for the body. Set SEO fields to control how the article appears in search and social previews.
        </p>
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
            <span className="text-[10px] font-mono uppercase text-[#64748b]">URL slug</span>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto from title if empty"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm font-mono"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase text-[#64748b]">Excerpt * (shown on /blog and in meta)</span>
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
              placeholder="https://…"
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
            />
          </label>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-white/20"
              />
              <span className="text-sm text-[#e8eef5]">Published (visible on public blog)</span>
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
              <span className="text-[10px] font-mono uppercase text-[#64748b]">SEO title (optional)</span>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/50 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase text-[#64748b]">SEO description (optional)</span>
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
                placeholder="Python, Django, career"
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
            {saving ? "Saving…" : "Create post"}
          </button>
        </div>
      </form>
    </div>
  );
}
