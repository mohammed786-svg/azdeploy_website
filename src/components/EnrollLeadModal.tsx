"use client";

import { useEffect, useState } from "react";
import LeadCaptureMiniForm from "@/components/LeadCaptureMiniForm";
import { ACADEMY_CONTACT_NUMBERS } from "@/lib/contact-info";

type Tab = "form" | "whatsapp";

type Props = {
  open: boolean;
  onClose: () => void;
  source: string;
  title?: string;
  subtitle?: string;
  borderClass?: string;
  whatsappMessage?: string;
};

const DEFAULT_WA_MESSAGE = `Hi AZ Deploy Academy,

I'm interested in becoming a job-ready software engineer through your Full-Stack + AI + DevOps program (6 months, Belagavi).

Please share the next steps for enrollment, batch timings (morning / afternoon / evening), and any prerequisites.

Thank you.`;

export default function EnrollLeadModal({
  open,
  onClose,
  source,
  title = "Enroll Now",
  subtitle = "Choose how you want to reach us — submit the form or message us directly on WhatsApp.",
  borderClass = "border-[#00d4ff]/40",
  whatsappMessage = DEFAULT_WA_MESSAGE,
}: Props) {
  const [tab, setTab] = useState<Tab>("form");
  const waHref = `https://wa.me/${ACADEMY_CONTACT_NUMBERS[0].raw}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    if (!open) return;
    setTab("form");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`relative w-full max-w-md rounded-2xl border ${borderClass} bg-gradient-to-br from-[#071321]/98 via-[#0a0a12]/98 to-[#12101f]/98 shadow-[0_0_80px_rgba(0,212,255,0.15)] p-5 sm:p-6 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-lead-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-white/70 hover:text-white border border-white/15 rounded-lg w-8 h-8"
          aria-label="Close"
        >
          ×
        </button>
        <h3 id="enroll-lead-title" className="text-lg sm:text-xl font-bold text-white pr-8">
          {title}
        </h3>
        {subtitle ? <p className="mt-2 text-sm text-white/75 leading-relaxed">{subtitle}</p> : null}

        <div className="mt-4 grid grid-cols-2 gap-2 p-1 rounded-xl border border-white/10 bg-black/40">
          <button
            type="button"
            onClick={() => setTab("form")}
            aria-pressed={tab === "form"}
            className={`rounded-lg px-3 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
              tab === "form"
                ? "bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/50"
                : "text-white/60 hover:text-white/90 border border-transparent"
            }`}
          >
            Enquiry form
          </button>
          <button
            type="button"
            onClick={() => setTab("whatsapp")}
            aria-pressed={tab === "whatsapp"}
            className={`rounded-lg px-3 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
              tab === "whatsapp"
                ? "bg-[#25D366]/20 text-[#86efac] border border-[#25D366]/50"
                : "text-white/60 hover:text-white/90 border border-transparent"
            }`}
          >
            WhatsApp
          </button>
        </div>

        <div className="mt-4">
          {tab === "form" ? (
            <LeadCaptureMiniForm source={source} stacked onSubmitted={onClose} />
          ) : (
            <div className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 p-4">
              <p className="text-sm text-white/80 leading-relaxed">
                Opens WhatsApp to{" "}
                <span className="font-mono text-[#86efac]">{ACADEMY_CONTACT_NUMBERS[0].display}</span> with a
                pre-filled enrollment message. You can edit it before sending.
              </p>
              <pre className="mt-3 max-h-36 overflow-y-auto rounded-lg border border-white/10 bg-black/50 p-3 text-[11px] text-white/65 whitespace-pre-wrap font-mono leading-relaxed">
                {whatsappMessage}
              </pre>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#25D366]/70 bg-[#25D366]/20 px-4 py-3 text-sm font-semibold text-[#86efac] hover:bg-[#25D366]/30 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Open WhatsApp message
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
