import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";
import type { BlogPostRecord, BlogPostRow } from "@/lib/hq-blog-types";
import { estimateReadingTimeMin, omitUndefined, slugifyTitle, slugTaken } from "@/lib/hq-blog-utils";

type Row = BlogPostRow;

function rowText(r: Row): string {
  return [r.title, r.slug, r.excerpt, r.keywords, r.authorName].filter(Boolean).join(" ").toLowerCase();
}

function filterRows(items: Row[], q: ListQuery): Row[] {
  let out = items;
  if (q.search) out = out.filter((r) => rowText(r).includes(q.search));
  if (q.dateFromMs != null || q.dateToMs != null) {
    out = out.filter((r) => {
      const t = Number(r.updatedAt) || Number(r.createdAt) || 0;
      if (!t) return false;
      if (q.dateFromMs != null && t < q.dateFromMs) return false;
      if (q.dateToMs != null && t > q.dateToMs) return false;
      return true;
    });
  }
  return out;
}

function sortRows(items: Row[], q: ListQuery): Row[] {
  const dir = q.sortDir === "asc" ? 1 : -1;
  const copy = [...items];
  copy.sort((a, b) => {
    if (q.sortField === "title") return dir * String(a.title ?? "").localeCompare(String(b.title ?? ""));
    if (q.sortField === "publishedAt") {
      const ta = Number(a.publishedAt) || Number(a.updatedAt) || 0;
      const tb = Number(b.publishedAt) || Number(b.updatedAt) || 0;
      return dir * (ta - tb);
    }
    const ta = Number(a.updatedAt) || Number(a.createdAt) || 0;
    const tb = Number(b.updatedAt) || Number(b.createdAt) || 0;
    return dir * (ta - tb);
  });
  return copy;
}

export async function GET(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ items: [], total: 0, page: 1, pageSize: 20, totalPages: 1 });
  }
  try {
    const q = parseListQuery(request.nextUrl.searchParams, "publishedAt_desc");
    const db = getAdminDatabase();
    const snap = await db.ref("hq/blogPosts").once("value");
    const val = snap.val() as Record<string, Record<string, unknown>> | null;
    let items: Row[] = val ? Object.keys(val).map((id) => ({ id, ...(val[id] as object) } as Row)) : [];
    items = filterRows(items, q);
    items = sortRows(items, q);
    return NextResponse.json(paginateSlice(items, q));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const excerpt = String(body.excerpt ?? "").trim();
    const md = String(body.body ?? "").trim();
    if (!title || !excerpt || !md) {
      return NextResponse.json({ error: "title, excerpt, and body are required" }, { status: 400 });
    }
    let slug = String(body.slug ?? "").trim().toLowerCase();
    if (!slug) slug = slugifyTitle(title);
    else slug = slugifyTitle(slug);

    const db = getAdminDatabase();
    const allSnap = await db.ref("hq/blogPosts").once("value");
    const allVal = allSnap.val() as Record<string, Record<string, unknown>> | null;
    const allRows: BlogPostRow[] = allVal
      ? Object.keys(allVal).map((id) => ({ id, ...(allVal[id] as object) } as BlogPostRow))
      : [];
    if (slugTaken(slug, allRows)) {
      return NextResponse.json({ error: `Slug "${slug}" is already in use` }, { status: 409 });
    }

    const published = Boolean(body.published);
    const now = Date.now();
    let publishedAt: number | undefined = published ? now : undefined;
    if (published && body.publishedAt) {
      const d = new Date(String(body.publishedAt));
      if (!Number.isNaN(d.getTime())) publishedAt = d.getTime();
    }

    const ref = db.ref("hq/blogPosts").push();
    const id = ref.key!;
    const record: BlogPostRecord = {
      title,
      slug,
      excerpt,
      body: md,
      coverImageUrl: body.coverImageUrl ? String(body.coverImageUrl).trim() : "",
      published,
      publishedAt,
      createdAt: now,
      updatedAt: now,
      authorName: body.authorName ? String(body.authorName).trim() : "AZ Deploy Academy",
      seoTitle: body.seoTitle ? String(body.seoTitle).trim() : "",
      seoDescription: body.seoDescription ? String(body.seoDescription).trim() : "",
      keywords: body.keywords ? String(body.keywords).trim() : "",
      readingTimeMin: estimateReadingTimeMin(md),
    };
    await ref.set(omitUndefined({ ...record }));
    return NextResponse.json({ item: { id, ...record } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
