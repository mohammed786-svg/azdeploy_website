"use client";

import { useEffect } from "react";
import LeadCaptureMiniForm from "@/components/LeadCaptureMiniForm";

type Props = {
  open: boolean;
  onClose: () => void;
  source: string;
  title?: string;
  subtitle?: string;
  borderClass?: string;
};

export default function EnrollLeadModal({
  open,
  onClose,
  source,
  title = "Enroll Now",
  subtitle = "Share your name and mobile number so our team can contact you about batch timing and admission.",
  borderClass = "border-[#00d4ff]/40",
}: Props) {
  useEffect(() => {
    if (!open) return;
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
        className={`relative w-full max-w-md rounded-2xl border ${borderClass} bg-gradient-to-br from-[#071321]/98 via-[#0a0a12]/98 to-[#12101f]/98 shadow-[0_0_80px_rgba(0,212,255,0.15)] p-5 sm:p-6`}
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
        <div className="mt-4">
          <LeadCaptureMiniForm source={source} stacked onSubmitted={onClose} />
        </div>
      </div>
    </div>
  );
}
