"use client";

import { useEffect, useState } from "react";
import { studioFetch } from "@/lib/studio-client";

export default function StudioEbooksPage() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    void studioFetch<{ items: Array<Record<string, unknown>> }>("/api/studio/ebooks")
      .then((d) => setItems(d.items))
      .catch(() => undefined);
  }, []);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-white">Ebook catalog</h1>
      <p className="mt-2 text-sm text-white/60">Read-only view. Price and active/inactive are controlled from HQ only.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((e) => (
          <div key={String(e.id)} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-semibold text-white">{String(e.title)}</p>
            <p className="text-xs text-white/50 mt-1">{String(e.subtitle || "")}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono uppercase">
              <span className={`rounded-full px-2 py-0.5 border ${e.isActive ? "border-emerald-400/40 text-emerald-300" : "border-red-400/40 text-red-300"}`}>
                {e.isActive ? "active" : "inactive"}
              </span>
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-white/50">{String(e.workbookStyle)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
