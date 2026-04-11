export type BlogPostRecord = {
  title: string;
  slug: string;
  excerpt: string;
  /** Markdown body (rendered with react-markdown + sanitize). */
  body: string;
  coverImageUrl?: string;
  published: boolean;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
  authorName?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** Comma-separated keywords for meta + internal use */
  keywords?: string;
  readingTimeMin?: number;
};

export type BlogPostRow = { id: string } & BlogPostRecord;
