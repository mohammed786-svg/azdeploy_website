import { NextRequest, NextResponse } from "next/server";
import { requireHqSession } from "@/lib/hq-auth";
import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { parseListQuery, paginateSlice, type ListQuery } from "@/lib/hq-list-query";

function formatInvoiceNumber(seq: number): string {
  const y = new Date().getFullYear();
  return `INV-${y}-${String(seq).padStart(5, "0")}`;
}

type InvRow = Record<string, unknown> & {
  id: string;
  invoiceNumber?: string;
  studentId?: string;
  studentName?: string;
  total?: number;
  createdAt?: number;
};

function rowText(r: InvRow): string {
  return [r.invoiceNumber, r.studentName, String(r.total)].filter(Boolean).join(" ").toLowerCase();
}

function filterInv(items: InvRow[], q: ListQuery): InvRow[] {
  let out = items;
  if (q.studentId) out = out.filter((r) => String(r.studentId ?? "") === q.studentId);
  if (q.search) out = out.filter((r) => rowText(r).includes(q.search));
  if (q.dateFromMs != null || q.dateToMs != null) {
    out = out.filter((r) => {
      const t = Number(r.createdAt) || 0;
      if (!t) return false;
      if (q.dateFromMs != null && t < q.dateFromMs) return false;
      if (q.dateToMs != null && t > q.dateToMs) return false;
      return true;
    });
  }
  return out;
}

function sortInv(items: InvRow[], q: ListQuery): InvRow[] {
  const dir = q.sortDir === "asc" ? 1 : -1;
  const copy = [...items];
  copy.sort((a, b) => {
    if (q.sortField === "invoiceNumber") {
      return dir * String(a.invoiceNumber ?? "").localeCompare(String(b.invoiceNumber ?? ""));
    }
    if (q.sortField === "studentName") {
      return dir * String(a.studentName ?? "").localeCompare(String(b.studentName ?? ""));
    }
    if (q.sortField === "total") {
      return dir * ((Number(a.total) || 0) - (Number(b.total) || 0));
    }
    const ta = Number(a.createdAt) || 0;
    const tb = Number(b.createdAt) || 0;
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
    const q = parseListQuery(request.nextUrl.searchParams, "createdAt_desc");
    const db = getAdminDatabase();
    const snap = await db.ref("hq/invoices").once("value");
    const val = snap.val() as Record<string, Record<string, unknown>> | null;
    let items: InvRow[] = val
      ? Object.keys(val).map((id) => ({ id, ...(val[id] as object) } as InvRow))
      : [];
    items = filterInv(items, q);
    items = sortInv(items, q);
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
    const studentId = String(body.studentId ?? "").trim();
    if (!studentId) {
      return NextResponse.json({ error: "studentId is required" }, { status: 400 });
    }
    const db = getAdminDatabase();
    const stSnap = await db.ref(`hq/students/${studentId}`).once("value");
    if (!stSnap.exists()) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    const student = stSnap.val() as { fullName?: string };
    const studentName = String(student.fullName ?? "");

    const taxPercent = body.taxPercent != null ? Number(body.taxPercent) : 0;
    let lineItems: { description: string; amount: number }[] = [];
    let installments: {
      id: string;
      label: string;
      amount: number;
      dueDate: string;
      paid: boolean;
      paidAt: number | null;
    }[] = [];
    let feeStructureId: string | null = body.feeStructureId ? String(body.feeStructureId) : null;

    if (feeStructureId) {
      const fsSnap = await db.ref(`hq/feeStructures/${feeStructureId}`).once("value");
      if (!fsSnap.exists()) {
        return NextResponse.json({ error: "Fee structure not found" }, { status: 404 });
      }
      const fs = fsSnap.val() as {
        name?: string;
        totalAmount?: number;
        currency?: string;
        installments?: { id: string; label: string; amount: number; dueOffsetDays?: number }[];
      };
      const baseDate = body.baseDate ? new Date(String(body.baseDate)) : new Date();
      const insts = Array.isArray(fs.installments) ? fs.installments : [];
      if (insts.length > 0) {
        lineItems = [{ description: `${fs.name ?? "Program"} — total fee`, amount: Number(fs.totalAmount) || 0 }];
        installments = insts.map((x, i) => {
          const d = new Date(baseDate);
          d.setDate(d.getDate() + (x.dueOffsetDays ?? 30 * i));
          return {
            id: x.id || `inst_${i}`,
            label: x.label,
            amount: Number(x.amount) || 0,
            dueDate: d.toISOString().slice(0, 10),
            paid: false,
            paidAt: null,
          };
        });
      } else {
        const total = Number(fs.totalAmount) || 0;
        lineItems = [{ description: `${fs.name ?? "Program"} fee`, amount: total }];
        installments = [
          {
            id: "full",
            label: "Full fee",
            amount: total,
            dueDate: baseDate.toISOString().slice(0, 10),
            paid: false,
            paidAt: null,
          },
        ];
      }
    } else if (Array.isArray(body.lineItems) && body.lineItems.length > 0) {
      lineItems = body.lineItems.map((x: { description?: string; amount?: number }) => ({
        description: String(x.description ?? "Line"),
        amount: Number(x.amount) || 0,
      }));
      if (Array.isArray(body.installments) && body.installments.length > 0) {
        installments = body.installments.map(
          (x: { id?: string; label?: string; amount?: number; dueDate?: string }, i: number) => ({
            id: String(x.id ?? `inst_${i + 1}`),
            label: String(x.label ?? `Installment ${i + 1}`),
            amount: Number(x.amount) || 0,
            dueDate: x.dueDate ? String(x.dueDate) : new Date().toISOString().slice(0, 10),
            paid: false,
            paidAt: null,
          })
        );
      }
    } else {
      return NextResponse.json({ error: "Provide feeStructureId or lineItems" }, { status: 400 });
    }

    const subtotal = lineItems.reduce((s, x) => s + x.amount, 0);
    const taxAmount = taxPercent ? (subtotal * taxPercent) / 100 : 0;
    const total = subtotal + taxAmount;

    if (installments.length && Math.abs(installments.reduce((s, x) => s + x.amount, 0) - total) > 0.02) {
      const sumInst = installments.reduce((s, x) => s + x.amount, 0);
      if (sumInst > 0 && total > 0) {
        const factor = total / sumInst;
        installments = installments.map((x) => ({
          ...x,
          amount: Math.round(x.amount * factor * 100) / 100,
        }));
      }
    }

    const seqRef = db.ref("hq/meta/invoiceSeq");
    const seqResult = await seqRef.transaction((current) => {
      const n = typeof current === "number" ? current : 1000;
      return n + 1;
    });
    if (!seqResult.committed || seqResult.snapshot.val() == null) {
      return NextResponse.json({ error: "Could not allocate invoice number" }, { status: 500 });
    }
    const seq = seqResult.snapshot.val() as number;
    const invoiceNumber = formatInvoiceNumber(seq);

    const ref = db.ref("hq/invoices").push();
    const invId = ref.key!;
    const now = Date.now();
    const currency = body.currency ? String(body.currency).toUpperCase() : "INR";
    const payload = {
      id: invId,
      invoiceNumber,
      studentId,
      studentName,
      lineItems,
      subtotal,
      taxPercent: taxPercent || 0,
      taxAmount,
      total,
      currency,
      status: body.status ? String(body.status) : "sent",
      dueDate: body.dueDate ? String(body.dueDate) : "",
      installments,
      feeStructureId,
      notes: body.notes ? String(body.notes) : "",
      createdAt: now,
      updatedAt: now,
    };
    await ref.set(payload);
    return NextResponse.json({ item: payload });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
