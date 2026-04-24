'use client';

import { useEffect, useState } from 'react';
import { normalizeHttpError, resolveApiOrigin } from '@/lib/api-http';
import { showToast } from '@/lib/toast';

type PublicStudentCountResponse = {
  count: number;
  seatsLeft: number;
  batchCapacity: number;
  totalAvailableSeats: number;
  totalSeatsRemaining: number;
  fallback?: boolean;
  error?: string;
};

export default function StudentsPanel() {
  const [data, setData] = useState<PublicStudentCountResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
    (async () => {
      try {
        const base = resolveApiOrigin();
        const url = `${base.replace(/\/$/, "")}/api/v1/public/student-count`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          throw new Error(normalizeHttpError(res.status));
        }
        const raw = (await res.json()) as
          | PublicStudentCountResponse
          | { success?: boolean; data?: PublicStudentCountResponse };
        const json =
          raw && typeof raw === "object" && "success" in raw
            ? (raw as { data?: PublicStudentCountResponse }).data || ({} as PublicStudentCountResponse)
            : (raw as PublicStudentCountResponse);
        const t1 = typeof performance !== 'undefined' ? performance.now() : 0;
        if (!cancelled) {
          setData(json);
          setLatencyMs(Math.round(t1 - t0));
        }
      } catch {
        if (!cancelled) {
          showToast("Could not load student count. Showing fallback values.", "info");
          setData({
            count: 1,
            seatsLeft: 29,
            batchCapacity: 30,
            totalAvailableSeats: 90,
            totalSeatsRemaining: 89,
            fallback: true,
          });
          setLatencyMs(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const count = data?.count ?? 1;
  const seatsLeft = data?.seatsLeft ?? 29;
  const cap = data?.batchCapacity ?? 30;
  const totalAvail = data?.totalAvailableSeats ?? 90;
  const totalLeft = data?.totalSeatsRemaining ?? 89;
  const inCurrentBatch =
    count > 0 && count % cap === 0 ? cap : count % cap;
  const filled = Math.min(10, Math.max(0, Math.round((inCurrentBatch / cap) * 10)));

  return (
    <div className="hud-corner-border p-4 w-full max-w-[280px] flex flex-col min-w-0">
      <div className="flex items-center gap-2 mb-4">
        <span className="hud-label text-white">[STUDENTS]</span>
        <span className="live-dot" />
        <span className="text-xs font-mono text-[#22c55e]">LIVE</span>
      </div>

      <div className="mb-2">
        <p className="text-xs text-white/80 font-mono">STUDENTS_REGISTERED</p>
        <p className="text-4xl font-bold text-[#00d4ff] text-glow-teal mt-1 tabular-nums">
          {loading ? '—' : count}
        </p>
      </div>

      <div className="segmented-bar mb-2">
        {[...Array(10)].map((_, i) => (
          <span key={i} className={!loading && i < filled ? 'opacity-100' : 'opacity-30'} />
        ))}
      </div>
      <p className="text-[10px] text-white/50 font-mono">
        {loading
          ? 'LOADING_ENROLLMENTS...'
          : data?.fallback
            ? 'LOCAL_PREVIEW · CONFIGURE_DJANGO_API'
            : 'ENROLLMENTS_SYNCED'}
      </p>

      <div className="mt-4 pt-4 border-t border-[#00d4ff]/20 space-y-1.5 text-[10px] text-white/40 font-mono">
        <div className="flex justify-between gap-2">
          <span>TOTAL_AVAILABLE: {loading ? '—' : totalAvail}</span>
          <span>TOTAL_LEFT: {loading ? '—' : totalLeft}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span>BATCH_LEFT: {loading ? '—' : seatsLeft}</span>
          <span>LATENCY: {latencyMs != null ? `${latencyMs}ms` : '—'}</span>
        </div>
      </div>
    </div>
  );
}
