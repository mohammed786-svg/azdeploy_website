/** Frontend-delivered ebooks (HTML/A4 → customer Save as PDF). No server PDF file required. */
export const FRONTEND_EBOOK_SLUGS = ["ai-engineering"] as const;

export type FrontendEbookSlug = (typeof FRONTEND_EBOOK_SLUGS)[number];

export function isFrontendEbook(slug: string): slug is FrontendEbookSlug {
  return (FRONTEND_EBOOK_SLUGS as readonly string[]).includes(slug);
}

export function ebookDownloadPath(opts: {
  token: string;
  slug: string;
  order?: string;
  title?: string;
}): string {
  const q = new URLSearchParams({
    token: opts.token,
    slug: opts.slug,
  });
  if (opts.order) q.set("order", opts.order);
  if (opts.title) q.set("title", opts.title);
  return `/ebooks/download?${q.toString()}`;
}
