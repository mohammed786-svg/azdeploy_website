/** UTC calendar date YYYY-MM-DD → ms at UTC midnight for that date. */
export function utcMsFromYmd(ymd: string): number {
  const y = Number(ymd.slice(0, 4));
  const m = Number(ymd.slice(5, 7)) - 1;
  const d = Number(ymd.slice(8, 10));
  return Date.UTC(y, m, d);
}

export function utcYmd(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Full calendar days from anchor (inclusive baseline) to end date. Same day → 0. */
export function daysSinceAnchorUtc(anchorYmd: string, endYmd: string): number {
  const a = utcMsFromYmd(anchorYmd);
  const b = utcMsFromYmd(endYmd);
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export type PublicStudentCountSettings = {
  anchorDate: string;
  countAtAnchor: number;
  batchCapacity?: number;
  /** Program-wide cap; if omitted, defaults to 3 × batch capacity. */
  totalAvailableSeats?: number;
};

export function displayStudentCount(settings: PublicStudentCountSettings, todayYmd: string): number {
  const delta = daysSinceAnchorUtc(settings.anchorDate, todayYmd);
  return settings.countAtAnchor + delta;
}

/**
 * Remaining seats in the current batch of `batchSize` (e.g. 30).
 * 24 → 6 left; 30 → 0; 31 → 29 (next batch).
 */
export function seatsLeftInCurrentBatch(registered: number, batchSize: number): number {
  if (batchSize <= 0) return 0;
  if (registered <= 0) return batchSize;
  const rem = registered % batchSize;
  return rem === 0 ? 0 : batchSize - rem;
}

export function resolvedTotalAvailableSeats(
  settings: PublicStudentCountSettings,
  defaultBatchCapacity: number
): number {
  const cap = settings.batchCapacity ?? defaultBatchCapacity;
  const t = settings.totalAvailableSeats;
  if (t != null && Number.isFinite(t) && t >= 0) return Math.floor(t);
  return cap * 3;
}

export function totalSeatsRemaining(totalAvailable: number, registered: number): number {
  return Math.max(0, Math.floor(totalAvailable) - registered);
}
