import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact AZDeploy Academy. Office: Plot 516, Ramteerth Nagar, Belagavi. WhatsApp & call: +91 82965 65587, +91 89712 44513, +91 73383 60607.",
};

const OFFICE = {
  addressLine1: "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590017",
  addressLine2: "VFF GROUP - First Floor",
  mapLat: 15.891116051838667,
  mapLng: 74.54251765767174,
};

const CONTACT_NUMBERS = [
  { display: "+91 82965 65587", raw: "918296565587" },
  { display: "+91 89712 44513", raw: "918971244513" },
  { display: "+91 73383 60607", raw: "917338360607" },
];

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

            {/* Contact numbers — WhatsApp & Call */}
            <div>
              <p className="text-white/50 text-xs font-mono uppercase tracking-wider mb-4">CONTACT_NUMBERS</p>
              <p className="text-white/60 text-xs mb-4">Reach us on WhatsApp or call. All numbers available on both.</p>
              <ul className="space-y-4">
                {CONTACT_NUMBERS.map((num) => (
                  <li key={num.raw} className="border border-[#00d4ff]/20 rounded p-4 bg-black/30">
                    <p className="text-white/90 font-mono font-semibold mb-3">{num.display}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://wa.me/${num.raw}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#00d4ff]/50 text-[#00d4ff] text-xs font-mono hover:bg-[#00d4ff]/20 transition-colors"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${num.raw}`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[#00d4ff]/50 text-[#00d4ff] text-xs font-mono hover:bg-[#00d4ff]/20 transition-colors"
                      >
                        Call
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-[#00d4ff]/20 text-center">
              <p className="text-white/60 text-xs mb-4 font-mono">
                LIMITED_SEATS: 3_BATCHES | 25_PER_BATCH | FIRST_10_GET_30%_OFF
              </p>
              <a
                href={`https://wa.me/${CONTACT_NUMBERS[0].raw}`}
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
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: CONTACT_OPEN — WhatsApp & Call</p>
      </footer>
    </div>
  );
}
