"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import EbookPaymentReceipt from "@/components/ebooks/EbookPaymentReceipt";

function SuccessInner() {
  const params = useSearchParams();
  const orderRef = params.get("order") || "";
  const title = params.get("title") || "Ebook";
  const slug = params.get("slug") || "";
  const buyerName = params.get("name") || "";
  const buyerEmail = params.get("email") || "";
  const amount = Number(params.get("amount") || "2999") || 2999;
  const libraryReady = params.get("library") === "1" || slug === "ai-engineering";

  return (
    <div className="min-h-screen bg-neutral-200">
      <div className="ebook-receipt-chrome sticky top-0 z-40 border-b border-neutral-300 bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Payment successful</p>
            <p className="text-[11px] text-neutral-500 font-mono">{orderRef}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded border border-neutral-900 bg-neutral-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Print / Save receipt PDF
            </button>
            {libraryReady ? (
              <Link
                href={`/library/login?next=${encodeURIComponent(slug ? `/library/ebooks/${slug}` : "/library")}`}
                className="rounded border border-sky-600 bg-sky-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white"
              >
                Open library (Google)
              </Link>
            ) : null}
            <Link href="/ebooks" className="rounded border border-neutral-300 px-3 py-1.5 text-xs text-neutral-700">
              Store
            </Link>
          </div>
        </div>
        {libraryReady ? (
          <p className="mx-auto max-w-[210mm] px-4 pb-3 text-[11px] text-neutral-600">
            Ebook reading is inside <strong>/library</strong> only (same Google email as checkout · max 2 IPs · no PDF download).
          </p>
        ) : null}
      </div>

      <EbookPaymentReceipt
        orderRef={orderRef}
        buyerName={buyerName}
        buyerEmail={buyerEmail}
        ebookTitle={title}
        ebookSlug={slug}
        amountInr={amount}
      />
    </div>
  );
}

export default function EbookSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-200 flex items-center justify-center text-sm text-neutral-600">
          Loading receipt…
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
