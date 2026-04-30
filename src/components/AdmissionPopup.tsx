"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LeadCaptureMiniForm from "@/components/LeadCaptureMiniForm";

const DISMISS_KEY = "az_admission_popup_dismissed_at";
const HIDE_FOR_MS = 24 * 60 * 60 * 1000;

export default function AdmissionPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAdmissionPrompt, setShowAdmissionPrompt] = useState(false);
  const [waitingToShowPrompt, setWaitingToShowPrompt] = useState(false);
  const [delayStarted, setDelayStarted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = window.localStorage.getItem(DISMISS_KEY);
    const dismissedAt = raw ? Number(raw) : 0;
    const recentlyDismissed = Number.isFinite(dismissedAt) && dismissedAt > 0 && Date.now() - dismissedAt < HIDE_FOR_MS;
    if (recentlyDismissed) return;
    const t = window.setTimeout(() => setOpen(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  function showMainPromptAfterDelay() {
    if (delayStarted) return;
    setDelayStarted(true);
    setWaitingToShowPrompt(true);
    window.setTimeout(() => {
      setShowAdmissionPrompt(true);
      setWaitingToShowPrompt(false);
    }, 10000);
  }

  function closePopup() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  }

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-[#00d4ff]/35 bg-gradient-to-br from-[#091025]/95 via-[#0a0a12]/95 to-[#1d1030]/90 shadow-[0_0_80px_rgba(0,212,255,0.18)] p-4 sm:p-6 lg:p-7 relative animate-fade-in-up max-h-[88vh] overflow-y-auto">
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-3 top-3 text-white/70 hover:text-white border border-white/15 rounded-lg w-8 h-8"
          aria-label="Close admission popup"
        >
          ×
        </button>

        {!showAdmissionPrompt ? (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-bold text-white">Before you continue</h2>
            <p className="text-sm text-white/80">
              Please share your details so our admissions team can help you with batch timing, online/offline mode, and placement roadmap.
            </p>
            <LeadCaptureMiniForm
              source="home_admission_prompt"
              compact
              onSubmitted={() => {
                showMainPromptAfterDelay();
              }}
            />
            {waitingToShowPrompt ? (
              <p className="text-xs text-[#94a3b8]">
                Thank you. Showing admission details in 10 seconds...
              </p>
            ) : null}
            <button
              type="button"
              onClick={showMainPromptAfterDelay}
              className="text-xs text-[#94a3b8] hover:text-white underline"
              disabled={waitingToShowPrompt}
            >
              {waitingToShowPrompt ? "Please wait..." : "Skip for now"}
            </button>
          </div>
        ) : null}

        {showAdmissionPrompt ? (
          <>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border border-amber-400/50 text-amber-100 bg-amber-400/15">
            Admission Closes Soon
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border border-cyan-400/40 text-cyan-200 bg-cyan-400/10">
            Job Assistance Support
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border border-emerald-400/40 text-emerald-200 bg-emerald-400/10">
            Live Projects
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border border-fuchsia-400/40 text-fuchsia-200 bg-fuchsia-400/10">
            Online + Offline
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white">🚀 Admissions Open – AZDeploy Academy</h2>
        <p className="mt-2 text-lg sm:text-xl font-semibold text-[#00f5d4]">Up to 12 LPA Job Assistance in 6 Months</p>
        <p className="mt-2 text-sm text-white/80 leading-relaxed">
          Master AI, Frontend, Backend, Data Engineering, Ubuntu, Nginx Reverse Proxy, Deployment, and real production projects under industry experts.
        </p>

        <div className="mt-3 rounded-xl border border-amber-400/45 bg-amber-400/10 px-3 py-2">
          <p className="text-sm font-semibold text-amber-100">Limited Seats Available – Admissions Closing Soon</p>
          <p className="text-xs text-amber-200/90 mt-1">Priority seats are filling fast. Confirm your admission process today.</p>
        </div>

        <div className="mt-3 rounded-xl border border-[#00d4ff]/40 bg-[#00d4ff]/10 px-3 py-2">
          <p className="text-sm font-semibold text-[#bff3ff]">Available in both Online and Offline Classroom modes.</p>
          <p className="text-xs text-white/75 mt-1">Choose the learning format that fits your schedule and location.</p>
        </div>

        <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-xs text-white/75">
          <li>• Real-world live project training</li>
          <li>• Production deployment experience</li>
          <li>• Interview preparation & resume building</li>
          <li>• Dedicated job assistance support</li>
          <li>• Limited batch size for personal mentoring</li>
          <li>• Learn from 8+ years industry experienced professionals</li>
        </ul>

        <p className="mt-4 text-sm text-white/90 font-medium">
          Reserve your seat now and take the first step toward career-focused training with job assistance.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              closePopup();
              router.push("/enquiry");
            }}
            className="flex-1 rounded-xl border border-[#00d4ff]/50 bg-[#00d4ff]/20 px-4 py-3 text-sm font-semibold text-[#bff3ff] hover:bg-[#00d4ff]/30 transition-colors"
          >
            Reserve Seat Now
          </button>
          <button
            type="button"
            onClick={() => {
              closePopup();
              router.push("/courses");
            }}
            className="flex-1 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
          >
            View Courses
          </button>
        </div>

        <div className="mt-4 text-xs font-mono text-[#94a3b8] flex flex-wrap gap-x-4 gap-y-1">
          <a href="tel:+918296565587" className="hover:text-[#7dd3fc]">+91 8296565587</a>
          <a href="tel:+918971244513" className="hover:text-[#7dd3fc]">+91 8971244513</a>
        </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
