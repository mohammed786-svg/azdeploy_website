import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/lib/blog-public-data";
import { CITY_LANDINGS, cityLandingUrl } from "@/lib/city-landing";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/home`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.88 },
    { url: `${baseUrl}/enquiry`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/enquiry/success`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/trainer`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const posts = await getPublishedBlogPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(p.slug)}`,
    lastModified: new Date(Number(p.updatedAt) || Number(p.publishedAt) || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.72,
  }));

  const cityEntries: MetadataRoute.Sitemap = CITY_LANDINGS.map((c) => ({
    url: `${baseUrl}${cityLandingUrl(c.slug)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.78,
  }));

  return [...staticEntries, ...cityEntries, ...blogEntries];
}
