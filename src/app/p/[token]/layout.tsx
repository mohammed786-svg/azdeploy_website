import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AZDeploy Academy — Company Profile",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default function CompanyProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
