"use client";

import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";
import type { StaffTodo } from "@/lib/staff-types";

export default function StaffTodosPage() {
  const [items, setItems] = useState<StaffTodo[]>([]);
  const [title, setTitle] = useState("");

  const load = useCallback(async () => {
    const d = await staffFetch<{ items: StaffTodo[] }>("/api/staff/todos");
    setItems(d.items || []);
  }, []);

  useEffect(() => {
    void load().catch(() => undefined);
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await staffFetch("/api/staff/todos", {
      method: "POST",
      body: JSON.stringify({ title: title.trim() }),
    }, { successMessage: "To-do added" });
    setTitle("");
    await load();
  }

  async function toggle(t: StaffTodo) {
    await staffFetch(`/api/staff/todos/${t.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isDone: !t.isDone }),
    }, { suppressSuccessToast: true });
    await load();
  }

  async function remove(id: string) {
    await staffFetch(`/api/staff/todos/${id}`, { method: "DELETE" }, { successMessage: "Removed" });
    await load();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">To-do list</h1>
        <p className="text-sm text-white/50">Quick personal checklist for the day.</p>
      </div>
      <form onSubmit={(e) => void add(e)} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a to-do"
          className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[#0ea5e9]/50"
        />
        <button type="submit" className="rounded-xl bg-[#0ea5e9] px-4 py-2.5 text-sm font-semibold">Add</button>
      </form>
      <div className="grid gap-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <input type="checkbox" checked={t.isDone} onChange={() => void toggle(t)} className="h-4 w-4" />
            <span className={`flex-1 text-sm ${t.isDone ? "text-white/35 line-through" : ""}`}>{t.title}</span>
            <button type="button" onClick={() => void remove(t.id)} className="text-xs text-white/35 hover:text-red-300">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
