"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  claimKidzzySession,
  formatInr,
  getKidzzyBuyerEmail,
  getKidzzyBuyerSession,
  kidzzyDownloadUrl,
  setKidzzyBuyerSession,
  type KidzzyPaidLineItem,
} from "@/lib/kidzzy";

function SuccessInner() {
  const search = useSearchParams();
  const orderRef = search.get("orderRef") || "";
  const token = search.get("token") || "";
  const title = search.get("title") || "Your printable";
  const amount = Number(search.get("amount") || 0);
  const email = search.get("email") || getKidzzyBuyerEmail();
  const sessionFromQuery = search.get("session") || "";
  const [ready, setReady] = useState(Boolean(getKidzzyBuyerSession() || sessionFromQuery));

  const items = useMemo(() => {
    const raw = search.get("items");
    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        if (Array.isArray(parsed)) return parsed as KidzzyPaidLineItem[];
      } catch {
        /* fall through */
      }
    }
    if (typeof window !== "undefined") {
      try {
        const stored = window.sessionStorage.getItem("kidzzy_success_items");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed as KidzzyPaidLineItem[];
        }
      } catch {
        /* ignore */
      }
    }
    return [] as KidzzyPaidLineItem[];
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (sessionFromQuery) {
        setKidzzyBuyerSession(sessionFromQuery, email || undefined);
        if (!cancelled) setReady(true);
        return;
      }
      if (getKidzzyBuyerSession()) {
        if (!cancelled) setReady(true);
        return;
      }
      const claimToken = token || items[0]?.downloadToken || "";
      if (claimToken) {
        try {
          await claimKidzzySession(claimToken);
          if (!cancelled) setReady(true);
        } catch {
          if (!cancelled) setReady(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionFromQuery, email, token, items]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">✓</div>
      <h1 className="mt-6 text-3xl font-black text-slate-900">Payment Successful!</h1>
      <p className="mt-3 text-slate-600">
        Thanks for buying <strong>{title}</strong>
        {amount ? ` for ${formatInr(amount)}` : ""}. Your PDF{items.length > 1 ? "s" : ""} and invoice are ready.
      </p>
      {orderRef ? <p className="mt-2 text-xs text-slate-400">Order {orderRef}</p> : null}
      {email ? (
        <p className="mt-2 text-xs text-slate-500">
          Signed in as <span className="font-semibold">{email}</span> on this device
        </p>
      ) : null}

      <div className="mt-8 flex w-full flex-col gap-3">
        {items.length > 1 ? (
          items.map((it) => (
            <a
              key={it.downloadToken || it.productSlug}
              href={kidzzyDownloadUrl(it.downloadToken)}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Download {it.productTitle}
              {it.quantity > 1 ? ` (×${it.quantity})` : ""}
            </a>
          ))
        ) : token || items[0]?.downloadToken ? (
          <a
            href={kidzzyDownloadUrl(token || items[0].downloadToken)}
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Download PDF
          </a>
        ) : null}
        <Link
          href="/kidzzy/orders"
          className={`rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 ${
            ready ? "" : "pointer-events-none opacity-60"
          }`}
        >
          View My Orders & Invoice
        </Link>
        <Link href="/kidzzy" className="text-sm font-semibold text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function KidzzySuccessPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-slate-500">Loading…</p>}>
      <SuccessInner />
    </Suspense>
  );
}
