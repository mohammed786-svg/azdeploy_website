import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Desk",
  robots: { index: false, follow: false },
};

export default function SalesRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
