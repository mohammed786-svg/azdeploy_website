import type { Metadata } from "next";
import CityLandingPage from "@/components/CityLandingPage";
import { CITY_LANDINGS } from "@/lib/city-landing";
import { getSiteUrl } from "@/lib/site-url";

const landing = CITY_LANDINGS.find((c) => c.slug === "software-training-in-belgaum")!;

export const metadata: Metadata = {
  title: "Best Software Training Institute in Belgaum",
  description:
    "Looking for software training in Belgaum? AZDeploy Academy provides placement-focused Full Stack, AI, and DevOps training with practical learning.",
  alternates: { canonical: `${getSiteUrl()}/${landing.slug}` },
  keywords: landing.focusKeywords,
};

export default function Page() {
  return <CityLandingPage landing={landing} />;
}

