"use client";

import { useState } from "react";
import EnrollLeadModal from "@/components/EnrollLeadModal";

type Props = {
  source: string;
  label?: string;
  className?: string;
  modalTitle?: string;
  modalSubtitle?: string;
  whatsappMessage?: string;
};

export default function EnrollNowButton({
  source,
  label = "Enroll Now",
  className = "inline-flex items-center justify-center rounded-lg border border-[#00d4ff]/55 bg-[#00d4ff]/20 px-6 py-3 text-sm font-semibold text-[#bff3ff] hover:bg-[#00d4ff]/30 transition-colors",
  modalTitle,
  modalSubtitle,
  whatsappMessage,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      <EnrollLeadModal
        open={open}
        onClose={() => setOpen(false)}
        source={source}
        title={modalTitle}
        subtitle={modalSubtitle}
        whatsappMessage={whatsappMessage}
      />
    </>
  );
}
