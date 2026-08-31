"use client";

import { useEffect, useState } from "react";
import { studioFetch } from "@/lib/studio-client";

type Job = {
  id: string;
  workflowType: string;
  prompt: string;
  status: string;
  errorMessage?: string;
  createdAt?: string;
};

export default function StudioGenerationsPage() {
  const [items, setItems] = useState<Job[]>([]);
  const [prompt, setPrompt] = useState("");
  const [workflowType, setWorkflowType] = useState("flux_schnell");
  const [busy, setBusy] = useState(false);

  async function load() {
    const data = await studioFetch<{ items: Job[] }>("/api/studio/generations");
    setItems(data.items);
  }

  useEffect(() => {
    void load().catch(() => undefined);
  }, []);

  async function queueJob(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setBusy(true);
    try {
      await studioFetch("/api/studio/generations/create", {
        method: "POST",
        body: JSON.stringify({ prompt, workflowType, params: { width: 1024, height: 1024 } }),
      });
      setPrompt("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-white">AI image generation</h1>
      <p className="mt-2 text-sm text-white/60">ComfyUI + FLUX.1 schnell · LoRA / ControlNet workflows for workbook visuals.</p>

      <form onSubmit={(e) => void queueJob(e)} className="mt-6 rounded-2xl border border-[#a78bfa]/25 bg-[#a78bfa]/10 p-4 space-y-3">
        <select value={workflowType} onChange={(e) => setWorkflowType(e.target.value)} className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm">
          <option value="flux_schnell">FLUX.1 schnell (fast)</option>
          <option value="flux_lora">FLUX + LoRA style</option>
          <option value="controlnet">ControlNet-style layout</option>
        </select>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe the workbook illustration — e.g. clean educational diagram of neural network layers, dotted handwriting lines, kid-friendly tech icons…"
          className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm"
          required
        />
        <button type="submit" disabled={busy} className="rounded-xl bg-[#7c3aed] px-4 py-2.5 text-sm font-semibold disabled:opacity-60">
          {busy ? "Queueing…" : "Generate with ComfyUI"}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {items.map((j) => (
          <div key={j.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-white">{j.prompt}</p>
              <span className="text-[10px] font-mono uppercase text-white/50">{j.status}</span>
            </div>
            <p className="text-xs text-white/40 mt-1">{j.workflowType}</p>
            {j.errorMessage ? <p className="text-xs text-red-300 mt-2">{j.errorMessage}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
