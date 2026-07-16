"use client";

import Link from "next/link";
import { ProposalRenderer } from "./ProposalRenderer";
import type { Proposal } from "@/data/proposals";

interface ProposalPageLayoutProps {
  proposal: Proposal;
}

/** Client-facing proposal — AZDeploy HUD theme, unique link only. */
export function ProposalPageLayout({ proposal }: ProposalPageLayoutProps) {
  return (
    <div className="proposal-shell min-h-screen hud-bg hud-grid">
      <nav className="sticky top-0 z-50 border-b border-[#00d4ff]/20 bg-[#0a0a0c]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/home"
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#00d4ff]/25 bg-[#00d4ff]/10 px-3 text-xs font-mono uppercase tracking-wider text-[#00d4ff] hover:bg-[#00d4ff]/20"
          >
            <span aria-hidden>←</span>
            Go Home
          </Link>
          <p className="truncate text-[10px] font-mono uppercase tracking-[0.2em] text-[#64748b] sm:text-xs">
            {proposal.clientName || proposal.title}
          </p>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="proposal-document-panel overflow-hidden rounded-2xl">
          <ProposalRenderer proposal={proposal} />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#00d4ff]/20 bg-[#0e0e14]/90 p-6 sm:flex-row">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#00d4ff]">Ready to proceed?</p>
            <p className="mt-1 text-sm text-[#94a3b8]">
              Contact AZDeploy — we&apos;ll walk you through the next steps.
            </p>
          </div>
          <Link
            href="/home"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#00d4ff]/30 px-4 text-xs font-mono uppercase tracking-wider text-[#00d4ff] hover:bg-[#00d4ff]/10"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
