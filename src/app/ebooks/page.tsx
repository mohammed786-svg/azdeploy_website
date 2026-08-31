import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import EbooksStoreClient from "@/components/ebooks/EbooksStoreClient";
import { fetchEbookCatalog, formatInr } from "@/lib/ebooks";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Job-Ready Tech Ebooks | AZ Deploy Academy",
  description:
    "Industry-ready workbook-style tech ebooks — AI Engineering, Data Science, Cyber Security, DevOps, Full Stack, DSA and more. From ₹2,999 via Razorpay. Read in your secure Library.",
  openGraph: {
    title: "Job-Ready Tech Ebooks — from ₹2,999",
    description:
      "Handwriting sheets, practice workbooks, and interview prep ebooks built for job-ready skills.",
  },
};

const FEATURES = [
  {
    title: "Workbook style",
    desc: "Not boring PDF notes — handwriting sheets, diagram pages, fill-in-the-blanks, and code trace exercises.",
  },
  {
    title: "Industry roadmap aligned",
    desc: "Topics mapped to real hiring skills: projects, checklists, interview Q&A, and mini-project trackers.",
  },
  {
    title: "Secure library access",
    desc: "Pay with Razorpay, then sign in with Google. Content stays in your Library — max 2 IPs, no PDF sharing.",
  },
];

export default async function EbooksPage() {
  const catalog = await fetchEbookCatalog();
  const prices = catalog.items.map((i) => i.priceInr).filter((n) => n > 0);
  const minPrice = prices.length ? Math.min(...prices) : catalog.defaultPriceInr || 2999;
  const maxPrice = prices.length ? Math.max(...prices) : 4999;
  const priceRangeLabel =
    minPrice === maxPrice ? formatInr(minPrice) : `${formatInr(minPrice)} – ${formatInr(maxPrice)}`;

  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="relative max-w-5xl mx-auto mb-10 sm:mb-14 rounded-2xl border border-[#00d4ff]/30 bg-gradient-to-br from-[#071321]/85 via-[#0b0b14]/90 to-[#1b1030]/80 p-5 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(0,212,255,0.12)]">
            <div className="absolute top-0 right-4 sm:right-6 -translate-y-1/2 rounded-full border border-[#ffd700]/45 bg-[#0f1320] px-3 py-1 shadow-[0_0_18px_rgba(255,215,0,0.22)]">
              <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-[#fde68a]">
                New · Student ebooks
              </p>
            </div>
            <p className="text-center text-[10px] sm:text-xs font-mono text-[#94a3b8] tracking-[0.22em] uppercase mb-2">
              AZ Deploy Academy
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] text-center leading-tight">
              Job-Ready Tech Playbooks
            </h1>
            <p className="mt-4 text-center text-sm sm:text-base text-white/85 max-w-3xl mx-auto leading-relaxed">
              Workbook-style ebooks for students — AI Engineering, Data Analytics, Cyber Security, DevOps, Android, iOS,
              Frontend, Backend, Full Stack, DSA and more. Built for industry skills, not theory dumps.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex rounded-full border border-[#00f5d4]/45 bg-[#00f5d4]/10 px-4 py-1.5 text-xs sm:text-sm font-mono text-[#86ffe7]">
                {priceRangeLabel}
              </span>
              <span className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs sm:text-sm font-mono text-white/70">
                Razorpay · Library access
              </span>
              <Link
                href="/library/login"
                className="inline-flex rounded-full border border-[#fde68a]/50 bg-[#fde68a]/10 px-4 py-1.5 text-xs sm:text-sm font-mono uppercase tracking-wider text-[#fde68a] hover:bg-[#fde68a]/20"
              >
                Customer login →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto mb-10 sm:mb-12">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 text-center md:text-left"
              >
                <h2 className="text-sm font-mono uppercase tracking-wider text-[#7dd3fc]">{f.title}</h2>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-glow-teal hud-label">[EBOOK_CATALOG]</h2>
            <p className="mt-2 text-sm text-white/65 font-mono">
              {catalog.items.length} tracks · ₹2,999 / ₹3,999 / ₹4,999 by demand · content updated step by step
            </p>
          </div>

          <EbooksStoreClient items={catalog.items} defaultPriceInr={catalog.defaultPriceInr || 2999} />
        </section>
      </main>
      <FloatingActions />
    </div>
  );
}
