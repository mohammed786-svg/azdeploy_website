"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { formatInr } from "@/lib/kidzzy";
import {
  getKidzzyCartCount,
  getKidzzyCartTotalInr,
  KIDZZY_CART_EVENT,
} from "@/lib/kidzzy-cart";

const NAV = [
  { href: "/kidzzy", label: "Home" },
  { href: "/kidzzy/printables", label: "Printables" },
];

export default function KidzzyHeader() {
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const sync = () => {
      setCartCount(getKidzzyCartCount());
      setCartTotal(getKidzzyCartTotalInr());
    };
    sync();
    window.addEventListener(KIDZZY_CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(KIDZZY_CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    window.location.href = term
      ? `/kidzzy/printables?q=${encodeURIComponent(term)}`
      : "/kidzzy/printables";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <Link href="/kidzzy" className="shrink-0 leading-none">
          <span
            className="block text-[1.55rem] font-black tracking-tight sm:text-[1.75rem]"
            style={{
              fontFamily: '"Nunito", system-ui, sans-serif',
              background: "linear-gradient(90deg,#ef4444,#f59e0b,#22c55e,#3b82f6,#a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            kidzzy
          </span>
          <span className="mt-0.5 block text-[10px] font-medium text-slate-400">azdeploy.com</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/kidzzy" ? pathname === "/kidzzy" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold ${active ? "text-blue-600" : "text-slate-600 hover:text-slate-900"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={onSearch} className="mx-auto hidden max-w-md flex-1 sm:block">
          <label className="relative block">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
              </svg>
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search printables"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none ring-blue-500/30 placeholder:text-slate-400 focus:bg-white focus:ring-2"
            />
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/kidzzy/orders"
            className="hidden rounded-full px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 sm:inline-flex"
          >
            My orders
          </Link>
          <Link
            href="/kidzzy/cart"
            className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-white shadow-sm transition sm:px-3 sm:py-2 ${
              cartCount > 0 ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-800 hover:bg-slate-900"
            }`}
            aria-label="Cart"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 7h14M10 20a1 1 0 112 0 1 1 0 01-2 0zm8 0a1 1 0 112 0 1 1 0 01-2 0z"
              />
            </svg>
            {cartCount > 0 ? (
              <span className="hidden leading-tight sm:block">
                <span className="block text-[11px] font-bold">
                  {cartCount} item{cartCount === 1 ? "" : "s"}
                </span>
                <span className="block text-xs font-extrabold">{formatInr(cartTotal)}</span>
              </span>
            ) : (
              <span className="hidden text-xs font-bold sm:inline">Cart</span>
            )}
            {cartCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-emerald-700 sm:hidden">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-slate-100 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/kidzzy/cart"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Cart{cartCount ? ` · ${cartCount} · ${formatInr(cartTotal)}` : ""}
            </Link>
            <Link
              href="/kidzzy/orders"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
            >
              My orders
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
