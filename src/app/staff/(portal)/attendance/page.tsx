"use client";

import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffAttendance } from "@/lib/staff-types";
import { formatStaffTime } from "@/lib/staff-types";

type AttendancePayload = {
  items: StaffAttendance[];
  policy?: {
    expectedCheckIn: string;
    message: string;
  };
  today?: StaffAttendance | null;
};

export default function StaffAttendancePage() {
  const [items, setItems] = useState<StaffAttendance[]>([]);
  const [today, setToday] = useState<StaffAttendance | null>(null);
  const [policyMsg, setPolicyMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const d = await staffFetch<AttendancePayload>("/api/staff/attendance");
    setItems(d.items || []);
    setToday(d.today || null);
    setPolicyMsg(d.policy?.message || "");
  }, []);

  useEffect(() => {
    void load().catch(() => undefined);
  }, [load]);

  async function mark(action: string, status?: string, workMode?: string, confirmText?: string) {
    const okConfirm = window.confirm(
      confirmText ||
        (action === "check_out"
          ? "Confirm check-out for today? You can check out only once per day."
          : "Confirm check-in? Official time is 9:30 AM. You can check in only once per day.")
    );
    if (!okConfirm) return;
    setBusy(true);
    setErr("");
    try {
      await staffFetch(
        "/api/staff/attendance",
        {
          method: "POST",
          body: JSON.stringify({ action, status, workMode }),
        },
        { successMessage: action === "check_out" ? "Checked out" : "Attendance saved" }
      );
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const checkedIn = Boolean(today?.checkInAt);
  const checkedOut = Boolean(today?.checkOutAt);
  const onLeave = today?.status === "leave" || today?.status === "absent";

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-sm text-white/50">One check-in and one check-out per day. Confirmation required each time.</p>
      </div>

      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
        <p className="font-semibold text-amber-200">Check in quickly — official time 9:30 AM (IST)</p>
        <p className="mt-2 leading-relaxed text-amber-100/90">
          {policyMsg ||
            "Official check-in time is 9:30 AM. You may check in only once and check out only once per day. Salary and attendance are calculated from these timings."}
        </p>
      </div>

      {today ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <p>
            Today: <span className="font-semibold text-[#86efac]">{today.status}</span>
            {today.lateMinutes ? (
              <span className="ml-2 text-amber-300">({today.lateMinutes} min late)</span>
            ) : null}
          </p>
          <p className="mt-1 text-white/60">In: {formatStaffTime(today.checkInAt)} · Out: {formatStaffTime(today.checkOutAt)}</p>
        </div>
      ) : (
        <p className="text-sm text-white/45">Not marked yet for today — please check in.</p>
      )}

      {err ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{err}</p> : null}

      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <button
          type="button"
          disabled={busy || checkedIn || onLeave}
          onClick={() => void mark("check_in", "present", "office")}
          className="rounded-xl bg-[#0ea5e9] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          {checkedIn ? "Already checked in" : "Check in (office)"}
        </button>
        <button
          type="button"
          disabled={busy || checkedIn || onLeave}
          onClick={() => void mark("check_in", "wfh", "remote", "Confirm WFH check-in? Only once per day. Official time is 9:30 AM.")}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm disabled:opacity-40"
        >
          WFH check-in
        </button>
        <button
          type="button"
          disabled={busy || checkedIn}
          onClick={() => void mark("leave", "leave", "office", "Mark today as Leave? This can only be set if you have not checked in.")}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm disabled:opacity-40"
        >
          Leave
        </button>
        <button
          type="button"
          disabled={busy || !checkedIn || checkedOut || onLeave}
          onClick={() => void mark("check_out")}
          className="rounded-xl border border-[#22c55e]/40 px-4 py-2 text-sm text-[#86efac] disabled:opacity-40"
        >
          {checkedOut ? "Already checked out" : "Check out"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/45">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">In</th>
              <th className="px-3 py-2">Out</th>
              <th className="px-3 py-2">Late</th>
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
                <td className="px-3 py-2">{a.lateMinutes ? `${a.lateMinutes}m` : "—"}</td>
                <td className="px-3 py-2">{a.workMode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
