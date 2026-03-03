import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import CourseRadar from "@/components/CourseRadar";
import StudentsPanel from "@/components/StudentsPanel";
import FloatingActions from "@/components/FloatingActions";
import HeroSplineBackground from "@/components/HeroSplineBackground";
import RegistrationMarquee from "@/components/RegistrationMarquee";

export const metadata: Metadata = {
  title: "Home",
  description:
    "AZDeploy Academy - Building student lives with real IT knowledge. Job-ready training in Python Full Stack and Android Development from industry experts.",
};

const TAGLINES = [
  "★ THINK_FIRST_AI_SECOND_REAL_KNOWLEDGE_FOREVER ★",
  "★ WE_ARE_HERE_TO_HELP_YOU_BECOME_JOB_READY ★",
  "★ 500+_PRODUCTS_WORTH_OF_EXPERIENCE_IN_YOUR_CORNER ★",
];

/** Insert zero-width space after underscores so wrapping happens at segments, not mid-word (e.g. keeps "FOREVER ★" together) */
function wrapAtUnderscores(s: string) {
  return s.replace(/_/g, "_\u200B");
}

const STATS = [
  { value: "8+", label: "YEARS_EXPERIENCE" },
  { value: "500+", label: "PRODUCTS_DEPLOYED" },
  { value: "25", label: "SEATS_PER_BATCH" },
  { value: "3", label: "BATCHES_PER_COURSE" },
];

const WHY_ITEMS = [
  "Trainers with real industry experience — not theory-only instructors",
  "Master fundamentals before AI — understand what happens under the hood",
  "Interview-ready curriculum — crack placements with actual concepts",
  "Limited batches for focused learning — quality over quantity",
  "Structured 6-month program — time to build real skills, not rush",
  "One-on-one mentorship for every student — no crowded batches",
];

export default function HomePage() {
  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />

      <main className="pt-20 sm:pt-24 pb-24 sm:pb-20 min-h-screen">
        {/* Three-column layout: Course Radar | Hero | Students + Why */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-8 px-4 sm:px-6 max-w-[1600px] mx-auto mt-4 sm:mt-6 w-full overflow-x-hidden">
          {/* Left - Course Radar */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <CourseRadar />
          </aside>

          {/* Center - Hero content */}
          <section className="hud-corner-border flex-1 flex flex-col items-center justify-center pt-4 sm:pt-6 pb-8 sm:py-12 relative min-h-[60vh]">
            <HeroSplineBackground />

            <div className="relative z-10 text-center max-w-2xl w-full mx-auto px-2 sm:px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white text-glow-teal">
                AZDeploy
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 mt-2 sm:mt-3 text-glow-teal">
                2026
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-[#00d4ff] mt-6 sm:mt-8 font-mono tracking-wide sm:tracking-widest max-w-lg mx-auto leading-relaxed break-words px-1 w-full min-w-0">
                {wrapAtUnderscores(TAGLINES[0])}
              </p>
              <p className="text-[10px] sm:text-xs text-[#00d4ff]/70 mt-2 font-mono">
                {TAGLINES[1]}
              </p>
              <p className="text-[10px] sm:text-xs text-[#00d4ff]/50 mt-1 font-mono hidden sm:block">
                {TAGLINES[2]}
              </p>

              {/* Stats row */}
              <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-6">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg sm:text-xl font-bold text-[#00d4ff]">{s.value}</p>
                    <p className="text-[9px] sm:text-[10px] text-white/50 font-mono">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Prize / Offer box */}
              <div className="hud-corner-border mt-8 sm:mt-10 px-4 sm:px-6 py-4 w-full max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">🏆</span>
                  <div>
                    <p className="text-[10px] sm:text-xs text-white/70 font-mono uppercase tracking-wider">
                      LIMITED_SEATS_OFFER
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-[#ffd700] text-glow-gold">
                      30% OFF
                    </p>
                    <p className="text-[10px] text-white/50 font-mono">
                      First 20 students per batch
                    </p>
                  </div>
                  <span className="text-xl sm:text-2xl">🏆</span>
                </div>
              </div>

              {/* Motto / Live box */}
              <div className="hud-corner-border mt-5 sm:mt-6 px-4 sm:px-6 py-3 w-full max-w-md mx-auto">
                <p className="text-[10px] font-mono text-[#22c55e] flex items-center justify-center gap-2 mb-2">
                  <span className="live-dot" />
                  NOW_LIVE
                </p>
                <p className="text-[10px] sm:text-xs md:text-base text-white/90 font-mono break-words">
                  THINK_ELITE_BUILD_REAL_CONQUER_PLACEMENTS
                </p>
              </div>
            </div>
          </section>

          {/* Right - Students + Why AZDeploy */}
          <aside className="hidden lg:flex flex-col w-[280px] shrink-0 gap-6">
            <StudentsPanel />
            <div className="hud-corner-border p-4 flex-1">
              <h2 className="text-sm font-bold text-[#00d4ff] font-mono mb-3 hud-label">
                [WHY_AZDEPLOY]
              </h2>
              <ul className="space-y-2 text-xs text-white/70">
                {WHY_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#00d4ff] mt-0.5 shrink-0">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 border border-[#00d4ff] text-[#00d4ff] text-xs font-mono hover:bg-[#00d4ff]/15 transition-colors"
              >
                ENROLL_NOW →
              </a>
            </div>
          </aside>
        </div>

        {/* Mobile: panels stack vertically on narrow, side-by-side on sm+ */}
        <div className="lg:hidden px-4 sm:px-6 pb-8 mt-8 sm:mt-10 w-full max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 justify-center sm:items-stretch mb-8">
            <div className="w-full sm:w-[calc(50%-0.5rem)] sm:min-w-[160px] max-w-[280px] sm:max-w-none mx-auto sm:mx-0">
              <CourseRadar />
            </div>
            <div className="w-full sm:w-[calc(50%-0.5rem)] sm:min-w-[160px] max-w-[280px] sm:max-w-none mx-auto sm:mx-0">
              <StudentsPanel />
            </div>
          </div>
          <div className="hud-corner-border p-4 sm:p-6">
            <h2 className="text-sm font-bold text-[#00d4ff] font-mono mb-3 hud-label">
              [WHY_AZDEPLOY]
            </h2>
            <ul className="space-y-2 text-sm text-white/70">
              {WHY_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-[#00d4ff] mt-0.5 shrink-0">▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center">
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#00d4ff] text-[#00d4ff] text-xs font-mono hover:bg-[#00d4ff]/15 transition-colors"
              >
                ENROLL_NOW →
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Text marquee */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <RegistrationMarquee />
      </div>

      <FloatingActions />
    </div>
  );
}
