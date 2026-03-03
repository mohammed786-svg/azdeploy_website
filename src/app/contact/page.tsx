import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact AZDeploy Academy. Office: Plot 516, Ramteerth Nagar, Belagavi. VFF GROUP Building, First Floor. WhatsApp +91 82965 65587.",
};

const OFFICE = {
  addressLine1: "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590017",
  addressLine2: "VFF GROUP - First Floor",
  whatsapp: "+91 82965 65587",
  mapLat: 15.891116051838667,
  mapLng: 74.54251765767174,
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

          <div className="hud-panel p-8 md:p-12 space-y-8">
            <p className="text-white/70 text-sm text-center">
              For course details, batch schedules, enrollment, and any queries, reach us on WhatsApp or visit our office.
            </p>

            {/* Office location - address + map */}
            <div className="border border-[#00d4ff]/30 rounded p-4 bg-black/30">
              <p className="text-[#00d4ff] text-xs font-mono uppercase tracking-wider mb-3">OFFICE_LOCATION</p>
              <p className="text-white/90 text-sm">{OFFICE.addressLine1}</p>
              <p className="text-white/90 text-sm font-semibold text-[#00d4ff]/90 mt-1">{OFFICE.addressLine2}</p>
            </div>

            {/* Map */}
            <div className="rounded overflow-hidden border border-[#00d4ff]/30 bg-black/30">
              <div className="flex items-center justify-between flex-wrap gap-2 p-3 pb-0">
                <p className="text-[#00d4ff] text-xs font-mono uppercase tracking-wider">MAP</p>
                <a
                  href={`https://www.google.com/maps?q=${OFFICE.mapLat},${OFFICE.mapLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00d4ff]/80 text-xs font-mono hover:text-[#00d4ff]"
                >
                  Open in Google Maps →
                </a>
              </div>
              <iframe
                title="AZDeploy Academy office location"
                src={`https://www.google.com/maps?q=${OFFICE.mapLat},${OFFICE.mapLng}&z=17&output=embed`}
                className="w-full min-h-[200px] border-0 aspect-video"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* WhatsApp */}
            <div className="text-center">
              <p className="text-white/50 text-xs font-mono uppercase tracking-wider mb-2">WHATSAPP</p>
              <a
                href={`https://wa.me/${OFFICE.whatsapp.replace(/[\s+]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-bold text-[#00d4ff] text-glow-teal hover:text-[#00e5cc] transition-colors font-mono"
              >
                {OFFICE.whatsapp}
              </a>
            </div>

            <div className="pt-6 border-t border-[#00d4ff]/20 text-center">
              <p className="text-white/60 text-xs mb-4 font-mono">
                LIMITED_SEATS: 3_BATCHES | 25_PER_BATCH | FIRST_10_GET_30%_OFF
              </p>
              <a
                href={`https://wa.me/${OFFICE.whatsapp.replace(/[\s+]/g, '')}`}
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
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: CONTACT_OPEN — {OFFICE.whatsapp}</p>
      </footer>
    </div>
  );
}
