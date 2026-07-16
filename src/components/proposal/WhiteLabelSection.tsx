import { Shield, CheckCircle2 } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

interface WhiteLabelSectionProps {
  points: string[];
}

export function WhiteLabelSection({ points }: WhiteLabelSectionProps) {
  return (
    <section className="avoid-break">
      <SectionTitle>White Label Rights</SectionTitle>
      <div className="rounded-xl border border-[#00d4ff]/20 bg-gradient-to-br from-[#00d4ff]/10 via-[#0e0e14] to-[#0a0a0c] p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#00d4ff]" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#00d4ff]">
            Full Ownership & Branding Rights
          </span>
        </div>
        <ul className="space-y-3">
          {points.map((point) => (
            <li key={point} className="flex gap-3 text-sm leading-relaxed sm:text-base">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00d4ff]" />
              <span className="text-[#e8f4f8]/90">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
