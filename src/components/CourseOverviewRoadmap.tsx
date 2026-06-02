"use client";

const STEP_VISUALS = [
  { glyph: "◈", tag: "TRAIN", glow: "shadow-[0_0_20px_rgba(0,212,255,0.45)]" },
  { glyph: "⬡", tag: "BUILD", glow: "shadow-[0_0_20px_rgba(167,139,250,0.45)]" },
  { glyph: "▲", tag: "SHIP", glow: "shadow-[0_0_20px_rgba(34,197,94,0.45)]" },
  { glyph: "◎", tag: "PREP", glow: "shadow-[0_0_20px_rgba(255,215,0,0.4)]" },
  { glyph: "★", tag: "HIRE", glow: "shadow-[0_0_24px_rgba(0,245,212,0.55)]" },
] as const;

/** Stylized stack icons — original AZDeploy artwork, not third-party trademarks. */
function TechIcon({ kind }: { kind: string }) {
  const wrap = "relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-white/10 bg-[#07080d]/90 roadmap-icon-ring";
  const base = "w-8 h-8 sm:w-9 sm:h-9";
  switch (kind) {
    case "python":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <rect x="4" y="4" width="32" height="32" rx="8" fill="#0f172a" stroke="#3776ab" strokeWidth="1.5" />
            <path d="M14 14h8a3 3 0 013 3v4h-4v-2h-5v8h5v-2h4v4a3 3 0 01-3 3h-8a3 3 0 01-3-3v-4h4v2h5v-8h-5v2h-4v-4a3 3 0 013-3z" fill="#ffd43b" opacity="0.95" />
            <circle cx="17" cy="17" r="1.2" fill="#0f172a" />
            <circle cx="23" cy="23" r="1.2" fill="#0f172a" />
          </svg>
        </div>
      );
    case "react":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <circle cx="20" cy="20" r="18" fill="#0f172a" stroke="#61dafb" strokeWidth="1.2" />
            <ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="#61dafb" strokeWidth="1.2" />
            <ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="#61dafb" strokeWidth="1.2" transform="rotate(60 20 20)" />
            <ellipse cx="20" cy="20" rx="14" ry="5" fill="none" stroke="#61dafb" strokeWidth="1.2" transform="rotate(120 20 20)" />
            <circle cx="20" cy="20" r="2.5" fill="#61dafb" />
          </svg>
        </div>
      );
    case "brain":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <rect x="4" y="4" width="32" height="32" rx="8" fill="#0f172a" stroke="#00f5d4" strokeWidth="1.2" />
            <path d="M20 11c-4 0-6 2.5-6 5.5 0 2 1 3.5 2.5 4.5-1.5 1-2.5 2.5-2.5 4.5 0 3 2 5.5 6 5.5s6-2.5 6-5.5c0-2-1-3.5-2.5-4.5 1.5-1 2.5-2.5 2.5-4.5 0-3-2-5.5-6-5.5z" fill="none" stroke="#00f5d4" strokeWidth="1.3" />
            <path d="M20 11v18M15 16h10M14 22h12" stroke="#7dd3fc" strokeWidth="0.9" opacity="0.7" />
          </svg>
        </div>
      );
    case "database":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <ellipse cx="20" cy="12" rx="12" ry="4" fill="#0f172a" stroke="#336791" strokeWidth="1.3" />
            <path d="M8 12v16c0 2.2 5.4 4 12 4s12-1.8 12-4V12" fill="none" stroke="#336791" strokeWidth="1.3" />
            <path d="M8 20c0 2.2 5.4 4 12 4s12-1.8 12-4" fill="none" stroke="#5eb3d9" strokeWidth="1" opacity="0.8" />
          </svg>
        </div>
      );
    case "docker":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <rect x="4" y="4" width="32" height="32" rx="8" fill="#0f172a" stroke="#2496ed" strokeWidth="1.2" />
            <rect x="11" y="18" width="5" height="5" rx="1" fill="#2496ed" />
            <rect x="17" y="18" width="5" height="5" rx="1" fill="#2496ed" />
            <rect x="23" y="18" width="5" height="5" rx="1" fill="#2496ed" />
            <rect x="17" y="12" width="5" height="5" rx="1" fill="#5eb3ff" />
            <path d="M10 26h22" stroke="#2496ed" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "cloud":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <path d="M14 28h16a6 6 0 000-12 8 8 0 00-15.2-2.4A5 5 0 0014 28z" fill="#0f172a" stroke="#ff9900" strokeWidth="1.3" />
            <path d="M18 24l3 3 6-6" fill="none" stroke="#ffb84d" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "shield":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <path d="M20 6l14 5v10c0 8-6 13-14 15-8-2-14-7-14-15V11l14-5z" fill="#0f172a" stroke="#f97316" strokeWidth="1.3" />
            <path d="M15 20l3 3 7-7" fill="none" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "mobile":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <rect x="12" y="6" width="16" height="28" rx="3" fill="#0f172a" stroke="#a78bfa" strokeWidth="1.3" />
            <rect x="14" y="10" width="12" height="18" rx="1" fill="#1e1b4b" stroke="#c4b5fd" strokeWidth="0.8" />
            <circle cx="20" cy="31" r="1.2" fill="#c4b5fd" />
          </svg>
        </div>
      );
    case "pipeline":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <rect x="4" y="4" width="32" height="32" rx="8" fill="#0f172a" stroke="#818cf8" strokeWidth="1.2" />
            <circle cx="12" cy="20" r="3" fill="#818cf8" />
            <circle cx="28" cy="20" r="3" fill="#a5b4fc" />
            <path d="M15 20h10" stroke="#c7d2fe" strokeWidth="1.5" strokeDasharray="2 2" />
            <path d="M24 17l4 3-4 3" fill="none" stroke="#c7d2fe" strokeWidth="1.2" />
          </svg>
        </div>
      );
    case "nginx":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <rect x="4" y="4" width="32" height="32" rx="6" fill="#0f172a" stroke="#009639" strokeWidth="1.2" />
            <path d="M12 28V12h6l4 10 4-10h6v16" fill="none" stroke="#009639" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case "chart":
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <rect x="4" y="4" width="32" height="32" rx="8" fill="#0f172a" stroke="#22c55e" strokeWidth="1.2" />
            <path d="M11 27V17M18 27V13M25 27V21M32 27V15" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={wrap}>
          <svg viewBox="0 0 40 40" className={base} aria-hidden>
            <rect x="4" y="4" width="32" height="32" rx="8" fill="#0f172a" stroke="#00d4ff" strokeWidth="1.2" />
            <path d="M12 20h16M20 12v16" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
  }
}

const ROADMAP_STEPS = [
  {
    step: "01",
    title: "Expert foundation",
    desc: "Learn from 8+ years industry mentors with a fundamentals-first, production-minded approach.",
  },
  {
    step: "02",
    title: "Real-world products",
    desc: "Work on labs shaped like live codebases — the same problems teams solve in production.",
  },
  {
    step: "03",
    title: "Ship & deploy",
    desc: "Deliver portfolio-ready projects with deployment, reviews, and professional documentation.",
  },
  {
    step: "04",
    title: "Career readiness",
    desc: "Resume, GitHub portfolio, mock interviews, and confident role-specific storytelling.",
  },
  {
    step: "05",
    title: "Job assistance",
    desc: "Placement guidance once you are industry-ready — connections, referrals, and interview support.",
  },
] as const;

const COURSE_STACK: Record<string, { icons: string[]; focus: string }> = {
  ai: { icons: ["python", "brain", "react", "cloud"], focus: "AI-powered product features" },
  ml: { icons: ["python", "chart", "database", "brain"], focus: "production ML workflows" },
  "deep-learning": { icons: ["brain", "python", "chart", "cloud"], focus: "deep learning in real apps" },
  "ethical-hacking": { icons: ["shield", "nginx", "docker", "cloud"], focus: "offensive security assessments" },
  "cyber-security": { icons: ["shield", "database", "nginx", "cloud"], focus: "security operations & response" },
  "ai-engineering": { icons: ["brain", "docker", "pipeline", "cloud"], focus: "production AI services" },
  "data-engineering": { icons: ["database", "pipeline", "python", "cloud"], focus: "reliable data pipelines" },
  mobile: { icons: ["mobile", "react", "database", "cloud"], focus: "publish-ready mobile apps" },
  devops: { icons: ["docker", "nginx", "cloud", "pipeline"], focus: "deployable cloud systems" },
};

type Props = {
  courseId: string;
  courseTitle: string;
  accentClass: string;
};

export default function CourseOverviewRoadmap({ courseId, courseTitle, accentClass }: Props) {
  const stack = COURSE_STACK[courseId] ?? { icons: ["python", "cloud", "database", "react"], focus: "industry-ready delivery" };

  return (
    <div className="roadmap-panel mt-6 relative overflow-hidden rounded-2xl border border-[#00d4ff]/30 bg-gradient-to-br from-[#071321]/95 via-[#0a0a12]/95 to-[#12101f]/90 p-4 sm:p-6 shadow-[0_0_50px_rgba(0,212,255,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.18),transparent_65%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 roadmap-grid-overlay opacity-[0.07]" aria-hidden />

      <div className="relative flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <p className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-[#7dd3fc]">
            <span className="live-dot opacity-80" />
            Career journey roadmap
          </p>
          <h4 className={`mt-2 text-lg sm:text-xl font-bold font-mono tracking-tight ${accentClass}`}>
            Classroom → Product → Career
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-white/70">
            Your overview path to a <span className={`font-semibold ${accentClass}`}>{courseTitle}</span> role
          </p>
        </div>
        <span className="rounded-full border border-[#ffd700]/40 bg-[#ffd700]/10 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-[#fde68a] shadow-[0_0_16px_rgba(255,215,0,0.2)]">
          Overview only
        </span>
      </div>

      <p className="relative text-xs sm:text-sm text-white/80 mb-5 leading-relaxed rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2.5">
        Industry expert training + real-world product exposure + job assistance — focused on{" "}
        <span className={`font-semibold ${accentClass}`}>{stack.focus}</span>.
      </p>

      <div className="relative mb-6 rounded-xl border border-[#00d4ff]/20 bg-[#00d4ff]/[0.04] px-3 py-4 sm:px-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#64748b] text-center mb-3">
          Tools & stack you touch
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {stack.icons.map((icon, i) => (
            <div
              key={`${courseId}-${icon}`}
              className="roadmap-icon-float flex flex-col items-center gap-1.5"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <TechIcon kind={icon} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: horizontal journey */}
      <div className="relative hidden sm:block mb-2">
        <svg className="absolute top-[2.1rem] left-[8%] right-[8%] h-3 w-[84%] overflow-visible" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden>
          <line x1="0" y1="6" x2="400" y2="6" stroke="rgba(0,212,255,0.15)" strokeWidth="2" />
          <line x1="0" y1="6" x2="400" y2="6" stroke="url(#roadmapGrad)" strokeWidth="2" strokeDasharray="8 6" className="roadmap-dash-flow" />
          <defs>
            <linearGradient id="roadmapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#00f5d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffd700" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
        <ol className="relative grid grid-cols-5 gap-2">
          {ROADMAP_STEPS.map((s, i) => {
            const vis = STEP_VISUALS[i];
            return (
              <li
                key={s.step}
                className="roadmap-step-enter group"
                style={{ animationDelay: `${0.1 + i * 0.12}s` }}
              >
                <div className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#00d4ff]/40 bg-[#07080d] text-lg transition-all duration-300 group-hover:scale-110 group-hover:border-[#00f5d4] ${vis.glow}`}>
                  <span className="text-[#00f5d4] drop-shadow-[0_0_8px_rgba(0,245,212,0.6)]">{vis.glyph}</span>
                </div>
                <div className="roadmap-step-card rounded-xl border border-white/10 bg-[#07080d]/90 p-3 transition-all duration-300 group-hover:border-[#00d4ff]/45 group-hover:shadow-[0_0_24px_rgba(0,212,255,0.15)] group-hover:-translate-y-0.5">
                  <p className="text-[9px] font-mono text-[#64748b] tracking-widest">{vis.tag} · {s.step}</p>
                  <p className="mt-1 text-xs font-bold text-white/95 leading-snug">{s.title}</p>
                  <p className="mt-1.5 text-[10px] text-[#94a3b8] leading-relaxed">{s.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: vertical timeline */}
      <ol className="relative sm:hidden space-y-0 pl-1">
        <div className="absolute left-[1.35rem] top-3 bottom-3 w-px roadmap-vertical-line" aria-hidden />
        {ROADMAP_STEPS.map((s, i) => {
          const vis = STEP_VISUALS[i];
          return (
            <li
              key={s.step}
              className="roadmap-step-enter relative flex gap-4 pb-5 last:pb-0"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#00d4ff]/40 bg-[#07080d] ${vis.glow}`}>
                <span className="text-[#00f5d4]">{vis.glyph}</span>
              </div>
              <div className="roadmap-step-card flex-1 rounded-xl border border-white/10 bg-[#07080d]/90 p-3">
                <p className="text-[9px] font-mono text-[#64748b] tracking-widest">{vis.tag} · {s.step}</p>
                <p className="mt-1 text-sm font-bold text-white/95">{s.title}</p>
                <p className="mt-1 text-[11px] text-[#94a3b8] leading-relaxed">{s.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="relative mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-[#ffd700]/35 bg-gradient-to-r from-[#ffd700]/[0.08] via-transparent to-[#00d4ff]/[0.08] px-4 py-3">
        <p className="text-[10px] sm:text-xs font-mono text-[#94a3b8] text-center sm:text-left leading-relaxed">
          /// Mentors with 500+ deployments · Real product labs · Portfolio proof · Job assistance when ready
        </p>
        <span className="shrink-0 rounded-lg border border-[#00f5d4]/50 bg-[#00f5d4]/10 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[#86ffe7] shadow-[0_0_20px_rgba(0,245,212,0.25)] roadmap-goal-pulse">
          Land the role
        </span>
      </div>
    </div>
  );
}
