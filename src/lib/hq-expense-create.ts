import { getAdminDatabase } from "@/lib/firebase-admin";

export function formatExpenseNumber(seq: number): string {
  const y = new Date().getFullYear();
  return `EXP-${y}-${String(seq).padStart(5, "0")}`;
}

export type CreateExpenseInput = {
  title: string;
  amount: number;
  currency: string;
  category: string;
  vendor: string;
  notes: string;
  spentAtMs: number;
};

export async function createExpenseRecord(input: CreateExpenseInput): Promise<{ id: string; expenseNumber: string }> {
  const db = getAdminDatabase();
  const seqRef = db.ref("hq/meta/expenseSeq");
  const seqResult = await seqRef.transaction((current) => {
    const n = typeof current === "number" ? current : 1000;
    return n + 1;
  });
  if (!seqResult.committed || seqResult.snapshot.val() == null) {
    throw new Error("Could not allocate expense number");
  }
  const seq = seqResult.snapshot.val() as number;
  const expenseNumber = formatExpenseNumber(seq);
  const ref = db.ref("hq/expenses").push();
  const id = ref.key!;
  const now = Date.now();
  const spentAt = Number.isFinite(input.spentAtMs) ? input.spentAtMs : now;
  const payload = {
    id,
    expenseNumber,
    title: input.title,
    amount: input.amount,
    currency: input.currency.toUpperCase(),
    category: input.category,
    vendor: input.vendor,
    notes: input.notes,
    spentAt,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(payload);
  return { id, expenseNumber };
}
