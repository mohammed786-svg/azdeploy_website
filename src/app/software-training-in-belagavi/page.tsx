import type { Metadata } from "next";
import CityLandingPage from "@/components/CityLandingPage";
import { CITY_LANDINGS } from "@/lib/city-landing";
import { getSiteUrl } from "@/lib/site-url";

const landing = CITY_LANDINGS.find((c) => c.slug === "software-training-in-belagavi")!;

export const metadata: Metadata = {
  title: "Best Software Training Institute in Belagavi",
  description:
    "Looking for the best software institute in Belagavi? AZDeploy Academy offers Full Stack, AI, and DevOps job-ready training with real projects and mentorship.",
  alternates: { canonical: `${getSiteUrl()}/${landing.slug}` },
  keywords: landing.focusKeywords,
};

export default function Page() {
  return <CityLandingPage landing={landing} />;
}

