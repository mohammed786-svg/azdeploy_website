"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage, chatWsBase, fetchVisitorChatSession, getVisitorId } from "@/lib/chatbot-client";

type Props = {
  embedded?: boolean;
  launcherClassName?: string;
};

function bubbleClass(sender: string): string {
  if (sender === "user") return "ml-auto bg-[#dcf8c6] text-[#111b21] rounded-2xl border border-[#9ad98f]/45";
  if (sender === "agent") return "bg-white text-[#111b21] rounded-2xl border border-black/10";
  return "bg-white text-[#111b21] rounded-2xl border border-black/10";
}

const QUICK_REPLY_OPTIONS = [
  "Batch timings",
  "Course details",
  "Fees and offers",
  "Contact numbers",
  "Office location",
];

export default function WebsiteChatWidget({ embedded = false, launcherClassName = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const visitorId = useMemo(() => getVisitorId(), []);
  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [detailsCompleted, setDetailsCompleted] = useState(false);
  const reconnectRef = useRef<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const d = await fetchVisitorChatSession(visitorId);
        if (!active) return;
        setMessages(d.messages || []);
        setSessionId(d.session.id);
        setDetailsCompleted(Boolean(d.session.detailsCompleted));
      } catch {
        /* ignore */
      }
      const devMode = Number(process.env.NEXT_PUBLIC_API_DEV_MODE ?? "1");
      const browserHost =
        typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";
      const candidates = Array.from(
        new Set(
          devMode === 1
            ? [
                chatWsBase(),
                `ws://${browserHost}:8001`,
                `ws://${browserHost}:8000`,
              ]
            : [chatWsBase()]
        )
      );
      let idx = 0;
      const connect = () => {
        const base = candidates[Math.min(idx, candidates.length - 1)];
        const ws = new WebSocket(`${base}/ws/chat/visitor/${encodeURIComponent(visitorId)}`);
        wsRef.current = ws;
        ws.onopen = () => {
          setConnected(true);
          idx = 0;
        };
        ws.onclose = () => {
          setConnected(false);
          if (!active) return;
          idx = Math.min(idx + 1, candidates.length - 1);
          reconnectRef.current = window.setTimeout(connect, 1500);
        };
        ws.onmessage = (ev) => {
          try {
            const payload = JSON.parse(ev.data) as { type?: string; payload?: ChatMessage; sessionId?: number };
            if (payload.type === "connected" && payload.sessionId) setSessionId(payload.sessionId);
            if (payload.type === "message" && payload.payload) {
              setTyping(payload.payload.sender === "bot");
              setMessages((prev) => [...prev, payload.payload as ChatMessage]);
              const txt = String(payload.payload.message || "").toLowerCase();
              if (payload.payload.sender === "bot" && txt.includes("details are captured")) {
                setDetailsCompleted(true);
              }
              if ((payload.payload.sender as string) === "bot") {
                setTimeout(() => setTyping(false), 700);
              }
            }
          } catch {
            /* ignore */
          }
        };
      };
      connect();
    })();
    return () => {
      active = false;
      if (reconnectRef.current != null) window.clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [visitorId]);

  function send() {
    const v = text.trim();
    if (!v || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ message: v }));
    setText("");
  }

  function sendQuickReply(value: string) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ message: value }));
  }

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  return (
    <div className={embedded ? "relative z-[60]" : "fixed bottom-40 right-4 sm:bottom-44 sm:right-5 z-[60]"}>
      {open ? (
        <div
          className={`${
            embedded
              ? "fixed bottom-24 right-2 left-2 sm:absolute sm:bottom-full sm:right-0 sm:left-auto sm:mb-3"
              : "fixed bottom-24 right-2 left-2 sm:bottom-44 sm:right-5 sm:left-auto"
          } w-auto sm:w-[min(94vw,360px)] h-[min(72dvh,520px)] rounded-2xl overflow-hidden shadow-2xl border border-black/20 bg-[#efeae2] flex flex-col`}
        >
          <div className="px-4 py-3 bg-[#075e54] text-white flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">AZ Deploy Assistant</p>
              <p className="text-[11px] opacity-90">{connected ? "online" : "connecting..."}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-sm opacity-90 hover:opacity-100">
              ✕
            </button>
          </div>
          <div
            className="flex-1 p-3 overflow-y-auto space-y-2 bg-[#efeae2]"
            style={{
              backgroundImage:
                "url('/logo_gold.png'), url('/chat-icons-gold.svg'), linear-gradient(rgba(255,255,255,0.82),rgba(255,255,255,0.82))",
              backgroundSize: "72px 46px, 280px 280px, auto",
              backgroundPosition: "0 0, 0 0, 0 0",
              backgroundRepeat: "repeat, repeat, repeat",
            }}
          >
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[85%] px-3 py-2 text-sm shadow-sm ${bubbleClass(m.sender)}`}>
                <div className="whitespace-pre-wrap break-words">{m.message}</div>
              </div>
            ))}
            {typing ? (
              <div className="max-w-[65%] rounded-lg rounded-tl-sm px-3 py-2 text-sm shadow-sm bg-white text-[#111b21]">
                <span className="animate-pulse">typing...</span>
              </div>
            ) : null}
            <div ref={endRef} />
          </div>
          {detailsCompleted ? (
            <div className="px-2 py-2 bg-[#f0f2f5] border-t border-black/10 overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {QUICK_REPLY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => sendQuickReply(opt)}
                    className="rounded-full border border-[#25d366]/45 bg-white px-3 py-1.5 text-xs font-medium text-[#128c7e] whitespace-nowrap transition hover:bg-[#ecfff3]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="relative p-2 bg-[#f0f2f5] border-t border-black/10 flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder={sessionId ? "Type message..." : "Loading..."}
              className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-[#111b21] placeholder:text-neutral-500 outline-none"
            />
            <button
              onClick={send}
              className="h-10 w-10 rounded-full bg-[#25d366] text-[#075e54] flex items-center justify-center shadow-sm hover:bg-[#20bf5a] transition"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={
            launcherClassName ||
            "rounded-full bg-[#25d366] text-black px-5 py-3 shadow-xl font-semibold"
          }
        >
          Chat
        </button>
      )}
    </div>
  );
}
