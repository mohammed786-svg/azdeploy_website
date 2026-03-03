import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact AZDeploy Academy for enrollment. WhatsApp +91 82965 65587. Limited seats—Python Full Stack and Android Development. First 10 students get 30% off.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-glow-teal text-center mb-8 hud-label">
            [CONTACT_US]
          </h1>

          <div className="hud-panel p-8 md:p-12 text-center space-y-8">
            <p className="text-white/70 text-sm">
              For course details, batch schedules, enrollment, and any queries, reach us on WhatsApp.
            </p>
            <div>
              <p className="text-white/50 text-xs font-mono uppercase tracking-wider mb-2">WHATSAPP</p>
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold text-[#00d4ff] text-glow-teal hover:text-[#00e5cc] transition-colors font-mono"
              >
                +91 82965 65587
              </a>
            </div>
            <div className="pt-6 border-t border-[#00d4ff]/20">
              <p className="text-white/60 text-xs mb-4 font-mono">
                LIMITED_SEATS: 3_BATCHES | 25_PER_BATCH | FIRST_10_GET_30%_OFF
              </p>
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono hover:bg-[#00d4ff]/20 transition-colors"
              >
                MESSAGE_WHATSAPP →
              </a>
            </div>
          </div>
        </section>
      </main>
      <FloatingActions />
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4 z-30">
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: CONTACT_OPEN — +91 82965 65587</p>
      </footer>
    </div>
  );
}
