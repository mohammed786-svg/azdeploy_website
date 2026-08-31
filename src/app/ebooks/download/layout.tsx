import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download ebook",
  robots: { index: false, follow: false },
};

export default function EbookDownloadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
