"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { resolveApiDbName } from "@/lib/api-http";
import { hqFetch } from "@/lib/hq-client";
import { HQ_API_SESSION_STORAGE_KEY } from "@/lib/hq-session-keys";

async function ensureHqApiSessionInStorage() {
  if (typeof window === "undefined") return;
  if (window.sessionStorage.getItem(HQ_API_SESSION_STORAGE_KEY)) return;
  const r = await fetch("/api/hq/refresh-api-token", { credentials: "include" });
  if (!r.ok) return;
  const j = (await r.json()) as { apiSession?: string };
  if (j.apiSession) window.sessionStorage.setItem(HQ_API_SESSION_STORAGE_KEY, j.apiSession);
}

function parseLoginError(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const o = data as { message?: string; error?: string; data?: { message?: string } };
    return o.message || o.error || o.data?.message || fallback;
  }
  return fallback;
}

/** Avoid dumping Django/HTML error pages into the UI. */
function humanizeLoginFailure(status: number, text: string, data: unknown): string {
  const t = text.trim();
  if (t.startsWith("<!DOCTYPE") || t.startsWith("<html") || t.includes("<title>Page not found")) {
    if (status === 404) {
      return "HQ login proxy is not reachable. Nginx must send /api/hq/django-auth (and related paths) to Next.js on :3000, not to Django. Copy the latest deployment/vps/nginx/azdeploy.conf and reload nginx.";
    }
    return "The server returned an HTML error page instead of JSON. Check Nginx routing for Next.js API routes.";
  }
  const fromJson = parseLoginError(data, "");
  if (fromJson) return fromJson;
  return t.length > 280 ? `${t.slice(0, 280)}…` : t || `Login failed (${status})`;
}

/** Login via Next proxy: sets Next httpOnly cookie + returns Django body (incl. apiSession Bearer). */
async function loginThroughDjangoProxy(email: string, password: string): Promise<void> {
  const r = await fetch("/api/hq/django-auth", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Database-Name": resolveApiDbName(),
    },
    body: JSON.stringify({ email, password }),
  });
  const text = await r.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!r.ok) {
    throw new Error(humanizeLoginFailure(r.status, text, data));
  }
  const wrapped = data as { success?: boolean; data?: { ok?: boolean; apiSession?: string }; message?: string };
  if (wrapped && "success" in wrapped && wrapped.success === false) {
    throw new Error(wrapped.message || "Login failed");
  }
  const inner = wrapped?.data;
  if (inner?.apiSession && typeof window !== "undefined") {
    window.sessionStorage.setItem(HQ_API_SESSION_STORAGE_KEY, inner.apiSession);
  }
}

export default function HqLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    const stopSpinner = () => {
      if (alive) setChecking(false);
    };
    const timeoutId = window.setTimeout(stopSpinner, 12_000);
    (async () => {
      try {
        await ensureHqApiSessionInStorage();
        await hqFetch<{ enquiries?: number }>("/api/hq/stats", undefined, { suppressSuccessToast: true });
        if (!alive) return;
        window.clearTimeout(timeoutId);
        window.location.assign("/hq");
      } catch {
        window.clearTimeout(timeoutId);
        stopSpinner();
      }
    })();
    return () => {
      alive = false;
      window.clearTimeout(timeoutId);
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await loginThroughDjangoProxy(email, password);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("hq_login_at", String(Date.now()));
        window.location.assign("/hq");
        return;
      }
      router.replace("/hq");
      router.refresh();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="text-[#64748b] font-mono text-sm animate-pulse">Checking session…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#7c3aed]/12 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#00d4ff]/10 blur-[80px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a10]/90 backdrop-blur-2xl shadow-[0_0_80px_rgba(124,58,237,0.12)] p-8 sm:p-10">
          <p className="text-[10px] font-mono text-[#64748b] tracking-[0.4em] uppercase text-center">Restricted</p>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-white to-[#a78bfa] bg-clip-text text-transparent">
            AZ Deploy HQ
          </h1>
          <p className="mt-2 text-sm text-[#64748b] text-center leading-relaxed">
            Internal dashboard. Not indexed. Use credentials from server env.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-[#475569] focus:border-[#a78bfa]/50 focus:outline-none focus:ring-1 focus:ring-[#a78bfa]/30"
                placeholder="support@azdeploy.co.in"
                required
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b]">Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white focus:border-[#00d4ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/30"
                required
              />
            </label>
            {err && (
              <p className="text-sm text-amber-400/90 font-mono" role="alert">
                {err}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(124,58,237,0.25)] hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Signing in…" : "Enter command center"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
