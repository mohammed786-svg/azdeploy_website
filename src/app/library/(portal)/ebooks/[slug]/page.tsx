"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AiEngineeringEbook from "@/components/ebooks/AiEngineeringEbook";
import { libraryFetch } from "@/lib/library-client";
import { useLibraryTheme } from "@/components/library/LibraryShell";

type Access = {
  allowed: boolean;
  slug: string;
  title: string;
  orderRef: string;
  viewOnly: boolean;
  downloadAllowed: boolean;
};

export default function LibraryEbookReaderPage() {
  const params = useParams();
  const slug = String(params.slug || "");
  const { theme } = useLibraryTheme();
  const dark = theme === "dark";
  const [access, setAccess] = useState<Access | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await libraryFetch<Access>(`/api/library/ebooks/${encodeURIComponent(slug)}`);
        if (!cancelled) setAccess(data);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Access denied");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <p className={`text-sm ${dark ? "text-white/50" : "text-slate-500"}`}>Checking purchase…</p>;
  }

  if (err || !access?.allowed) {
    return (
      <div className="max-w-lg">
        <p className="text-sm text-red-500">{err || "Not authorized"}</p>
        <Link href="/library" className="mt-4 inline-block text-sm text-sky-600 underline">
          ← Back to library
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      <div className="px-4 sm:px-6 lg:px-8 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/library" className={`text-sm ${dark ? "text-sky-300" : "text-sky-700"}`}>
            ← My library
          </Link>
          <h1 className="mt-1 text-xl font-bold">{access.title}</h1>
        </div>
        <p className={`text-xs font-mono ${dark ? "text-white/40" : "text-slate-400"}`}>View only · no download</p>
      </div>
      {slug === "ai-engineering" ? (
        <AiEngineeringEbook orderRef={access.orderRef} viewOnly />
      ) : (
        <p className="px-8 text-sm">Viewer not available for this title yet.</p>
      )}
    </div>
  );
}
