import Image from "next/image";
import { company } from "@/data/proposals";

interface ProposalHeaderProps {
  compact?: boolean;
}

export function ProposalHeader({ compact = false }: ProposalHeaderProps) {
  return (
    <header className="border-b border-[#00d4ff]/20 bg-[#0a0a0c]/60">
      <div
        className={`mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-center ${
          compact ? "py-6" : "py-8 sm:py-10"
        }`}
      >
        <Image
          src="/logo_gold.png"
          alt={`${company.name} logo`}
          width={compact ? 180 : 220}
          height={compact ? 90 : 110}
          className="h-auto w-auto max-w-[min(80vw,220px)] object-contain"
          priority
        />
        <div className="space-y-1">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.35em] text-[#00d4ff]">
            {company.name}
          </p>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {company.tagline}
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-[#64748b]">{company.documentType}</p>
        </div>
      </div>
    </header>
  );
}
