"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import WorkshopCertificateEditor, { formFromCertificate } from "@/components/hq/WorkshopCertificateEditor";
import type { WorkshopCertificate } from "@/lib/workshop-certificate-types";

export default function EditWorkshopCertificatePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<WorkshopCertificate | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await hqFetch<{ item: WorkshopCertificate }>(`/api/hq/workshop-certificates/${id}`);
        if (!cancelled) setItem(data.item);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load certificate");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (err) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 text-red-300">
        {err}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 text-[#94a3b8]">
        Loading…
      </div>
    );
  }

  return (
    <WorkshopCertificateEditor
      certificateId={item.id}
      initialForm={formFromCertificate(item)}
      publicUrl={item.publicUrl}
    />
  );
}
