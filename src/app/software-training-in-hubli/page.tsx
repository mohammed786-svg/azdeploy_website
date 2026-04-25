import type { Metadata } from "next";
import CityLandingPage from "@/components/CityLandingPage";
import { CITY_LANDINGS } from "@/lib/city-landing";
import { getSiteUrl } from "@/lib/site-url";

const landing = CITY_LANDINGS.find((c) => c.slug === "software-training-in-hubli")!;

export const metadata: Metadata = {
  title: "Software Training Institute in Hubli",
  description:
    "Searching for software training in Hubli? Learn Full Stack, AI, and DevOps with AZDeploy Academy’s job-ready curriculum and mentorship.",
  alternates: { canonical: `${getSiteUrl()}/${landing.slug}` },
  keywords: landing.focusKeywords,
};

export default function Page() {
  return <CityLandingPage landing={landing} />;
}

