import Link from "next/link";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import type { CityLanding } from "@/lib/city-landing";
import { CITY_LANDINGS, cityLandingUrl } from "@/lib/city-landing";

export default function CityLandingPage({ landing }: { landing: CityLanding }) {
  const others = CITY_LANDINGS.filter((c) => c.slug !== landing.slug);

  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <h1 className="text-2xl sm:text-4xl font-bold text-white text-glow-teal text-center">
            Best Software Training Institute in {landing.city}
          </h1>
          <p className="mt-4 text-center text-white/75 max-w-3xl mx-auto">
            AZDeploy Academy offers job-ready Full Stack, AI, and DevOps training for learners in {landing.city},{" "}
            {landing.region}. Our program is built for real placement outcomes with practical projects, deployment
            experience, and mentor guidance.
          </p>

          <div className="mt-8 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#00d4ff]">Why students from {landing.city} choose us</h2>
            <ul className="mt-4 space-y-3 text-white/85 text-sm sm:text-base">
              <li>Training by mentors with real product deployment experience.</li>
              <li>One integrated track: Full Stack + AI + DevOps in 6 months.</li>
              <li>Small batches with code reviews and interview preparation.</li>
              <li>Suitable for students and working professionals {landing.nearbyCopy}.</li>
            </ul>
          </div>

          <div className="mt-6 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#00d4ff]">Popular searches we cover</h2>
            <p className="mt-3 text-white/80 text-sm sm:text-base">
              {landing.focusKeywords.join(" • ")}
            </p>
          </div>

          <div className="mt-6 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#00d4ff]">Quick links</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/courses" className="px-4 py-2 border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/15">
                View Courses
              </Link>
              <Link href="/contact" className="px-4 py-2 border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/15">
                Contact Academy
              </Link>
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/15"
              >
                WhatsApp Now
              </a>
            </div>
          </div>

          <div className="mt-6 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#00d4ff]">Nearby city pages</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {others.map((c) => (
                <Link
                  key={c.slug}
                  href={cityLandingUrl(c.slug)}
                  className="text-xs sm:text-sm px-3 py-2 border border-white/20 text-white/80 hover:text-white hover:border-[#00d4ff]/50"
                >
                  {c.city}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FloatingActions />
    </div>
  );
}

