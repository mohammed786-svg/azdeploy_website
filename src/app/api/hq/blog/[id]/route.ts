import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import type { BlogPostRecord, BlogPostRow } from "@/lib/hq-blog-types";
import { estimateReadingTimeMin, omitUndefined, slugifyTitle, slugTaken } from "@/lib/hq-blog-utils";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  try {
    const snap = await getAdminDatabase().ref(`hq/blogPosts/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ item: { id, ...(snap.val() as object) } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  try {
    const body = await request.json();
    const db = getAdminDatabase();
    const snap = await db.ref(`hq/blogPosts/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const cur = snap.val() as BlogPostRecord;
    const allSnap = await db.ref("hq/blogPosts").once("value");
    const allVal = allSnap.val() as Record<string, Record<string, unknown>> | null;
    const list: BlogPostRow[] = allVal
      ? Object.keys(allVal).map((k) => ({ id: k, ...(allVal[k] as object) } as BlogPostRow))
      : [];

    let slug = cur.slug;
    if (body.slug !== undefined) {
      slug = slugifyTitle(String(body.slug).trim() || cur.title);
    }
    if (slugTaken(slug, list, id)) {
      return NextResponse.json({ error: `Slug "${slug}" is already in use` }, { status: 409 });
    }

    const title = body.title != null ? String(body.title).trim() : cur.title;
    const excerpt = body.excerpt != null ? String(body.excerpt).trim() : cur.excerpt;
    const md = body.body != null ? String(body.body) : cur.body;
    const published = body.published !== undefined ? Boolean(body.published) : cur.published;
    const now = Date.now();
    let publishedAt = cur.publishedAt;
    if (published && !publishedAt) publishedAt = now;
    if (!published) publishedAt = undefined;
    if (body.publishedAt !== undefined && published) {
      const d = new Date(String(body.publishedAt));
      if (!Number.isNaN(d.getTime())) publishedAt = d.getTime();
    }

    const next: BlogPostRecord = {
      ...cur,
      title,
      slug,
      excerpt,
      body: md,
      coverImageUrl: body.coverImageUrl !== undefined ? String(body.coverImageUrl ?? "").trim() : cur.coverImageUrl,
      published,
      publishedAt,
      updatedAt: now,
      authorName: body.authorName !== undefined ? String(body.authorName ?? "").trim() : cur.authorName,
      seoTitle: body.seoTitle !== undefined ? String(body.seoTitle ?? "").trim() : cur.seoTitle,
      seoDescription: body.seoDescription !== undefined ? String(body.seoDescription ?? "").trim() : cur.seoDescription,
      keywords: body.keywords !== undefined ? String(body.keywords ?? "").trim() : cur.keywords,
      readingTimeMin: estimateReadingTimeMin(md),
    };
    await db.ref(`hq/blogPosts/${id}`).set(omitUndefined({ ...next }));
    return NextResponse.json({ item: { id, ...next } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  try {
    const db = getAdminDatabase();
    const snap = await db.ref(`hq/blogPosts/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await db.ref(`hq/blogPosts/${id}`).remove();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
