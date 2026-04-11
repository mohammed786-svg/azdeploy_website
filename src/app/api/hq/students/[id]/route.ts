import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { requireConfirmPassword } from "@/lib/hq-password";
import { backfillMissingStudentSerials } from "@/lib/hq-student-serial";

type Ctx = { params: Promise<{ id: string }> };

type HistoryEntry = { batchId: string; batchName: string; enrolledAt: number; leftAt?: number };

export async function GET(request: NextRequest, ctx: Ctx) {
  const denied = requireHqSession(request);
  if (denied) return denied;
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ error: "Firebase Admin not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  try {
    const db = getAdminDatabase();
    await backfillMissingStudentSerials(db);
    const snap = await db.ref(`hq/students/${id}`).once("value");
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
    const snap = await db.ref(`hq/students/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const cur = snap.val() as Record<string, unknown>;
    const now = Date.now();
    let batchHistory: HistoryEntry[] = Array.isArray(cur.batchHistory)
      ? [...(cur.batchHistory as HistoryEntry[])]
      : [];
    const oldBatchId = String(cur.currentBatchId ?? "");
    let currentBatchId: string | null =
      body.currentBatchId !== undefined ? (body.currentBatchId ? String(body.currentBatchId) : null) : oldBatchId || null;
    let currentBatchName: string | null =
      body.currentBatchId !== undefined
        ? null
        : (cur.currentBatchName as string | null) ?? null;

    if (body.currentBatchId !== undefined) {
      const newBatchId = body.currentBatchId ? String(body.currentBatchId) : "";
      currentBatchId = newBatchId || null;
      if (newBatchId) {
        const bSnap = await db.ref(`hq/batches/${newBatchId}`).once("value");
        currentBatchName = bSnap.exists()
          ? String((bSnap.val() as { name?: string }).name ?? "")
          : "";
        if (newBatchId !== oldBatchId) {
          batchHistory = batchHistory.map((h) =>
            h.batchId === oldBatchId && !h.leftAt ? { ...h, leftAt: now } : h
          );
          batchHistory.push({
            batchId: newBatchId,
            batchName: currentBatchName || "",
            enrolledAt: now,
          });
        }
      } else {
        currentBatchName = null;
        if (oldBatchId) {
          batchHistory = batchHistory.map((h) =>
            h.batchId === oldBatchId && !h.leftAt ? { ...h, leftAt: now } : h
          );
        }
      }
    }

    const next = {
      ...cur,
      fullName: body.fullName != null ? String(body.fullName).trim() : cur.fullName,
      email: body.email != null ? String(body.email).trim() : cur.email,
      phone: body.phone != null ? String(body.phone).trim() : cur.phone,
      degree: body.degree !== undefined ? String(body.degree) : cur.degree,
      college: body.college !== undefined ? String(body.college) : cur.college,
      passoutYear: body.passoutYear !== undefined ? String(body.passoutYear) : cur.passoutYear,
      city: body.city !== undefined ? String(body.city) : cur.city,
      gender: body.gender !== undefined ? String(body.gender ?? "").trim() : cur.gender,
      currentBatchId,
      currentBatchName,
      batchHistory,
      feeStructureId: body.feeStructureId !== undefined ? (body.feeStructureId || null) : cur.feeStructureId,
      status: body.status != null ? String(body.status) : cur.status,
      updatedAt: now,
    };
    await db.ref(`hq/students/${id}`).set(next);
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
    await getAdminDatabase().ref(`hq/students/${id}`).remove();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
