import "server-only";

import type { BlogPostRow } from "@/lib/hq-blog-types";

async function fetchDjangoPublishedPosts(): Promise<BlogPostRow[] | null> {
  const base = process.env.NEXT_PUBLIC_DJANGO_API_ORIGIN?.trim();
  if (!base) return null;
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/v1/public/blog`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: BlogPostRow[]; data?: { items?: BlogPostRow[] } };
    return data.items ?? data.data?.items ?? [];
  } catch {
    return [];
  }
}

/** Published posts only, newest first. For `/blog` and sitemap. */
export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  const django = await fetchDjangoPublishedPosts();
  return django ?? [];
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const base = process.env.NEXT_PUBLIC_DJANGO_API_ORIGIN?.trim();
  if (base) {
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}/api/v1/public/blog/${encodeURIComponent(slug)}`, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { item?: BlogPostRow; data?: { item?: BlogPostRow } };
        return data.item ?? data.data?.item ?? null;
      }
    } catch {
      /* fallback below */
    }
  }
  const posts = await getPublishedBlogPosts();
  const norm = slug.toLowerCase();
  return posts.find((p) => String(p.slug || "").toLowerCase() === norm) ?? null;
}

export async function getAllSlugsForBuild(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => p.slug);
}
