import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import BrochureViewer from "@/components/BrochureViewer";

export const metadata: Metadata = {
  title: "Brochure",
  description:
    "AZDeploy Academy brochure: services, courses, and contact. Job-ready IT training, Python Full Stack, Android Development. Belagavi office.",
};

export default function BrochurePage() {
  return (
    <div className="min-h-screen hud-bg">
      <HudHeader />
      <BrochureViewer />
    </div>
  );
}
