"use client";

import { useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffLead } from "@/lib/staff-types";
import { formatStaffTime } from "@/lib/staff-types";

const STATUSES = ["follow_up", "interested", "contacted", "converted", "lost", "not_interested"];

export default function LeadFollowUpModal({
  lead,
  onClose,
  onSaved,
}: {
  lead: StaffLead;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(lead.status === "new" ? "follow_up" : lead.status);
  const [nextAt, setNextAt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function save() {
    if (!note.trim()) {
      setErr("Add a follow-up note");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await staffFetch(
        `/api/staff/leads/${lead.id}/followup`,
        {
          method: "POST",
          body: JSON.stringify({
            note: note.trim(),
            status,
            nextFollowUpAt: nextAt ? new Date(nextAt).toISOString() : null,
          }),
        },
        { successMessage: "Follow-up saved" }
      );
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-4 sm:items-center" role="dialog">
      <div className="w-full max-w-lg rounded-2xl border border-[#f59e0b]/40 bg-[#12121a] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#fbbf24]">Lead follow-up due</p>
            <h2 className="mt-1 text-xl font-bold">{lead.leadName}</h2>
            <p className="mt-1 text-sm text-white/55">
              {lead.phone || "No phone"} · Due {formatStaffTime(lead.nextFollowUpAt)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/15 px-2 py-1 text-sm text-white/50">
            Later
          </button>
        </div>

        {err ? <p className="mt-3 text-sm text-red-300">{err}</p> : null}

        <label className="mt-4 block text-xs text-white/50">What happened?</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#f59e0b]/50"
          placeholder="Call notes, interest level, next step…"
        />

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-white/50">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50">Next follow-up</label>
            <input
              type="datetime-local"
              value={nextAt}
              onChange={(e) => setNextAt(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="mt-5 w-full rounded-xl bg-[#f59e0b] px-4 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save follow-up"}
        </button>
      </div>
    </div>
  );
}
