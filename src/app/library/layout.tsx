import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ebook Library",
  robots: { index: false, follow: false },
};

export default function LibraryRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
