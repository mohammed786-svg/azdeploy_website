import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { createReceiptRecord } from "@/lib/hq-receipt-create";
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
    const snap = await getAdminDatabase().ref(`hq/invoices/${id}`).once("value");
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
    const action = body.action as string | undefined;
    const db = getAdminDatabase();
    const snap = await db.ref(`hq/invoices/${id}`).once("value");
    if (!snap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const cur = snap.val() as Record<string, unknown>;
    const now = Date.now();

    if (action === "markPaid") {
      const instId = String(body.installmentId ?? "");
      const paymentMethod = String(body.paymentMethod ?? "Cash").trim() || "Cash";
      const paymentNote =
        body.paymentNote !== undefined && body.paymentNote !== null ? String(body.paymentNote).trim() : "";
      const rawAmt = body.amountPaid;
      let installments = Array.isArray(cur.installments) ? [...(cur.installments as object[])] : [];
      const idx = installments.findIndex((x) => String((x as { id?: string }).id ?? "") === instId);
      if (idx < 0) {
        return NextResponse.json({ error: "Installment not found" }, { status: 400 });
      }
      const row = installments[idx] as {
        id?: string;
        amount?: number;
        label?: string;
        paid?: boolean;
        paidAt?: number;
        payments?: { amount: number; paymentMethod: string; paidAt: number; note?: string }[];
      };
      const due = Number(row.amount) || 0;
      let amountPaid = rawAmt != null && rawAmt !== "" ? Number(rawAmt) : due;
      if (!Number.isFinite(amountPaid) || amountPaid <= 0) {
        return NextResponse.json({ error: "amountPaid must be a positive number" }, { status: 400 });
      }
      const prevPayments = Array.isArray(row.payments) ? [...row.payments] : [];
      prevPayments.push({
        amount: amountPaid,
        paymentMethod,
        paidAt: now,
        ...(paymentNote ? { note: paymentNote } : {}),
      });
      const receivedTotal = prevPayments.reduce((s, p) => s + Number(p.amount) || 0, 0);
      const fullyPaid = receivedTotal >= due - 0.02;
      /** RTDB rejects `undefined` — never write paidAt unless we have a number. */
      const merged: Record<string, unknown> = { ...row, payments: prevPayments, paid: fullyPaid };
      delete merged.paidAt;
      if (fullyPaid) {
        merged.paidAt = now;
      } else if (typeof row.paidAt === "number" && !Number.isNaN(row.paidAt)) {
        merged.paidAt = row.paidAt;
      }
      installments[idx] = merged;

      const studentId = String(cur.studentId ?? "").trim();
      const studentName = String(cur.studentName ?? "");
      const currency = String(cur.currency ?? "INR").toUpperCase();
      let receipt: { id: string; receiptNumber: string } | null = null;
      if (studentId) {
        const stSnap = await db.ref(`hq/students/${studentId}`).once("value");
        const stName = stSnap.exists() ? String((stSnap.val() as { fullName?: string }).fullName ?? studentName) : studentName;
        const label = String(row.label ?? "Installment");
        receipt = await createReceiptRecord({
          studentId,
          studentName: stName,
          amount: amountPaid,
          currency,
          purpose: `${cur.invoiceNumber ? String(cur.invoiceNumber) : "Invoice"} · ${label}`,
          paymentMethod,
          invoiceId: id,
          installmentId: instId,
          notes: paymentNote,
          receivedAtMs: now,
        });
      }

      const allPaid =
        installments.length > 0 &&
        installments.every((x) => {
          const xi = x as {
            amount?: number;
            paid?: boolean;
            payments?: { amount: number }[];
          };
          if (xi.paid && (!xi.payments || xi.payments.length === 0)) return true;
          const t = Number(xi.amount) || 0;
          const sum = (xi.payments ?? []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
          return sum >= t - 0.02;
        });
      const paidAmount = installments.reduce((sum, x) => {
        const xi = x as {
          amount?: number;
          paid?: boolean;
          payments?: { amount: number }[];
        };
        if (Array.isArray(xi.payments) && xi.payments.length > 0) {
          return sum + xi.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
        }
        // Backward compatibility for very old rows where only `paid=true` existed.
        if (xi.paid) return sum + (Number(xi.amount) || 0);
        return sum;
      }, 0);
      const total = Number(cur.total) || 0;
      const dueAmount = Math.max(0, total - paidAmount);
      const next = {
        ...cur,
        installments,
        paidAmount,
        dueAmount,
        balanceRemaining: dueAmount,
        status: allPaid ? "paid" : "partial",
        updatedAt: now,
      };
      await db.ref(`hq/invoices/${id}`).set(next);
      return NextResponse.json({ item: next, receipt });
    }

    const next = {
      ...cur,
      status: body.status != null ? String(body.status) : cur.status,
      dueDate: body.dueDate !== undefined ? String(body.dueDate) : cur.dueDate,
      notes: body.notes !== undefined ? String(body.notes) : cur.notes,
      updatedAt: now,
    };
    await db.ref(`hq/invoices/${id}`).set(next);
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
    await getAdminDatabase().ref(`hq/invoices/${id}`).remove();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
