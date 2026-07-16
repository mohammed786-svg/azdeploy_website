import type { Metadata } from "next";
import CityLandingPage from "@/components/CityLandingPage";
import { getCityLanding } from "@/lib/city-landing";
import { getSiteUrl } from "@/lib/site-url";

const landing = getCityLanding("software-training-in-hubli")!;

export const metadata: Metadata = {
  title: { absolute: landing.seoTitle },
  description: landing.seoDescription,
  alternates: { canonical: `${getSiteUrl()}/${landing.slug}` },
  keywords: landing.focusKeywords,
  openGraph: {
    title: landing.seoTitle,
    description: landing.seoDescription,
    url: `${getSiteUrl()}/${landing.slug}`,
    locale: "en_IN",
    type: "website",
  },
};

export default function Page() {
  return <CityLandingPage landing={landing} />;
}
