import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import CoursesFloatingIcons from "@/components/CoursesFloatingIcons";
import { ProgramRoadmap } from "@/components/CourseRoadmap";
import IndustryCurriculum from "@/components/IndustryCurriculum";
import AzcrashCourseMark from "@/components/AzcrashCourseMark";
import { WhyAzDeploy } from "@/components/WhyAzDeploy";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "AZ Deploy Academy Belagavi — AZCrash 1.0: industry-ready curriculum (Python, SQL, Django, React, DevOps, AWS, AI & Gen AI). One 6-month Full-Stack + AI + DevOps program. Batch timings: Morning 9–11, Afternoon 3–5, Evening 6–8.",
};

const OFFICE_ADDRESS = {
  addressLine1: "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590016",
  addressLine2: "VFF GROUP Building — First Floor",
};

const WHATSAPP_INQUIRY =
  "https://wa.me/918296565587?text=Hi,%20I%20am%20interested%20in%20the%20Full-Stack%20%2B%20AI%20%2B%20DevOps%20program";

const BATCH_SLOTS = [
  {
    id: "morning",
    label: "Morning batch",
    time: "9:00 AM – 11:00 AM",
    detail: "Two focused hours before the workday. Ideal if you study or work in the afternoon or evening.",
  },
  {
    id: "afternoon",
    label: "Afternoon batch",
    time: "3:00 PM – 5:00 PM",
    detail: "Mid-day slot after lunch — good for college students with morning classes or professionals with flexible afternoons.",
  },
  {
    id: "evening",
    label: "Evening batch",
    time: "6:00 PM – 8:00 PM",
    detail: "After office hours for working professionals who want to upskill without quitting their job.",
  },
];

/** Pillars of the same program — not separate courses; students choose where to lean. */
const PROGRAM_PILLARS = [
  {
    id: "fullstack-ai-devops",
    name: "Full-Stack + AI + DevOps — All-in-One",
    desc: "One integrated 6-month track: you learn to ship full-stack apps (React + Django + PostgreSQL), operate them like production (Linux, Nginx, Docker, CI/CD, AWS VPS), and apply AI & data skills where they matter — not scattered mini-courses.",
    highlight: true,
  },
  {
    id: "development",
    name: "Development",
    desc: "React: components, hooks, routing, state, modern UI patterns. Django: MVT, REST APIs, auth, system design for scalable backends. PostgreSQL: schema design, queries, indexes, and optimization for real traffic.",
  },
  {
    id: "devops-systems",
    name: "DevOps & Systems",
    desc: "Linux at server depth — users, permissions, processes, networking. Nginx as reverse proxy and static server. Docker images & compose. CI/CD pipelines so every change is built and tested. Deploy to a VPS on AWS with HTTPS and monitoring basics.",
  },
  {
    id: "ai-data",
    name: "AI & Data",
    desc: "Practical AI: when to use APIs vs local models, prompt patterns, integrating AI into apps safely. Data engineering: pipelines, batch vs stream mindset, storage choices, and fundamentals that pair with PostgreSQL and your backend.",
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid relative">
      <HudHeader />
      <main className="relative z-10 pt-16 pb-24 sm:pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <p className="courses-fade-in text-center text-[10px] sm:text-xs font-mono text-[#94a3b8] tracking-[0.2em] uppercase mb-2">
            Not just another course
          </p>
          <h1 className="courses-fade-in text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] text-center mb-2 leading-tight px-2">
            Become a Real Software Engineer in 6 Months
          </h1>
          <p className="courses-fade-in courses-fade-in-delay-1 text-center text-lg sm:text-xl font-bold text-white/95 mb-1">
            AZ DEPLOY ACADEMY
          </p>
          <p className="courses-fade-in courses-fade-in-delay-1 text-center text-sm font-mono text-[#ffd700] mb-4">
            First time in Belagavi
          </p>
          <div className="courses-fade-in courses-fade-in-delay-1 mb-8">
            <AzcrashCourseMark
              href="#batch-timings"
              aria-label="AZCrash 1.0 — jump to batch timings on this page"
              footerHint="Jump to batches →"
            />
          </div>

          {/* Batch timings — highlighted */}
          <div
            id="batch-timings"
            className="courses-fade-in courses-fade-in-delay-1 max-w-4xl mx-auto mb-10 rounded-xl border-2 border-[#ffd700]/70 bg-gradient-to-b from-[#ffd700]/[0.12] to-[#0a1628]/80 shadow-[0_0_40px_rgba(255,215,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-[#ffd700]/30 px-4 sm:px-8 py-6 sm:py-8"
          >
            <p className="text-center text-[11px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#ffd700] mb-1">
              Batch timings
            </p>
            <p className="text-center text-sm text-white/80 mb-6 max-w-2xl mx-auto">
              Pick <span className="text-[#00f5d4] font-semibold">one</span> batch — same curriculum, same depth. Each session runs{" "}
              <span className="text-white font-semibold">2 hours</span> so you can stay consistent without burning out.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {BATCH_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-lg border border-[#00d4ff]/35 bg-black/50 px-4 py-5 text-center sm:text-left transition hover:border-[#ffd700]/50 hover:bg-[#00d4ff]/5"
                >
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-2">{slot.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#ffd700] font-mono tabular-nums leading-tight mb-3">
                    {slot.time}
                  </p>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{slot.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] text-[#64748b] font-mono mt-6">
              Timings shown in local time · Confirm your preferred batch when enrollment opens
            </p>
          </div>

          <p className="courses-fade-in courses-fade-in-delay-1 text-center text-xs sm:text-sm text-white/70 mb-2 max-w-3xl mx-auto leading-relaxed">
            <span className="text-white/90 font-medium">Who this is for:</span> paths toward{" "}
            <span className="text-[#00d4ff]">AI Engineer</span> · <span className="text-[#00d4ff]">Data Engineer</span> ·{" "}
            <span className="text-[#00d4ff]">Backend Developer</span> · <span className="text-[#00d4ff]">Frontend Developer</span> ·{" "}
            <span className="text-[#00d4ff]">DevOps Engineer</span>
            {" "}— one program, many doors; you go deep on the stack employers actually ship.
          </p>

          <div className="courses-fade-in courses-fade-in-delay-2 hud-panel p-6 sm:p-8 max-w-3xl mx-auto mb-10 border-[#00d4ff]/30">
            <h2 className="text-center text-sm sm:text-base font-mono text-[#00d4ff] uppercase tracking-wider mb-2">
              Full-Stack + AI + DevOps — All-in-One Program
            </h2>
            <p className="text-center text-lg sm:text-xl font-bold text-white/95 tracking-wide mb-3">
              Learn. Build. Deploy. Scale. Get hired.
            </p>
            <p className="text-center text-sm text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
              Six months of structured learning plus hands-on practice: you won&apos;t stop at tutorials — you&apos;ll design APIs, tune databases,
              put services behind Nginx, containerize with Docker, automate with CI/CD, and deploy to a real cloud VPS — the same moving parts you&apos;ll see on the job.
            </p>
          </div>

          <IndustryCurriculum />

          <WhyAzDeploy variant="full" />

          {/* Why fail / What we do — expanded */}
          <div className="courses-fade-in courses-fade-in-delay-2 grid md:grid-cols-2 gap-6 md:gap-8 mb-12 max-w-5xl mx-auto">
            <div className="hud-corner-border p-5 sm:p-6 border-red-500/20">
              <h3 className="text-red-400/90 text-sm font-mono uppercase tracking-wider mb-3">Why most students fail?</h3>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">
                Many courses stop at syntax. Employers need people who can own a feature end-to-end — from UI to DB to deploy.
              </p>
              <ul className="text-sm text-[#94a3b8] space-y-3">
                <li className="flex gap-2">
                  <span className="text-red-400/80 shrink-0">•</span>
                  <span><strong className="text-white/70">Toy projects only</strong> — Todo apps and calculators don&apos;t teach scaling, security, or teamwork.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400/80 shrink-0">•</span>
                  <span><strong className="text-white/70">No production exposure</strong> — no logs, no crashes, no real users — so interviews fall apart on &quot;what happens when…?&quot;</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400/80 shrink-0">•</span>
                  <span><strong className="text-white/70">Deployment is a black box</strong> — if you&apos;ve never SSH&apos;d into a server or read an Nginx error, ops questions are guesswork.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400/80 shrink-0">•</span>
                  <span><strong className="text-white/70">Production vs dev</strong> — env vars, secrets, migrations, and rollbacks aren&apos;t covered in hello-world courses.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400/80 shrink-0">•</span>
                  <span><strong className="text-white/70">Interview gap</strong> — nervous explaining system design, trade-offs, and past failures because nothing was ever shipped.</span>
                </li>
              </ul>
            </div>
            <div className="hud-corner-border p-5 sm:p-6 border-[#22c55e]/25">
              <h3 className="text-[#22c55e] text-sm font-mono uppercase tracking-wider mb-3">What we do differently</h3>
              <p className="text-xs text-white/50 mb-4 leading-relaxed">
                We train you like you&apos;re joining a real product team — architecture, shipping, and iteration matter as much as code style.
              </p>
              <ul className="text-sm text-[#94a3b8] space-y-3">
                <li className="flex gap-2">
                  <span className="text-[#22c55e] shrink-0">•</span>
                  <span><strong className="text-white/70">Production-shaped projects</strong> — multi-service thinking, realistic constraints, not just &quot;it works on my machine.&quot;</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#22c55e] shrink-0">•</span>
                  <span><strong className="text-white/70">Live startup-style work</strong> — priorities change, bugs appear, you learn to triage and document.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#22c55e] shrink-0">•</span>
                  <span><strong className="text-white/70">System architecture</strong> — how pieces talk: browser → API → DB → cache → queue → deploy pipeline.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#22c55e] shrink-0">•</span>
                  <span><strong className="text-white/70">Real deployment environment</strong> — Linux shell, process managers, reverse proxy, HTTPS, env-based config.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#22c55e] shrink-0">•</span>
                  <span><strong className="text-white/70">Engineer habits</strong> — code review mindset, git discipline, reading docs, and clear communication under time pressure.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Offers */}
          <div className="courses-fade-in courses-fade-in-delay-3 max-w-xl mx-auto hud-corner-border p-5 mb-12 border-[#ffd700]/30 bg-[#ffd700]/5">
            <p className="text-center text-[#ffd700] font-bold text-lg sm:text-xl">30% off for first 10 students</p>
            <p className="text-center text-white/80 text-sm mt-2">Top performer wins MacBook Pro</p>
            <p className="text-center text-[11px] text-[#64748b] mt-3">Offer applies when enrollment opens — ask on WhatsApp for details.</p>
          </div>

          {/* Floating icons + single program card — enrollment */}
          <div className="relative min-h-[320px] mb-12">
            <CoursesFloatingIcons />
            <div className="relative z-10 max-w-xl mx-auto">
              <div className="hud-panel p-8 border-[#ffd700]/40 text-center">
                <p className="text-[#ffd700] text-xs font-mono uppercase tracking-widest mb-2">Enrollment opening soon</p>
                <h2 className="text-xl sm:text-2xl font-bold text-[#e8f4f8] mb-3">Full-Stack + AI + DevOps</h2>
                <p className="text-[#94a3b8] text-sm mb-4">
                  One program — enquiry only for now. We&apos;ll notify you when enrollment opens. Mention your preferred{" "}
                  <a href="#batch-timings" className="text-[#ffd700] underline underline-offset-2 hover:text-[#ffe566]">
                    batch timing
                  </a>{" "}
                  (morning / afternoon / evening) on WhatsApp.
                </p>
                <a
                  href={WHATSAPP_INQUIRY}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00d4ff]/20 border border-[#00d4ff]/50 text-[#00d4ff] font-medium hover:bg-[#00d4ff]/30 transition-colors"
                >
                  Enquiry — WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Roadmap */}
          <div className="courses-fade-in courses-fade-in-delay-4 mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">What you&apos;ll learn — roadmap</h2>
            <p className="text-[#94a3b8] text-sm text-center max-w-2xl mx-auto mb-10">
              Six months to train like a real software engineer — production systems, not toy apps. Depth below follows the same three pillars as the flyer.
            </p>
            <div className="max-w-2xl mx-auto hud-corner-border p-6 md:p-8">
              <ProgramRoadmap />
            </div>
          </div>

          {/* Same program — pillars / where you fit */}
          <h2 className="courses-fade-in text-xl font-bold text-[#94a3b8] text-center mb-3">Your journey — choose your focus</h2>
          <p className="text-center text-xs text-[#64748b] max-w-2xl mx-auto mb-8">
            One ongoing 6-month intake. The sections below are pillars of that single program — use them to see where you fit (build-heavy, ops-heavy, AI-heavy, or the full arc). Not four different courses.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {PROGRAM_PILLARS.map((course) => (
              <div
                key={course.id}
                className={`hud-panel p-5 text-left transition-all duration-300 hover:scale-[1.02] ${
                  course.highlight
                    ? "border-2 border-[#ffd700]/60 bg-[#ffd700]/5 shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                    : "opacity-90 border border-[#00d4ff]/20"
                }`}
              >
                <h3 className={`font-bold font-mono text-sm ${course.highlight ? "text-[#ffd700]" : "text-[#94a3b8]"}`}>
                  {course.name}
                </h3>
                <p className="text-[#94a3b8] text-xs mt-2 leading-relaxed">{course.desc}</p>
                <p className="text-[#22c55e]/90 text-[10px] sm:text-xs font-mono mt-3 tracking-wide">SAME_PROGRAM · PICK_EMPHASIS</p>
              </div>
            ))}
          </div>

          {/* Office + contacts */}
          <div className="hud-panel p-6 max-w-2xl mx-auto mt-12 text-left sm:text-center transition-all duration-300 hover:border-[#00d4ff]/40">
            <h3 className="text-[#00d4ff] text-sm font-mono uppercase tracking-wider mb-3">Office</h3>
            <p className="text-white/80 text-sm">{OFFICE_ADDRESS.addressLine1}</p>
            <p className="text-white/80 text-sm font-semibold text-[#00d4ff]/90 mt-1">{OFFICE_ADDRESS.addressLine2}</p>
            <p className="text-white/60 text-xs mt-4 font-mono">
              <a href="https://www.azdeploy.com" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] hover:underline">
                www.azdeploy.com
              </a>
            </p>
          </div>

          <div className="text-center mt-10">
            <p className="text-[#94a3b8] mb-4 text-sm">WhatsApp</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="https://wa.me/918296565587" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] link-underline font-mono">
                +91 82965 65587
              </a>
              <a href="https://wa.me/918971244513" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] link-underline font-mono">
                +91 89712 44513
              </a>
              <a href="https://wa.me/917338360607" target="_blank" rel="noopener noreferrer" className="text-[#00d4ff] link-underline font-mono">
                +91 73383 60607
              </a>
            </div>
          </div>
        </section>
      </main>
      <FloatingActions />
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4 z-30">
        <p className="text-[10px] font-mono text-white/40">/// ONE_PROGRAM · JOURNEY_FOCUS · AZDEPLOY.COM</p>
      </footer>
    </div>
  );
}
