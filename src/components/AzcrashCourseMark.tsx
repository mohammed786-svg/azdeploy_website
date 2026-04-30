"use client";

import Link from "next/link";
import OrbitStarsField from "@/components/OrbitStarsField";

type Props = {
  /** Where the mark links (default: full program page). */
  href?: string;
  /** Slightly tighter on dense layouts. */
  size?: "default" | "compact";
  /** Override default screen-reader label. */
  "aria-label"?: string;
  /** Small line under the tagline (default: open syllabus). Set `false` to hide. */
  footerHint?: string | false;
  /** Antigravity-style orbital particles behind the mark. */
  orbitBackground?: boolean;
};

/**
 * Flagship program codename — HUD-style mark with animated rim + strong hover glow.
 */
export default function AzcrashCourseMark({
  href = "/courses",
  size = "default",
  "aria-label": ariaLabel = "AZCrash 1.0 — flagship program (open courses)",
  footerHint = "Open syllabus →",
  orbitBackground = true,
}: Props) {
  const compact = size === "compact";
  return (
    <div
      className={`relative flex justify-center items-center w-full overflow-hidden rounded-3xl ${
        compact ? "my-4 min-h-[200px]" : "my-5 sm:my-6 min-h-[240px] sm:min-h-[280px]"
      }`}
    >
      {orbitBackground && (
        <>
          <OrbitStarsField className="opacity-95" intensity={0.78} />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,transparent_0%,rgba(7,8,13,0.08)_40%,rgba(7,8,13,0.38)_100%)]"
            aria-hidden
          />
        </>
      )}
      <Link
        href={href}
        className="azcrash-mark group relative z-[2] isolate max-w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4ff]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080d] rounded-2xl"
        aria-label={ariaLabel}
      >
        {/* Hover bloom */}
        <span
          className="pointer-events-none absolute -inset-8 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 azcrash-mark__bloom"
          aria-hidden
        />

        <span className="relative z-10 block rounded-2xl p-[2px] bg-gradient-to-b from-white/[0.12] to-transparent">
          <span className="flex flex-col items-center rounded-2xl bg-[#07080d]/[0.97] px-5 py-3.5 sm:px-8 sm:py-4 border border-white/[0.07] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <span className="text-[9px] sm:text-[10px] font-mono text-[#64748b] tracking-[0.45em] uppercase mb-2 select-none">
              Flagship · codename
            </span>
            <span
              className={`font-mono font-black tracking-tight leading-none flex flex-wrap items-baseline justify-center gap-x-1 sm:gap-x-1.5 ${
                compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl md:text-4xl"
              }`}
            >
              <span className="azcrash-mark__gold bg-gradient-to-b from-[#ffe566] via-[#ffd700] to-[#b8860b] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,215,0,0.35)] group-hover:drop-shadow-[0_0_22px_rgba(255,215,0,0.75)] transition-[filter] duration-300">
                AZ
              </span>
              <span className="azcrash-mark__cyan bg-gradient-to-b from-[#7df9ff] via-[#00d4ff] to-[#007799] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(0,212,255,0.45)] group-hover:drop-shadow-[0_0_28px_rgba(0,245,212,0.85)] transition-[filter] duration-300">
                CRASH
              </span>
              <span className="inline-flex items-center gap-1 ml-0.5 sm:ml-1">
                <span className="text-[0.55em] font-bold text-white/25 font-mono select-none">×</span>
                <span className="rounded-md border border-[#00d4ff]/40 bg-[#00d4ff]/[0.08] px-2 py-0.5 text-[0.58em] sm:text-[0.52em] font-mono font-bold text-[#00f5d4] tabular-nums shadow-[0_0_16px_rgba(0,212,255,0.2)] group-hover:border-[#ffd700]/50 group-hover:text-[#ffd700] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.35)] transition-all duration-300">
                  1.0
                </span>
              </span>
            </span>
            <span className="mt-2.5 text-[10px] sm:text-[11px] font-mono text-[#94a3b8] tracking-[0.15em] uppercase text-center group-hover:text-[#cbd5e1] transition-colors">
              Full-stack · AI · DevOps · 6 Months
            </span>
            {footerHint !== false && (
              <span className="mt-2 text-[9px] font-mono text-[#00d4ff]/0 group-hover:text-[#00d4ff]/90 transition-all duration-300 uppercase tracking-widest">
                {footerHint}
              </span>
            )}
          </span>
        </span>
      </Link>
    </div>
  );
}
