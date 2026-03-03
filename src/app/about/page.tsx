import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AZDeploy Academy - Software training company making students job-ready with real industry knowledge. Avoid fake teachers, learn from experts with 500+ products deployed.",
};

const STATS = [
  { value: "8+", label: "YEARS_EXPERIENCE" },
  { value: "500+", label: "PRODUCTS_DEPLOYED" },
  { value: "25", label: "SEATS_PER_BATCH" },
  { value: "3", label: "BATCHES_PER_COURSE" },
];

const WHY_DIFFERENT = [
  "Trainers who have actually shipped 500+ products—not theory-only instructors",
  "Curriculum built around real stacks: Python, Django, React, Android, Kotlin, Linux, DevOps",
  "Think first, AI second—we strengthen fundamentals before you lean on tools",
  "Limited batches (3 per course, 25 seats) so every student gets real attention",
  "Interview and placement focus with mock interviews, resume prep, and industry insights",
  "Live projects from day one; no certificate mills—only job-ready skills",
];

const VALUES = [
  { title: "Real over fake", desc: "We call out fake teachers. Our trainers have years in the industry and real deployments to show." },
  { title: "Basics first", desc: "Strong fundamentals, debugging, and problem-solving before AI. You understand what happens under the hood." },
  { title: "Quality over quantity", desc: "Small batches, first 20 get 30% off. We care about outcomes, not headcount." },
  { title: "Placement ready", desc: "Resume reviews, mock interviews, and the kind of knowledge that actually helps you crack placements." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8">
          <h1 className="about-enter text-2xl sm:text-3xl md:text-5xl font-bold text-white text-glow-teal text-center mb-4 hud-label">
            [ABOUT_AZDEPLOY]
          </h1>
          <p className="about-enter about-enter-delay-1 text-[#00d4ff]/90 text-center text-sm sm:text-base font-mono max-w-2xl mx-auto">
            Job-ready training from trainers who have shipped real products. Think first, AI second.
          </p>
        </section>

        {/* Stats strip */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="hud-corner-border flex flex-wrap justify-center gap-8 sm:gap-12 py-6 about-enter about-enter-delay-2">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#00d4ff]">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-white/50 font-mono mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our story */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="hud-panel p-8 md:p-10 space-y-6 text-white/80 leading-relaxed about-enter about-enter-delay-3">
            <h2 className="text-[#00d4ff] text-lg font-mono font-semibold border-b border-[#00d4ff]/30 pb-2">
              [OUR_STORY_&_MISSION]
            </h2>
            <p>
              We are a software training company based in <strong className="text-[#00d4ff]">Belagavi</strong>, dedicated to making students <strong className="text-[#00d4ff]">job-ready</strong>.
              Our trainers have worked on <strong className="text-[#00d4ff]">500+ products</strong> and bring
              <strong className="text-[#00d4ff]"> 8+ years</strong> of experience across full stack, mobile, DevOps, cyber security, Nginx, Ubuntu, Linux, Kali Linux, and more.
            </p>
            <p>
              We exist to protect students from fake teachers who sell courses without industry experience and have never deployed anything in production. Our mission: teach actual concepts and give enough exposure so students understand what is really happening in the IT industry.
            </p>
            <p>
              Everyone depends on AI—but not everyone uses it well because they haven&apos;t built strong basics. We make our students <strong className="text-[#00d4ff]">think first, then use AI</strong> to boost their work. We make them capable of <strong className="text-[#00d4ff]">cracking interviews</strong> by teaching real concepts and industry secrets.
            </p>
          </div>
        </section>

        {/* The reality & our promise - highlighted */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="about-enter about-enter-delay-3 border-2 border-[#00d4ff]/50 rounded-lg p-8 md:p-10 bg-[#00d4ff]/5 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
            <h2 className="text-[#00d4ff] text-lg font-mono font-semibold border-b border-[#00d4ff]/40 pb-2 mb-6">
              [THE_REALITY_&_OUR_PROMISE]
            </h2>
            <p className="text-white/90 leading-relaxed mb-4">
              Many students invest <strong className="text-[#00d4ff]">years and significant money</strong> in degrees, only to find repeated practical output or no industry-ready knowledge at the end. Meanwhile, expecting to become job-ready in a few weeks or a month is unrealistic—real skills need structured learning and practice.
            </p>
            <p className="text-white/90 leading-relaxed">
              We offer a <strong className="text-[#00d4ff]">focused 6-month program</strong> where <strong className="text-[#00d4ff]">every student receives one-on-one mentorship</strong>. No crowded batches, no one-size-fits-all. You build real skills, ship real projects, and leave genuinely job-ready—not with just a certificate, but with the confidence to crack interviews and succeed in the industry.
            </p>
          </div>
        </section>

        {/* Why we're different */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="hud-corner-border p-8 md:p-10 about-enter about-enter-delay-4">
            <h2 className="text-[#00d4ff] text-lg font-mono font-semibold border-b border-[#00d4ff]/30 pb-2 mb-6">
              [WHY_WE_RE_DIFFERENT]
            </h2>
            <ul className="space-y-3 text-sm sm:text-base text-white/80">
              {WHY_DIFFERENT.map((item, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <span className="text-[#00d4ff] shrink-0 mt-0.5 transition-transform duration-300 group-hover:translate-x-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What we stand for - value cards */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <h2 className="about-enter about-enter-delay-5 text-[#00d4ff] text-lg font-mono font-semibold text-center mb-6">
            [WHAT_WE_STAND_FOR]
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className="about-enter border border-[#00d4ff]/25 rounded-lg p-5 bg-black/30 hover:border-[#00d4ff]/50 hover:bg-black/40 transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${0.55 + i * 0.08}s` }}
              >
                <h3 className="text-[#00d4ff] font-mono text-sm font-semibold mb-2">{v.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="hud-panel p-6 md:p-8 about-enter about-enter-delay-6">
            <h2 className="text-[#00d4ff] text-lg font-mono font-semibold border-b border-[#00d4ff]/30 pb-2 mb-4">
              [WHERE_WE_ARE]
            </h2>
            <p className="text-white/80 text-sm">
              Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590017.
            </p>
            <p className="text-[#00d4ff] font-mono font-semibold text-sm mt-2">VFF GROUP — First Floor</p>
            <p className="text-white/60 text-xs mt-3">Limited seats per batch. First 20 students get 30% off.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="text-center about-enter about-enter-delay-7">
            <p className="text-white/70 text-sm sm:text-base mb-4">Ready to build real skills and crack placements?</p>
            <Link
              href="https://wa.me/918296565587"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[#00d4ff] text-[#00d4ff] text-sm font-mono hover:bg-[#00d4ff]/15 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300"
            >
              ENROLL_VIA_WHATSAPP →
            </Link>
          </div>
        </section>
      </main>
      <FloatingActions />
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4 z-30">
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: AZDEPLOY_ACADEMY</p>
      </footer>
    </div>
  );
}
