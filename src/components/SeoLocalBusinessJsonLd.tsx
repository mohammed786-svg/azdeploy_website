import { ACADEMY_CONTACT_NUMBERS, ACADEMY_OFFICE, academyGoogleMapsUrl } from "@/lib/contact-info";
import { getSiteUrl } from "@/lib/site-url";

export default function SeoLocalBusinessJsonLd() {
  const site = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${site}/#organization`,
    name: "AZDeploy Academy",
    url: site,
    logo: `${site}/logo_gold.png`,
    image: `${site}/logo_gold.png`,
    description:
      "Software training institute in Belagavi offering Full-Stack, AI, and DevOps job-ready programs.",
    telephone: ACADEMY_CONTACT_NUMBERS[0].display,
    contactPoint: ACADEMY_CONTACT_NUMBERS.map((n) => ({
      "@type": "ContactPoint",
      contactType: "customer support",
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
      { "@type": "City", name: "Dharwad" },
      { "@type": "City", name: "Kolhapur" },
    ],
    hasMap: academyGoogleMapsUrl(),
    sameAs: [site],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
