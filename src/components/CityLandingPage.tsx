import Link from "next/link";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import type { CityLanding } from "@/lib/city-landing";
import { CITY_LANDINGS, cityLandingUrl } from "@/lib/city-landing";
import { ACADEMY_CONTACT_NUMBERS, ACADEMY_OFFICE, academyGoogleMapsUrl } from "@/lib/contact-info";
import { getSiteUrl } from "@/lib/site-url";

function CityLandingJsonLd({ landing }: { landing: CityLanding }) {
  const site = getSiteUrl();
  const pageUrl = `${site}/${landing.slug}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site}/home` },
      { "@type": "ListItem", position: 2, name: "Courses", item: `${site}/courses` },
      { "@type": "ListItem", position: 3, name: landing.headline, item: pageUrl },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: landing.seoTitle,
    description: landing.seoDescription,
    about: {
      "@type": "EducationalOrganization",
      name: "AZDeploy Academy",
      url: site,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${ACADEMY_OFFICE.addressLine1}, ${ACADEMY_OFFICE.addressLine2}`,
        addressLocality: "Belagavi",
        addressRegion: "Karnataka",
        postalCode: "590016",
        addressCountry: "IN",
      },
    },
    speaksAbout: [landing.city, ...(landing.aliases ?? []), "Full Stack", "AI", "DevOps"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
    </>
  );
}

export default function CityLandingPage({ landing }: { landing: CityLanding }) {
  const others = CITY_LANDINGS.filter((c) => c.slug !== landing.slug);
  const aliasLine =
    landing.aliases && landing.aliases.length > 0
      ? ` Also searched as ${landing.aliases.join(" / ")}.`
      : "";

  return (
    <div className="min-h-screen hud-bg hud-grid">
      <CityLandingJsonLd landing={landing} />
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <nav className="text-[11px] font-mono text-white/45 mb-6 flex flex-wrap gap-x-2 gap-y-1" aria-label="Breadcrumb">
            <Link href="/home" className="hover:text-[#00d4ff]">
              Home
            </Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-[#00d4ff]">
              Courses
            </Link>
            <span>/</span>
            <span className="text-white/70">{landing.city}</span>
          </nav>

          <h1 className="text-2xl sm:text-4xl font-bold text-white text-glow-teal text-center leading-tight">
            {landing.headline}
          </h1>
          <p className="mt-2 text-center text-[11px] sm:text-xs font-mono uppercase tracking-[0.18em] text-[#7dd3fc]">
            {landing.city}, {landing.state} · {landing.region}
            {aliasLine}
          </p>
          <p className="mt-4 text-center text-white/75 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
            {landing.intro}
          </p>

          <div className="mt-8 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#00d4ff]">
              Why students from {landing.city} choose AZDeploy Academy
            </h2>
            <ul className="mt-4 space-y-3 text-white/85 text-sm sm:text-base">
              {landing.whyBullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-[#00d4ff] shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-white/70 leading-relaxed border-t border-white/10 pt-4">{landing.localAngle}</p>
          </div>

          <div className="mt-6 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#00d4ff]">Programs for {landing.city} learners</h2>
            <ul className="mt-4 space-y-2 text-white/85 text-sm sm:text-base">
              {landing.programs.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-[#00f5d4] shrink-0">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[#94a3b8]">{landing.commuteNote}</p>
          </div>

          <div className="mt-6 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#00d4ff]">Belagavi campus · NAP</h2>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">{ACADEMY_OFFICE.addressLine1}</p>
            <p className="text-sm text-[#00d4ff]/90 font-medium">{ACADEMY_OFFICE.addressLine2}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {ACADEMY_CONTACT_NUMBERS.map((n) => (
                <a
                  key={n.raw}
                  href={`https://wa.me/${n.raw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00d4ff] hover:underline font-mono"
                >
                  {n.display}
                </a>
              ))}
              <a
                href={academyGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00f5d4] hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="mt-6 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#00d4ff]">FAQs — {landing.city}</h2>
            <div className="mt-4 space-y-4">
              {landing.faqs.map((f) => (
                <div key={f.question} className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-sm sm:text-base font-semibold text-white">{f.question}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#00d4ff]">Get started from {landing.city}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/courses" className="px-4 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/15 text-sm font-medium">
                View Courses
              </Link>
              <Link href="/enquiry" className="px-4 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/15 text-sm font-medium">
                Enquiry Form
              </Link>
              <Link href="/contact" className="px-4 py-2.5 border border-[#00d4ff]/40 text-[#00d4ff] hover:bg-[#00d4ff]/15 text-sm font-medium">
                Contact Academy
              </Link>
              <a
                href={`https://wa.me/${ACADEMY_CONTACT_NUMBERS[0].raw}?text=${encodeURIComponent(
                  `Hi AZDeploy Academy, I am from ${landing.city} and interested in Full-Stack + AI + DevOps training.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 border border-[#25D366]/50 text-[#86efac] hover:bg-[#25D366]/15 text-sm font-medium"
              >
                WhatsApp from {landing.city}
              </a>
            </div>
          </div>

          <div className="mt-6 hud-panel p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-[#00d4ff]">Training across North Karnataka &amp; Kolhapur</h2>
            <p className="mt-2 text-sm text-white/65">
              AZDeploy Academy serves Belagavi / Belgaum as the home campus, plus learners from Hubli, Hubballi, Dharwad, and
              Kolhapur.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {others.map((c) => (
                <Link
                  key={c.slug}
                  href={cityLandingUrl(c.slug)}
                  className="text-xs sm:text-sm px-3 py-2 border border-white/20 text-white/80 hover:text-white hover:border-[#00d4ff]/50"
                >
                  {c.city}
                  {c.aliases?.[0] ? ` / ${c.aliases[0]}` : ""}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-[10px] font-mono text-white/35 leading-relaxed max-w-2xl mx-auto">
            Related searches: {landing.focusKeywords.slice(0, 5).join(" · ")}
          </p>
        </section>
      </main>
      <FloatingActions />
    </div>
  );
}
