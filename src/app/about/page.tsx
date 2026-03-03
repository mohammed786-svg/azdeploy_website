import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AZDeploy Academy - Software training company making students job-ready with real industry knowledge. Avoid fake teachers, learn from experts with 500+ products deployed.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-glow-teal text-center mb-8 hud-label">
            [ABOUT_AZDEPLOY]
          </h1>
          <div className="hud-panel p-8 md:p-12 space-y-6 text-white/80 leading-relaxed">
            <p>
              We are a software training company dedicated to making students <strong className="text-[#00d4ff]">job-ready</strong>.
              Our trainers have worked on <strong className="text-[#00d4ff]">500+ products</strong> in real-time and bring
              <strong className="text-[#00d4ff]"> 8+ years</strong> of industry experience across all stacks—cyber security,
              nginx, Ubuntu, Linux, Kali Linux, and more.
            </p>
            <p>
              We exist to protect students from fake teachers who sell courses without industry experience,
              who have never deployed anything in production, and who lack real knowledge of the stacks they teach.
              Our mission: teach actual concepts and give enough exposure so students understand what is really
              happening in the IT industry.
            </p>
            <p>
              In today&apos;s world, everyone depends on AI—but not everyone knows how to use it properly because
              they haven&apos;t built strong basics or invested in using their own brains first. We make our students
              think first, then use AI to boost their work. Most students use AI without understanding what&apos;s
              going on behind the scenes. We fix that.
            </p>
            <p>
              We make students capable of <strong className="text-[#00d4ff]">cracking interviews</strong> by
              teaching real concepts and exposing them to the secrets of what it takes to succeed in this industry.
            </p>
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
