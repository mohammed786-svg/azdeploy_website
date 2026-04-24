/** Canonical site origin for SEO (Open Graph, JSON-LD, sitemap). Set `NEXT_PUBLIC_SITE_URL` in production. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://azdeploy.com";
  return raw.replace(/\/$/, "");
}
