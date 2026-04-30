import Link from "next/link";

const WHATSAPP = "https://wa.me/918296565587";

/** Shared copy — full section expands; compact uses one-line summaries */
export const WHY_AZDEPLOY_PILLARS = [
  {
    kicker: "REAL_SHIPPING",
    title: "Mentors who build products, not slide decks",
    summary: "Trainers carry years of shipping software — you learn what breaks in prod, not just what passes tests.",
    detail:
      "Expect honest war stories: outages, bad deploys, performance cliffs, and how teams recover. That context is what interview panels listen for — and what separates engineers from tutorial finishers.",
  },
  {
    kicker: "DEPTH_FIRST",
    title: "Fundamentals before AI glitter",
    summary: "Strong systems thinking and debugging so AI accelerates you instead of masking gaps.",
    detail:
      "We drill HTTP, databases, concurrency basics, and reading error messages under pressure. When you reach for AI, it’s to move faster on a foundation you already understand — not to guess your way through fundamentals.",
  },
  {
    kicker: "PLACEMENT_REALITY",
    title: "Curriculum shaped like real hiring",
    summary: "System design, trade-offs, and hands-on depth aligned with how teams actually hire.",
    detail:
      "You practice explaining architecture, defending schema choices, and walking through failures. The goal isn’t a certificate — it’s sounding credible when someone asks “what happens when traffic 10×’s overnight?”",
  },
  {
    kicker: "SMALL_BATCHES",
    title: "Limited seats — feedback that scales with you",
    summary: "Room for code review, 1:1 mentorship, and accountability — not anonymous lecture halls.",
    detail:
      "Smaller cohorts mean your questions get answered, your projects get reviewed, and you can’t hide. We optimize for depth and follow-through, not packing the room.",
  },
  {
    kicker: "SIX_MONTH_ARC",
    title: "Six months to go from syntax to deploy",
    summary: "Structured path from UI + API + DB to Linux, Nginx, Docker, CI/CD, and cloud VPS.",
    detail:
      "You’re not racing through frameworks in isolation — you connect the full path a feature travels before users touch it. That’s the muscle memory companies expect from mid-level engineers.",
  },
  {
    kicker: "ONE_TRACK_MANY_DOORS",
    title: "One program — choose where you lean",
    summary: "Same ongoing track; mentors help you stress build, ops, or AI based on how you fit.",
    detail:
      "Whether you gravitate toward product code, infrastructure, or AI-enabled features, you stay inside one coherent journey — so your story stays sharp when you interview for the role you actually want.",
  },
] as const;

const CREDIBILITY = [
  { value: "8+", label: "Years in industry" },
  { value: "500+", label: "Products deployed" },
  { value: "30", label: "Students per batch" },
];

type Props = {
  variant?: "full" | "compact";
  className?: string;
};

export function WhyAzDeploy({ variant = "full", className = "" }: Props) {
  if (variant === "compact") {
    return (
      <div className={className}>
        <h2 className="text-sm font-bold text-[#00d4ff] font-mono mb-3 hud-label">[WHY_AZDEPLOY]</h2>
        <p className="inline-flex items-center rounded-full border border-[#ffd700]/45 bg-[#ffd700]/10 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#ffe27a] shadow-[0_0_16px_rgba(255,215,0,0.25)] mb-3">
          UP TO 12 LPA PACKAGE
        </p>
        <p className="text-[10px] font-mono text-[#64748b] mb-3 leading-relaxed">
          Job-ready training from people who ship — Belagavi, limited batches.
        </p>
        <ul className="space-y-2.5 text-xs text-white/75">
          {WHY_AZDEPLOY_PILLARS.map((p) => (
            <li key={p.kicker} className="flex items-start gap-2">
              <span className="text-[#00d4ff] mt-0.5 shrink-0 font-mono text-[10px]">▸</span>
              <span>
                <span className="text-[#94a3b8] font-mono text-[10px]">{p.kicker}</span>
                <span className="text-white/80"> — {p.summary}</span>
              </span>
            </li>
          ))}
        </ul>
        <Link
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 border border-[#00d4ff] text-[#00d4ff] text-xs font-mono hover:bg-[#00d4ff]/15 transition-colors"
        >
          ENROLL_NOW →
        </Link>
      </div>
    );
  }

  return (
    <section
      className={`courses-fade-in courses-fade-in-delay-2 relative max-w-6xl mx-auto mb-14 sm:mb-16 ${className}`}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-[#00d4ff]/25 bg-gradient-to-b from-[#071018]/95 via-[#0a0f14]/90 to-black/80 shadow-[0_0_80px_rgba(0,212,255,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]"
        aria-labelledby="why-azdeploy-heading"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.14),transparent_65%)]" />
        <div className="relative px-4 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <p className="text-[10px] sm:text-xs font-mono text-[#00d4ff] tracking-[0.35em] uppercase mb-3">[WHY_AZDEPLOY]</p>
            <p className="inline-flex items-center rounded-full border border-[#ffd700]/45 bg-[#ffd700]/10 px-3 py-1 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#ffe27a] shadow-[0_0_22px_rgba(255,215,0,0.28)] mb-3">
              UP TO 12 LPA PACKAGE
            </p>
            <h2
              id="why-azdeploy-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0f4ff] to-[#00d4ff] mb-4 leading-tight"
            >
              Where ambition meets real engineering
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
              Most institutes optimize for completion certificates. We optimize for{" "}
              <span className="text-white/90 font-medium">confidence in interviews</span>,{" "}
              <span className="text-white/90 font-medium">clarity under production pressure</span>, and{" "}
              <span className="text-white/90 font-medium">proof you can ship</span> — because that&apos;s what gets you hired and
              promoted.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
            {CREDIBILITY.map((c) => (
              <div
                key={c.label}
                className="rounded-lg border border-[#00d4ff]/20 bg-black/40 px-4 py-2.5 text-center min-w-[100px]"
              >
                <p className="text-lg sm:text-xl font-bold font-mono text-[#ffd700] tabular-nums">{c.value}</p>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#64748b]">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {WHY_AZDEPLOY_PILLARS.map((p) => (
              <article
                key={p.kicker}
                className="group rounded-xl border border-[#00d4ff]/15 bg-black/35 p-4 sm:p-5 transition duration-300 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/[0.04] hover:shadow-[0_0_24px_rgba(0,212,255,0.08)]"
              >
                <p className="text-[9px] sm:text-[10px] font-mono text-[#00d4ff]/80 tracking-widest mb-2">{p.kicker}</p>
                <h3 className="text-sm sm:text-base font-semibold text-white/95 mb-2 leading-snug group-hover:text-[#00f5d4] transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed mb-2">{p.summary}</p>
                <p className="text-[11px] sm:text-xs text-[#64748b] leading-relaxed border-t border-[#00d4ff]/10 pt-3 mt-1">
                  {p.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <Link
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00d4ff]/15 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono uppercase tracking-wider hover:bg-[#00d4ff]/25 transition-colors"
            >
              Ask us on WhatsApp →
            </Link>
            <p className="text-[11px] text-[#64748b] max-w-md font-mono leading-relaxed">
              /// Tell us your background — we&apos;ll help you see how this program maps to the role you want.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
