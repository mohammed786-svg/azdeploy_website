"use client";

import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffReport } from "@/lib/staff-types";

export default function StaffReportsPage() {
  const [items, setItems] = useState<StaffReport[]>([]);
  const [summary, setSummary] = useState("");
  const [accomplishments, setAccomplishments] = useState("");
  const [blockers, setBlockers] = useState("");
  const [planTomorrow, setPlanTomorrow] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const d = await staffFetch<{ items: StaffReport[] }>("/api/staff/reports");
    setItems(d.items || []);
    const today = new Date().toISOString().slice(0, 10);
    const todays = (d.items || []).find((r) => r.reportDate === today);
    if (todays) {
      setSummary(todays.summary || "");
      setAccomplishments(todays.accomplishments || "");
      setBlockers(todays.blockers || "");
      setPlanTomorrow(todays.planTomorrow || "");
      setHoursWorked(todays.hoursWorked != null ? String(todays.hoursWorked) : "");
    }
  }, []);

  useEffect(() => {
    void load().catch(() => undefined);
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await staffFetch("/api/staff/reports", {
        method: "POST",
        body: JSON.stringify({
          summary: summary.trim(),
          accomplishments: accomplishments.trim(),
          blockers: blockers.trim(),
          planTomorrow: planTomorrow.trim(),
          hoursWorked: hoursWorked ? Number(hoursWorked) : null,
        }),
      }, { successMessage: "Report saved" });
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Daily report</h1>
        <p className="text-sm text-white/50">Submit what you completed, blockers, and tomorrow&apos;s plan.</p>
      </div>
      <form onSubmit={(e) => void save(e)} className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div>
          <label className="text-xs text-white/50">Summary *</label>
          <textarea required value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-white/50">Accomplishments</label>
          <textarea value={accomplishments} onChange={(e) => setAccomplishments(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-white/50">Blockers</label>
          <textarea value={blockers} onChange={(e) => setBlockers(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-white/50">Plan for tomorrow</label>
          <textarea value={planTomorrow} onChange={(e) => setPlanTomorrow(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-white/50">Hours worked</label>
          <input type="number" step="0.5" min="0" value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} className="mt-1 w-40 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={busy} className="rounded-xl bg-[#0ea5e9] px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
          {busy ? "Saving…" : "Save today's report"}
        </button>
      </form>
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-white/60">Recent</h2>
        {items.slice(0, 10).map((r) => (
          <div key={r.id} className="rounded-xl border border-white/10 px-3 py-2.5">
            <p className="text-xs text-white/40">{r.reportDate}</p>
            <p className="mt-1 text-sm">{r.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
