"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hqFetch } from "@/lib/hq-client";
import LandscapePrintShell from "@/components/hq/LandscapePrintShell";
import PrintShareActions from "@/components/hq/PrintShareActions";
import WorkshopCertificateDocument from "@/components/hq/WorkshopCertificateDocument";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";
import type { WorkshopCertificate } from "@/lib/workshop-certificate-types";

export default function HqWorkshopCertificatePrintPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [item, setItem] = useState<WorkshopCertificate | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const data = await hqFetch<{ item: WorkshopCertificate }>(`/api/hq/workshop-certificates/${id}`);
    setItem(data.item);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Failed to load certificate");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, load]);

  useEffect(() => {
    if (!item) return;
    const prev = document.title;
    const name = sanitizeForPdfFilename(item.studentName || "Student");
    document.title = `${name} — Workshop Certificate`;
    return () => {
      document.title = prev;
    };
  }, [item]);

  if (err || !item) {
    return (
      <LandscapePrintShell>
        <p className="p-6 text-red-700">{err || "Loading…"}</p>
        <Link href="/hq/workshop-certificates" className="px-6 text-blue-700 text-sm print:hidden">
          Back
        </Link>
      </LandscapePrintShell>
    );
  }

  const publicUrl =
    typeof window !== "undefined" ? `${window.location.origin}${item.publicUrl}` : item.publicUrl;

  return (
    <div className="print:m-0">
      <div className="print:hidden px-4 pt-4">
        <PrintShareActions
          backHref="/hq/workshop-certificates"
          backLabel="← Back to certificates"
          whatsappMessage={`Your workshop certificate from AZ Deploy Academy is ready:\n${publicUrl}`}
        />
        <p className="mt-2 text-sm text-neutral-600">
          Use <strong>Download PDF / Print</strong> — choose <strong>Landscape</strong> if prompted. Exports as A4 horizontal only.
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          Student link:{" "}
          <a href={item.publicUrl} className="text-blue-700 underline" target="_blank" rel="noreferrer">
            {publicUrl}
          </a>
        </p>
      </div>
      <LandscapePrintShell>
        <WorkshopCertificateDocument data={item} />
      </LandscapePrintShell>
    </div>
  );
}
