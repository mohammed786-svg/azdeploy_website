import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Trainer",
  description:
    "AZDeploy Academy trainer: 8+ years industry experience, 500+ products deployed. Real knowledge in Python, Android, cyber security, Linux, nginx. No fake teachers.",
};

export default function TrainerPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-glow-teal text-center mb-8 hud-label">
            [MEET_THE_TRAINER]
          </h1>

          <div className="hud-panel p-8 md:p-12 space-y-6">
            <div className="flex flex-wrap gap-2">
              {["8+_YEARS", "500+_PRODUCTS", "ALL_STACKS"].map((badge) => (
                <span key={badge} className="px-3 py-1 border border-[#00d4ff]/50 text-[#00d4ff] text-xs font-mono">
                  {badge}
                </span>
              ))}
            </div>
            <p className="text-white/80 leading-relaxed">
              Our lead trainer has <strong className="text-[#00d4ff]">8+ years</strong> of experience in the IT industry
              and has worked on <strong className="text-[#00d4ff]">500+ products</strong> in real-time. Expertise spans
              Python Full Stack, Android Development, cyber security, Nginx, Ubuntu, Linux, Kali Linux, and more.
            </p>
            <p className="text-white/80 leading-relaxed">
              Unlike many &quot;instructors&quot; who sell courses without real-world experience, our trainer has
              actually deployed, scaled, and maintained production systems. This means you learn what works in
              the real industry—not just theory.
            </p>
            <p className="text-white/80 leading-relaxed">
              The focus is on making you understand concepts deeply, use your brain first, and then leverage AI
              to boost productivity. Students leave not just with certificates, but with the ability to crack
              interviews and build real careers.
            </p>
            <div className="pt-6 border-t border-[#00d4ff]/20">
              <p className="text-white/70 mb-4 text-sm">Ready to learn from someone who has been there?</p>
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono hover:bg-[#00d4ff]/20 transition-colors"
              >
                CONTACT_WHATSAPP →
              </a>
            </div>
          </div>
        </section>
      </main>
      <FloatingActions />
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4 z-30">
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: TRAINER_AVAILABLE</p>
      </footer>
    </div>
  );
}
