import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { requireConfirmPassword } from "@/lib/hq-password";

type Ctx = { params: Promise<{ id: string }> };

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
    const snap = await db.ref(`hq/batches/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const cur = snap.val() as Record<string, unknown>;
    const next = {
      ...cur,
      name: body.name != null ? String(body.name).trim() : cur.name,
      code: body.code != null ? String(body.code).trim().toUpperCase() : cur.code,
      startDate: body.startDate !== undefined ? String(body.startDate) : cur.startDate,
      endDate: body.endDate !== undefined ? String(body.endDate) : cur.endDate,
      capacity: body.capacity !== undefined ? (body.capacity === null ? null : Number(body.capacity)) : cur.capacity,
      notes: body.notes !== undefined ? String(body.notes) : cur.notes,
      updatedAt: Date.now(),
    };
    await db.ref(`hq/batches/${id}`).set(next);
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
    await getAdminDatabase().ref(`hq/batches/${id}`).remove();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
