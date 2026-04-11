'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ACADEMY_CONTACT_NUMBERS, ACADEMY_OFFICE, academyGoogleMapsUrl } from '@/lib/contact-info';

const SERVICES_DETAIL = [
  {
    title: "JOB_READY_TRAINING",
    desc: "Placement-oriented curriculum with real projects, real stacks, real deployments. Resume & interview prep. We focus on what companies actually need—not just certificates.",
    points: ["Live projects from day one", "Resume & LinkedIn optimization", "Mock interviews with feedback", "Placement support & referrals"],
  },
  {
    title: "INDUSTRY_MENTORSHIP",
    desc: "Trainers with 8+ years experience and 500+ products deployed. One-on-one doubt clearing, code reviews, career guidance.",
    points: ["1:1 doubt clearing sessions", "Code reviews on real projects", "Career roadmap guidance", "Industry insider tips"],
  },
  {
    title: "FUNDAMENTALS_FIRST",
    desc: "Master concepts before relying on AI. Strong basics, debugging skills, problem-solving focus. Use your brain, then boost with AI.",
    points: ["Deep dive into core concepts", "Debugging & troubleshooting", "Problem-solving frameworks", "Build intuition, then use AI"],
  },
  {
    title: "LIMITED_BATCHES",
    desc: "Morning 9AM–11AM, Afternoon 3PM–5PM, Evening 6PM–8PM. Up to 30 students per batch. First 10 students get 30% off. Top performer wins MacBook Pro.",
    points: ["30 students per batch", "Batch timings: morning / afternoon / evening", "30% off for first 10 students", "MacBook Pro for top performer", "Quality over quantity"],
  },
];

const PROGRAM_COURSE = {
  name: "Full-Stack + AI + DevOps — All-in-One",
  tag: "6 months · One program · Pick your focus",
  fullDesc:
    "Not just another course. Become a real software engineer: build production-level systems, work on live startup projects, learn complete system architecture, hands-on deployment, train like real software engineers — not Todo apps.",
  topics: [
    "Development: React / Modern UI · Django / APIs / System Design · PostgreSQL / Optimization",
    "DevOps & Systems: Linux (server level) · Nginx · Docker & CI/CD · Deployment VPS (AWS)",
    "AI & Data: AI+ real use cases · Data engineering fundamentals",
  ],
  bullets: [
    "Learn. Build. Deploy. Scale. Get hired.",
    "30% off for first 10 students · MacBook Pro for top performer",
    "First time in Belagavi · www.azdeploy.com",
  ],
};

const WHY_AZDEPLOY = [
  "8+ years industry experience, 500+ products deployed",
  "Real deployments—not just tutorials",
  "Avoid fake teachers who sell courses without shipping software",
  "Think first, AI second—master fundamentals",
  "Interview secrets & placement focus",
  "Limited batches for quality learning",
];

const TOTAL_PAGES = 6;

function PageCover() {
  return (
    <div className="brochure-page-content p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-full text-center box-border">
      <p className="text-xs sm:text-sm md:text-base font-mono font-bold tracking-[0.2em] text-[#00d4ff] mb-3 sm:mb-4">AZCRASH 1.0</p>
      <p className="text-[10px] sm:text-xs text-[#94a3b8] font-mono uppercase tracking-widest mb-2">Not just another course</p>
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white text-glow-teal mb-2 px-1 leading-tight">
        Become a Real Software Engineer in 6 Months
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-[#00d4ff] font-mono mb-1">AZ DEPLOY ACADEMY</p>
      <p className="text-xs sm:text-sm text-[#ffd700] font-mono mb-3">First time in Belagavi</p>
      <p className="text-xs sm:text-sm text-white/70 max-w-full mb-2 px-1">
        Full-Stack + AI + DevOps — all-in-one. Learn. Build. Deploy. Scale. Get hired.
      </p>
      <p className="text-[10px] sm:text-xs text-[#00d4ff]/80 font-mono">— BROCHURE —</p>
      <p className="text-[10px] text-white/50 mt-2 sm:mt-4">One ongoing program · Belagavi</p>
    </div>
  );
}

function PageServices() {
  return (
    <div className="brochure-page-content p-3 sm:p-4 md:p-6 min-h-full box-border">
      <h2 className="text-[#00d4ff] text-sm sm:text-base md:text-lg font-mono border-b border-[#00d4ff]/30 pb-1.5 sm:pb-2 mb-3 sm:mb-4">[OUR_SERVICES]</h2>
      <ul className="space-y-3 sm:space-y-4">
        {SERVICES_DETAIL.map((s) => (
          <li key={s.title}>
            <h3 className="text-white font-semibold text-xs sm:text-sm font-mono mb-0.5 sm:mb-1">{s.title}</h3>
            <p className="text-white/70 text-[10px] sm:text-xs leading-relaxed mb-1 sm:mb-2">{s.desc}</p>
            <ul className="text-[10px] sm:text-xs text-[#00d4ff]/90 font-mono space-y-0.5">
              {s.points.map((pt) => (
                <li key={pt}>▸ {pt}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PageCourses() {
  return (
    <div className="brochure-page-content p-3 sm:p-4 md:p-6 min-h-full box-border">
      <h2 className="text-[#00d4ff] text-sm sm:text-base md:text-lg font-mono border-b border-[#00d4ff]/30 pb-1.5 sm:pb-2 mb-3 sm:mb-4">[COURSES]</h2>
      <div className="space-y-4 sm:space-y-5">
        <div>
          <span className="text-[#00e5cc] text-[10px] font-mono">{PROGRAM_COURSE.tag}</span>
          <h3 className="text-white font-semibold text-sm sm:text-base">{PROGRAM_COURSE.name}</h3>
          <p className="text-white/70 text-[10px] sm:text-xs mt-0.5 sm:mt-1 mb-1 sm:mb-2">{PROGRAM_COURSE.fullDesc}</p>
          <p className="text-[10px] text-[#00d4ff]/80 font-mono mb-0.5 sm:mb-1">What you will master:</p>
          <ul className="text-[10px] text-white/60 space-y-0.5 mb-1 sm:mb-2">
            {PROGRAM_COURSE.topics.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
          <ul className="text-[10px] text-[#00d4ff]/90 font-mono">
            {PROGRAM_COURSE.bullets.map((b) => (
              <li key={b}>▸ {b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PageWhy() {
  return (
    <div className="brochure-page-content p-3 sm:p-4 md:p-6 min-h-full box-border">
      <h2 className="text-[#00d4ff] text-sm sm:text-base md:text-lg font-mono border-b border-[#00d4ff]/30 pb-1.5 sm:pb-2 mb-3 sm:mb-4">[WHY_AZDEPLOY]</h2>
      <ul className="space-y-2 sm:space-y-3">
        {WHY_AZDEPLOY.map((item) => (
          <li key={item} className="flex items-start gap-2 text-white/80 text-[10px] sm:text-xs md:text-sm">
            <span className="text-[#00d4ff] mt-0.5 shrink-0">▸</span>
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 sm:mt-6 text-[10px] text-white/50 font-mono">
        Trainer: 8+ years | 500+ products deployed | Cyber security, Nginx, Ubuntu, Linux, Kali Linux
      </p>
    </div>
  );
}

function PageContact() {
  return (
    <div className="brochure-page-content p-3 sm:p-4 md:p-6 min-h-full flex flex-col box-border gap-3 sm:gap-4">
      <h2 className="text-[#00d4ff] text-sm sm:text-base md:text-lg font-mono border-b border-[#00d4ff]/30 pb-1.5 sm:pb-2 shrink-0">
        [CONTACT_&_OFFICE]
      </h2>
      <div className="space-y-1">
        <p className="text-white/80 text-[10px] sm:text-xs md:text-sm leading-snug">{ACADEMY_OFFICE.addressLine1}</p>
        <p className="text-white/80 text-[10px] sm:text-xs md:text-sm font-semibold text-[#00d4ff]/90">{ACADEMY_OFFICE.addressLine2}</p>
        <a
          href={academyGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[10px] sm:text-xs text-[#00d4ff]/85 font-mono hover:text-[#00e5cc] mt-1"
        >
          Open in Google Maps →
        </a>
      </div>
      <div>
        <p className="text-white/50 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider mb-2">WhatsApp &amp; Call</p>
        <ul className="space-y-2.5">
          {ACADEMY_CONTACT_NUMBERS.map((num) => (
            <li key={num.raw} className="border border-[#00d4ff]/15 rounded-lg px-2.5 py-2 bg-black/25">
              <p className="text-white/95 font-mono text-[11px] sm:text-xs font-semibold mb-1.5">{num.display}</p>
              <div className="flex flex-wrap gap-1.5">
                <a
                  href={`https://wa.me/${num.raw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2 py-1 border border-[#00d4ff]/40 text-[#00d4ff] text-[9px] sm:text-[10px] font-mono hover:bg-[#00d4ff]/15"
                >
                  WhatsApp
                </a>
                <a
                  href={`tel:${num.raw}`}
                  className="inline-flex items-center px-2 py-1 border border-[#00d4ff]/40 text-[#00d4ff] text-[9px] sm:text-[10px] font-mono hover:bg-[#00d4ff]/15"
                >
                  Call
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-[9px] sm:text-[10px] text-white/45 mt-auto pt-1 leading-snug">
        30% off first 10 students · Top performer: MacBook Pro
      </p>
    </div>
  );
}

function PageBack() {
  return (
    <div className="brochure-page-content p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-full text-center box-border">
      <p className="text-[#ffd700] text-xs sm:text-sm font-mono mb-2 sm:mb-4">ONE_PROGRAM · ENQUIRE</p>
      <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 max-w-full px-1">
        One ongoing 6-month track — choose your focus within it. Enquiry on WhatsApp — Morning 9–11 · Afternoon 3–5 · Evening 6–8. First 10 students: 30% off. Top performer wins MacBook Pro.
      </p>
      <a
        href={`https://wa.me/${ACADEMY_CONTACT_NUMBERS[0].raw}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 sm:px-6 py-2 sm:py-3 border border-[#00d4ff] text-[#00d4ff] text-xs sm:text-sm font-mono hover:bg-[#00d4ff]/20 transition-all duration-300"
      >
        WHATSAPP {ACADEMY_CONTACT_NUMBERS[0].display}
      </a>
      <div className="mt-3 flex flex-col gap-1.5 text-[9px] sm:text-[10px] font-mono text-white/55">
        <span className="text-white/40 uppercase tracking-wider">Also on WhatsApp</span>
        {ACADEMY_CONTACT_NUMBERS.slice(1).map((num) => (
          <a
            key={num.raw}
            href={`https://wa.me/${num.raw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00d4ff]/90 hover:text-[#00e5cc]"
          >
            {num.display}
          </a>
        ))}
      </div>
      <Link href="/" className="mt-4 sm:mt-6 text-white/50 text-[10px] sm:text-xs font-mono hover:text-[#00d4ff] transition-colors">
        ← Back to site
      </Link>
    </div>
  );
}

const PAGES = [
  () => <PageCover />,
  () => <PageServices />,
  () => <PageCourses />,
  () => <PageWhy />,
  () => <PageContact />,
  () => <PageBack />,
];

export default function BrochureViewer() {
  const [current, setCurrent] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [nextPage, setNextPage] = useState(0);

  const goTo = useCallback((target: number) => {
    if (flipping) return;
    const next = (target + TOTAL_PAGES) % TOTAL_PAGES;
    if (next === current) return;
    setNextPage(next);
    const isPrev = next === (current - 1 + TOTAL_PAGES) % TOTAL_PAGES;
    setDirection(isPrev ? 'prev' : 'next');
    setFlipping(true);
    setTimeout(() => {
      setCurrent(next);
      setFlipping(false);
    }, 800);
  }, [current, flipping]);

  const goNext = () => goTo(current + 1);
  const goPrev = () => goTo(current - 1);

  return (
    <div className="brochure-wrapper min-h-screen hud-bg hud-grid flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-16 sm:py-20">
      {/* Open book layout */}
      <div className="book-open-frame w-full max-w-4xl">
        {/* Book spine (center) + left & right pages */}
        <div className="book-open-inner relative flex">
          {/* Left page (decorative) */}
          <div className="book-page-left hidden sm:flex" aria-hidden />
          {/* Center spine */}
          <div className="book-spine" aria-hidden />
          {/* Right page (content) */}
          <div className="book-page-right flex-1 relative min-h-[280px] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[480px] flex flex-col">
            {flipping ? (
              <div className="brochure-page-under absolute inset-0 z-[0] flex flex-col min-h-0" aria-hidden>
                {PAGES[nextPage]()}
              </div>
            ) : null}
            <div
              className={`absolute inset-0 z-[1] flex flex-col min-h-0 ${direction === 'next' ? 'brochure-page-turn-next' : 'brochure-page-turn-prev'} ${flipping ? 'turning' : ''}`}
              style={{ pointerEvents: flipping ? 'none' : 'auto' }}
            >
              {PAGES[current]()}
            </div>
          </div>
        </div>
      </div>

      {/* Prev/Next - directly below book */}
      <div className="book-controls flex items-center justify-center gap-4 sm:gap-6 mt-6 w-full max-w-4xl">
        <button
          type="button"
          onClick={goPrev}
          disabled={flipping || current === 0}
          className="px-4 sm:px-6 py-2 sm:py-2.5 border border-[#00d4ff]/50 text-[#00d4ff] text-xs sm:text-sm font-mono disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00d4ff]/15 transition-all duration-300 rounded"
        >
          ← Prev
        </button>
        <span className="text-white/60 text-xs font-mono min-w-[3rem] text-center">
          {current + 1} / {TOTAL_PAGES}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={flipping || current === TOTAL_PAGES - 1}
          className="px-4 sm:px-6 py-2 sm:py-2.5 border border-[#00d4ff]/50 text-[#00d4ff] text-xs sm:text-sm font-mono disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00d4ff]/15 transition-all duration-300 rounded"
        >
          Next →
        </button>
      </div>

      <Link
        href="/"
        className="mt-4 text-white/50 text-xs font-mono hover:text-[#00d4ff] transition-colors"
      >
        Close brochure
      </Link>
    </div>
  );
}
