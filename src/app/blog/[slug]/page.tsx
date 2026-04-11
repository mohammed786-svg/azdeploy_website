import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import BlogMarkdown from "@/components/blog/BlogMarkdown";
import BlogPostingJsonLd from "@/components/blog/BlogPostingJsonLd";
import { getPublishedPostBySlug } from "@/lib/blog-public-data";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params;
  const post = await getPublishedPostBySlug(decodeURIComponent(raw));
  if (!post) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }
  const base = getSiteUrl();
  const url = `${base}/blog/${encodeURIComponent(post.slug)}`;
  const title = post.seoTitle?.trim() || post.title;
  const description = post.seoDescription?.trim() || post.excerpt;
  const ogImage = post.coverImageUrl?.trim() || `${base}/logo_gold.png`;
  const kw = post.keywords
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    title,
    description,
    keywords: kw,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      modifiedTime: new Date(post.updatedAt).toISOString(),
      images: [{ url: ogImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug: raw } = await params;
  const post = await getPublishedPostBySlug(decodeURIComponent(raw));
  if (!post) notFound();

  const base = getSiteUrl();
  const url = `${base}/blog/${encodeURIComponent(post.slug)}`;
  const date = post.publishedAt ?? post.updatedAt;
  const dateIso = date ? new Date(date).toISOString() : undefined;
  const readMin = post.readingTimeMin ?? 1;

  return (
    <div className="min-h-screen hud-bg hud-grid">
      <BlogPostingJsonLd post={post} />
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8" itemScope itemType="https://schema.org/BlogPosting">
          <meta itemProp="headline" content={post.title} />
          {dateIso && <meta itemProp="datePublished" content={dateIso} />}
          <meta itemProp="dateModified" content={new Date(post.updatedAt).toISOString()} />
          <link itemProp="url" href={url} />

          <nav className="text-[11px] font-mono text-[#64748b] mb-8" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#00d4ff] transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-white/25">
                /
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#00d4ff] transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden className="text-white/25">
                /
              </li>
              <li className="text-[#94a3b8] truncate max-w-[min(100%,240px)]">{post.title}</li>
            </ol>
          </nav>

          <header className="mb-10">
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#00d4ff]/80 uppercase mb-3">Article</p>
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white leading-tight tracking-tight text-glow-teal">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#94a3b8]">
              {post.authorName && (
                <span className="font-mono text-[#cbd5e1]" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{post.authorName}</span>
                </span>
              )}
              {date && (
                <time dateTime={dateIso} className="font-mono text-xs text-[#64748b]">
                  {new Date(date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              )}
              <span className="text-[#475569]">·</span>
              <span className="font-mono text-xs text-[#64748b]">{readMin} min read</span>
            </div>
            {post.coverImageUrl?.trim() && (
              <div className="mt-8 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a12] aspect-[2/1] max-h-[420px]">
                {/* eslint-disable-next-line @next/next/no-img-element -- external cover URL */}
                <img
                  src={post.coverImageUrl.trim()}
                  alt=""
                  className="w-full h-full object-cover"
                  itemProp="image"
                />
              </div>
            )}
            <p className="mt-8 text-lg text-[#94a3b8] leading-relaxed border-l-2 border-[#00d4ff]/40 pl-5" itemProp="description">
              {post.excerpt}
            </p>
          </header>

          <div className="border-t border-white/[0.06] pt-10" itemProp="articleBody">
            <BlogMarkdown content={post.body} />
          </div>

          <footer className="mt-16 pt-10 border-t border-white/[0.06]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-[#00d4ff] hover:text-[#7dd3fc] transition-colors"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              All articles
            </Link>
          </footer>
        </article>
      </main>
      <FloatingActions />
    </div>
  );
}
