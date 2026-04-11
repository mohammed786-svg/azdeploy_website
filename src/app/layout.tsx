import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "AZDeploy Academy | Job-Ready IT Training | Python Full Stack & Android",
    template: "%s | AZDeploy Academy",
  },
  description:
    "AZDeploy Academy - Software training company making students job-ready. Learn Python Full Stack & Android Development from industry experts with 8+ years experience, 500+ products deployed. Limited batches, 30% off for first 10.",
  keywords: [
    "AZDeploy",
    "IT training",
    "Python Full Stack",
    "Android Development",
    "Job ready",
    "Cyber security",
    "Linux",
    "Ubuntu",
    "Kali Linux",
    "Nginx",
    "Blog",
    "DevOps training",
  ],
  authors: [{ name: "AZDeploy Academy" }],
  openGraph: {
    title: "AZDeploy Academy | Job-Ready IT Training",
    description: "Building student lives with real IT knowledge. Python Full Stack & Android Development.",
    type: "website",
    url: getSiteUrl(),
    siteName: "AZ Deploy Academy",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AZDeploy Academy | Job-Ready IT Training",
    description: "Python Full Stack & Android Development from industry experts.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/logo_gold.png", type: "image/png" }],
    apple: "/logo_gold.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden min-w-0`}>
        {children}
      </body>
    </html>
  );
}
