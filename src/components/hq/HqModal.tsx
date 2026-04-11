"use client";

import { useEffect } from "react";

const maxW = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-5xl",
} as const;

type MaxKey = keyof typeof maxW;

export default function HqModal({
  open,
  title,
  children,
  onClose,
  size = "md",
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: MaxKey;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="dialog" aria-modal aria-labelledby="hq-modal-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 cursor-default"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className={`relative w-full ${maxW[size]} max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c12] p-6 shadow-2xl`}
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <h2 id="hq-modal-title" className="text-lg font-semibold text-white pr-2">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-[#64748b] hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
