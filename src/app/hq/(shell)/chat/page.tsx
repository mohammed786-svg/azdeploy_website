"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { chatWsBase } from "@/lib/chatbot-client";
import { hqFetch } from "@/lib/hq-client";
import { hqListUrl } from "@/lib/hq-list-url";

type SessionRow = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  detailsCompleted: boolean;
  lastMessage: string;
  updatedAt?: string;
};

type Msg = { id: number; sender: "user" | "bot" | "agent"; message: string; createdAt?: string };

function initials(name: string): string {
  const p = (name || "V").trim().split(/\s+/).slice(0, 2);
  return p.map((x) => x[0]?.toUpperCase() || "").join("") || "V";
}

function timeText(v?: string): string {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toLowerCase();
}

export default function HqChatInboxPage() {
  const [items, setItems] = useState<SessionRow[]>([]);
  const [active, setActive] = useState<SessionRow | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Favourites" | "Groups">("All");
  const [favourites, setFavourites] = useState<Set<number>>(new Set());
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function loadSessions() {
    setLoading(true);
    try {
      const d = await hqFetch<{ items: SessionRow[] }>(hqListUrl("/api/hq/chat/sessions", { page: 1, pageSize: 200, sort: "updatedAt_desc" }));
      setItems(d.items || []);
      if (!active && d.items?.length) setActive(d.items[0]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSessions();
  }, []);

  useEffect(() => {
    if (!active) return;
    let cancel = false;
    (async () => {
      const d = await hqFetch<{ items: Msg[] }>(`/api/hq/chat/messages/${active.id}`);
      if (!cancel) setMessages(d.items || []);
    })();
    wsRef.current?.close();
    const ws = new WebSocket(`${chatWsBase()}/ws/chat/hq/${active.id}`);
    wsRef.current = ws;
    ws.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data) as { type?: string; payload?: Msg };
        if (payload.type === "message" && payload.payload) {
          setMessages((prev) => [...prev, payload.payload as Msg]);
        }
      } catch {
        /* ignore */
      }
    };
    return () => {
      cancel = true;
      ws.close();
    };
  }, [active?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, active?.id]);

  function send() {
    const v = text.trim();
    if (!v || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ message: v }));
    setText("");
    setShowEmoji(false);
  }

  const title = useMemo(() => {
    if (!active) return "Select a conversation";
    return `${active.fullName || "Visitor"}${active.phone ? ` · ${active.phone}` : ""}`;
  }, [active]);

  const filteredItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return items.filter((s) => {
      const txt = `${s.fullName} ${s.email} ${s.phone} ${s.lastMessage}`.toLowerCase();
      if (q && !txt.includes(q)) return false;
      if (activeFilter === "Unread") return !s.detailsCompleted;
      if (activeFilter === "Favourites") return favourites.has(s.id);
      if (activeFilter === "Groups") return /group|team|batch/i.test(s.fullName || "");
      return true;
    });
  }, [items, searchText, activeFilter, favourites]);

  function sendSystemText(v: string) {
    if (!v.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ message: v }));
  }

  return (
    <div className="h-[calc(100dvh-7.5rem)] rounded-2xl border border-[#2a3942] overflow-hidden grid grid-cols-1 lg:grid-cols-[390px_1fr] bg-[#111b21] font-sans">
      <aside className="border-r border-[#2a3942] bg-[#111b21] overflow-y-auto">
        <div className="px-4 py-3 border-b border-[#2a3942] bg-[#202c33]">
          <div className="flex items-center justify-between">
            <h1 className="text-[22px] font-semibold text-[#e9edef]">WhatsApp</h1>
            <div className="relative flex items-center gap-3 text-[#aebac1]">
              <button
                type="button"
                onClick={() => {
                  void loadSessions();
                }}
                className="text-sm hover:text-white"
                aria-label="Refresh chats"
              >
                ↻
              </button>
              <button
                type="button"
                onClick={() => setShowSidebarMenu((v) => !v)}
                className="text-base hover:text-white"
                aria-label="Chat list menu"
              >
                ⋮
              </button>
              {showSidebarMenu ? (
                <div className="absolute right-0 top-7 z-20 w-44 rounded-md border border-[#2a3942] bg-[#233138] p-1 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter("All");
                      setShowSidebarMenu(false);
                    }}
                    className="w-full rounded px-3 py-2 text-left text-xs text-[#d1d7db] hover:bg-[#2a3942]"
                  >
                    Show all chats
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (active) {
                        setFavourites((prev) => {
                          const next = new Set(prev);
                          if (next.has(active.id)) next.delete(active.id);
                          else next.add(active.id);
                          return next;
                        });
                      }
                      setShowSidebarMenu(false);
                    }}
                    className="w-full rounded px-3 py-2 text-left text-xs text-[#d1d7db] hover:bg-[#2a3942]"
                  >
                    Toggle favourite
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="px-3 py-2 border-b border-[#2a3942] bg-[#111b21]">
          <input
            ref={searchInputRef}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full rounded-lg border border-[#2a3942] bg-[#202c33] px-3 py-2 text-sm text-[#e9edef] placeholder:text-[#8696a0] outline-none"
            placeholder="Search or start new chat"
          />
          <div className="mt-2 flex items-center gap-2">
            {(["All", "Unread", "Favourites", "Groups"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveFilter(t)}
                className={`rounded-full px-3 py-1 text-xs ${
                  activeFilter === t ? "bg-[#103529] text-[#d1f4cc]" : "bg-[#202c33] text-[#aebac1]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {loading ? <p className="px-4 py-4 text-sm text-[#8696a0]">Loading chats...</p> : null}
        <div className="divide-y divide-[#2a3942]">
          {filteredItems.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className={`w-full text-left px-4 py-3 hover:bg-[#202c33] ${
                active?.id === s.id ? "bg-[#2a3942]" : "bg-[#111b21]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-[#2a3942] text-[#d1d7db] text-xs font-semibold flex items-center justify-center shrink-0">
                  {initials(s.fullName || "Visitor")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-[#e9edef] font-medium truncate">{s.fullName || "Visitor"}</p>
                    <p className="text-[10px] text-[#8696a0] shrink-0">{timeText(s.updatedAt)}</p>
                  </div>
                  <p className="text-xs text-[#8696a0] mt-0.5 truncate">{s.lastMessage || "No messages yet"}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
      <section className="flex flex-col min-h-0 bg-[#0b141a]">
        <header className="px-4 py-2.5 border-b border-[#2a3942] bg-[#202c33]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-full bg-[#2a3942] text-[#d1d7db] text-xs font-semibold flex items-center justify-center shrink-0">
                {initials(active?.fullName || "Visitor")}
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[#e9edef] font-medium truncate">{title}</p>
                <p className="text-[11px] text-[#8696a0] truncate">{active?.email || "online"}</p>
              </div>
            </div>
            <div className="relative flex items-center gap-4 text-[#aebac1]">
              <button
                type="button"
                onClick={() => {
                  if (active?.phone) window.open(`https://wa.me/${active.phone.replace(/\D+/g, "")}`, "_blank", "noopener,noreferrer");
                }}
                aria-label="Open WhatsApp"
              >
                ◻
              </button>
              <button type="button" onClick={() => searchInputRef.current?.focus()} aria-label="Search chats">
                ⌕
              </button>
              <button type="button" onClick={() => setShowHeaderMenu((v) => !v)} aria-label="Conversation menu">
                ⋮
              </button>
              {showHeaderMenu ? (
                <div className="absolute right-0 top-7 z-20 w-44 rounded-md border border-[#2a3942] bg-[#233138] p-1 shadow-xl">
                  <button
                    type="button"
                    onClick={() => {
                      if (active) navigator.clipboard.writeText(`${active.fullName} ${active.phone || ""}`.trim());
                      setShowHeaderMenu(false);
                    }}
                    className="w-full rounded px-3 py-2 text-left text-xs text-[#d1d7db] hover:bg-[#2a3942]"
                  >
                    Copy contact
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([]);
                      setShowHeaderMenu(false);
                    }}
                    className="w-full rounded px-3 py-2 text-left text-xs text-[#d1d7db] hover:bg-[#2a3942]"
                  >
                    Clear view
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <div
          className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-[#0b141a]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(11,20,26,0.88), rgba(11,20,26,0.88)), url('/chat-icons-white.svg'), url('/logo_white.png')",
            backgroundSize: "auto, 280px 280px, 52px 34px",
            backgroundPosition: "0 0, 0 0, 0 0",
            backgroundRepeat: "repeat, repeat, repeat",
          }}
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === "agent" ? "justify-end" : "justify-start"}`}>
              <div
                className={`w-fit max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm leading-relaxed border ${
                  m.sender === "agent"
                    ? "bg-[#005c4b] text-[#e9edef] border-[#0b7b66]"
                    : m.sender === "user"
                      ? "bg-[#202c33] text-[#e9edef] border-[#32444f]"
                      : "bg-[#ffffff] text-[#111b21] border-[#d8dee2]"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{m.message}</div>
                <div className="mt-1 text-[10px] text-right opacity-70">{timeText(m.createdAt)}</div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="relative p-3 border-t border-[#2a3942] bg-[#202c33] flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-9 w-9 rounded-full text-[#8696a0] hover:bg-[#2a3942] hover:text-[#e9edef] transition"
            aria-label="Attach"
          >+</button>
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className="h-9 w-9 rounded-full text-[#8696a0] hover:bg-[#2a3942] hover:text-[#e9edef] transition"
            aria-label="Emoji"
          >
            ☺
          </button>
          {showEmoji ? (
            <div className="absolute bottom-16 right-16 z-20 rounded-lg border border-[#2a3942] bg-[#233138] p-2">
              {["😀", "👍", "🙏", "✅", "🎉", "📌"].map((em) => (
                <button
                  key={em}
                  type="button"
                  className="px-1.5 py-1 text-lg"
                  onClick={() => setText((prev) => `${prev}${em}`)}
                >
                  {em}
                </button>
              ))}
            </div>
          ) : null}
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            className="flex-1 rounded-lg border border-[#2a3942] bg-[#2a3942] px-4 py-2 text-sm text-[#e9edef] placeholder:text-[#8696a0] outline-none"
            placeholder="Type reply..."
          />
          {text.trim() ? (
            <button
              onClick={send}
              className="h-10 w-10 rounded-full bg-[#00a884] text-white flex items-center justify-center hover:bg-[#019a79] transition"
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => sendSystemText("Voice note requested by agent.")}
              className="h-10 w-10 rounded-full bg-[#00a884] text-white flex items-center justify-center"
              aria-label="Voice message"
            >
              🎤
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) sendSystemText(`[Attachment] ${f.name}`);
              e.currentTarget.value = "";
            }}
          />
        </div>
      </section>
    </div>
  );
}
