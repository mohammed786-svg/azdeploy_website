"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { libraryFetch } from "@/lib/library-client";
import { formatInr } from "@/lib/ebooks";
import { useLibraryTheme } from "@/components/library/LibraryShell";

type Purchase = {
  orderRef: string;
  amountInr: number;
  paidAt?: string;
  slug: string;
  title: string;
  subtitle: string;
  coverAccent: string;
  viewInLibrary: boolean;
};

export default function LibraryHomePage() {
  const { theme } = useLibraryTheme();
  const dark = theme === "dark";
  const [items, setItems] = useState<Purchase[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    void libraryFetch<{ items: Purchase[] }>("/api/library/purchases")
      .then((d) => setItems(d.items))
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl sm:text-3xl font-bold">My purchased ebooks</h1>
      <p className={`mt-2 text-sm max-w-2xl ${dark ? "text-white/60" : "text-slate-600"}`}>
        Content opens inside this dashboard only. PDF download is disabled. Use the same Google email as checkout. Max 2 IPs.
      </p>

      {err ? <p className="mt-4 text-sm text-red-500">{err}</p> : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((p) => (
          <div
            key={p.orderRef}
            className={`rounded-2xl border p-5 ${dark ? "border-white/10 bg-white/[0.03]" : "border-slate-200 bg-white shadow-sm"}`}
          >
            <div className="h-1 w-16 rounded-full mb-3" style={{ background: p.coverAccent }} />
            <h2 className="text-lg font-semibold">{p.title}</h2>
            {p.subtitle ? <p className={`mt-1 text-sm ${dark ? "text-white/55" : "text-slate-500"}`}>{p.subtitle}</p> : null}
            <p className={`mt-3 text-xs font-mono ${dark ? "text-white/40" : "text-slate-400"}`}>
              {p.orderRef} · {formatInr(p.amountInr)}
            </p>
            {p.viewInLibrary ? (
              <Link
                href={`/library/ebooks/${p.slug}`}
                className={`mt-4 inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  dark ? "bg-sky-500 text-white" : "bg-sky-600 text-white"
                }`}
              >
                Open in library
              </Link>
            ) : (
              <p className={`mt-4 text-sm ${dark ? "text-amber-200/80" : "text-amber-700"}`}>Viewer coming soon for this title.</p>
            )}
          </div>
        ))}
      </div>

      {!items.length && !err ? (
        <div className={`mt-8 rounded-2xl border p-6 text-sm ${dark ? "border-white/10 text-white/60" : "border-slate-200 text-slate-600"}`}>
          No purchases yet for this Google email.{" "}
          <Link href="/ebooks" className="text-sky-600 underline">
            Browse ebooks
          </Link>{" "}
          and checkout with this same email.
        </div>
      ) : null}
    </div>
  );
}
