"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { studioFetch } from "@/lib/studio-client";

export default function StudioProjectDetailPage() {
  const params = useParams();
  const projectId = String(params.id || "");
  const [project, setProject] = useState<Record<string, unknown> | null>(null);
  const [pages, setPages] = useState<Array<Record<string, unknown>>>([]);
  const [pageTitle, setPageTitle] = useState("");
  const [pageType, setPageType] = useState("worksheet");

  async function load() {
    const data = await studioFetch<{ project: Record<string, unknown>; pages: Array<Record<string, unknown>> }>(
      `/api/studio/projects/${projectId}`
    );
    setProject(data.project);
    setPages(data.pages);
  }

  useEffect(() => {
    if (projectId) void load().catch(() => undefined);
  }, [projectId]);

  async function addPage(e: React.FormEvent) {
    e.preventDefault();
    await studioFetch(`/api/studio/projects/${projectId}/pages`, {
      method: "POST",
      body: JSON.stringify({ title: pageTitle, pageType }),
    });
    setPageTitle("");
    await load();
  }

  if (!project) return <p className="text-white/60 text-sm">Loading project…</p>;

  return (
    <div className="max-w-5xl">
      <p className="text-xs font-mono uppercase tracking-wider text-[#c4b5fd]">{String(project.ebookTitle)}</p>
      <h1 className="text-2xl font-bold text-white mt-1">{String(project.title)}</h1>
      <p className="text-sm text-white/50 mt-1">Status: {String(project.status)}</p>

      <form onSubmit={(e) => void addPage(e)} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto] rounded-2xl border border-white/10 p-4">
        <input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="Page title" className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm" required />
        <select value={pageType} onChange={(e) => setPageType(e.target.value)} className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm">
          <option value="cover">Cover</option>
          <option value="content">Content</option>
          <option value="worksheet">Worksheet</option>
          <option value="diagram">Diagram</option>
          <option value="interview">Interview Q&A</option>
          <option value="checklist">Checklist</option>
        </select>
        <button type="submit" className="rounded-xl bg-[#7c3aed] px-4 py-2 text-sm font-semibold">Add page</button>
      </form>

      <div className="mt-6 space-y-2">
        {pages.map((p) => (
          <div key={String(p.id)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">
                #{String(p.pageNo)} · {String(p.title || "Untitled")}
              </p>
              <p className="text-xs text-white/50">{String(p.pageType)}</p>
            </div>
            <span className="text-[10px] font-mono uppercase text-white/45">{String(p.status)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
