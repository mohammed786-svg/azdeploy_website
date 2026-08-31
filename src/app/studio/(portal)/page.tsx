"use client";

import { useEffect, useState } from "react";
import { studioFetch } from "@/lib/studio-client";

type Dashboard = {
  activeEbooks: number;
  projects: number;
  pages: number;
  jobsQueued: number;
  jobsRunning: number;
  jobsCompleted: number;
};

export default function StudioDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    void studioFetch<Dashboard>("/api/studio/dashboard").then(setData).catch(() => undefined);
  }, []);

  const cards = [
    { label: "Active ebooks", value: data?.activeEbooks ?? "—", color: "#00d4ff" },
    { label: "Projects", value: data?.projects ?? "—", color: "#a78bfa" },
    { label: "Pages drafted", value: data?.pages ?? "—", color: "#22c55e" },
    { label: "AI jobs queued", value: data?.jobsQueued ?? "—", color: "#fbbf24" },
    { label: "AI jobs running", value: data?.jobsRunning ?? "—", color: "#f97316" },
    { label: "AI jobs done", value: data?.jobsCompleted ?? "—", color: "#86efac" },
  ];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Studio dashboard</h1>
      <p className="mt-2 text-sm text-white/60 max-w-2xl">
        Build industry-ready workbook ebooks with ComfyUI + FLUX.1 schnell. HQ controls pricing and catalog visibility — you focus on content quality.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-mono uppercase tracking-wider text-white/50">{c.label}</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: c.color }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl border border-[#a78bfa]/25 bg-[#a78bfa]/10 p-5">
        <h2 className="text-sm font-semibold text-[#ddd6fe]">Workflow stack</h2>
        <p className="mt-2 text-sm text-white/75 leading-relaxed">
          ComfyUI · FLUX.1 schnell · LoRA / ControlNet-style workflows for handwriting sheets, diagrams, and practice pages.
        </p>
      </div>
    </div>
  );
}
