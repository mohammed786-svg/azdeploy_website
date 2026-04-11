import "server-only";

import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { BlogPostRow } from "@/lib/hq-blog-types";

function rowsFromSnap(val: Record<string, Record<string, unknown>> | null): BlogPostRow[] {
  if (!val) return [];
  return Object.keys(val).map((id) => ({ id, ...(val[id] as object) } as BlogPostRow));
}

/** Published posts only, newest first. For `/blog` and sitemap. */
export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  if (!isFirebaseAdminConfigured()) return [];
  const snap = await getAdminDatabase().ref("hq/blogPosts").once("value");
  const all = rowsFromSnap(snap.val() as Record<string, Record<string, unknown>> | null);
  const pub = all.filter((p) => p.published && (p.publishedAt || p.updatedAt));
  pub.sort((a, b) => (Number(b.publishedAt) || Number(b.updatedAt)) - (Number(a.publishedAt) || Number(a.updatedAt)));
  return pub;
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostRow | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const norm = slug.toLowerCase();
  const posts = await getPublishedBlogPosts();
  return posts.find((p) => p.slug.toLowerCase() === norm) ?? null;
}

export async function getAllSlugsForBuild(): Promise<string[]> {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => p.slug);
}
