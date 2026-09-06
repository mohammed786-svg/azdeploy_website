"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDownloadCount, formatInr, kidzzyMediaUrl, type KidzzyProduct } from "@/lib/kidzzy";
import {
  addToKidzzyCart,
  getKidzzyCartQty,
  KIDZZY_CART_EVENT,
  setKidzzyCartQty,
} from "@/lib/kidzzy-cart";

export default function KidzzyProductCard({ product }: { product: KidzzyProduct }) {
  const cover = kidzzyMediaUrl(product.coverImageUrl);
  const canBuy = product.isPurchasable && product.hasPdf;
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const sync = () => setQty(getKidzzyCartQty(product.slug));
    sync();
    window.addEventListener(KIDZZY_CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(KIDZZY_CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [product.slug]);

  function onAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!canBuy) return;
    addToKidzzyCart({
      productSlug: product.slug,
      title: product.title,
      priceInr: product.priceInr,
      coverImageUrl: product.coverImageUrl,
      coverAccent: product.coverAccent,
      quantity: 1,
    });
  }

  function onDec(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setKidzzyCartQty(product.slug, qty - 1);
  }

  function onInc(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (qty >= 20) return;
    setKidzzyCartQty(product.slug, qty + 1);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)]">
      <Link href={`/kidzzy/printables/${product.slug}`} className="block">
        <div
          className="relative aspect-[4/3] overflow-hidden bg-slate-50"
          style={{
            background: cover
              ? undefined
              : `linear-gradient(145deg, ${product.coverAccent}22, #fff 55%, ${product.coverAccent}33)`,
          }}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-full w-full object-cover object-top" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="text-4xl">📘</span>
              <p className="line-clamp-2 text-sm font-bold text-slate-700">{product.title}</p>
            </div>
          )}
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
            {product.ageLabel}
          </span>
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M5 20h14v-2H5v2zm7-18L5.33 9.5h3.84V16h5.66V9.5h3.84L12 2z" />
            </svg>
            {formatDownloadCount(product.downloadCount)}
          </span>
          {product.hasSample || product.previewImages?.length ? (
            <span className="absolute bottom-2.5 left-2.5 rounded bg-white/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600 shadow-sm">
              Sample
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <Link href={`/kidzzy/printables/${product.slug}`} className="block">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-500">Printables</p>
          <h3 className="mt-0.5 line-clamp-2 text-[15px] font-bold leading-snug text-slate-800 group-hover:text-blue-700">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-base font-extrabold text-slate-900">{formatInr(product.priceInr)}</p>
            <p className="text-[10px] font-semibold text-slate-500">{product.primaryTag}</p>
          </div>
          {canBuy ? (
            qty > 0 ? (
              <div
                className="inline-flex h-8 min-w-[5.5rem] items-center justify-between rounded-lg bg-emerald-600 text-white shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Decrease"
                  onClick={onDec}
                  className="px-2.5 py-1 text-base font-bold leading-none"
                >
                  −
                </button>
                <span className="min-w-[1.25rem] text-center text-xs font-extrabold">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase"
                  onClick={onInc}
                  className="px-2.5 py-1 text-base font-bold leading-none"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onAdd}
                className="h-8 rounded-lg border-[1.5px] border-emerald-600 bg-white px-3.5 text-xs font-extrabold uppercase tracking-wide text-emerald-700 shadow-sm hover:bg-emerald-50"
              >
                ADD
              </button>
            )
          ) : (
            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-500">Soon</span>
          )}
        </div>
      </div>
    </div>
  );
}
