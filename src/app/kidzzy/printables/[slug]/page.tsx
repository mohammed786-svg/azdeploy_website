"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import KidzzyProductCard from "@/components/kidzzy/KidzzyProductCard";
import KidzzyProtectedPreview from "@/components/kidzzy/KidzzyProtectedPreview";
import {
  fetchKidzzyProduct,
  formatInr,
  kidzzyMediaUrl,
  trackKidzzyCheckoutLead,
  type KidzzyProduct,
} from "@/lib/kidzzy";
import {
  addToKidzzyCart,
  getKidzzyCartQty,
  KIDZZY_CART_EVENT,
  setKidzzyCartQty,
  setKidzzyCheckoutItems,
} from "@/lib/kidzzy-cart";

export default function KidzzyProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [item, setItem] = useState<KidzzyProduct | null>(null);
  const [related, setRelated] = useState<KidzzyProduct[]>([]);
  const [err, setErr] = useState("");
  const [activePreview, setActivePreview] = useState(0);
  const [cartQty, setCartQty] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchKidzzyProduct(slug);
        if (!cancelled) {
          setItem(data.item);
          setRelated(data.related);
          setActivePreview(0);
        }
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Not found");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const sync = () => setCartQty(getKidzzyCartQty(slug));
    sync();
    window.addEventListener(KIDZZY_CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(KIDZZY_CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  if (err) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-red-600">{err}</p>
        <Link href="/kidzzy/printables" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to printables
        </Link>
      </div>
    );
  }

  if (!item) {
    return <p className="py-16 text-center text-slate-500">Loading…</p>;
  }

  const product = item;
  const previews = (product.previewImages || []).map(kidzzyMediaUrl).filter(Boolean);
  const cover = kidzzyMediaUrl(product.coverImageUrl);
  const hero = previews[activePreview] || cover;
  const hasSample = Boolean(product.hasSample || previews.length);
  const canBuy = product.isPurchasable && product.hasPdf;

  function lineForQty(quantity: number) {
    return {
      productSlug: product.slug,
      title: product.title,
      priceInr: product.priceInr,
      coverImageUrl: product.coverImageUrl || product.previewImages?.[0] || "",
      coverAccent: product.coverAccent,
      quantity,
    };
  }

  function onAdd() {
    if (!canBuy) return;
    void trackKidzzyCheckoutLead({ productSlug: product.slug, stage: "buy_click" });
    addToKidzzyCart(lineForQty(1));
  }

  function goToCart() {
    router.push("/kidzzy/cart");
  }

  function goCheckout() {
    if (!canBuy) return;
    void trackKidzzyCheckoutLead({ productSlug: product.slug, stage: "buy_click" });
    const q = cartQty > 0 ? cartQty : 1;
    if (cartQty <= 0) addToKidzzyCart(lineForQty(1));
    setKidzzyCheckoutItems([lineForQty(q)]);
    router.push("/kidzzy/checkout");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pb-10 sm:pt-10">
      <p className="text-xs text-slate-500 sm:text-sm">
        <Link href="/kidzzy" className="hover:text-blue-600">
          Home
        </Link>{" "}
        ›{" "}
        <Link href="/kidzzy/printables" className="hover:text-blue-600">
          Printables
        </Link>{" "}
        › <span className="text-slate-800">{item.title}</span>
      </p>

      <div className="mt-4 grid gap-6 sm:mt-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <KidzzyProtectedPreview className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm sm:rounded-3xl">
            <div
              className="relative flex aspect-[4/5] items-center justify-center sm:aspect-[4/3]"
              style={{ background: `linear-gradient(145deg, ${item.coverAccent}25, #fff)` }}
            >
              {hero ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hero}
                  alt=""
                  draggable={false}
                  className="pointer-events-none h-full w-full bg-white object-contain object-top"
                />
              ) : (
                <div className="text-center">
                  <span className="text-6xl sm:text-7xl">📘</span>
                  <p className="mt-3 max-w-xs px-4 text-base font-bold text-slate-700 sm:text-lg">{item.title}</p>
                </div>
              )}
              {hasSample ? (
                <span className="absolute left-2.5 top-2.5 rounded bg-rose-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow sm:left-3 sm:top-3 sm:px-2.5">
                  Free sample
                </span>
              ) : null}
            </div>
          </KidzzyProtectedPreview>

          {previews.length > 1 ? (
            <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
              {previews.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActivePreview(i)}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border-2 sm:h-16 sm:w-14 ${
                    i === activePreview ? "border-blue-600" : "border-slate-200"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    className="pointer-events-none h-full w-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h1 className="text-2xl font-black leading-tight text-slate-900 sm:text-3xl lg:text-4xl">{item.title}</h1>
          {item.subtitle ? <p className="mt-2 text-sm text-slate-600 sm:text-base">{item.subtitle}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">{item.ageLabel}</span>
            <span className="text-sm font-semibold text-amber-500">★ 4.8</span>
            <span className="text-sm text-slate-500">{item.pageCount} pages</span>
          </div>
          <p className="mt-4 text-2xl font-black text-slate-900 sm:mt-5 sm:text-3xl">{formatInr(item.priceInr)}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4">{item.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
            {item.tags.map((t) => (
              <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 hidden flex-col gap-3 sm:mt-8 sm:flex">
            <div className="flex flex-wrap items-center gap-3">
              {canBuy && cartQty > 0 ? (
                <div className="inline-flex h-11 min-w-[8rem] items-center justify-between rounded-xl bg-emerald-600 text-white shadow-sm">
                  <button
                    type="button"
                    aria-label="Decrease"
                    onClick={() => setKidzzyCartQty(product.slug, cartQty - 1)}
                    className="px-4 py-2 text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="min-w-[1.5rem] text-center text-sm font-extrabold">{cartQty}</span>
                  <button
                    type="button"
                    aria-label="Increase"
                    disabled={cartQty >= 20}
                    onClick={() => setKidzzyCartQty(product.slug, cartQty + 1)}
                    className="px-4 py-2 text-lg font-bold disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={onAdd}
                  className="h-11 rounded-xl border-2 border-emerald-600 bg-white px-8 text-sm font-extrabold uppercase tracking-wide text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                >
                  ADD
                </button>
              )}
              {cartQty > 0 ? (
                <button
                  type="button"
                  onClick={goToCart}
                  className="h-11 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Go to cart
                </button>
              ) : null}
              <button
                type="button"
                disabled={!canBuy}
                onClick={goCheckout}
                className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
            {cartQty > 0 ? (
              <p className="text-sm text-slate-500">
                In cart · {formatInr(product.priceInr * cartQty)} — checkout from cart when ready
              </p>
            ) : null}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 sm:mt-8 sm:p-5">
            <p className="text-sm font-bold text-slate-800">What&apos;s included</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>✓ {item.pageCount} pages PDF</li>
              <li>✓ High quality print-ready</li>
              <li>✓ Instant download after payment</li>
              {hasSample ? <li>✓ Free in-page sample preview (view-only, watermarked)</li> : null}
            </ul>
          </div>
        </div>
      </div>

      {related.length ? (
        <section className="mt-10 sm:mt-14">
          <h2 className="text-lg font-black text-slate-900 sm:text-xl">More printables you might like</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <KidzzyProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          {cartQty > 0 ? (
            <div className="inline-flex h-11 min-w-[6.5rem] shrink-0 items-center justify-between rounded-xl bg-emerald-600 text-white">
              <button
                type="button"
                onClick={() => setKidzzyCartQty(product.slug, cartQty - 1)}
                className="px-3 py-2 text-lg font-bold"
              >
                −
              </button>
              <span className="text-sm font-extrabold">{cartQty}</span>
              <button
                type="button"
                disabled={cartQty >= 20}
                onClick={() => setKidzzyCartQty(product.slug, cartQty + 1)}
                className="px-3 py-2 text-lg font-bold disabled:opacity-40"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={!canBuy}
              onClick={onAdd}
              className="h-11 shrink-0 rounded-xl border-2 border-emerald-600 bg-white px-5 text-sm font-extrabold uppercase text-emerald-700 disabled:opacity-50"
            >
              ADD
            </button>
          )}
          <button
            type="button"
            disabled={!canBuy}
            onClick={cartQty > 0 ? goToCart : goCheckout}
            className="min-w-0 flex-1 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50"
          >
            {cartQty > 0 ? "Go to cart" : `Buy ${formatInr(product.priceInr)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
