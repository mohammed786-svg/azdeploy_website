import { getAdminDatabase, isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import {
  displayStudentCount,
  resolvedTotalAvailableSeats,
  seatsLeftInCurrentBatch,
  totalSeatsRemaining,
  utcYmd,
  type PublicStudentCountSettings,
} from "@/lib/public-student-count";

const REF = "hq/siteSettings/publicStudentCount";
export const DEFAULT_BATCH_CAPACITY = 30;

function normalize(raw: unknown): PublicStudentCountSettings {
  const o = raw as Record<string, unknown>;
  const anchorDate = typeof o.anchorDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.anchorDate) ? o.anchorDate : utcYmd();
  const countAtAnchor = Number(o.countAtAnchor);
  const batchCap = o.batchCapacity != null ? Number(o.batchCapacity) : DEFAULT_BATCH_CAPACITY;
  const totalRaw = o.totalAvailableSeats != null ? Number(o.totalAvailableSeats) : undefined;
  return {
    anchorDate,
    countAtAnchor: Number.isFinite(countAtAnchor) ? Math.max(0, Math.floor(countAtAnchor)) : 1,
    batchCapacity:
      Number.isFinite(batchCap) && batchCap > 0 ? Math.floor(batchCap) : DEFAULT_BATCH_CAPACITY,
    totalAvailableSeats:
      totalRaw != null && Number.isFinite(totalRaw) && totalRaw >= 0 ? Math.floor(totalRaw) : undefined,
  };
}

/** Read settings; if missing, initialize to count 1 anchored at today (UTC). */
export async function getOrInitPublicStudentCountSettings(): Promise<PublicStudentCountSettings | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const db = getAdminDatabase();
  const ref = db.ref(REF);
  const snap = await ref.once("value");
  if (snap.exists()) {
    return normalize(snap.val());
  }
  const initial: PublicStudentCountSettings = {
    anchorDate: utcYmd(),
    countAtAnchor: 1,
    batchCapacity: DEFAULT_BATCH_CAPACITY,
    totalAvailableSeats: DEFAULT_BATCH_CAPACITY * 3,
  };
  await ref.set(initial);
  return initial;
}

export async function savePublicStudentCountSettings(next: PublicStudentCountSettings): Promise<void> {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase not configured");
  }
  await getAdminDatabase().ref(REF).set({
    anchorDate: next.anchorDate,
    countAtAnchor: next.countAtAnchor,
    batchCapacity: next.batchCapacity ?? DEFAULT_BATCH_CAPACITY,
    totalAvailableSeats:
      next.totalAvailableSeats != null
        ? next.totalAvailableSeats
        : resolvedTotalAvailableSeats(
            { ...next, batchCapacity: next.batchCapacity ?? DEFAULT_BATCH_CAPACITY },
            DEFAULT_BATCH_CAPACITY
          ),
  });
}

export function computePublicPayload(settings: PublicStudentCountSettings, todayYmd: string) {
  const count = displayStudentCount(settings, todayYmd);
  const cap = settings.batchCapacity ?? DEFAULT_BATCH_CAPACITY;
  const totalAvail = resolvedTotalAvailableSeats(settings, DEFAULT_BATCH_CAPACITY);
  return {
    count,
    seatsLeft: seatsLeftInCurrentBatch(count, cap),
    batchCapacity: cap,
    totalAvailableSeats: totalAvail,
    totalSeatsRemaining: totalSeatsRemaining(totalAvail, count),
  };
}
