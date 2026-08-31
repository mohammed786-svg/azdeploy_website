"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, createContext, useContext } from "react";
import { libraryFetch } from "@/lib/library-client";
import { LIBRARY_API_LOCAL_STORAGE_KEY, LIBRARY_API_SESSION_STORAGE_KEY, LIBRARY_THEME_KEY } from "@/lib/library-session-keys";
import { firebaseSignOut } from "@/lib/firebase-auth";

type Theme = "light" | "dark";

type Customer = {
  id: string;
  email: string;
  fullName: string;
  photoUrl?: string;
  ipSlotsUsed: number;
  ipSlotsMax: number;
  boundIps?: { ip: string; lastSeenAt?: string }[];
};

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "light", toggle: () => undefined });

export function useLibraryTheme() {
  return useContext(ThemeCtx);
}

const NAV = [
  { href: "/library", label: "My library", match: (p: string) => p === "/library" },
  { href: "/library/devices", label: "Devices / IPs", match: (p: string) => p.startsWith("/library/devices") },
];

export default function LibraryShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("light");
  const [me, setMe] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && window.localStorage.getItem(LIBRARY_THEME_KEY)) as Theme | null;
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(LIBRARY_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    void libraryFetch<{ item: Customer }>("/api/library/me")
      .then((d) => setMe(d.item))
      .catch(() => undefined);
  }, []);

  function toggle() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  async function logout() {
    try {
      await libraryFetch("/api/library/logout", { method: "POST", body: JSON.stringify({}) }, { suppressSuccessToast: true });
    } catch {
      /* still clear local */
    }
    window.sessionStorage.removeItem(LIBRARY_API_SESSION_STORAGE_KEY);
    window.localStorage.removeItem(LIBRARY_API_LOCAL_STORAGE_KEY);
    await firebaseSignOut().catch(() => undefined);
    router.replace("/library/login");
  }

  const dark = theme === "dark";

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <div className={`min-h-screen flex ${dark ? "bg-[#0b0d12] text-[#e8eef5]" : "bg-[#f4f6f9] text-[#0f172a]"}`}>
        <aside
          className={`relative z-20 hidden w-[260px] shrink-0 flex-col border-r lg:flex ${
            dark ? "border-white/10 bg-[#11141c]" : "border-slate-200 bg-white"
          }`}
        >
          <div className={`border-b px-5 py-5 ${dark ? "border-white/10" : "border-slate-200"}`}>
            <p className={`text-[10px] font-mono uppercase tracking-[0.28em] ${dark ? "text-[#7dd3fc]" : "text-sky-700"}`}>
              Customer library
            </p>
            <h1 className="mt-1 text-lg font-bold">My ebooks</h1>
            {me ? (
              <div className={`mt-3 rounded-xl px-3 py-2 text-sm ${dark ? "bg-white/5" : "bg-slate-50"}`}>
                <p className="font-semibold truncate">{me.fullName || me.email}</p>
                <p className={`text-xs truncate ${dark ? "text-white/50" : "text-slate-500"}`}>{me.email}</p>
                <p className={`mt-1 text-[10px] font-mono ${dark ? "text-amber-200/80" : "text-amber-700"}`}>
                  IPs {me.ipSlotsUsed}/{me.ipSlotsMax}
                </p>
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
                      ? dark
                        ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                        : "bg-sky-50 text-sky-800 border border-sky-200"
                      : dark
                        ? "text-white/65 hover:bg-white/5"
                        : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className={`space-y-2 border-t p-3 ${dark ? "border-white/10" : "border-slate-200"}`}>
            <button
              type="button"
              onClick={toggle}
              className={`w-full rounded-xl border px-3 py-2 text-sm ${
                dark ? "border-white/15 text-white/70" : "border-slate-200 text-slate-600"
              }`}
            >
              {dark ? "Light theme" : "Dark theme"}
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="w-full rounded-xl border border-red-400/40 px-3 py-2 text-sm text-red-500"
            >
              Sign out (clears this IP)
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className={`sticky top-0 z-30 flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur lg:px-6 ${
              dark ? "border-white/10 bg-[#0b0d12]/90" : "border-slate-200 bg-[#f4f6f9]/90"
            }`}
          >
            <button
              type="button"
              className={`rounded-lg border px-3 py-1.5 text-xs lg:hidden ${dark ? "border-white/15" : "border-slate-300"}`}
              onClick={() => setOpen((v) => !v)}
            >
              Menu
            </button>
            <p className={`truncate text-xs font-mono uppercase tracking-[0.15em] ${dark ? "text-white/45" : "text-slate-500"}`}>
              Session · 3 days · max 2 IPs
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={toggle} className={`rounded-lg border px-3 py-1.5 text-xs ${dark ? "border-white/15" : "border-slate-300"}`}>
                {dark ? "Light" : "Dark"}
              </button>
              <Link href="/ebooks" className={`rounded-lg border px-3 py-1.5 text-xs ${dark ? "border-white/15" : "border-slate-300"}`}>
                Store
              </Link>
            </div>
          </header>

          {open ? (
            <div className={`border-b p-3 lg:hidden ${dark ? "border-white/10 bg-[#11141c]" : "border-slate-200 bg-white"}`}>
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm">
                  {item.label}
                </Link>
              ))}
              <button type="button" onClick={() => void logout()} className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500">
                Sign out
              </button>
            </div>
          ) : null}

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
