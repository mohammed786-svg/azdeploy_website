import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Trainer",
  description:
    "AZDeploy Academy trainer: 8+ years industry experience, 500+ products deployed. Real knowledge in Python, Android, cyber security, Linux, nginx. No fake teachers.",
};

export default function TrainerPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
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
            <div className="border border-[#00d4ff]/20 rounded p-5 bg-black/30">
              <h2 className="text-sm font-mono font-semibold text-[#00d4ff] mb-3">[EXPERTISE_&_TECH_STACK]</h2>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-white/80">
                <li><span className="text-[#00d4ff]/80">·</span> Python, Django, Flask, REST APIs</li>
                <li><span className="text-[#00d4ff]/80">·</span> Android (Kotlin, Java), Jetpack Compose</li>
                <li><span className="text-[#00d4ff]/80">·</span> PostgreSQL, MySQL, ORM, migrations</li>
                <li><span className="text-[#00d4ff]/80">·</span> Nginx, Gunicorn, VPS deployment</li>
                <li><span className="text-[#00d4ff]/80">·</span> Ubuntu, Linux, Kali Linux</li>
                <li><span className="text-[#00d4ff]/80">·</span> Cyber security, hardening, best practices</li>
                <li><span className="text-[#00d4ff]/80">·</span> Git, CI/CD, local & server setup</li>
              </ul>
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
      </main>
      <FloatingActions />
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4 z-30">
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: TRAINER_AVAILABLE</p>
      </footer>
    </div>
  );
}
