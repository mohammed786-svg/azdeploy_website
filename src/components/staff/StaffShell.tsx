"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { STAFF_API_LOCAL_STORAGE_KEY, STAFF_API_SESSION_STORAGE_KEY } from "@/lib/staff-session-keys";
import { staffFetch } from "@/lib/staff-client";
import type { StaffEmployee } from "@/lib/staff-types";
import { roleLabel } from "@/lib/staff-types";

const NAV = [
  { href: "/staff", label: "Dashboard", match: (p: string) => p === "/staff" },
  { href: "/staff/tasks", label: "Tasks", match: (p: string) => p.startsWith("/staff/tasks") },
  { href: "/staff/todos", label: "To-do", match: (p: string) => p.startsWith("/staff/todos") },
  { href: "/staff/attendance", label: "Attendance", match: (p: string) => p.startsWith("/staff/attendance") },
  { href: "/staff/reports", label: "Daily report", match: (p: string) => p.startsWith("/staff/reports") },
  { href: "/staff/leads", label: "Leads", match: (p: string) => p.startsWith("/staff/leads") },
];

export default function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<StaffEmployee | null>(null);

  useEffect(() => {
    void staffFetch<{ item: StaffEmployee }>("/api/staff/me", undefined, { redirectOn401: true })
      .then((d) => setMe(d.item))
      .catch(() => undefined);
  }, []);

  async function logout() {
    try {
      await staffFetch("/api/staff/logout", { method: "POST" }, { suppressSuccessToast: true });
    } catch {
      /* ignore */
    }
    window.sessionStorage.removeItem(STAFF_API_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(STAFF_API_LOCAL_STORAGE_KEY);
    router.replace("/staff/login");
  }

  return (
    <div className="min-h-screen bg-[#07070c] text-[#e8eef5] flex">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-[360px] w-[360px] rounded-full bg-[#0ea5e9]/12 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-[#22c55e]/10 blur-[90px]" />
      </div>

      <aside className="relative z-20 hidden w-64 shrink-0 flex-col border-r border-white/10 bg-[#0b0b12]/95 lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Image src="/logo_gold.png" alt="AZDeploy" width={140} height={48} className="h-10 w-auto object-contain" />
          <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.28em] text-[#38bdf8]">Staff workspace</p>
          {me ? (
            <div className="mt-3">
              <p className="truncate text-sm font-semibold text-white">{me.fullName}</p>
              <p className="truncate text-xs text-white/50">{roleLabel(me.role)}</p>
            </div>
          ) : null}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#0ea5e9]/15 text-[#7dd3fc] border border-[#0ea5e9]/30"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => void logout()}
            className="w-full rounded-xl border border-white/15 px-3 py-2.5 text-sm text-white/70 hover:border-red-400/40 hover:text-red-300"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/10 bg-[#07070c]/90 px-4 py-3 backdrop-blur lg:px-6">
          <button
            type="button"
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
          <p className="truncate text-xs font-mono uppercase tracking-[0.2em] text-white/45">
            {me?.fullName || "Staff"} · {roleLabel(me?.role || "")}
          </p>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:text-white lg:hidden"
          >
            Out
          </button>
        </header>

        {open ? (
          <div className="border-b border-white/10 bg-[#0b0b12] p-3 lg:hidden">
            <nav className="grid gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
