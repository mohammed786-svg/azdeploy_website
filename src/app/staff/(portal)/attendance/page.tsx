"use client";

import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffAttendance } from "@/lib/staff-types";
import { formatStaffTime } from "@/lib/staff-types";

export default function StaffAttendancePage() {
  const [items, setItems] = useState<StaffAttendance[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const d = await staffFetch<{ items: StaffAttendance[] }>("/api/staff/attendance");
    setItems(d.items || []);
  }, []);

  useEffect(() => {
    void load().catch(() => undefined);
  }, [load]);

  async function mark(action: string, status?: string, workMode?: string) {
    setBusy(true);
    try {
      await staffFetch("/api/staff/attendance", {
        method: "POST",
        body: JSON.stringify({ action, status, workMode }),
      }, { successMessage: "Attendance updated" });
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-sm text-white/50">Mark check-in / check-out from here only.</p>
      </div>
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <button type="button" disabled={busy} onClick={() => void mark("check_in", "present", "office")} className="rounded-xl bg-[#0ea5e9] px-4 py-2 text-sm font-semibold disabled:opacity-50">Check in (office)</button>
        <button type="button" disabled={busy} onClick={() => void mark("check_in", "wfh", "remote")} className="rounded-xl border border-white/15 px-4 py-2 text-sm disabled:opacity-50">WFH</button>
        <button type="button" disabled={busy} onClick={() => void mark("leave", "leave")} className="rounded-xl border border-white/15 px-4 py-2 text-sm disabled:opacity-50">Leave</button>
        <button type="button" disabled={busy} onClick={() => void mark("check_out")} className="rounded-xl border border-[#22c55e]/40 px-4 py-2 text-sm text-[#86efac] disabled:opacity-50">Check out</button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/45">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">In</th>
              <th className="px-3 py-2">Out</th>
              <th className="px-3 py-2">Mode</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="px-3 py-2">{a.attendanceDate}</td>
                <td className="px-3 py-2">{a.status}</td>
                <td className="px-3 py-2">{formatStaffTime(a.checkInAt)}</td>
                <td className="px-3 py-2">{formatStaffTime(a.checkOutAt)}</td>
                <td className="px-3 py-2">{a.workMode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
