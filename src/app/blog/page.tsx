import type { Metadata } from "next";
import Link from "next/link";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import { getPublishedBlogPosts } from "@/lib/blog-public-data";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 120;

const BLOG_INDEX_DESC =
  "Insights on Python Full Stack, Android, DevOps, and job-ready IT training from AZ Deploy Academy trainers.";

export const metadata: Metadata = {
  title: "Blog",
  description: BLOG_INDEX_DESC,
  alternates: {
    canonical: `${getSiteUrl()}/blog`,
  },
  openGraph: {
    title: "Blog | AZ Deploy Academy",
    description: "Articles on full-stack development, Android, and building a career in IT.",
    url: `${getSiteUrl()}/blog`,
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();
  const base = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AZ Deploy Academy Blog",
    description: BLOG_INDEX_DESC,
    url: `${base}/blog`,
    publisher: {
      "@type": "Organization",
      name: "AZ Deploy Academy",
      url: base,
    },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${base}/blog/${encodeURIComponent(p.slug)}`,
      datePublished: p.publishedAt ? new Date(p.publishedAt).toISOString() : undefined,
    })),
  };

  return (
    <div className="min-h-screen hud-bg hud-grid">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-[min(100%,520px)] rounded-full bg-[#00d4ff]/[0.07] blur-[80px]" />
          <p className="text-center text-[10px] sm:text-xs font-mono tracking-[0.35em] text-[#00d4ff]/80 uppercase mb-3">
            [ INSIGHTS & UPDATES ]
          </p>
          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white text-glow-teal tracking-tight">
            Academy Blog
          </h1>
          <p className="mt-4 text-center text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Practical notes on Python, Django, React, Android, Linux, and becoming job-ready—written by trainers who ship
            real products.
          </p>
        </section>

        {posts.length === 0 ? (
          <section className="max-w-lg mx-auto px-4 text-center">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-12">
              <p className="text-[#94a3b8] font-mono text-sm">New articles are on the way. Check back soon.</p>
              <Link
                href="/courses"
                className="inline-block mt-6 text-[#00d4ff] text-sm font-mono uppercase tracking-wider hover:underline"
              >
                View courses →
              </Link>
            </div>
          </section>
        ) : (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
            <ul className="grid gap-6 sm:gap-8">
              {posts.map((p) => {
                const href = `/blog/${encodeURIComponent(p.slug)}`;
                const date = p.publishedAt ?? p.updatedAt;
                const dateStr = date
                  ? new Date(date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "";
                const readMin = p.readingTimeMin ?? 1;
                return (
                  <li key={p.id}>
                    <article className="group relative rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-transparent overflow-hidden transition-all duration-300 hover:border-[#00d4ff]/25 hover:shadow-[0_0_40px_-12px_rgba(0,212,255,0.35)]">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-[#00d4ff]/[0.04] via-transparent to-[#a78bfa]/[0.05] pointer-events-none" />
                      <Link href={href} className="flex flex-col sm:flex-row gap-0 sm:gap-6 p-5 sm:p-7">
                        <div className="relative w-full sm:w-[220px] shrink-0 aspect-[16/10] sm:aspect-auto sm:h-[140px] rounded-xl overflow-hidden bg-[#0a0a12] border border-white/[0.06]">
                          {p.coverImageUrl?.trim() ? (
                            // eslint-disable-next-line @next/next/no-img-element -- user-supplied cover URLs (any host)
                            <img
                              src={p.coverImageUrl.trim()}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#050508]">
                              <span className="text-[10px] font-mono text-[#475569] tracking-widest">AZ_DEPLOY</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-4 sm:pt-0 flex flex-col justify-center">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-[#64748b] mb-2">
                            {dateStr && <time dateTime={new Date(date!).toISOString()}>{dateStr}</time>}
                            <span className="text-white/20">·</span>
                            <span>{readMin} min read</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#7dd3fc] transition-colors leading-snug">
                            {p.title}
                          </h2>
                          <p className="mt-2 text-sm sm:text-[15px] text-[#94a3b8] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                            {p.excerpt}
                          </p>
                          <span className="mt-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00d4ff]">
                            Read article
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
      <FloatingActions />
    </div>
  );
}
