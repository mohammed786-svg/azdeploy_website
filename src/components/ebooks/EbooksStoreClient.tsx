"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resolveApiDbName, resolveApiOrigin } from "@/lib/api-http";
import {
  CATEGORY_LABELS,
  type CreateOrderResponse,
  type EbookCatalogItem,
  type VerifyOrderResponse,
  WORKBOOK_STYLE_LABELS,
  formatInr,
} from "@/lib/ebooks";
import { isFrontendEbook } from "@/lib/ebooks/frontend-catalog";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Props = {
  items: EbookCatalogItem[];
  defaultPriceInr: number;
};

type CheckoutState = {
  ebook: EbookCatalogItem;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
};

const REFERRAL_STORAGE_KEY = "azd_ebook_ref";

function useReferralCode() {
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get("ref") || "").trim().toUpperCase();
    if (fromUrl) {
      window.localStorage.setItem(REFERRAL_STORAGE_KEY, fromUrl);
      setReferralCode(fromUrl);
      const base = resolveApiOrigin();
      const dbName = resolveApiDbName();
      void fetch(`${base}/api/v1/public/ebooks/referral/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Database-Name": dbName },
        body: JSON.stringify({ code: fromUrl }),
      }).catch(() => undefined);
      return;
    }
    setReferralCode((window.localStorage.getItem(REFERRAL_STORAGE_KEY) || "").toUpperCase());
  }, []);

  return referralCode;
}

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function EbooksStoreClient({ items, defaultPriceInr }: Props) {
  const router = useRouter();
  const referralCode = useReferralCode();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["all", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((i) => i.category === activeCategory);
  }, [activeCategory, items]);

  async function startCheckout(ebook: EbookCatalogItem) {
    setError("");
    setCheckout({
      ebook,
      buyerName: "",
      buyerEmail: "",
      buyerPhone: "",
    });
  }

  async function submitCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!checkout) return;
    setBusy(true);
    setError("");

    const base = resolveApiOrigin();
    const dbName = resolveApiDbName();

    try {
      const createRes = await fetch(`${base}/api/v1/public/ebooks/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Database-Name": dbName,
        },
        body: JSON.stringify({
          ebookSlug: checkout.ebook.slug,
          buyerName: checkout.buyerName.trim(),
          buyerEmail: checkout.buyerEmail.trim(),
          buyerPhone: checkout.buyerPhone.trim(),
          referralCode: referralCode || undefined,
        }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok || !createJson?.success) {
        throw new Error(createJson?.message || "Could not start checkout");
      }
      const order = createJson.data as CreateOrderResponse;

      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error("Payment gateway failed to load. Please retry.");
      }

      const keyId = order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
      if (!keyId) {
        throw new Error("Payment gateway is not configured.");
      }

      const rz = new window.Razorpay({
        key: keyId,
        amount: order.amountPaise,
        currency: order.currency,
        name: "AZ Deploy Academy",
        description: order.ebookTitle,
        order_id: order.razorpayOrderId,
        prefill: order.prefill,
        theme: { color: "#00d4ff" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch(`${base}/api/v1/public/ebooks/orders/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Database-Name": dbName,
              },
              body: JSON.stringify({
                orderRef: order.orderRef,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok || !verifyJson?.success) {
              throw new Error(verifyJson?.message || "Payment verification failed");
            }
            const verified = verifyJson.data as VerifyOrderResponse;
            const params = new URLSearchParams({
              order: verified.orderRef,
              slug: verified.ebookSlug,
              title: verified.ebookTitle,
              amount: String(verified.amountInr || checkout.ebook.priceInr || 2999),
              name: checkout.buyerName.trim(),
              email: (verified.buyerEmail || checkout.buyerEmail.trim()).toLowerCase(),
              library: verified.libraryReady || isFrontendEbook(verified.ebookSlug) ? "1" : "0",
            });
            router.push(`/ebooks/success?${params.toString()}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed");
          } finally {
            setBusy(false);
            setCheckout(null);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
          },
        },
      });
      rz.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-[10px] sm:text-xs font-mono uppercase tracking-wider transition-colors ${
              activeCategory === cat
                ? "border-[#00d4ff] bg-[#00d4ff]/15 text-[#7dd3fc]"
                : "border-white/15 bg-white/[0.03] text-white/65 hover:border-[#00d4ff]/40 hover:text-white/90"
            }`}
          >
            {cat === "all" ? "All tracks" : CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-white/70 font-mono text-sm">Catalog loading soon. Run the ebooks migration on the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((ebook) => (
            <article
              key={ebook.id}
              className="group relative flex flex-col rounded-2xl border border-[#00d4ff]/25 bg-gradient-to-br from-[#071321]/80 via-[#0b0b14]/90 to-[#12101f]/85 p-5 sm:p-6 shadow-[0_0_40px_rgba(0,212,255,0.08)] transition-all duration-300 hover:border-[#00d4ff]/50 hover:shadow-[0_0_60px_rgba(0,212,255,0.16)]"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-80"
                style={{ background: `linear-gradient(90deg, ${ebook.coverAccent}, transparent)` }}
                aria-hidden
              />
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/70">
                    {WORKBOOK_STYLE_LABELS[ebook.workbookStyle]}
                  </span>
                  {ebook.libraryOnly || ebook.delivery === "library" || isFrontendEbook(ebook.slug) ? (
                    <span className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                      Library access
                    </span>
                  ) : ebook.hasPdf ? (
                    <span className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                      PDF ready
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-amber-200/90">
                      Coming soon
                    </span>
                  )}
                </div>
                <span className="text-lg sm:text-xl font-bold text-[#fde68a] font-mono shrink-0">
                  {formatInr(ebook.priceInr || defaultPriceInr)}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">{ebook.title}</h2>
              {ebook.subtitle ? (
                <p className="mt-1 text-xs sm:text-sm text-[#7dd3fc]/90 font-mono">{ebook.subtitle}</p>
              ) : null}
              <p className="mt-3 text-sm text-white/75 leading-relaxed flex-1">{ebook.description}</p>
              {ebook.highlights?.length ? (
                <ul className="mt-4 space-y-1.5">
                  {ebook.highlights.slice(0, 4).map((h) => (
                    <li key={h} className="flex items-start gap-2 text-xs text-white/65">
                      <span className="text-[#00f5d4] mt-0.5">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <button
                type="button"
                disabled={!ebook.isPurchasable || busy}
                onClick={() => startCheckout(ebook)}
                className="mt-5 w-full rounded-xl border border-[#00d4ff] bg-[#00d4ff]/15 px-4 py-3 text-xs sm:text-sm font-mono uppercase tracking-wider text-[#00d4ff] transition-colors hover:bg-[#00d4ff]/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ebook.isPurchasable ? `Buy — ${formatInr(ebook.priceInr || defaultPriceInr)}` : "Coming soon"}
              </button>
            </article>
          ))}
        </div>
      )}

      {checkout ? (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-[#00d4ff]/35 bg-[#0b0f18] p-5 sm:p-6 shadow-[0_0_80px_rgba(0,212,255,0.2)]"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#7dd3fc]">Secure checkout</p>
                <h3 id="checkout-title" className="text-lg font-bold text-white mt-1">{checkout.ebook.title}</h3>
                <p className="text-sm font-mono text-[#fde68a] mt-1">
                  {formatInr(checkout.ebook.priceInr || defaultPriceInr)} · Razorpay
                </p>
              </div>
              <button
                type="button"
                onClick={() => !busy && setCheckout(null)}
                className="text-white/50 hover:text-white text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <form onSubmit={submitCheckout} className="space-y-3">
              <label className="block">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">Full name</span>
                <input
                  required
                  value={checkout.buyerName}
                  onChange={(e) => setCheckout({ ...checkout, buyerName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00d4ff]/60"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">Email (use your Google / Gmail)</span>
                <input
                  required
                  type="email"
                  value={checkout.buyerEmail}
                  onChange={(e) => setCheckout({ ...checkout, buyerEmail: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00d4ff]/60"
                  placeholder="you@gmail.com"
                />
                <span className="mt-1 block text-[10px] text-white/45">Must match the Google account you use to open /library</span>
              </label>
              <label className="block">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">Phone</span>
                <input
                  required
                  type="tel"
                  value={checkout.buyerPhone}
                  onChange={(e) => setCheckout({ ...checkout, buyerPhone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-[#00d4ff]/60"
                  placeholder="+91 98765 43210"
                />
              </label>
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl border border-[#00d4ff] bg-[#00d4ff] px-4 py-3 text-sm font-mono uppercase tracking-wider text-[#041018] hover:bg-[#33ddff] disabled:opacity-60"
              >
                {busy ? "Opening Razorpay…" : "Pay with Razorpay"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
