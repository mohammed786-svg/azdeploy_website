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
    const snap = await getAdminDatabase().ref(`hq/feeStructures/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const val = snap.val() as Record<string, unknown>;
    return NextResponse.json({ item: { id, ...val } });
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
    const snap = await db.ref(`hq/feeStructures/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const cur = snap.val() as Record<string, unknown>;
    let installments = cur.installments;
    if (Array.isArray(body.installments)) {
      installments = body.installments.map(
        (x: { id?: string; label?: string; amount?: number; dueOffsetDays?: number }, i: number) => ({
          id: typeof x.id === "string" && x.id ? x.id : `inst_${i + 1}`,
          label: String(x.label ?? `Installment ${i + 1}`),
          amount: Number(x.amount) || 0,
          dueOffsetDays: x.dueOffsetDays != null ? Number(x.dueOffsetDays) : 30 * i,
        })
      );
    }
    const next = {
      ...cur,
      name: body.name != null ? String(body.name).trim() : cur.name,
      code: body.code != null ? String(body.code).trim().toUpperCase() : cur.code,
      description: body.description !== undefined ? String(body.description) : cur.description,
      totalAmount: body.totalAmount != null ? Number(body.totalAmount) : cur.totalAmount,
      currency: body.currency != null ? String(body.currency).toUpperCase() : cur.currency,
      installments,
      updatedAt: Date.now(),
    };
    await db.ref(`hq/feeStructures/${id}`).set(next);
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
    await getAdminDatabase().ref(`hq/feeStructures/${id}`).remove();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
