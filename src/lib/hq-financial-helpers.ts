/** Sum recorded payments on an installment row. */
export function installmentReceived(inst: { payments?: { amount?: number }[]; paid?: boolean }): number {
  const payments = Array.isArray(inst.payments) ? inst.payments : [];
  return payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
}

/** Cash recognized on an installment (payments, or legacy full amount if marked paid). */
export function installmentCollected(inst: {
  amount?: number;
  paid?: boolean;
  payments?: { amount?: number }[];
}): number {
  const fromP = installmentReceived(inst);
  if (fromP > 0.02) return fromP;
  if (inst.paid) return Number(inst.amount) || 0;
  return 0;
}

/** Remaining balance on one installment (same tolerance as invoice PATCH). */
export function installmentOutstanding(inst: {
  amount?: number;
  payments?: { amount?: number }[];
  paid?: boolean;
}): number {
  const due = Number(inst.amount) || 0;
  const received = installmentReceived(inst);
  if (inst.paid && received >= due - 0.02) return 0;
  return Math.max(0, due - received);
}

type InvLike = {
  installments?: unknown[];
  total?: number;
  status?: string;
};

/** Total outstanding student fees for one invoice. */
export function invoiceOutstandingTotal(inv: InvLike): number {
  const insts = Array.isArray(inv.installments) ? inv.installments : [];
  if (insts.length === 0) {
    const st = String(inv.status ?? "").toLowerCase();
    if (st === "paid") return 0;
    return Number(inv.total) || 0;
  }
  return insts.reduce((s: number, inst: unknown) => s + installmentOutstanding(inst as Parameters<typeof installmentOutstanding>[0]), 0);
}

/** Total fees collected on invoice (sum of installment receipts / legacy paid flags). */
export function invoiceCollectedTotal(inv: InvLike): number {
  const insts = Array.isArray(inv.installments) ? inv.installments : [];
  if (insts.length === 0) {
    const st = String(inv.status ?? "").toLowerCase();
    if (st === "paid") return Number(inv.total) || 0;
    return 0;
  }
  return insts.reduce(
    (s: number, raw: unknown) => s + installmentCollected(raw as Parameters<typeof installmentCollected>[0]),
    0
  );
}

export type PendingInstallmentRow = {
  invoiceId: string;
  invoiceNumber: string;
  studentName: string;
  installmentLabel: string;
  dueDate: string;
  outstanding: number;
  currency: string;
  /** Sum of outstanding installments across this student (all invoices). */
  studentOutstandingTotal?: number;
};

/** One row per installment with a positive balance (for reports / Excel). */
export function flattenPendingInstallments(invoices: Record<string, unknown>[]): PendingInstallmentRow[] {
  const out: PendingInstallmentRow[] = [];
  for (const inv of invoices) {
    const invoiceId = String(inv.id ?? "");
    const invoiceNumber = String(inv.invoiceNumber ?? "");
    const studentName = String(inv.studentName ?? "");
    const currency = String(inv.currency ?? "INR");
    const insts = Array.isArray(inv.installments) ? inv.installments : [];
    if (insts.length === 0) {
      const o = invoiceOutstandingTotal(inv as InvLike);
      if (o <= 0.02) continue;
      out.push({
        invoiceId,
        invoiceNumber,
        studentName,
        installmentLabel: "(balance)",
        dueDate: String(inv.dueDate ?? ""),
        outstanding: o,
        currency,
      });
      continue;
    }
    for (const raw of insts) {
      const inst = raw as Parameters<typeof installmentOutstanding>[0] & { label?: string; dueDate?: string };
      const o = installmentOutstanding(inst);
      if (o <= 0.02) continue;
      out.push({
        invoiceId,
        invoiceNumber,
        studentName,
        installmentLabel: String(inst.label ?? ""),
        dueDate: String(inst.dueDate ?? ""),
        outstanding: o,
        currency,
      });
    }
  }
  return out;
}

type InvoiceRow = Record<string, unknown> & {
  studentId?: unknown;
  currency?: unknown;
  total?: unknown;
  status?: unknown;
  installments?: { amount?: unknown; paid?: boolean }[];
};

export type StudentBalanceRollup = {
  outstandingPending: number;
  currency: string;
};

/**
 * Sum unpaid invoice amounts per student — same rules as
 * `GET /api/hq/students/[id]/billing-summary` (installments with `!paid`, else non-draft non-paid totals).
 */
export function aggregateOutstandingPendingByStudent(
  invVal: Record<string, Record<string, unknown>> | null
): Record<string, StudentBalanceRollup> {
  const out: Record<string, StudentBalanceRollup> = {};
  if (!invVal) return out;

  for (const invId of Object.keys(invVal)) {
    const inv = invVal[invId] as InvoiceRow;
    const studentId = String(inv.studentId ?? "").trim();
    if (!studentId) continue;

    const c = String(inv.currency ?? "INR").toUpperCase() || "INR";
    const total = Number(inv.total) || 0;
    const status = String(inv.status ?? "").toLowerCase();
    const insts = inv.installments;

    let invPending = 0;
    if (Array.isArray(insts) && insts.length > 0) {
      for (const x of insts) {
        if (!x.paid) invPending += Number(x.amount) || 0;
      }
    } else if (status !== "paid" && status !== "draft") {
      invPending += total;
    }

    const prev = out[studentId] ?? { outstandingPending: 0, currency: "INR" };
    const outstandingPending = Math.round((prev.outstandingPending + invPending) * 100) / 100;
    out[studentId] = {
      outstandingPending,
      currency: c || prev.currency,
    };
  }

  return out;
}
