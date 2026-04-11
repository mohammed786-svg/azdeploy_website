import type { BlogPostRow } from "./hq-blog-types";

/**
 * Firebase Realtime Database rejects objects with `undefined` values. Strip those keys before `.set()`.
 */
export function omitUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    const v = obj[key];
    if (v !== undefined) out[key as string] = v;
  }
  return out as T;
}

export function slugifyTitle(title: string): string {
  const s = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  return s || "post";
}

export function estimateReadingTimeMin(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Returns true if slug is taken by another post. */
export function slugTaken(slug: string, posts: BlogPostRow[], exceptId?: string): boolean {
  const norm = slug.toLowerCase();
  return posts.some((p) => p.slug.toLowerCase() === norm && p.id !== exceptId);
}
