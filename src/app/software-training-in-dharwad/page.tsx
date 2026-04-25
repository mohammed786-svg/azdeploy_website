import type { Metadata } from "next";
import CityLandingPage from "@/components/CityLandingPage";
import { CITY_LANDINGS } from "@/lib/city-landing";
import { getSiteUrl } from "@/lib/site-url";

const landing = CITY_LANDINGS.find((c) => c.slug === "software-training-in-dharwad")!;

export const metadata: Metadata = {
  title: "Software Training Institute in Dharwad",
  description:
    "Find software training in Dharwad with AZDeploy Academy: Full Stack, AI, and DevOps program with real projects and placement-focused learning.",
  alternates: { canonical: `${getSiteUrl()}/${landing.slug}` },
  keywords: landing.focusKeywords,
};

export default function Page() {
  return <CityLandingPage landing={landing} />;
}

