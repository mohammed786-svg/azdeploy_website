import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AZDeploy Academy services: Job-ready IT training, Python Full Stack, Android Development, real industry mentorship. Limited seats, 30% off for early enrollments.",
};

export default function ServicesPage() {
  const services = [
    { title: "JOB_READY_TRAINING", desc: "Our courses are designed to make you interview-ready. Real projects, real stacks, real deployments." },
    { title: "INDUSTRY_MENTORSHIP", desc: "Learn from trainers with 8+ years experience and 500+ products deployed. No theory-only—actual hands-on knowledge." },
    { title: "FUNDAMENTALS_FIRST", desc: "Master concepts before relying on AI. Understand what happens under the hood. Use your brain, then boost with AI." },
    { title: "LIMITED_BATCHES", desc: "Only 3 batches per course, 25 seats per batch. First 10 students get 30% off. Focus on quality, not quantity." },
  ];

  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-glow-teal text-center mb-4 hud-label">
            [OUR_SERVICES]
          </h1>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-16 font-mono text-sm">
            We provide training that turns students into job-ready professionals with real industry knowledge.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((s) => (
              <div key={s.title} className="hud-panel p-8">
                <h2 className="text-lg font-bold text-[#00d4ff] mb-3 font-mono">{s.title}</h2>
                <p className="text-white/70 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center hud-panel p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4 hud-label">READY_TO_START</h2>
            <p className="text-white/70 mb-6 text-sm">
              Contact us on WhatsApp for course details, batch schedules, and enrollment.
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono hover:bg-[#00d4ff]/20 transition-colors mr-4"
            >
              VIEW_COURSES
            </Link>
            <a
              href="https://wa.me/918296565587"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 border border-[#00e5cc] text-[#00e5cc] text-sm font-mono hover:bg-[#00e5cc]/20 transition-colors"
            >
              WHATSAPP
            </a>
          </div>
        </section>
      </main>
      <FloatingActions />
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4 z-30">
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: ENROLLMENT_OPEN</p>
      </footer>
    </div>
  );
}
