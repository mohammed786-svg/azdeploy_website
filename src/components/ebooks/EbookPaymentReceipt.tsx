"use client";

import { PrintLogoBlack } from "@/components/hq/PrintLogoBlack";
import { INVOICE_ORG } from "@/lib/invoice-org";
import { formatInr } from "@/lib/ebooks";
import { sanitizeForPdfFilename } from "@/lib/hq-print-pdf-title";
import { useEffect } from "react";

export type EbookReceiptProps = {
  orderRef: string;
  buyerName?: string;
  buyerEmail?: string;
  ebookTitle: string;
  ebookSlug?: string;
  amountInr?: number;
  paidAt?: string | Date | null;
};

/** HQ-style A4 payment receipt for ebook purchases (print-friendly). */
export default function EbookPaymentReceipt({
  orderRef,
  buyerName,
  buyerEmail,
  ebookTitle,
  ebookSlug,
  amountInr = 2999,
  paidAt,
}: EbookReceiptProps) {
  const when = paidAt ? new Date(paidAt) : new Date();

  useEffect(() => {
    const prev = document.title;
    const name = sanitizeForPdfFilename(buyerName || buyerEmail || "Customer");
    const num = sanitizeForPdfFilename(orderRef || "receipt");
    document.title = `${name} — Receipt ${num}`;
    return () => {
      document.title = prev;
    };
  }, [buyerName, buyerEmail, orderRef]);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @page { size: A4; margin: 8mm; }
          @media print {
            html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
            .ebook-receipt-chrome { display: none !important; }
            .ebook-receipt-screen { background: #fff !important; padding: 0 !important; }
            .ebook-receipt-sheet { box-shadow: none !important; max-width: none !important; width: 100% !important; }
            .hq-print-logo {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              filter: brightness(0) !important;
            }
          }
        `,
        }}
      />
      <div className="ebook-receipt-screen flex justify-center bg-neutral-200 py-6 print:bg-white print:py-0">
        <div
          className="ebook-receipt-sheet w-[210mm] max-w-[calc(100vw-1.5rem)] min-h-[297mm] bg-white text-neutral-900 shadow-xl print:shadow-none box-border px-[12mm] py-[10mm]"
          style={{ fontFamily: 'system-ui, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}
        >
          <header className="text-center border-b border-neutral-300 pb-6 mb-8">
            <div className="flex justify-center mb-3">
              <PrintLogoBlack align="center" className="h-16 sm:h-[72px] w-[260px] max-w-full min-h-[4rem]" />
            </div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-500">AZ Deploy Academy</p>
            <h1 className="text-2xl font-bold text-neutral-900 mt-2">PAYMENT RECEIPT</h1>
            <div className="text-xs text-neutral-600 mt-3 max-w-lg mx-auto leading-relaxed space-y-1">
              {INVOICE_ORG.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className="pt-1">
                <span className="text-neutral-500">Contact:</span> {INVOICE_ORG.phones[0]}
              </p>
              <p>GSTIN: {INVOICE_ORG.gstin}</p>
              <p>{INVOICE_ORG.website}</p>
            </div>
          </header>

          <div className="flex justify-between items-start gap-4 mb-8 text-sm">
            <div>
              <p className="text-[9px] uppercase text-neutral-500">Receipt / Order no.</p>
              <p className="font-mono font-semibold text-lg text-neutral-900">{orderRef || "—"}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase text-neutral-500">Date</p>
              <p className="font-mono text-neutral-900">
                {when.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          <section className="mb-6">
            <p className="text-[9px] uppercase text-neutral-500">Received from</p>
            <p className="text-lg font-semibold text-neutral-900 mt-1">{buyerName || "Customer"}</p>
            {buyerEmail ? <p className="text-sm text-neutral-600 mt-0.5">{buyerEmail}</p> : null}
          </section>

          <div className="rounded border-2 border-neutral-900 p-6 mb-8 text-center">
            <p className="text-[9px] uppercase tracking-wider text-neutral-500">Amount received</p>
            <p className="text-3xl font-bold text-neutral-900 mt-2 tabular-nums">{formatInr(amountInr)}</p>
          </div>

          <table className="w-full text-sm mb-6">
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="py-2 text-neutral-500 w-1/3">Purpose</td>
                <td className="py-2 text-neutral-900 font-medium">Ebook purchase — {ebookTitle}</td>
              </tr>
              {ebookSlug ? (
                <tr className="border-b border-neutral-200">
                  <td className="py-2 text-neutral-500">Catalog code</td>
                  <td className="py-2 font-mono text-neutral-900">{ebookSlug}</td>
                </tr>
              ) : null}
              <tr className="border-b border-neutral-200">
                <td className="py-2 text-neutral-500">Payment method</td>
                <td className="py-2 text-neutral-900">Razorpay</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 text-neutral-500">Access</td>
                <td className="py-2 text-neutral-900">
                  View in Library at {INVOICE_ORG.website}/library (same Google email · max 2 IPs)
                </td>
              </tr>
            </tbody>
          </table>

          <section className="text-sm text-neutral-600 mb-6 rounded border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-[9px] uppercase text-neutral-500 mb-1">Important</p>
            <p>
              This receipt confirms payment. Ebook content is available only inside your customer Library after signing in
              with Google. PDF download and sharing are disabled to protect licensed content.
            </p>
          </section>

          <footer className="pt-8 border-t border-neutral-200 text-center text-[9px] text-neutral-500 leading-relaxed space-y-1">
            <p>{INVOICE_ORG.legalName}</p>
            <p>
              {INVOICE_ORG.phones[0]} · GSTIN {INVOICE_ORG.gstin}
            </p>
            <p>{INVOICE_ORG.website}</p>
            <p className="text-neutral-400">Computer-generated receipt</p>
          </footer>
        </div>
      </div>
    </>
  );
}
