import { getSiteUrl } from "@/lib/site-url";
import type { BlogPostRow } from "@/lib/hq-blog-types";

type Props = {
  post: BlogPostRow;
};

export default function BlogPostingJsonLd({ post }: Props) {
  const base = getSiteUrl();
  const url = `${base}/blog/${encodeURIComponent(post.slug)}`;
  const image = post.coverImageUrl?.trim()
    ? post.coverImageUrl.trim()
    : `${base}/logo_gold.png`;
  const datePublished = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString();
  const dateModified = new Date(post.updatedAt).toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription?.trim() || post.excerpt,
    image: [image],
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: post.authorName || "AZ Deploy Academy",
    },
    publisher: {
      "@type": "Organization",
      name: "AZ Deploy Academy",
      logo: {
        "@type": "ImageObject",
        url: `${base}/logo_gold.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    keywords: post.keywords?.trim() || undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
