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

/** Dedicated blog sitemap for faster post discovery by search engines. */
export async function GET(): Promise<Response> {
  const base = getSiteUrl();
  const posts = await getPublishedBlogPosts();

  const urls = posts
    .map((p) => {
      const loc = `${base}/blog/${encodeURIComponent(p.slug)}`;
      const updatedMs = Number(p.updatedAt) || Number(p.publishedAt) || Date.now();
      const lastmod = new Date(updatedMs).toISOString();
      return `<url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.72</priority></url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
