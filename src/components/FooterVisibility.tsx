"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function FooterVisibility() {
  const pathname = usePathname();
  const hiddenPrefixes = ["/hq", "/android-doc", "/python-doc"];
  const shouldHide = hiddenPrefixes.some((p) => pathname.startsWith(p));
  if (shouldHide) return null;
  return <Footer />;
}

