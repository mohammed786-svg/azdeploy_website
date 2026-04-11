"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "/hq", label: "Dashboard", match: (p: string) => p === "/hq" },
  { href: "/hq/enquiries", label: "Students Enquiry", match: (p: string) => p.startsWith("/hq/enquiries") },
  { href: "/hq/onboarding", label: "New Student Onboarding", match: (p: string) => p.startsWith("/hq/onboarding") },
  { href: "/hq/batches", label: "Batch settings", match: (p: string) => p.startsWith("/hq/batches") },
  { href: "/hq/students", label: "All students", match: (p: string) => p.startsWith("/hq/students") },
  { href: "/hq/fees", label: "Fee structures", match: (p: string) => p.startsWith("/hq/fees") },
  { href: "/hq/invoices", label: "Invoices & billing", match: (p: string) => p.startsWith("/hq/invoices") },
  { href: "/hq/receipts", label: "Receipts", match: (p: string) => p.startsWith("/hq/receipts") },
  { href: "/hq/expenses", label: "Expenses", match: (p: string) => p.startsWith("/hq/expenses") },
  { href: "/hq/reports", label: "Reports", match: (p: string) => p.startsWith("/hq/reports") },
  { href: "/hq/blog", label: "Blog", match: (p: string) => p.startsWith("/hq/blog") },
];

function NavIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full transition-all ${
        active ? "h-8 bg-gradient-to-b from-[#a78bfa] to-[#00d4ff]" : "h-0 bg-transparent"
      }`}
    />
  );
}

export default function HqShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/hq/logout", { method: "POST", credentials: "include" });
    window.location.href = "/hq/login";
  }

  return (
    <div className="min-h-screen bg-[#050508] text-[#e8eef5] flex">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#7c3aed]/15 blur-[100px]" />
        <div className="absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-[#00d4ff]/10 blur-[90px]" />
        <div className="absolute bottom-0 left-1/4 h-px w-1/2 bg-gradient-to-r from-transparent via-[#00d4ff]/25 to-transparent" />
      </div>

      {/* Desktop sidebar */}
      <aside className="relative z-20 hidden lg:flex print:hidden w-[280px] shrink-0 flex-col border-r border-white/[0.06] bg-[#07070c]/90 backdrop-blur-xl">
        <div className="p-6 border-b border-white/[0.06] flex flex-col items-center text-center">
          <Link
            href="/hq"
            className="flex w-full justify-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070c]"
          >
            <Image
              src="/logo_gold.png"
              alt="AZ Deploy Academy"
              width={520}
              height={200}
              className="h-[52px] w-auto max-w-[220px] object-contain object-center mx-auto"
              priority
            />
          </Link>
          <h1 className="mt-3 text-lg font-bold tracking-tight bg-gradient-to-r from-white via-[#e0e7ff] to-[#a78bfa] bg-clip-text text-transparent w-full">
            Command Center
          </h1>
          <p className="text-[11px] text-[#64748b] mt-1 font-mono w-full">Internal HQ · hidden route</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative block rounded-xl px-4 py-3 pl-5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/[0.06] text-white shadow-[inset_0_0_0_1px_rgba(0,212,255,0.15)]"
                    : "text-[#94a3b8] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <NavIcon active={active} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs font-mono uppercase tracking-wider text-[#94a3b8] hover:border-[#f87171]/40 hover:text-[#fca5a5] transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile header — 3 equal columns so logo stays true center */}
      <div className="lg:hidden print:hidden fixed top-0 left-0 right-0 z-30 grid grid-cols-3 items-center gap-2 border-b border-white/[0.06] bg-[#07070c]/95 backdrop-blur-xl px-3 sm:px-4 py-3">
        <div className="flex justify-start min-w-0">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-white/10 p-2 text-white hover:bg-white/5 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <Link
          href="/hq"
          className="flex justify-center items-center min-w-0 px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff]/40 rounded-lg mx-auto"
          aria-label="AZ Deploy Academy — Dashboard"
        >
          <Image
            src="/logo_gold.png"
            alt=""
            width={520}
            height={200}
            className="h-8 w-auto max-w-[min(200px,48vw)] object-contain object-center opacity-95"
            priority
          />
        </Link>
        <div className="flex justify-end min-w-0">
          <button
            type="button"
            onClick={() => void logout()}
            className="text-[10px] font-mono uppercase text-[#94a3b8] hover:text-[#fca5a5] px-2 py-2 shrink-0"
          >
            Out
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/70"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[min(88vw,300px)] bg-[#07070c] border-r border-white/10 flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-white/10 relative flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 p-2 text-[#94a3b8] hover:text-white rounded-lg shrink-0"
                  aria-label="Close menu"
                >
                  ✕
                </button>
                <Link href="/hq" className="flex justify-center w-full pt-1 px-8" onClick={() => setOpen(false)}>
                  <Image
                    src="/logo_gold.png"
                    alt="AZ Deploy Academy"
                    width={520}
                    height={200}
                    className="h-10 w-auto max-w-[200px] object-contain object-center mx-auto opacity-95"
                  />
                </Link>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#64748b]">Menu</span>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {NAV.map((item) => {
                  const active = item.match(pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm ${
                        active ? "bg-white/10 text-white" : "text-[#94a3b8] hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 min-w-0 flex flex-col pt-14 lg:pt-0 print:pt-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
