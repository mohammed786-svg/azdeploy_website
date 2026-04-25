"use client";

import { usePathname } from "next/navigation";
import WebsiteChatWidget from "@/components/chat/WebsiteChatWidget";

export default function GlobalChatWidget() {
  const p = usePathname();
  const floatingActionsPages = [
    "/home",
    "/courses",
    "/blog",
    "/enquiry",
    "/services",
    "/about",
    "/trainer",
    "/contact",
  ];
  if (p.startsWith("/hq")) return null;
  if (floatingActionsPages.some((route) => p === route || p.startsWith(`${route}/`))) return null;
  if (p === "/" || p.startsWith("/home")) return null;
  return <WebsiteChatWidget />;
}
