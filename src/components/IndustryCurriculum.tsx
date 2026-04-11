"use client";

import { useState } from "react";

/** `slug` uses cdn.simpleicons.org; some brands 404 there — set `src` to a direct SVG URL (e.g. jsDelivr). */
type IconDef = { label: string; slug?: string; color?: string; src?: string };

type Phase = {
  id: string;
  title: string;
  tagline: string;
  bullets: string[];
  icons: IconDef[];
};

/** High-level industry-ready arcs — same 6-month program; not separate paid courses. */
const PHASES: Phase[] = [
  {
    id: "foundations",
    title: "Python & engineering foundations",
    tagline: "Readable Python, confident terminal work, and Git workflows teams expect",
    bullets: [
      "Python core: types, collections, functions, comprehensions, exceptions, and packaging (venv, pip, requirements).",
      "Structure & OOP: modules, packages, classes, protocols vs inheritance, and organizing code for growth.",
      "Quality habits: docstrings, typing basics, logging, and introductory tests (e.g. pytest) so refactors stay safe.",
      "Linux shell: filesystem layout, permissions, processes, pipes, cron-style thinking, and reading logs.",
      "Git end-to-end: clone → branch → commit → push, merge vs rebase (when each fits), `.gitignore`, and pull-request review flow.",
    ],
    icons: [
      { slug: "python", label: "Python", color: "3776AB" },
      { slug: "linux", label: "Linux", color: "FCC624" },
      { slug: "git", label: "Git", color: "F05032" },
    ],
  },
  {
    id: "data-sql",
    title: "Data & persistence",
    tagline: "Relational modeling, strong SQL, and Python-side data wrangling",
    bullets: [
      "PostgreSQL & SQL: SELECT patterns, JOINs, subqueries, GROUP BY, window functions, constraints, and transactions.",
      "Performance mindset: indexes, EXPLAIN, avoiding N+1 patterns, and sane migration strategies.",
      "Django data layer: models, relations, migrations, the ORM query API, and admin for rapid iteration.",
      "Pandas-style workflows: load CSV/JSON, clean, transform, aggregate, merge — bridging analysis to “small ETL” thinking.",
      "Data integrity: normalization vs denormalization trade-offs, keys, and when to push logic to SQL vs application code.",
    ],
    icons: [
      { slug: "postgresql", label: "PostgreSQL", color: "4169E1" },
      { slug: "django", label: "Django", color: "092E20" },
      { slug: "pandas", label: "Pandas", color: "150458" },
    ],
  },
  {
    id: "backend",
    title: "APIs & backend services",
    tagline: "RESTful APIs, auth, and contracts you can defend in design reviews",
    bullets: [
      "Django REST-style APIs: serializers, viewsets or class-based views, permissions, throttling, pagination, and filtering.",
      "Authentication patterns: sessions vs tokens, password flows at a high level, and protecting sensitive routes.",
      "Flask (and similar): blueprints, lightweight JSON APIs, and when a smaller service footprint makes sense.",
      "HTTP & API design: status codes, idempotency, errors, versioning, OpenAPI/Swagger-style documentation for consumers.",
      "Background work & integration: email/webhooks/file uploads (as applicable), idempotent handlers, and safe retries.",
    ],
    icons: [
      { slug: "django", label: "Django", color: "092E20" },
      { slug: "flask", label: "Flask", color: "000000" },
      { slug: "swagger", label: "OpenAPI", color: "85EA2D" },
    ],
  },
  {
    id: "frontend",
    title: "Modern frontend & UX",
    tagline: "React apps that are maintainable, testable, and pleasant to use",
    bullets: [
      "React fundamentals: components, JSX, hooks (state, effects, memoization), composition, and lifting state cleanly.",
      "Routing & UX: client-side navigation, protected routes, loading and empty states, and form validation feedback.",
      "State & data: Redux (or equivalent patterns), async fetching, caching basics, and avoiding unnecessary re-renders.",
      "Tooling: Vite-based dev/build, environment config, and lint/format discipline so teams can onboard fast.",
      "Quality bar: component tests, accessibility basics (keyboard, labels), and performance checks for real devices.",
    ],
    icons: [
      { slug: "react", label: "React", color: "61DAFB" },
      { slug: "redux", label: "Redux", color: "764ABC" },
      { slug: "vite", label: "Vite", color: "646CFF" },
    ],
  },
  {
    id: "devops",
    title: "DevOps, cloud & delivery",
    tagline: "Ship repeatable environments, automate pipelines, and run in the cloud",
    bullets: [
      "Server operations: SSH, users & permissions, systemd/services, log locations, disk, and basic troubleshooting.",
      "Nginx: reverse proxy to app servers, static assets, gzip/brotli awareness, and TLS termination concepts.",
      "Containers: Docker images & layers, multi-stage builds, Compose for local parity, and registry basics.",
      "Kubernetes orientation: pods, deployments, services, ConfigMaps/Secrets, ingress at a practitioner level (not certification cram).",
      "Infrastructure as code: Terraform (or similar) for providers, modules, state, and safe plan/apply workflows.",
      "AWS overview: EC2, S3, RDS/VPC at a “what to click and why” level; cost and security guardrails in mind.",
      "CI/CD: GitHub Actions (and Jenkins-style thinking)—build, test, artifact, deploy hooks, secrets in pipelines, rollbacks.",
    ],
    icons: [
      { slug: "docker", label: "Docker", color: "2496ED" },
      { slug: "kubernetes", label: "Kubernetes", color: "326CE5" },
      { slug: "terraform", label: "Terraform", color: "7B42BC" },
      {
        label: "AWS",
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg",
      },
      { slug: "githubactions", label: "GitHub Actions", color: "2088FF" },
      { slug: "nginx", label: "Nginx", color: "009639" },
    ],
  },
  {
    id: "ai-data-gen",
    title: "Data platforms, AI & Gen AI",
    tagline: "Big-data intuition, classical ML, and production-minded LLM features",
    bullets: [
      "Data platforms: batch vs streaming, partitions, idempotent pipelines, and lake vs warehouse trade-offs at a high level.",
      "Distributed processing: Spark/PySpark-style transformations (filter, join, aggregate) and when scale tooling matters.",
      "ML foundations: supervised vs unsupervised, train/validate/test, metrics, overfitting, and responsible data use.",
      "Deep learning touchpoints: tensors, training loops, CNN/RNN intuition, and using PyTorch-style APIs with pretrained models.",
      "Gen AI & LLMs: prompting, system prompts, tool use, cost/latency limits, and guardrails (PII, safety, monitoring).",
      "RAG & apps: chunking, embeddings, vector search concepts, and wiring LLM calls into Django/React backends safely.",
      "Ecosystem: Hugging Face Hub, OpenAI-compatible APIs, and Gemini-style multimodal awareness where relevant to products.",
    ],
    icons: [
      { slug: "apachespark", label: "Apache Spark", color: "E25A1C" },
      { slug: "pytorch", label: "PyTorch", color: "EE4C2C" },
      {
        label: "OpenAI",
        src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg",
      },
      { slug: "huggingface", label: "Hugging Face", color: "FFD21E" },
      { slug: "googlegemini", label: "Gemini", color: "8E75B2" },
    ],
  },
];

function StackIcon({ slug, label, color, src }: IconDef) {
  const c = color ?? "ffffff";
  const href = src ?? (slug ? `https://cdn.simpleicons.org/${slug}/${c}` : "");
  return (
    <span className="inline-flex flex-col items-center gap-1 shrink-0" title={label}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={href}
        alt=""
        width={28}
        height={28}
        className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-[0_0_8px_rgba(0,212,255,0.25)]"
        loading="lazy"
      />
      <span className="text-[8px] font-mono text-[#64748b] max-w-[52px] truncate text-center hidden sm:block">{label}</span>
    </span>
  );
}

function PhaseCard({ phase, open, onToggle }: { phase: Phase; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        open
          ? "border-[#00d4ff]/45 bg-[#00d4ff]/[0.07] shadow-[0_0_32px_rgba(0,212,255,0.12)]"
          : "border-white/[0.08] bg-[#0a0a12]/90 hover:border-[#00d4ff]/25"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
        aria-expanded={open}
      >
        <div className="flex flex-wrap gap-2 sm:gap-3 flex-1 min-w-0">
          {phase.icons.map((ic) => (
            <StackIcon key={`${phase.id}-${ic.slug ?? ic.src ?? ic.label}`} {...ic} />
          ))}
        </div>
        <div className="flex-1 min-w-0 sm:pl-2">
          <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{phase.title}</h3>
          <p className="text-[11px] sm:text-xs text-[#94a3b8] mt-1">{phase.tagline}</p>
        </div>
        <span
          className={`ml-auto shrink-0 w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#00d4ff] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="px-4 sm:px-5 pb-4 pt-0 space-y-2.5 border-t border-white/[0.06]">
            {phase.bullets.map((b, i) => (
              <li key={`${phase.id}-${i}`} className="flex gap-2 text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                <span className="text-[#00d4ff] shrink-0 mt-0.5">▹</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function IndustryCurriculum() {
  const [openId, setOpenId] = useState<string | null>(PHASES[0]?.id ?? null);

  const left = PHASES.slice(0, 3);
  const right = PHASES.slice(3, 6);

  return (
    <section className="relative mb-14 sm:mb-20">
      <div className="text-center mb-8 sm:mb-10">
        <p className="text-[10px] sm:text-xs font-mono text-[#64748b] tracking-[0.25em] uppercase mb-2">Industry-ready track</p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#00d4ff] to-[#34d399] mb-3">
          High-level curriculum
        </h2>
        <p className="text-sm text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
          One integrated six-month track. Each block below lists what you&apos;ll be able to do and recognize on the job — still high level, but concrete enough to compare with industry job descriptions.
          Open a section for the full topic list; week-by-week pacing stays in your batch syllabus.
        </p>
      </div>

      {/* Stats strip — reference-style, honest numbers from your academy positioning */}
      <div className="max-w-4xl mx-auto mb-10 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent px-4 py-5 sm:py-6">
        <div className="grid grid-cols-3 divide-x divide-white/[0.08]">
          <div className="px-2 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/25 mb-2 mx-auto">
              <svg className="w-5 h-5 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">6 mo</p>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#64748b] mt-1">Structured program</p>
          </div>
          <div className="px-2 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/25 mb-2 mx-auto">
              <svg className="w-5 h-5 text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">30</p>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#64748b] mt-1">Seats / batch</p>
          </div>
          <div className="px-2 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#34d399]/10 border border-[#34d399]/25 mb-2 mx-auto">
              <svg className="w-5 h-5 text-[#34d399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <p className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">Project-first</p>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#64748b] mt-1">Ship, not only watch</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 lg:gap-5 max-w-6xl mx-auto">
        <div className="space-y-4">
          {left.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              open={openId === phase.id}
              onToggle={() => setOpenId((prev) => (prev === phase.id ? null : phase.id))}
            />
          ))}
        </div>
        <div className="space-y-4">
          {right.map((phase) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              open={openId === phase.id}
              onToggle={() => setOpenId((prev) => (prev === phase.id ? null : phase.id))}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] sm:text-[11px] font-mono text-[#64748b] mt-8 max-w-2xl mx-auto leading-relaxed">
        Third-party names and logos belong to their respective owners; they are shown only to identify tools and topics we cover, not to suggest endorsement or partnership. Curriculum scope, depth, and order are defined in your official batch syllabus and may be updated.
      </p>
    </section>
  );
}
