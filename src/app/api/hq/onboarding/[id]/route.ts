import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { requireConfirmPassword } from "@/lib/hq-password";
import { allocateNextStudentSerial, backfillMissingStudentSerials } from "@/lib/hq-student-serial";

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
    const action = body.action as string | undefined;
    const db = getAdminDatabase();
    const snap = await db.ref(`hq/onboarding/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const cur = snap.val() as Record<string, unknown>;
    const now = Date.now();

    if (action === "approve") {
      const fullName = String(cur.fullName ?? "");
      const email = String(cur.email ?? "");
      const phone = String(cur.phone ?? "");
      const batchId = String(cur.batchId ?? "");
      const feeStructureId = cur.feeStructureId ? String(cur.feeStructureId) : null;
      let batchName = "";
      const bSnap = await db.ref(`hq/batches/${batchId}`).once("value");
      if (bSnap.exists()) {
        batchName = String((bSnap.val() as { name?: string }).name ?? "");
      }
      await backfillMissingStudentSerials(db);
      const serial = await allocateNextStudentSerial(db);
      const stRef = db.ref("hq/students").push();
      const studentId = stRef.key!;
      const studentPayload = {
        id: studentId,
        serial,
        fullName,
        email,
        phone,
        gender: cur.gender ? String(cur.gender) : "",
        degree: cur.degree ? String(cur.degree) : "",
        college: cur.college ? String(cur.college) : "",
        passoutYear: "",
        city: "",
        currentBatchId: batchId,
        currentBatchName: batchName,
        batchHistory: [{ batchId, batchName, enrolledAt: now }],
        feeStructureId,
        enquiryId: null,
        status: "active",
        createdAt: now,
        updatedAt: now,
      };
      await stRef.set(studentPayload);
      const nextOn = {
        ...cur,
        status: "approved",
        studentId,
        updatedAt: now,
      };
      await db.ref(`hq/onboarding/${id}`).set(nextOn);
      return NextResponse.json({ ok: true, student: studentPayload, onboarding: nextOn });
    }

    if (action === "reject") {
      const nextOn = {
        ...cur,
        status: "rejected",
        updatedAt: now,
      };
      await db.ref(`hq/onboarding/${id}`).set(nextOn);
      return NextResponse.json({ ok: true, onboarding: nextOn });
    }

    const next = {
      ...cur,
      fullName: body.fullName != null ? String(body.fullName).trim() : cur.fullName,
      email: body.email != null ? String(body.email).trim() : cur.email,
      phone: body.phone != null ? String(body.phone).trim() : cur.phone,
      batchId: body.batchId != null ? String(body.batchId) : cur.batchId,
      feeStructureId: body.feeStructureId !== undefined ? (body.feeStructureId || null) : cur.feeStructureId,
      gender: body.gender !== undefined ? String(body.gender ?? "").trim() : cur.gender,
      notes: body.notes !== undefined ? String(body.notes) : cur.notes,
      updatedAt: now,
    };
    await db.ref(`hq/onboarding/${id}`).set(next);
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
    await getAdminDatabase().ref(`hq/onboarding/${id}`).remove();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
