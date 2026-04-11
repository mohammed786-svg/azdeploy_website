"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hqFetch } from "@/lib/hq-client";

export default function HqLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await hqFetch<{ enquiries?: number }>("/api/hq/stats");
        if (!cancelled) router.replace("/hq");
      } catch {
        /* not logged in */
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await hqFetch<{ ok?: boolean }>("/api/hq/auth", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
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
