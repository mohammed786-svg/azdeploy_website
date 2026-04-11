import type { Database } from "firebase-admin/database";

const META_SEQ = "hq/meta/studentSeq";

/**
 * Next integer student serial (1, 2, 3, …). Persists under `hq/meta/studentSeq`.
 */
export async function allocateNextStudentSerial(db: Database): Promise<number> {
  const seqRef = db.ref(META_SEQ);
  const result = await seqRef.transaction((current) => {
    const n = typeof current === "number" && !Number.isNaN(current) ? current : 0;
    return n + 1;
  });
  if (!result.committed || result.snapshot.val() == null) {
    throw new Error("Could not allocate student serial");
  }
  return result.snapshot.val() as number;
}

type Row = { id: string; createdAt: number; serial?: unknown };

/**
 * Assigns `serial` to any student missing it: stable order by `createdAt`, then id.
 * Sets `hq/meta/studentSeq` to the highest serial after updates.
 */
export async function backfillMissingStudentSerials(db: Database): Promise<void> {
  const snap = await db.ref("hq/students").once("value");
  const val = snap.val() as Record<string, Record<string, unknown>> | null;
  if (!val) return;

  const rows: Row[] = Object.keys(val).map((id) => ({
    id,
    createdAt: Number(val[id].createdAt) || 0,
    serial: val[id].serial,
  }));

  const numericSerials = rows
    .map((r) => r.serial)
    .filter((s): s is number => typeof s === "number" && !Number.isNaN(s));
  const maxSerial = numericSerials.length > 0 ? Math.max(...numericSerials) : 0;

  const missing = rows
    .filter((r) => typeof r.serial !== "number" || Number.isNaN(Number(r.serial)))
    .sort((a, b) => (a.createdAt - b.createdAt || a.id.localeCompare(b.id)));

  if (missing.length === 0) {
    if (maxSerial > 0) {
      const cur = await db.ref(META_SEQ).once("value");
      const v = cur.val();
      if (typeof v !== "number" || v < maxSerial) {
        await db.ref(META_SEQ).set(maxSerial);
      }
    }
    return;
  }

  const patch: Record<string, unknown> = {};
  let next = maxSerial;
  for (const r of missing) {
    next += 1;
    patch[`hq/students/${r.id}/serial`] = next;
  }
  patch[META_SEQ] = next;
  await db.ref().update(patch);
}
