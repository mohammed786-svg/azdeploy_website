"use client";

import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffLead } from "@/lib/staff-types";
import { formatStaffTime } from "@/lib/staff-types";
import LeadFollowUpModal from "@/components/staff/LeadFollowUpModal";

export default function StaffLeadsPage() {
  const [items, setItems] = useState<StaffLead[]>([]);
  const [follow, setFollow] = useState<StaffLead | null>(null);
  const [leadName, setLeadName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseInterest, setCourseInterest] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");

  const load = useCallback(async () => {
    const d = await staffFetch<{ items: StaffLead[] }>("/api/staff/leads");
    setItems(d.items || []);
  }, []);

  useEffect(() => {
    void load().catch(() => undefined);
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!leadName.trim()) return;
    await staffFetch("/api/staff/leads", {
      method: "POST",
      body: JSON.stringify({
        leadName: leadName.trim(),
        phone: phone.trim(),
        courseInterest: courseInterest.trim(),
        nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt).toISOString() : null,
        status: "new",
      }),
    }, { successMessage: "Lead added" });
    setLeadName("");
    setPhone("");
    setCourseInterest("");
    setNextFollowUpAt("");
    await load();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-white/50">For sales / telecallers — track follow-ups and conversions.</p>
      </div>

      <form onSubmit={(e) => void add(e)} className="grid gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
        <input value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Lead name *" required className="rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm sm:col-span-2" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm" />
        <input value={courseInterest} onChange={(e) => setCourseInterest(e.target.value)} placeholder="Course interest" className="rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm" />
        <input type="datetime-local" value={nextFollowUpAt} onChange={(e) => setNextFollowUpAt(e.target.value)} className="rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm sm:col-span-2" />
        <button type="submit" className="rounded-xl bg-[#0ea5e9] px-4 py-2.5 text-sm font-semibold sm:col-span-2">Add lead</button>
      </form>

      <div className="grid gap-2">
        {items.map((l) => (
          <div key={l.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="font-medium">{l.leadName}</p>
              <p className="text-xs text-white/45">
                {l.phone || "—"} · {l.status.replace(/_/g, " ")}
                {l.nextFollowUpAt ? ` · next ${formatStaffTime(l.nextFollowUpAt)}` : ""}
              </p>
              {l.courseInterest ? <p className="mt-1 text-xs text-[#7dd3fc]">{l.courseInterest}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => setFollow(l)}
              className="rounded-xl border border-[#f59e0b]/40 px-3 py-1.5 text-xs font-semibold text-[#fbbf24]"
            >
              Follow up
            </button>
          </div>
        ))}
      </div>

      {follow ? (
        <LeadFollowUpModal
          lead={follow}
          onClose={() => setFollow(null)}
          onSaved={() => {
            setFollow(null);
            void load();
          }}
        />
      ) : null}
    </div>
  );
}
