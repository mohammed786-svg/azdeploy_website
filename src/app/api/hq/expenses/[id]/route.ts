import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { requireConfirmPassword } from "@/lib/hq-password";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  try {
    const snap = await getAdminDatabase().ref(`hq/expenses/${id}`).once("value");
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
    const pwdErr = requireConfirmPassword(body);
    if (pwdErr) return pwdErr;
    const db = getAdminDatabase();
    const snap = await db.ref(`hq/expenses/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const cur = snap.val() as Record<string, unknown>;
    const now = Date.now();
    let spentAt = cur.spentAt;
    if (body.spentAt !== undefined) {
      const d = new Date(String(body.spentAt));
      if (!Number.isNaN(d.getTime())) spentAt = d.getTime();
    }
    const next = {
      ...cur,
      title: body.title != null ? String(body.title).trim() : cur.title,
      amount: body.amount != null ? Number(body.amount) : cur.amount,
      currency: body.currency != null ? String(body.currency).toUpperCase() : cur.currency,
      category: body.category !== undefined ? String(body.category ?? "").trim() : cur.category,
      vendor: body.vendor !== undefined ? String(body.vendor ?? "").trim() : cur.vendor,
      notes: body.notes !== undefined ? String(body.notes ?? "") : cur.notes,
      spentAt,
      updatedAt: now,
    };
    await db.ref(`hq/expenses/${id}`).set(next);
    return NextResponse.json({ item: next });
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
    let body: unknown = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const pwdErr = requireConfirmPassword(body);
    if (pwdErr) return pwdErr;
    await getAdminDatabase().ref(`hq/expenses/${id}`).remove();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
