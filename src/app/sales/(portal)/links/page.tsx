"use client";

import { useEffect, useState } from "react";
import { salesFetch } from "@/lib/sales-client";
import type { SalesLink } from "@/lib/ebook-portal-types";

export default function SalesLinksPage() {
  const [items, setItems] = useState<SalesLink[]>([]);
  const [label, setLabel] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const data = await salesFetch<{ items: SalesLink[] }>("/api/sales/links");
    setItems(data.items);
  }

  useEffect(() => {
    void load().catch(() => undefined);
  }, []);

  async function createLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await salesFetch("/api/sales/links/create", {
        method: "POST",
        body: JSON.stringify({ label: label.trim(), code: code.trim() || undefined }),
      });
      setLabel("");
      setCode("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-white">My referral links</h1>
      <p className="mt-2 text-sm text-white/60">Share on WhatsApp, Instagram, or Meta ads. Sales are attributed when buyers purchase via your link.</p>

      <form onSubmit={(e) => void createLink(e)} className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto] rounded-2xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 p-4">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (e.g. Instagram reel)" className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm" />
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Custom code (optional)" className="rounded-xl border border-white/15 bg-black/30 px-3 py-2.5 text-sm uppercase" />
        <button type="submit" disabled={busy} className="rounded-xl bg-[#fbbf24] px-4 py-2.5 text-sm font-semibold text-[#1a1200] disabled:opacity-60">
          Create link
        </button>
      </form>

      <div className="mt-6 space-y-3">
        {items.map((link) => (
          <div key={link.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{link.label || link.code}</p>
                <p className="text-xs text-white/50 mt-1">{link.ebookTitle}</p>
                <p className="mt-2 text-xs font-mono text-[#fde68a] break-all">{link.referralUrl}</p>
              </div>
              <div className="text-right text-xs text-white/50">
                <p>{link.clickCount} clicks</p>
                <p className="mt-1 font-mono">{link.code}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void copyUrl(link.referralUrl)}
              className="mt-3 rounded-lg border border-[#fbbf24]/40 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#fde68a] hover:bg-[#fbbf24]/10"
            >
              Copy link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
