"use client";

import { useEffect, useRef, useState } from "react";
import { COMPANY_PROFILE_TOKEN } from "@/lib/company-profile";

type Kind = "g" | "u";

export default function ProtectedPdfViewer({
  kind,
  title,
}: {
  kind: Kind;
  title: string;
}) {
  const [src, setSrc] = useState("");
  const [err, setErr] = useState("");
  const blobUrl = useRef("");

  useEffect(() => {
    let cancelled = false;
    setErr("");
    setSrc("");

    (async () => {
      try {
        const res = await fetch(`/api/p/${COMPANY_PROFILE_TOKEN}/doc?k=${kind}`, {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!res.ok) throw new Error("Document unavailable");
        const blob = await res.blob();
        if (cancelled) return;
        if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
        blobUrl.current = URL.createObjectURL(blob);
        setSrc(blobUrl.current);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load");
      }
    })();

    return () => {
      cancelled = true;
      if (blobUrl.current) {
        URL.revokeObjectURL(blobUrl.current);
        blobUrl.current = "";
      }
    };
  }, [kind]);

  function block(e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div
      className="relative h-[268mm] w-full overflow-hidden bg-neutral-100 select-none"
      onContextMenu={block}
      onDragStart={block}
      onCopy={block}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-amber-100 px-3 py-1.5 text-center text-[10px] font-semibold uppercase tracking-wide text-amber-900">
        {title} · View only · Download disabled
      </div>
      {err ? (
        <p className="absolute inset-0 z-10 flex items-center justify-center text-sm text-red-700">{err}</p>
      ) : null}
      {src ? (
        <iframe
          title={title}
          src={`${src}#toolbar=0&navpanes=0&scrollbar=1&zoom=page-fit`}
          className="absolute inset-0 h-full w-full border-0 pt-7 pointer-events-none"
          sandbox="allow-same-origin"
        />
      ) : !err ? (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">Loading document…</p>
      ) : null}
      <div
        className="absolute inset-0 z-30 cursor-default"
        onContextMenu={block}
        onDoubleClick={block}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-[0.07]">
        <p className="rotate-[-28deg] text-4xl font-bold tracking-[0.3em] text-neutral-900">AZDEPLOY · VIEW ONLY</p>
      </div>
    </div>
  );
}
