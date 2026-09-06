"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearKidzzyCheckoutItems,
  getKidzzyCart,
  getKidzzyCartTotalInr,
  removeFromKidzzyCart,
  setKidzzyCartQty,
  setKidzzyCheckoutItems,
  KIDZZY_CART_EVENT,
  type KidzzyCartLine,
} from "@/lib/kidzzy-cart";
import { formatInr, kidzzyMediaUrl } from "@/lib/kidzzy";

export default function KidzzyCartPage() {
  const [items, setItems] = useState<KidzzyCartLine[]>([]);

  function refresh() {
    setItems(getKidzzyCart());
  }

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(KIDZZY_CART_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(KIDZZY_CART_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const total = getKidzzyCartTotalInr();

  function checkout() {
    if (!items.length) return;
    clearKidzzyCheckoutItems();
    setKidzzyCheckoutItems(items);
    window.location.href = "/kidzzy/checkout";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Your cart</h1>
      <p className="mt-1 text-sm text-slate-500">Add multiple printables and quantities, then checkout once.</p>

      {!items.length ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link
            href="/kidzzy/printables"
            className="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            Browse printables
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {items.map((line) => {
              const cover = kidzzyMediaUrl(line.coverImageUrl);
              return (
                <div
                  key={line.productSlug}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
                >
                  <div
                    className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:h-24 sm:w-20"
                    style={{ background: cover ? undefined : `${line.coverAccent}22` }}
                  >
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl">📘</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/kidzzy/printables/${line.productSlug}`}
                      className="line-clamp-2 text-sm font-bold text-slate-900 hover:text-blue-700 sm:text-base"
                    >
                      {line.title}
                    </Link>
                    <p className="mt-1 text-sm font-extrabold text-slate-900">{formatInr(line.priceInr)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="px-3 py-1.5 text-sm font-bold text-slate-700"
                          onClick={() => setKidzzyCartQty(line.productSlug, line.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-bold">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="px-3 py-1.5 text-sm font-bold text-slate-700"
                          onClick={() => setKidzzyCartQty(line.productSlug, line.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromKidzzyCart(line.productSlug)}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                      <p className="ml-auto text-sm font-bold text-slate-800">
                        {formatInr(line.priceInr * line.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                {items.reduce((n, i) => n + i.quantity, 0)} item
                {items.reduce((n, i) => n + i.quantity, 0) === 1 ? "" : "s"}
              </span>
              <span className="text-xl font-black text-slate-900">{formatInr(total)}</span>
            </div>
            <button
              type="button"
              onClick={checkout}
              className="mt-4 w-full rounded-full bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Proceed to checkout
            </button>
            <Link
              href="/kidzzy/printables"
              className="mt-3 block text-center text-sm font-semibold text-blue-600 hover:underline"
            >
              Continue shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
