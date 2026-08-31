"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resolveApiDbName, resolveApiOrigin } from "@/lib/api-http";
import { SALES_API_LOCAL_STORAGE_KEY, SALES_API_SESSION_STORAGE_KEY } from "@/lib/sales-session-keys";

export default function SalesLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const base = resolveApiOrigin();
      const r = await fetch(`${base.replace(/\/$/, "")}/api/v1/sales/auth`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Database-Name": resolveApiDbName(),
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const wrapped = await r.json();
      if (!r.ok || !wrapped?.success) throw new Error(wrapped?.message || "Invalid credentials");
      const token = wrapped?.data?.apiSession;
      if (!token) throw new Error("Login response missing session");
      window.sessionStorage.setItem(SALES_API_SESSION_STORAGE_KEY, token);
      window.localStorage.setItem(SALES_API_LOCAL_STORAGE_KEY, token);
      router.replace("/sales");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050508] text-white flex items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-[#fbbf24]/15 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-[#22c55e]/10 blur-[100px]" />
      </div>
      <form onSubmit={(e) => void onSubmit(e)} className="relative w-full max-w-md rounded-3xl border border-[#fbbf24]/25 bg-[#0e0e16]/95 p-6 sm:p-8 shadow-[0_30px_80px_-40px_rgba(251,191,36,0.35)]">
        <div className="mb-6 text-center">
          <Image src="/logo_gold.png" alt="AZDeploy" width={160} height={56} className="mx-auto h-12 w-auto object-contain" priority />
          <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.3em] text-[#fde68a]">Sales desk</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Track your ebook sales</h1>
          <p className="mt-1 text-sm text-white/50">Share your referral links · see revenue in real time</p>
        </div>
        {err ? <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{err}</p> : null}
        <label className="block text-xs font-medium text-white/60">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 mb-4 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[#fbbf24]/50" />
        <label className="block text-xs font-medium text-white/60">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 mb-6 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[#fbbf24]/50" />
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-[#d97706] to-[#fbbf24] px-4 py-3 text-sm font-semibold text-[#1a1200] disabled:opacity-60">
          {loading ? "Signing in…" : "Enter sales desk"}
        </button>
      </form>
    </div>
  );
}
