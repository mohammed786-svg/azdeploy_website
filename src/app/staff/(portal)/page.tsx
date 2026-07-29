"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffAttendance, StaffLead, StaffReport, StaffTask } from "@/lib/staff-types";
import { formatStaffTime } from "@/lib/staff-types";
import LeadFollowUpModal from "@/components/staff/LeadFollowUpModal";

type Dash = {
  stats: {
    tasksTodo: number;
    tasksInProgress: number;
    tasksBlocked: number;
    tasksDone: number;
    openTodos: number;
    dueFollowUps: number;
  };
  todayAttendance: StaffAttendance | null;
  todayReport: StaffReport | null;
  dueFollowUps: StaffLead[];
  recentTasks: StaffTask[];
};

export default function StaffDashboardPage() {
  const [data, setData] = useState<Dash | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [followLead, setFollowLead] = useState<StaffLead | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await staffFetch<Dash>("/api/staff/dashboard");
      setData(d);
      setErr("");
      setFollowLead((prev) => {
        if (prev) return prev;
        return d.dueFollowUps?.[0] || null;
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function checkIn(action: "check_in" | "check_out" | "wfh" | "leave") {
    setBusy(true);
    try {
      await staffFetch(
        "/api/staff/attendance",
        {
          method: "POST",
          body: JSON.stringify({
            action: action === "wfh" ? "check_in" : action,
            status: action === "wfh" ? "wfh" : action === "leave" ? "leave" : "present",
            workMode: action === "wfh" ? "remote" : "office",
          }),
        },
        { successMessage: action === "check_out" ? "Checked out" : "Attendance saved" }
      );
      await load();
    } finally {
      setBusy(false);
    }
  }

  const s = data?.stats;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Today</h1>
        <p className="mt-1 text-sm text-white/50">Tasks, attendance, reports, and follow-ups in one place.</p>
      </div>

      {err ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{err}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "To do", value: s?.tasksTodo ?? "—" },
          { label: "In progress", value: s?.tasksInProgress ?? "—" },
          { label: "Open todos", value: s?.openTodos ?? "—" },
          { label: "Due follow-ups", value: s?.dueFollowUps ?? "—" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#7dd3fc]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Attendance</h2>
          {data?.todayAttendance ? (
            <div className="mt-3 space-y-1 text-sm text-white/80">
              <p>
                Status: <span className="font-semibold text-[#86efac]">{data.todayAttendance.status}</span> ·{" "}
                {data.todayAttendance.workMode}
              </p>
              <p>In: {formatStaffTime(data.todayAttendance.checkInAt)}</p>
              <p>Out: {formatStaffTime(data.todayAttendance.checkOutAt)}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/45">Not marked yet for today.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void checkIn("check_in")}
              className="rounded-xl bg-[#0ea5e9] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Check in
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void checkIn("wfh")}
              className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-50"
            >
              WFH
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void checkIn("leave")}
              className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-50"
            >
              Leave
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void checkIn("check_out")}
              className="rounded-xl border border-[#22c55e]/40 px-3 py-2 text-xs text-[#86efac] disabled:opacity-50"
            >
              Check out
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Daily report</h2>
            <Link href="/staff/reports" className="text-xs text-[#7dd3fc] hover:underline">
              Open
            </Link>
          </div>
          {data?.todayReport ? (
            <p className="mt-3 line-clamp-4 text-sm text-white/75">{data.todayReport.summary}</p>
          ) : (
            <p className="mt-3 text-sm text-white/45">No report submitted today.</p>
          )}
          <Link
            href="/staff/reports"
            className="mt-4 inline-flex rounded-xl border border-[#0ea5e9]/40 px-3 py-2 text-xs font-semibold text-[#7dd3fc]"
          >
            Write / update report
          </Link>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Active tasks</h2>
          <Link href="/staff/tasks" className="text-xs text-[#7dd3fc] hover:underline">
            All tasks
          </Link>
        </div>
        <div className="mt-3 grid gap-2">
          {(data?.recentTasks || []).length === 0 ? (
            <p className="text-sm text-white/45">No open tasks.</p>
          ) : (
            data?.recentTasks.map((t) => (
              <div key={t.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-white/45">
                    {t.status} · {t.priority}
                    {t.dueAt ? ` · due ${formatStaffTime(t.dueAt)}` : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {followLead ? (
        <LeadFollowUpModal
          lead={followLead}
          onClose={() => setFollowLead(null)}
          onSaved={() => {
            setFollowLead(null);
            void load();
          }}
        />
      ) : null}
    </div>
  );
}
