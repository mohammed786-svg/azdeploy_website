import { resolveApiOrigin } from "@/lib/api-http";
import type { WorkshopCertificate } from "@/lib/workshop-certificate-types";

export async function fetchPublicWorkshopCertificate(token: string): Promise<WorkshopCertificate> {
  const base = resolveApiOrigin();
  const res = await fetch(`${base}/api/v1/public/workshop-certificates/${encodeURIComponent(token)}`, {
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.data?.item) {
    throw new Error(json?.message || "Certificate not found");
  }
  return json.data.item as WorkshopCertificate;
}
