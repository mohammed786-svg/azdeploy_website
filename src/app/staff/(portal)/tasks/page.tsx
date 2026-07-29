"use client";

import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffTask } from "@/lib/staff-types";
import { formatStaffTime } from "@/lib/staff-types";

const STATUSES = ["todo", "in_progress", "blocked", "done"];
const PRIORITIES = ["low", "medium", "high", "urgent"];

export default function StaffTasksPage() {
  const [items, setItems] = useState<StaffTask[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const q = filter ? `?status=${encodeURIComponent(filter)}` : "";
    const d = await staffFetch<{ items: StaffTask[] }>(`/api/staff/tasks${q}`);
    setItems(d.items || []);
  }, [filter]);

  useEffect(() => {
    void load().catch(() => undefined);
  }, [load]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    try {
      await staffFetch(
        "/api/staff/tasks",
        { method: "POST", body: JSON.stringify({ title: title.trim(), priority }) },
        { successMessage: "Task added" }
      );
      setTitle("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: string, status: string) {
    await staffFetch(`/api/staff/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }, { successMessage: "Updated" });
    await load();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-sm text-white/50">End-to-end task board for your role.</p>
      </div>

      <form onSubmit={(e) => void addTask(e)} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[#0ea5e9]/50"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button type="submit" disabled={busy} className="rounded-xl bg-[#0ea5e9] px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setFilter("")} className={`rounded-full px-3 py-1 text-xs ${!filter ? "bg-[#0ea5e9]/20 text-[#7dd3fc]" : "border border-white/15 text-white/50"}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} type="button" onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs ${filter === s ? "bg-[#0ea5e9]/20 text-[#7dd3fc]" : "border border-white/15 text-white/50"}`}>
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{t.title}</p>
                {t.description ? <p className="mt-1 text-sm text-white/50">{t.description}</p> : null}
                <p className="mt-2 text-xs text-white/40">
                  {t.priority} · {t.status}
                  {t.dueAt ? ` · due ${formatStaffTime(t.dueAt)}` : ""}
                </p>
              </div>
              <select
                value={t.status}
                onChange={(e) => void setStatus(t.id, e.target.value)}
                className="rounded-lg border border-white/15 bg-black/40 px-2 py-1.5 text-xs"
              >
                {[...STATUSES, "cancelled"].map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {items.length === 0 ? <p className="text-sm text-white/45">No tasks yet.</p> : null}
      </div>
    </div>
  );
}
