import type { Metadata } from "next";
import CityLandingPage from "@/components/CityLandingPage";
import { CITY_LANDINGS } from "@/lib/city-landing";
import { getSiteUrl } from "@/lib/site-url";

const landing = CITY_LANDINGS.find((c) => c.slug === "software-training-in-kolhapur")!;

export const metadata: Metadata = {
  title: "Software Training Institute in Kolhapur",
  description:
    "Looking for software training in Kolhapur (Kholapur)? AZDeploy Academy offers practical Full Stack, AI, and DevOps training with industry mentorship.",
  alternates: { canonical: `${getSiteUrl()}/${landing.slug}` },
  keywords: landing.focusKeywords,
};

export default function Page() {
  return <CityLandingPage landing={landing} />;
}

