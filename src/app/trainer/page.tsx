import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import IndustryCurriculum from "@/components/IndustryCurriculum";

export const metadata: Metadata = {
  title: "Trainer",
  description:
    "AZ Deploy Academy trainer — 8+ years industry, 500+ products shipped. Same industry-ready track as our courses: Python, Django, React, PostgreSQL, DevOps, AWS, AI & Gen AI. Real deployment experience, not slide-only teaching.",
};

export default function TrainerPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid relative">
      <HudHeader />
      <main className="relative z-10 pt-16 pb-24 sm:pb-20">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-glow-teal text-center mb-8 hud-label">
            [MEET_THE_TRAINER]
          </h1>

          <div className="hud-panel p-8 md:p-12 space-y-8">
            <div className="flex flex-wrap gap-2">
              {["8+_YEARS", "500+_PRODUCTS", "ALL_STACKS"].map((badge) => (
                <span key={badge} className="px-3 py-1 border border-[#00d4ff]/50 text-[#00d4ff] text-xs font-mono">
                  {badge}
                </span>
              ))}
            </div>

            <p className="text-white/80 leading-relaxed">
              Our lead trainer has <strong className="text-[#00d4ff]">8+ years</strong> of experience in the IT industry
              and has worked on <strong className="text-[#00d4ff]">500+ products</strong> in real-time. Expertise spans
              Python Full Stack, Android Development, cyber security, Nginx, Ubuntu, Linux, Kali Linux, and more.
            </p>
            <p className="text-white/80 leading-relaxed">
              Unlike many &quot;instructors&quot; who sell courses without real-world experience, our trainer has
              actually deployed, scaled, and maintained production systems. This means you learn what works in
              the real industry—not just theory.
            </p>
            <p className="text-white/80 leading-relaxed">
              The focus is on making you understand concepts deeply, use your brain first, and then leverage AI
              to boost productivity. Students leave not just with certificates, but with the ability to crack
              interviews and build real careers.
            </p>

            {/* Expertise & tech stack */}
            <div className="border border-[#00d4ff]/20 rounded p-5 sm:p-6 bg-black/30 space-y-6">
              <h2 className="text-sm font-mono font-semibold text-[#00d4ff]">[EXPERTISE_&_TECH_STACK]</h2>
              <p className="text-xs text-[#94a3b8] leading-relaxed -mt-2">
                Production-style stacks — what ships on servers and in app stores, not hello-world snippets only.
              </p>

              <div className="space-y-5">
                <div>
                  <h3 className="text-[10px] font-mono text-[#64748b] uppercase tracking-[0.2em] mb-2.5">Backend & APIs</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
                    <li><span className="text-[#00d4ff]/80">·</span> Python — structure, OOP, async where it pays off, packaging & tooling</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Django — MVT, admin, auth, ORM, migrations, signals (when appropriate)</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Django REST-style APIs — serializers, permissions, pagination, throttling</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Flask & lightweight services — blueprints, JSON APIs, smaller surface area</li>
                    <li><span className="text-[#00d4ff]/80">·</span> REST design — HTTP semantics, errors, versioning, OpenAPI-style documentation</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Background tasks & integrations — emails, uploads, webhooks, idempotent handlers</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono text-[#64748b] uppercase tracking-[0.2em] mb-2.5">Frontend & mobile</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
                    <li><span className="text-[#00d4ff]/80">·</span> React — hooks, composition, client routing, forms & validation</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Redux (or equivalent) — predictable state, async data, DevTools mindset</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Vite / modern build — env splits, fast dev feedback, production bundles</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Android — Kotlin & Java, Jetpack Compose, Material patterns, Gradle basics</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Mobile integration — REST clients, auth storage, offline & error UX</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono text-[#64748b] uppercase tracking-[0.2em] mb-2.5">Data & persistence</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
                    <li><span className="text-[#00d4ff]/80">·</span> PostgreSQL — modeling, constraints, indexes, EXPLAIN, query tuning</li>
                    <li><span className="text-[#00d4ff]/80">·</span> MySQL / MariaDB where teams still standardize on them</li>
                    <li><span className="text-[#00d4ff]/80">·</span> ORMs, migrations, avoiding N+1, sane schema evolution in teams</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Pandas-style analysis & small ETL — CSV/JSON in/out, transforms, merges</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono text-[#64748b] uppercase tracking-[0.2em] mb-2.5">DevOps, cloud & delivery</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
                    <li><span className="text-[#00d4ff]/80">·</span> Ubuntu & Linux servers — SSH, users, permissions, systemd, logs, disk & CPU</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Nginx — reverse proxy, static files, gzip, TLS termination concepts</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Gunicorn / app servers — workers, timeouts, binding behind Nginx</li>
                    <li><span className="text-[#00d4ff]/80">·</span> VPS & cloud deploys — domains, HTTPS, updates, backups, rollback thinking</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Docker & Compose — images, layers, local parity with production</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Kubernetes orientation — pods, services, ingress, ConfigMaps at practitioner level</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Terraform / IaC — modules, state, plan/apply discipline</li>
                    <li><span className="text-[#00d4ff]/80">·</span> AWS — EC2, S3, RDS/VPC intuition; cost & security guardrails</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Git, branching, PR reviews; CI/CD (GitHub Actions, Jenkins-style pipelines)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono text-[#64748b] uppercase tracking-[0.2em] mb-2.5">Security & platform</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
                    <li><span className="text-[#00d4ff]/80">·</span> Kali Linux & offensive awareness — to defend better, not to teach misuse</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Hardening — firewalls, SSH keys, least privilege, patching cadence</li>
                    <li><span className="text-[#00d4ff]/80">·</span> App security — OWASP-style thinking, secrets handling, dependency hygiene</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono text-[#64748b] uppercase tracking-[0.2em] mb-2.5">AI, data platforms & automation</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-white/80">
                    <li><span className="text-[#00d4ff]/80">·</span> LLM APIs & prompt patterns — cost, latency, guardrails in real apps</li>
                    <li><span className="text-[#00d4ff]/80">·</span> RAG & embeddings — chunking, vector search concepts, wiring into backends</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Spark / big-data intuition — when batch & scale tooling beats a single DB</li>
                    <li><span className="text-[#00d4ff]/80">·</span> Scripting & automation — Bash/Python for ops glue and repeatable tasks</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Teaching approach */}
            <div>
              <h2 className="text-sm font-mono font-semibold text-[#00d4ff] mb-3">[TEACHING_APPROACH]</h2>
              <ul className="space-y-2 text-white/80 text-sm leading-relaxed">
                <li><strong className="text-white/90">Hands-on first:</strong> Every concept is tied to real code and real projects, not slides.</li>
                <li><strong className="text-white/90">Think first, AI second:</strong> You learn to reason and debug; then use AI to speed up, not replace, your skills.</li>
                <li><strong className="text-white/90">Production mindset:</strong> Deployment, debugging, and maintenance are part of the curriculum from day one.</li>
                <li><strong className="text-white/90">One-on-one:</strong> Doubt clearing, code reviews, and career guidance are included—not extra paid add-ons.</li>
              </ul>
            </div>

            {/* What you get */}
            <div>
              <h2 className="text-sm font-mono font-semibold text-[#00d4ff] mb-3">[WHAT_YOU_GET]</h2>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>Direct access to the trainer for doubts and code reviews</li>
                <li>Real project builds with feedback on your code and architecture</li>
                <li>Mock technical and HR interviews with detailed feedback</li>
                <li>Resume, LinkedIn, and portfolio guidance</li>
                <li>Placement prep: company patterns, negotiation, and interview readiness</li>
              </ul>
            </div>

            <div className="pt-6 border-t border-[#00d4ff]/20">
              <p className="text-white/70 mb-4 text-sm">Ready to learn from someone who has been there?</p>
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono hover:bg-[#00d4ff]/20 transition-colors"
              >
                CONTACT_WHATSAPP →
              </a>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
          <p className="text-center text-[10px] sm:text-xs font-mono text-[#94a3b8] tracking-[0.2em] uppercase mb-6">
            Same program · what you learn with this trainer
          </p>
          <IndustryCurriculum />
        </section>
      </main>
      <FloatingActions />
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4 z-30">
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: TRAINER_AVAILABLE</p>
      </footer>
    </div>
  );
}
