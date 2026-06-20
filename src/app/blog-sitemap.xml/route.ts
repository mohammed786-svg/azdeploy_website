import { getPublishedBlogPosts } from "@/lib/blog-public-data";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

function escapeXml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function safeIso(ms: number): string {
  const n = Number(ms);
  const d = Number.isFinite(n) && n > 0 ? new Date(n) : new Date();
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/** Dedicated blog sitemap for faster post discovery by search engines. */
export async function GET(): Promise<Response> {
  try {
    const base = getSiteUrl();
    const posts = await getPublishedBlogPosts();

    const urls: string[] = [
      `<url><loc>${escapeXml(`${base}/blog`)}</loc><lastmod>${safeIso(Date.now())}</lastmod><changefreq>weekly</changefreq><priority>0.88</priority></url>`,
    ];

    for (const p of posts) {
      const slug = String(p.slug || "").trim();
      if (!slug) continue;
      const loc = `${base}/blog/${encodeURIComponent(slug)}`;
      const updatedMs = Number(p.updatedAt) || Number(p.publishedAt) || Date.now();
      urls.push(
        `<url><loc>${escapeXml(loc)}</loc><lastmod>${safeIso(updatedMs)}</lastmod><changefreq>weekly</changefreq><priority>0.72</priority></url>`
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    const base = getSiteUrl();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${escapeXml(`${base}/blog`)}</loc><lastmod>${new Date().toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.88</priority></url>
</urlset>`;
    console.error("[blog-sitemap]", e);
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=60",
      },
    });
  }
}
