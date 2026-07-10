"use client";

import { openWhatsAppShare } from "@/lib/hq-whatsapp";

type Props = {
  mobile?: string;
  whatsappMessage?: string;
  backHref?: string;
  backLabel?: string;
};

export default function PrintShareActions({ mobile, whatsappMessage, backHref, backLabel }: Props) {
  return (
    <div className="print:hidden mb-4 flex flex-wrap gap-2 text-sm">
      {backHref ? (
        <a href={backHref} className="text-blue-700 underline">
          {backLabel || "← Back"}
        </a>
      ) : null}
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded border border-neutral-400 px-3 py-1 text-neutral-800 hover:bg-neutral-100"
      >
        Download PDF / Print
      </button>
      {mobile && whatsappMessage ? (
        <button
          type="button"
          onClick={() => openWhatsAppShare(mobile, whatsappMessage)}
          className="rounded border border-emerald-600 bg-emerald-50 px-3 py-1 text-emerald-800 hover:bg-emerald-100"
        >
          Share on WhatsApp
        </button>
      ) : null}
    </div>
  );
}
