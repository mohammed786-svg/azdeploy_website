import { ACADEMY_CONTACT_NUMBERS, ACADEMY_OFFICE, academyGoogleMapsUrl } from "@/lib/contact-info";
import { getSiteUrl } from "@/lib/site-url";

export default function SeoLocalBusinessJsonLd() {
  const site = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${site}/#organization`,
    name: "AZDeploy Academy",
    alternateName: ["AZ Deploy Academy", "Best Software Training Institute Belagavi"],
    url: site,
    logo: `${site}/logo_gold.png`,
    image: `${site}/logo_gold.png`,
    description:
      "Best software training academy in Belagavi (Belgaum) for Full-Stack, AI, and DevOps. Serving students from Belagavi, Hubli, Hubballi, Dharwad, and Kolhapur.",
    telephone: ACADEMY_CONTACT_NUMBERS[0].display,
    priceRange: "₹₹",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    contactPoint: ACADEMY_CONTACT_NUMBERS.map((n) => ({
      "@type": "ContactPoint",
      contactType: "admissions",
      telephone: n.display,
      areaServed: "IN",
      availableLanguage: ["en", "hi", "kn", "mr"],
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ACADEMY_OFFICE.addressLine1}, ${ACADEMY_OFFICE.addressLine2}`,
      addressLocality: "Belagavi",
      addressRegion: "Karnataka",
      postalCode: "590016",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: ACADEMY_OFFICE.mapLat,
      longitude: ACADEMY_OFFICE.mapLng,
    },
    areaServed: [
      { "@type": "City", name: "Belagavi" },
      { "@type": "City", name: "Belgaum" },
      { "@type": "City", name: "Hubli" },
      { "@type": "City", name: "Hubballi" },
      { "@type": "City", name: "Dharwad" },
      { "@type": "City", name: "Kolhapur" },
    ],
    knowsAbout: [
      "Full Stack Development",
      "Python Django",
      "React",
      "DevOps",
      "AI and Generative AI",
      "Software Engineer Training Belagavi",
    ],
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Course",
        name: "Full-Stack + AI + DevOps — Industry Ready Program",
        description:
          "6-month job-ready software engineering program in Belagavi covering React, Django, PostgreSQL, Linux, Nginx, Docker, CI/CD, AWS, and AI.",
        provider: { "@type": "Organization", name: "AZDeploy Academy", url: site },
        url: `${site}/courses`,
      },
    },
    hasMap: academyGoogleMapsUrl(),
    sameAs: [site],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
