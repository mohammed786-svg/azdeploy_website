import { resolveApiOrigin } from "@/lib/api-http";

export type ChatMessage = {
  id: number;
  sessionId: number;
  sender: "user" | "bot" | "agent";
  message: string;
  createdAt?: string | null;
};

export type ChatSessionData = {
  id: number;
  visitorId: string;
  detailsCompleted: boolean;
  fullName?: string;
  email?: string;
  phone?: string;
  degree?: string;
  college?: string;
  passoutYear?: string;
  city?: string;
};

export function chatApiBase(): string {
  const explicit = process.env.NEXT_PUBLIC_DJANGO_API_BASE?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  return `${resolveApiOrigin().replace(/\/$/, "")}/api/v1`;
}

export function chatWsBase(): string {
  const explicit = process.env.NEXT_PUBLIC_DJANGO_WS_BASE?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const origin = resolveApiOrigin().replace(/\/$/, "");
  if (origin.startsWith("https://")) return origin.replace("https://", "wss://");
  if (origin.startsWith("http://")) return origin.replace("http://", "ws://");
  return "ws://127.0.0.1:8001";
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  const key = "az_chat_visitor_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const id = `v_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
  window.localStorage.setItem(key, id);
  return id;
}

export async function fetchVisitorChatSession(visitorId: string): Promise<{ session: ChatSessionData; messages: ChatMessage[] }> {
  const res = await fetch(`${chatApiBase()}/chat/session?visitorId=${encodeURIComponent(visitorId)}`, {
    credentials: "include",
  });
  const body = (await res.json()) as { success?: boolean; data?: { session: ChatSessionData; messages: ChatMessage[] } };
  if (!res.ok || body?.success === false || !body?.data) throw new Error("Failed to load chat session");
  return body.data;
}
