"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { studioFetch } from "@/lib/studio-client";
import type { StudioProject } from "@/lib/ebook-portal-types";

export default function StudioProjectsPage() {
  const [items, setItems] = useState<StudioProject[]>([]);
  const [title, setTitle] = useState("");
  const [ebookId, setEbookId] = useState("");
  const [ebooks, setEbooks] = useState<{ id: string; title: string }[]>([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const [projects, catalog] = await Promise.all([
      studioFetch<{ items: StudioProject[] }>("/api/studio/projects"),
      studioFetch<{ items: { id: string; title: string }[] }>("/api/studio/ebooks"),
    ]);
    setItems(projects.items);
    setEbooks(catalog.items);
    if (!ebookId && catalog.items[0]) setEbookId(catalog.items[0].id);
  }

  useEffect(() => {
    void load().catch(() => undefined);
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !ebookId) return;
    setBusy(true);
    try {
      await studioFetch("/api/studio/projects/create", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), ebookId }),
      });
      setTitle("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-white">Content projects</h1>
      <p className="mt-2 text-sm text-white/60">One project per ebook edition — pages, worksheets, and AI-generated visuals.</p>

      <form onSubmit={(e) => void createProject(e)} className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto] rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm" />
        <select value={ebookId} onChange={(e) => setEbookId(e.target.value)} className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm">
          {ebooks.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        <button type="submit" disabled={busy} className="rounded-xl bg-[#7c3aed] px-4 py-2.5 text-sm font-semibold disabled:opacity-60">
          New project
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/studio/projects/${p.id}`}
            className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-[#a78bfa]/40 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-white">{p.title}</p>
                <p className="text-xs text-white/50 mt-1">{p.ebookTitle}</p>
              </div>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/60">
                {p.status}
              </span>
            </div>
          </Link>
        ))}
        {items.length === 0 ? <p className="text-sm text-white/50">No projects yet.</p> : null}
      </div>
    </div>
  );
}
