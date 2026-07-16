import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/hq", "/proposal"],
    },
    sitemap: [`${base}/sitemap.xml`, `${base}/blog-sitemap.xml`],
  };
}
