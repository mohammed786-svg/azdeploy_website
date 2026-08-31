"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string; match: (p: string) => boolean };

type Props = {
  children: React.ReactNode;
  nav: NavItem[];
  title: string;
  subtitle: string;
  accent: string;
  accentSoft: string;
  userName?: string;
  userRole?: string;
  onLogout: () => Promise<void>;
};

export default function PortalShell({
  children,
  nav,
  title,
  subtitle,
  accent,
  accentSoft,
  userName,
  userRole,
  onLogout,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#050508] text-[#e8eef5] flex">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-[380px] w-[380px] rounded-full blur-[110px]" style={{ background: accentSoft }} />
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-white/[0.03] blur-[90px]" />
      </div>

      <aside className="relative z-20 hidden w-[270px] shrink-0 flex-col border-r border-white/[0.06] bg-[#07070c]/95 backdrop-blur-xl lg:flex">
        <div className="border-b border-white/[0.06] p-5">
          <Image src="/logo_gold.png" alt="AZ Deploy Academy" width={160} height={48} className="h-10 w-auto object-contain" />
          <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.28em]" style={{ color: accent }}>
            {subtitle}
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-white">{title}</h1>
          {userName ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <p className="truncate text-sm font-semibold">{userName}</p>
              {userRole ? <p className="truncate text-xs text-white/50">{userRole}</p> : null}
            </div>
          ) : null}
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "border text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
                style={active ? { borderColor: `${accent}55`, background: `${accent}18`, color: accent } : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/[0.06] p-3">
          <button
            type="button"
            onClick={() => void onLogout()}
            className="w-full rounded-xl border border-white/15 px-3 py-2.5 text-sm text-white/70 hover:border-red-400/40 hover:text-red-300"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-[#050508]/90 px-4 py-3 backdrop-blur lg:px-6">
          <button type="button" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs lg:hidden" onClick={() => setOpen((v) => !v)}>
            Menu
          </button>
          <p className="truncate text-xs font-mono uppercase tracking-[0.2em] text-white/45">
            {userName || title} {userRole ? `· ${userRole}` : ""}
          </p>
          <Link href="/ebooks" className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:text-white">
            Store
          </Link>
        </header>

        {open ? (
          <div className="border-b border-white/10 bg-[#0b0b12] p-3 lg:hidden">
            <nav className="grid gap-1">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5">
                  {item.label}
                </Link>
              ))}
              <button type="button" onClick={() => void onLogout()} className="rounded-lg px-3 py-2 text-left text-sm text-red-300">
                Sign out
              </button>
            </nav>
          </div>
        ) : null}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
