"use client";

import { usePathname } from "next/navigation";
import WebsiteChatWidget from "@/components/chat/WebsiteChatWidget";

export default function GlobalChatWidget() {
  const p = usePathname();
  if (p.startsWith("/hq")) return null;
  if (p.startsWith("/courses")) return null;
  if (p === "/" || p.startsWith("/home")) return null;
  return <WebsiteChatWidget />;
}
