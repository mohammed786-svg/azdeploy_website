"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  createKidzzyOrder,
  fetchKidzzyProduct,
  formatInr,
  getKidzzyClientKey,
  trackKidzzyCheckoutLead,
  verifyKidzzyOrder,
} from "@/lib/kidzzy";
import {
  clearKidzzyCart,
  clearKidzzyCheckoutItems,
  getKidzzyCart,
  getKidzzyCheckoutItems,
  removeFromKidzzyCart,
  setKidzzyCheckoutItems,
  type KidzzyCartLine,
} from "@/lib/kidzzy-cart";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeIndianMobile(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length >= 12) digits = digits.slice(-10);
  else if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);
  else if (digits.length > 10) digits = digits.slice(-10);
  return digits.slice(0, 10);
}

function indianMobileError(value: string): string | undefined {
  const digits = normalizeIndianMobile(value);
  if (!digits) return "Mobile number is required";
  if (digits.length < 10) return "Enter a complete 10-digit mobile number";
  if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid Indian mobile (starts with 6, 7, 8 or 9)";
  if (/^(\d)\1{9}$/.test(digits)) return "Enter a real mobile number";
  return undefined;
}

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

function CheckoutInner() {
  const search = useSearchParams();
  const router = useRouter();
  const slug = search.get("slug") || "";
  const [lines, setLines] = useState<KidzzyCartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const billingRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let checkout = getKidzzyCheckoutItems();
        if (!checkout.length && slug) {
          const data = await fetchKidzzyProduct(slug);
          checkout = [
            {
              productSlug: data.item.slug,
              title: data.item.title,
              priceInr: data.item.priceInr,
              coverImageUrl: data.item.coverImageUrl,
              coverAccent: data.item.coverAccent,
              quantity: 1,
            },
          ];
          setKidzzyCheckoutItems(checkout);
        }
        if (!checkout.length) {
          checkout = getKidzzyCart();
          if (checkout.length) setKidzzyCheckoutItems(checkout);
        }
        if (!checkout.length) {
          if (!cancelled) {
            setErr("Your cart is empty");
            setLoading(false);
          }
          return;
        }
        // Refresh prices/titles from API
        const refreshed: KidzzyCartLine[] = [];
        for (const line of checkout) {
          try {
            const data = await fetchKidzzyProduct(line.productSlug);
            refreshed.push({
              productSlug: data.item.slug,
              title: data.item.title,
              priceInr: data.item.priceInr,
              coverImageUrl: data.item.coverImageUrl,
              coverAccent: data.item.coverAccent,
              quantity: line.quantity,
            });
          } catch {
            refreshed.push(line);
          }
        }
        if (cancelled) return;
        setLines(refreshed);
        setKidzzyCheckoutItems(refreshed);
        for (const line of refreshed) {
          void trackKidzzyCheckoutLead({ productSlug: line.productSlug, stage: "checkout_open" });
        }
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Could not load checkout");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const totalInr = lines.reduce((n, l) => n + l.priceInr * l.quantity, 0);
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!buyerName.trim()) next.name = "Please enter your name";
    if (!buyerEmail.trim()) next.email = "Please enter your email";
    else if (!isValidEmail(buyerEmail)) next.email = "Enter a valid email address";
    const phoneErr = indianMobileError(buyerPhone);
    if (phoneErr) next.phone = phoneErr;
    return next;
  }

  function scrollToFirstError(next: FieldErrors) {
    const target = next.name
      ? nameRef.current
      : next.email
        ? emailRef.current
        : next.phone
          ? phoneRef.current
          : null;
    billingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 280);
  }

  function syncLead(stage: "details_filled" | "pay_click" = "details_filled") {
    for (const line of lines) {
      void trackKidzzyCheckoutLead({
        productSlug: line.productSlug,
        stage,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerPhone: normalizeIndianMobile(buyerPhone),
      });
    }
  }

  async function pay() {
    if (!lines.length) return;
    const next = validate();
    setFieldErrors(next);
    if (next.name || next.email || next.phone) {
      const missing = [next.name && "Name", next.email && "Email", next.phone && "Mobile"]
        .filter(Boolean)
        .join(", ");
      setErr(`${missing} required — scroll up and fill the highlighted fields`);
      scrollToFirstError(next);
      return;
    }
    setBusy(true);
    setErr("");
    syncLead("pay_click");
    try {
      const order = await createKidzzyOrder({
        items: lines.map((l) => ({ productSlug: l.productSlug, quantity: l.quantity })),
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerPhone: normalizeIndianMobile(buyerPhone),
        clientKey: getKidzzyClientKey(),
      });
      const okScript = await loadRazorpayScript();
      if (!okScript || !window.Razorpay) throw new Error("Could not load Razorpay");

      const mobile = normalizeIndianMobile(buyerPhone);
      const rzp = new window.Razorpay({
        key: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amountPaise,
        currency: order.currency,
        name: "Kidzzy by AZ Deploy",
        description: order.productTitle,
        order_id: order.razorpayOrderId,
        prefill: {
          name: order.buyerName,
          email: order.buyerEmail,
          contact: mobile ? `+91${mobile}` : undefined,
        },
        theme: { color: "#2563EB" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await verifyKidzzyOrder({
              orderRef: order.orderRef,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            for (const line of lines) removeFromKidzzyCart(line.productSlug);
            if (!getKidzzyCart().length) clearKidzzyCart();
            clearKidzzyCheckoutItems();

            const qs = new URLSearchParams({
              orderRef: verified.orderRef,
              amount: String(verified.amountInr),
              email: verified.buyerEmail,
              title: verified.productTitle,
            });
            if (verified.buyerSession) qs.set("session", verified.buyerSession);
            if (verified.downloadToken) qs.set("token", verified.downloadToken);
            if (verified.items?.length) {
              try {
                window.sessionStorage.setItem(
                  "kidzzy_success_items",
                  JSON.stringify(verified.items),
                );
              } catch {
                /* ignore */
              }
              qs.set("items", encodeURIComponent(JSON.stringify(verified.items)));
            }
            router.push(`/kidzzy/success?${qs.toString()}`);
          } catch (e) {
            setErr(e instanceof Error ? e.message : "Verification failed");
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });
      rzp.open();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Checkout failed");
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-slate-500">Loading checkout…</p>;
  }

  if (err && !lines.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-600">{err}</p>
        <Link href="/kidzzy/printables" className="mt-4 inline-block font-semibold text-blue-600 hover:underline">
          Browse printables
        </Link>
      </div>
    );
  }

  const inputBase =
    "mt-1 w-full rounded-xl border bg-white px-3 py-3 text-base outline-none transition sm:py-2.5 sm:text-sm";
  const inputOk = "border-slate-200 focus:ring-2 focus:ring-blue-500/30";
  const inputBad = "border-red-400 bg-red-50/40 focus:ring-2 focus:ring-red-400/30";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-32 pt-6 sm:px-6 sm:pb-10 sm:pt-10">
      <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-slate-500">
        Secure payment powered by Razorpay · {itemCount} item{itemCount === 1 ? "" : "s"}
      </p>

      {err ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-6 lg:grid lg:grid-cols-3">
        <div className="order-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 lg:order-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Order summary</p>
          <ul className="mt-3 space-y-3">
            {lines.map((line) => (
              <li key={line.productSlug} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-bold leading-snug text-slate-900">{line.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Qty {line.quantity} · {formatInr(line.priceInr)} each
                  </p>
                </div>
                <p className="shrink-0 font-bold text-slate-900">{formatInr(line.priceInr * line.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm font-semibold text-slate-500">Total</span>
            <span className="text-2xl font-black text-slate-900">{formatInr(totalInr)}</span>
          </div>
          <Link href="/kidzzy/cart" className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline">
            ← Edit cart
          </Link>
        </div>

        <div
          ref={billingRef}
          id="billing-details"
          className="order-2 scroll-mt-24 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 lg:order-3"
        >
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Billing details</p>
          <p className="mt-1 text-xs text-slate-500">Required for receipt and PDF downloads</p>

          <label className="mt-4 block text-sm">
            <span className="font-semibold text-slate-700">
              Name <span className="text-red-500">*</span>
            </span>
            <input
              ref={nameRef}
              value={buyerName}
              onChange={(e) => {
                setBuyerName(e.target.value);
                if (fieldErrors.name) setFieldErrors((f) => ({ ...f, name: undefined }));
              }}
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.name)}
              className={`${inputBase} ${fieldErrors.name ? inputBad : inputOk}`}
              placeholder="Parent / guardian name"
            />
            {fieldErrors.name ? <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.name}</p> : null}
          </label>

          <label className="mt-3 block text-sm">
            <span className="font-semibold text-slate-700">
              Email <span className="text-red-500">*</span>
            </span>
            <input
              ref={emailRef}
              type="email"
              inputMode="email"
              autoComplete="email"
              value={buyerEmail}
              onChange={(e) => {
                setBuyerEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              className={`${inputBase} ${fieldErrors.email ? inputBad : inputOk}`}
              placeholder="you@gmail.com"
            />
            {fieldErrors.email ? <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.email}</p> : null}
          </label>

          <label className="mt-3 block text-sm">
            <span className="font-semibold text-slate-700">
              Mobile <span className="text-red-500">*</span>
            </span>
            <div
              className={`mt-1 flex overflow-hidden rounded-xl border bg-white transition ${
                fieldErrors.phone
                  ? "border-red-400 bg-red-50/40 ring-2 ring-red-400/30"
                  : "border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/30"
              }`}
            >
              <span className="flex shrink-0 items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
                +91
              </span>
              <input
                ref={phoneRef}
                value={buyerPhone}
                onChange={(e) => {
                  const next = normalizeIndianMobile(e.target.value);
                  setBuyerPhone(next);
                  if (fieldErrors.phone) {
                    setFieldErrors((f) => ({ ...f, phone: indianMobileError(next) }));
                  }
                }}
                onBlur={() => {
                  if (buyerPhone) {
                    setFieldErrors((f) => ({ ...f, phone: indianMobileError(buyerPhone) }));
                  }
                  if (!indianMobileError(buyerPhone)) syncLead("details_filled");
                }}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                pattern="[6-9][0-9]{9}"
                aria-invalid={Boolean(fieldErrors.phone)}
                className="w-full border-0 bg-transparent px-3 py-3 text-base outline-none sm:py-2.5 sm:text-sm"
                placeholder="9876543210"
              />
            </div>
            {fieldErrors.phone ? (
              <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.phone}</p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                10-digit Indian mobile (starts with 6–9) — for payment follow-up
              </p>
            )}
          </label>

          <p className="mt-4 rounded-xl bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-800">
            PDFs download instantly after payment. Find them later under My Orders with this email.
          </p>
        </div>

        <div className="order-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 lg:order-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Payment method</p>
          <p className="mt-2 text-lg font-black text-blue-700">Razorpay</p>
          <p className="mt-1 text-sm text-slate-500">UPI · Cards · Netbanking · RuPay</p>

          <button
            type="button"
            disabled={busy || !lines.length}
            onClick={() => void pay()}
            className="mt-5 hidden w-full rounded-full bg-blue-600 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 sm:block"
          >
            {busy ? "Opening Razorpay…" : `Pay ${formatInr(totalInr)} with Razorpay`}
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-5xl flex-col gap-2">
          {(fieldErrors.name || fieldErrors.email || fieldErrors.phone) && (
            <button
              type="button"
              onClick={() => scrollToFirstError(fieldErrors)}
              className="text-left text-xs font-semibold text-red-600"
            >
              {[fieldErrors.name && "Name", fieldErrors.email && "Email", fieldErrors.phone && "Mobile"]
                .filter(Boolean)
                .join(" · ")}{" "}
              missing — tap to fill
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-500">
                {lines.length === 1 ? lines[0].title : `${lines.length} printables`}
              </p>
              <p className="text-lg font-black text-slate-900">{formatInr(totalInr)}</p>
            </div>
            <button
              type="button"
              disabled={busy || !lines.length}
              onClick={() => void pay()}
              className="shrink-0 rounded-full bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50"
            >
              {busy ? "Opening…" : "Pay with Razorpay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KidzzyCheckoutPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-slate-500">Loading checkout…</p>}>
      <CheckoutInner />
    </Suspense>
  );
}
