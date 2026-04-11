import { getAdminDatabase } from "@/lib/firebase-admin";

export function formatReceiptNumber(seq: number): string {
  const y = new Date().getFullYear();
  return `RCP-${y}-${String(seq).padStart(5, "0")}`;
}

export type CreateReceiptInput = {
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  purpose: string;
  paymentMethod: string;
  invoiceId: string | null;
  installmentId: string | null;
  notes?: string;
  receivedAtMs?: number;
};

/** Allocate sequential receipt number and write `hq/receipts/{id}`. */
export async function createReceiptRecord(input: CreateReceiptInput): Promise<{ id: string; receiptNumber: string }> {
  const db = getAdminDatabase();
  const seqRef = db.ref("hq/meta/receiptSeq");
  const seqResult = await seqRef.transaction((current) => {
    const n = typeof current === "number" ? current : 1000;
    return n + 1;
  });
  if (!seqResult.committed || seqResult.snapshot.val() == null) {
    throw new Error("Could not allocate receipt number");
  }
  const seq = seqResult.snapshot.val() as number;
  const receiptNumber = formatReceiptNumber(seq);
  const ref = db.ref("hq/receipts").push();
  const id = ref.key!;
  const now = Date.now();
  let receivedAt = input.receivedAtMs ?? now;
  if (input.receivedAtMs != null && Number.isFinite(input.receivedAtMs)) {
    receivedAt = input.receivedAtMs;
  }
  const payload = {
    id,
    receiptNumber,
    studentId: input.studentId,
    studentName: input.studentName,
    amount: input.amount,
    currency: input.currency.toUpperCase(),
    purpose: input.purpose,
    paymentMethod: input.paymentMethod,
    invoiceId: input.invoiceId,
    installmentId: input.installmentId,
    notes: input.notes ?? "",
    receivedAt,
    createdAt: now,
  };
  await ref.set(payload);
  return { id, receiptNumber };
}
