'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

const OFFICE = {
  addressLine1: "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590017",
  addressLine2: "VFF GROUP - First Floor",
  whatsapp: "+91 82965 65587",
};

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
    desc: "Only 3 batches per course, 25 seats per batch. First 10 students get 30% off. Quality over quantity.",
    points: ["3 batches per course only", "25 seats per batch max", "First 10: 30% discount", "Personal attention guaranteed"],
  },
];

const PYTHON_COURSE = {
  name: "Python Full Stack",
  tag: "Primary Course",
  fullDesc: "Without Python, students can't build their career. Our comprehensive program covers everything from fundamentals to production deployment—Django/Flask, React/Vue, PostgreSQL/MySQL, REST APIs, Docker, and CI/CD. Build real projects that go live.",
  topics: ["Backend: Django, Flask, FastAPI", "Frontend: HTML/CSS/JS, React", "Database: PostgreSQL, MySQL", "APIs: REST, authentication", "Deployment: Docker, AWS/GCP"],
  bullets: ["3 batches only", "25 seats per batch", "First 10: 30% off", "Projects included", "Interview prep & placement support"],
};

const ANDROID_COURSE = {
  name: "Android Developer",
  tag: "Primary Course",
  fullDesc: "Master Android development with Kotlin, Android Studio, Jetpack Compose, and Material Design. Build and publish real apps on Play Store. Understand architecture patterns (MVVM), Room DB, Retrofit, and modern Android practices.",
  topics: ["Kotlin & Java fundamentals", "Android Studio & Gradle", "Jetpack Compose, Material UI", "Room, Retrofit, WorkManager", "Play Store publishing"],
  bullets: ["3 batches only", "25 seats per batch", "First 10: 30% off", "App portfolio included", "Industry-ready skills"],
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
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-glow-teal mb-1 sm:mb-2">AZDeploy</h1>
      <p className="text-lg sm:text-xl md:text-2xl text-[#00d4ff] font-mono mb-2 sm:mb-4">ACADEMY_2026</p>
      <p className="text-xs sm:text-sm md:text-base text-white/70 max-w-full mb-2 sm:mb-4 px-1">
        Building student lives with real IT knowledge. Think first, AI second. From fake teachers to real deployments.
      </p>
      <p className="text-[10px] sm:text-xs text-[#00d4ff]/80 font-mono">— BROCHURE —</p>
      <p className="text-[10px] text-white/50 mt-2 sm:mt-4">Python Full Stack | Android Development | Belagavi</p>
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
          <span className="text-[#00e5cc] text-[10px] font-mono">{PYTHON_COURSE.tag}</span>
          <h3 className="text-white font-semibold text-sm sm:text-base">{PYTHON_COURSE.name}</h3>
          <p className="text-white/70 text-[10px] sm:text-xs mt-0.5 sm:mt-1 mb-1 sm:mb-2">{PYTHON_COURSE.fullDesc}</p>
          <p className="text-[10px] text-[#00d4ff]/80 font-mono mb-0.5 sm:mb-1">Topics:</p>
          <ul className="text-[10px] text-white/60 space-y-0.5 mb-1 sm:mb-2">
            {PYTHON_COURSE.topics.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
          <ul className="text-[10px] text-[#00d4ff]/90 font-mono">
            {PYTHON_COURSE.bullets.map((b) => (
              <li key={b}>▸ {b}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-[#00e5cc] text-[10px] font-mono">{ANDROID_COURSE.tag}</span>
          <h3 className="text-white font-semibold text-sm sm:text-base">{ANDROID_COURSE.name}</h3>
          <p className="text-white/70 text-[10px] sm:text-xs mt-0.5 sm:mt-1 mb-1 sm:mb-2">{ANDROID_COURSE.fullDesc}</p>
          <p className="text-[10px] text-[#00d4ff]/80 font-mono mb-0.5 sm:mb-1">Topics:</p>
          <ul className="text-[10px] text-white/60 space-y-0.5 mb-1 sm:mb-2">
            {ANDROID_COURSE.topics.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
          <ul className="text-[10px] text-[#00d4ff]/90 font-mono">
            {ANDROID_COURSE.bullets.map((b) => (
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
    <div className="brochure-page-content p-3 sm:p-4 md:p-6 min-h-full flex flex-col box-border">
      <h2 className="text-[#00d4ff] text-sm sm:text-base md:text-lg font-mono border-b border-[#00d4ff]/30 pb-1.5 sm:pb-2 mb-3 sm:mb-4">[CONTACT_&_OFFICE]</h2>
      <p className="text-white/80 text-[10px] sm:text-xs md:text-sm">{OFFICE.addressLine1}</p>
      <p className="text-white/80 text-[10px] sm:text-xs md:text-sm font-semibold text-[#00d4ff]/90 mt-1">{OFFICE.addressLine2}</p>
      <p className="text-white/70 text-[10px] sm:text-xs mt-auto">WhatsApp</p>
      <a
        href={`https://wa.me/${OFFICE.whatsapp.replace(/[\s+]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00d4ff] font-mono text-sm sm:text-lg hover:text-[#00e5cc]"
      >
        {OFFICE.whatsapp}
      </a>
      <p className="text-[10px] text-white/50 mt-2 sm:mt-4">Limited seats • First 10 get 30% off</p>
    </div>
  );
}

function PageBack() {
  return (
    <div className="brochure-page-content p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-full text-center box-border">
      <p className="text-[#00d4ff] text-xs sm:text-sm font-mono mb-2 sm:mb-4">ENROLL_NOW</p>
      <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 max-w-full px-1">
        Limited seats. 3 batches per course, 25 per batch. First 10 students get 30% off. Contact on WhatsApp to secure your spot.
      </p>
      <a
        href={`https://wa.me/${OFFICE.whatsapp.replace(/[\s+]/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 sm:px-6 py-2 sm:py-3 border border-[#00d4ff] text-[#00d4ff] text-xs sm:text-sm font-mono hover:bg-[#00d4ff]/20 transition-all duration-300"
      >
        WHATSAPP {OFFICE.whatsapp}
      </a>
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
