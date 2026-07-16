import "server-only";

import type { BlogPostRow } from "@/lib/hq-blog-types";
import { DEFAULT_SEO_BLOG_POSTS, getDefaultSeoBlogBySlug } from "@/data/default-seo-blogs";
import { resolveApiOriginForServer } from "@/lib/api-http";

const DJANGO_FETCH_MS = 2500;

function mergeWithDefaults(fromApi: BlogPostRow[]): BlogPostRow[] {
  const bySlug = new Map<string, BlogPostRow>();
  for (const p of DEFAULT_SEO_BLOG_POSTS) {
    bySlug.set(p.slug.toLowerCase(), p);
  }
  for (const p of fromApi) {
    const slug = String(p.slug || "").toLowerCase();
    if (!slug) continue;
    bySlug.set(slug, { ...p, published: true });
  }
  return Array.from(bySlug.values()).sort((a, b) => {
    const ta = Number(a.publishedAt || a.updatedAt || 0);
    const tb = Number(b.publishedAt || b.updatedAt || 0);
    return tb - ta;
  });
}

function apiBase(): string {
  try {
    return resolveApiOriginForServer()?.trim() || process.env.NEXT_PUBLIC_DJANGO_API_ORIGIN?.trim() || "";
  } catch {
    return process.env.NEXT_PUBLIC_DJANGO_API_ORIGIN?.trim() || "";
  }
}

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), DJANGO_FETCH_MS);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      // Short CDN/ISR cache — avoids 10s hangs on every request when Django is slow/down
      next: { revalidate: 120 },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDjangoPublishedPosts(): Promise<BlogPostRow[]> {
  const base = apiBase();
  if (!base) return [];
  const res = await fetchWithTimeout(`${base.replace(/\/$/, "")}/api/v1/public/blog`);
  if (!res?.ok) return [];
  try {
    const data = (await res.json()) as { items?: BlogPostRow[]; data?: { items?: BlogPostRow[] } };
    return data.items ?? data.data?.items ?? [];
  } catch {
    return [];
  }
}

/** Published posts (HQ/Django + default SEO seeds). Newest first. */
export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  const django = await fetchDjangoPublishedPosts();
  return mergeWithDefaults(django);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const base = apiBase();
  if (base) {
    const res = await fetchWithTimeout(
      `${base.replace(/\/$/, "")}/api/v1/public/blog/${encodeURIComponent(slug)}`
    );
    if (res?.ok) {
      try {
        const data = (await res.json()) as { item?: BlogPostRow; data?: { item?: BlogPostRow } };
        const item = data.item ?? data.data?.item ?? null;
        if (item) return item;
      } catch {
        /* fallback */
      }
    }
  }
  const fromDefault = getDefaultSeoBlogBySlug(slug);
  if (fromDefault) return fromDefault;
  const posts = await getPublishedBlogPosts();
  const norm = slug.toLowerCase();
  return posts.find((p) => String(p.slug || "").toLowerCase() === norm) ?? null;
}

export async function getAllSlugsForBuild(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => p.slug);
}
