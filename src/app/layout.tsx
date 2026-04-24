import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import FooterVisibility from "@/components/FooterVisibility";
import GlobalChatWidget from "@/components/chat/GlobalChatWidget";

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
    default: "AZDeploy Academy | Become a Real Software Engineer in 6 Months",
    template: "%s | AZDeploy Academy",
  },
  description:
    "AZDeploy Academy - Become a real software engineer in 6 months. Learn Full Stack, AI, Data Engineering & DevOps with real-world projects, deployment experience, and production-level systems. Limited batches, 30% off for first 10 students.",
  keywords: [
    "AZDeploy",
    "Software Engineer Training",
    "Full Stack Developer",
    "AI Engineer",
    "Data Engineer",
    "DevOps Engineer",
    "Backend Developer",
    "Frontend Developer",
    "Linux",
    "Nginx",
    "Docker",
    "CI/CD",
    "Belagavi IT Training",
  ],
  authors: [{ name: "AZDeploy Academy" }],
  openGraph: {
    title: "AZDeploy Academy | Become a Real Software Engineer",
    description:
      "Full Stack + AI + DevOps — All-in-One program with real production experience. Learn, Build, Deploy, Scale, Get Hired.",
    type: "website",
    url: getSiteUrl(),
    siteName: "AZ Deploy Academy",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AZDeploy Academy | Become a Real Software Engineer",
    description:
      "Learn Full Stack, AI, Data & DevOps with real-world systems and live projects.",
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
        <GlobalChatWidget />
        <FooterVisibility />
      </body>
    </html>
  );
}
