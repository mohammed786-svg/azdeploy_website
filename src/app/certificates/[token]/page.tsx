"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LandscapePrintShell from "@/components/hq/LandscapePrintShell";
import PrintShareActions from "@/components/hq/PrintShareActions";
import WorkshopCertificateDocument from "@/components/hq/WorkshopCertificateDocument";
import { fetchPublicWorkshopCertificate } from "@/lib/workshop-certificate-public";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";
import type { WorkshopCertificate } from "@/lib/workshop-certificate-types";

export default function PublicWorkshopCertificatePage() {
  const params = useParams();
  const token = typeof params.token === "string" ? params.token : "";
  const [item, setItem] = useState<WorkshopCertificate | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPublicWorkshopCertificate(token);
        if (!cancelled) setItem(data);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Certificate not found");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!item) return;
    const prev = document.title;
    const name = sanitizeForPdfFilename(item.studentName || "Student");
    document.title = `${name} — Certificate of Participation`;
    return () => {
      document.title = prev;
    };
  }, [item]);

  if (err || !item) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold text-neutral-900">Certificate not found</h1>
          <p className="mt-2 text-sm text-neutral-600">{err || "Loading…"}</p>
          <p className="mt-4 text-xs text-neutral-500">
            If you believe this is an error, contact AZ Deploy Academy at 82965 65587.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="print:m-0">
      <div className="print:hidden px-4 pt-4 max-w-4xl mx-auto">
        <PrintShareActions backHref="/" backLabel="← AZ Deploy Academy" />
        <p className="mt-2 text-sm text-neutral-700">
          Certificate for <strong>{item.studentName}</strong>. Use &quot;Download PDF / Print&quot; — choose{" "}
          <strong>Landscape</strong> if prompted (A4 horizontal).
        </p>
      </div>
      <LandscapePrintShell>
        <WorkshopCertificateDocument data={item} />
      </LandscapePrintShell>
    </div>
  );
}
