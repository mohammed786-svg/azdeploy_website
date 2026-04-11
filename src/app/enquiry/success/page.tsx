'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import RegistrationMarquee from "@/components/RegistrationMarquee";

const steps = [
  {
    title: "Knowledge check",
    mono: "ASSESSMENT",
    desc: "We conduct structured exams to understand your fundamentals — logic, problem-solving, and readiness for an intensive full-stack track. There’s no pass/fail label; it helps us guide you honestly.",
    accent: "from-[#00d4ff]/20 to-transparent",
    border: "border-[#00d4ff]/30",
  },
  {
    title: "Personal follow-up",
    mono: "WHATSAPP",
    desc: "Our team may reach out on the number you shared to confirm details, answer questions, and share exam slot options.",
    accent: "from-[#25D366]/15 to-transparent",
    border: "border-[#25D366]/30",
  },
  {
    title: "Right batch, right pace",
    mono: "PLACEMENT",
    desc: "Results help us suggest morning / afternoon / evening batches and mentorship so you’re not lost in a one-size-fits-all crowd.",
    accent: "from-[#ffd700]/15 to-transparent",
    border: "border-[#ffd700]/35",
  },
];

export default function EnquirySuccessPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid flex flex-col">
      <HudHeader />

      <main className="flex-1 pt-20 sm:pt-24 pb-32 sm:pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10 sm:mb-14"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#22c55e]/30 blur-2xl scale-150" aria-hidden />
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-2 border-[#22c55e]/60 bg-[#22c55e]/10 shadow-[0_0_40px_rgba(34,197,94,0.25)]">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-[10px] sm:text-xs font-mono text-[#22c55e] tracking-[0.35em] uppercase mb-3">[ ENQUIRY RECEIVED ]</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e8fff4] to-[#4ade80] mb-4 leading-tight">
              You’re on the list
            </h1>
            <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
              Thank you for trusting AZ Deploy Academy. We’ve saved your profile — including your academic background — so we can
              place you accurately in our pipeline.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="rounded-2xl border border-[#00d4ff]/25 bg-gradient-to-b from-[#071018]/95 to-black/70 p-5 sm:p-8 mb-8 shadow-[0_0_60px_rgba(0,212,255,0.08)]"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ffd700]/15 text-[#ffd700] text-lg font-mono font-bold">
                !
              </span>
              <div className="text-left">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-1">Why we assess your knowledge</h2>
                <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                  Our program is fast and deep. Short exams help us see where you stand — so we don’t put you in a batch that
                  moves too slow or too fast. It’s about <span className="text-white/90">fit</span>, not filtering people out.
                </p>
              </div>
            </div>
            <p className="text-[11px] sm:text-xs font-mono text-[#64748b] border-t border-[#00d4ff]/15 pt-4">
              /// You’ll get details on format, duration, and scheduling over WhatsApp or call — keep an eye on your phone.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:gap-5 sm:grid-cols-3 mb-10">
            {steps.map((s, i) => (
              <motion.article
                key={s.mono}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className={`relative overflow-hidden rounded-xl border ${s.border} bg-gradient-to-b ${s.accent} to-black/40 p-4 sm:p-5 text-left`}
              >
                <p className="text-[9px] font-mono text-[#64748b] tracking-widest mb-2">{s.mono}</p>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{s.title}</h3>
                <p className="text-[11px] sm:text-xs text-[#94a3b8] leading-relaxed">{s.desc}</p>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/home"
              className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono uppercase tracking-wider hover:bg-[#00d4ff]/25 transition-colors"
            >
              Back to home
            </Link>
            <Link
              href="/courses"
              className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/50 text-[#ffd700] text-sm font-mono uppercase tracking-wider hover:bg-[#ffd700]/15 transition-colors"
            >
              Explore course
            </Link>
            <a
              href="https://wa.me/918296565587"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/50 text-[#4ade80] text-sm font-mono uppercase tracking-wider hover:bg-[#25D366]/25 transition-colors"
            >
              WhatsApp us
            </a>
          </motion.div>

          <p className="text-center text-[10px] font-mono text-[#475569] mt-10">
            Wrong page?{" "}
            <Link href="/enquiry" className="text-[#00d4ff] hover:underline">
              Submit another enquiry
            </Link>
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <RegistrationMarquee />
      </div>
      <FloatingActions />
    </div>
  );
}
