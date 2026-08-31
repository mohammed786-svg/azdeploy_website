import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ebook Studio",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
