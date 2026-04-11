'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { push, ref, serverTimestamp } from "firebase/database";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import RegistrationMarquee from "@/components/RegistrationMarquee";
import { getFirebaseDatabase, initFirebaseAnalytics, isFirebaseConfigured } from "@/lib/firebase";
import { ENQUIRY_DEGREE_OPTIONS } from "@/lib/enquiry-degree";
import { validateIndiaMobileForEnquiry } from "@/lib/phone-e164";

type EnquiryPanelId = "whatsapp" | "form" | "courses" | "home";

const WHATSAPP_PHONE = "918296565587";
const WHATSAPP_MESSAGE = `Hi AZ Deploy Academy,

I'm interested in becoming a job-ready software engineer through your Full-Stack + AI + DevOps program (6 months, Belagavi).

Please share the next steps for enrollment, batch timings, and any prerequisites.

Thank you.`;

const waHref = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const BATCH_OPTIONS = [
  { value: "", label: "No preference yet" },
  { value: "morning", label: "Morning (9:00 AM – 11:00 AM)" },
  { value: "afternoon", label: "Afternoon (3:00 PM – 5:00 PM)" },
  { value: "evening", label: "Evening (6:00 PM – 8:00 PM)" },
];

function buildPassoutYearOptions() {
  const y = new Date().getFullYear();
  const opts = [{ value: "", label: "Pass-out / expected year" }];
  opts.push({ value: "still_studying", label: "Still studying — not graduated yet" });
  for (let i = 0; i <= 12; i++) {
    const year = y - i;
    opts.push({ value: String(year), label: `Graduated ${year}` });
  }
  opts.push({ value: "before_range", label: "Graduated before " + (y - 12) });
  return opts;
}

const PASSOUT_YEAR_OPTIONS = buildPassoutYearOptions();

const inputClass =
  "w-full rounded-lg border border-[#00d4ff]/25 bg-black/50 px-3 py-2.5 text-sm text-white placeholder:text-[#64748b] focus:border-[#00d4ff]/60 focus:outline-none focus:ring-1 focus:ring-[#00d4ff]/40";

const OPTION_CARDS: {
  id: EnquiryPanelId;
  step: string;
  title: string;
  subtitle: string;
  accent: string;
  border: string;
  glow: string;
}[] = [
  {
    id: "form",
    step: "01",
    title: "Enquiry form",
    subtitle: "Save your details for callbacks & exams",
    accent: "text-[#00d4ff]",
    border: "border-[#00d4ff]/35 hover:border-[#00d4ff]/65",
    glow: "hover:shadow-[0_0_50px_rgba(0,212,255,0.15)]",
  },
  {
    id: "whatsapp",
    step: "02",
    title: "WhatsApp",
    subtitle: "Instant chat with a prefilled message",
    accent: "text-[#25D366]",
    border: "border-[#25D366]/35 hover:border-[#25D366]/70",
    glow: "hover:shadow-[0_0_50px_rgba(37,211,102,0.18)]",
  },
  {
    id: "courses",
    step: "03",
    title: "About the course",
    subtitle: "Curriculum, batches, roadmap",
    accent: "text-[#ffd700]",
    border: "border-[#ffd700]/35 hover:border-[#ffd700]/65",
    glow: "hover:shadow-[0_0_45px_rgba(255,215,0,0.12)]",
  },
  {
    id: "home",
    step: "04",
    title: "Home",
    subtitle: "Hero, radar & campus HUD",
    accent: "text-[#00f5d4]",
    border: "border-[#00d4ff]/25 hover:border-[#00d4ff]/55",
    glow: "hover:shadow-[0_0_40px_rgba(0,245,212,0.1)]",
  },
];

function OptionIcon({ id }: { id: EnquiryPanelId }) {
  if (id === "whatsapp")
    return (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  if (id === "form")
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  if (id === "courses")
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  return (
    <Image src="/logo_white.png" alt="" width={36} height={36} className="object-contain w-9 h-9 opacity-95" />
  );
}

export default function EnquiryClient() {
  const router = useRouter();
  const [active, setActive] = useState<EnquiryPanelId | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [phone, setPhone] = useState("");
  const [degreeValue, setDegreeValue] = useState("");
  const phoneValidation = validateIndiaMobileForEnquiry(phone);

  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = e.currentTarget;
    const fd = new FormData(form);

    const fullName = String(fd.get("fullName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phoneTrim = phone.trim();
    const degree = String(fd.get("degree") ?? "").trim();
    const college = String(fd.get("college") ?? "").trim();
    const passoutYear = String(fd.get("passoutYear") ?? "").trim();

    if (!fullName || !email || !phoneTrim) {
      setErrorMsg("Full name, email, and phone are required.");
      setStatus("error");
      return;
    }
    const phoneCheck = validateIndiaMobileForEnquiry(phoneTrim);
    if (!phoneCheck.ok) {
      setErrorMsg(phoneCheck.error ?? "Enter a valid Indian mobile number (+91).");
      setStatus("error");
      return;
    }
    if (!degree) {
      setErrorMsg("Please select your degree or current program.");
      setStatus("error");
      return;
    }
    const degreeOther = String(fd.get("degreeOther") ?? "").trim();
    if (degree === "other_degree") {
      if (degreeOther.length < 2) {
        setErrorMsg("Please specify your degree or program (at least 2 characters).");
        setStatus("error");
        return;
      }
      if (degreeOther.length > 200) {
        setErrorMsg("Degree / program text is too long (max 200 characters).");
        setStatus("error");
        return;
      }
    }
    if (!college) {
      setErrorMsg("Please enter your college or university name.");
      setStatus("error");
      return;
    }
    if (!passoutYear) {
      setErrorMsg("Please select pass-out year or “still studying”.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    if (!isFirebaseConfigured()) {
      setErrorMsg("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* keys to .env.local.");
      setStatus("error");
      return;
    }

    const payload = {
      fullName,
      email,
      phone: phoneCheck.e164 ?? phoneTrim,
      degree,
      degreeOther: degree === "other_degree" ? degreeOther : null,
      college,
      passoutYear,
      city: String(fd.get("city") ?? "").trim(),
      preferredBatch: String(fd.get("preferredBatch") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      source: "enquiry_page",
      createdAt: serverTimestamp(),
    };

    try {
      const db = getFirebaseDatabase();
      await push(ref(db, "enquiries"), payload);
      form.reset();
      setPhone("");
      setDegreeValue("");
      router.push("/enquiry/success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(
        /permission/i.test(msg)
          ? "Could not save (database rules). Check Firebase Console → Realtime Database → Rules for /enquiries."
          : `${msg} — try WhatsApp if this persists.`
      );
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen hud-bg hud-grid flex flex-col">
      <HudHeader />

      <main className="flex-1 pt-20 sm:pt-24 pb-28 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8 sm:mb-10">
            <p className="text-[10px] sm:text-xs font-mono text-[#00d4ff] tracking-[0.35em] uppercase mb-3">[ ENQUIRY ]</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0f4ff] to-[#00d4ff] mb-4 leading-tight px-1">
              Start your journey as a real software engineer
            </h1>
            <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
              {active === null
                ? "Pick a path below — then we’ll expand your choice with full details. You can switch anytime from the side rail."
                : "You’re viewing one path — use the rail to jump to another without losing context."}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {active === null ? (
              <motion.div
                key="picker"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="grid sm:grid-cols-2 gap-4 sm:gap-5"
              >
                {OPTION_CARDS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setActive(opt.id)}
                    className={`group relative text-left rounded-2xl border-2 ${opt.border} bg-gradient-to-br from-[#0c1218]/95 to-black/70 p-6 sm:p-7 transition-all duration-300 ${opt.glow} focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/40 focus:ring-offset-2 focus:ring-offset-[#0a0a0c] overflow-hidden`}
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#00d4ff]/[0.06] blur-2xl" />
                    <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
                      <span
                        className={`flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 ${opt.accent}`}
                      >
                        <OptionIcon id={opt.id} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className={`text-[10px] font-mono font-bold tracking-[0.25em] ${opt.accent}`}>{opt.step}</span>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-2 group-hover:text-white transition-colors">
                          {opt.title}
                        </h2>
                        <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">{opt.subtitle}</p>
                        <span className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider ${opt.accent}`}>
                          Open
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch"
              >
                {/* Main expanded panel */}
                <section className="flex-1 min-w-0 order-1 lg:order-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-[#00d4ff]/25 bg-gradient-to-b from-[#071018]/98 to-black/80 shadow-[0_0_60px_rgba(0,212,255,0.08)] overflow-hidden"
                    >
                      <div className="px-1 border-b border-[#00d4ff]/15 bg-black/30">
                        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/25">
                              <OptionIcon id={active} />
                            </span>
                            <div>
                              <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest">Active</p>
                              <p className="text-lg font-bold text-white">
                                {OPTION_CARDS.find((o) => o.id === active)?.title}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setActive(null);
                              setStatus("idle");
                              setErrorMsg("");
                            }}
                            className="text-[11px] sm:text-xs font-mono text-[#94a3b8] hover:text-[#00d4ff] border border-[#00d4ff]/20 hover:border-[#00d4ff]/50 rounded-lg px-3 py-2 transition-colors"
                          >
                            ← All options
                          </button>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6 md:p-8">
                        {active === "whatsapp" && (
                          <div className="space-y-6">
                            <p className="text-sm text-[#94a3b8] leading-relaxed">
                              We’ll open WhatsApp to <span className="text-white font-mono">+91 82965 65587</span> with a
                              professional template. You can edit before sending.
                            </p>
                            <div className="rounded-xl border border-[#25D366]/25 bg-black/40 p-4 font-mono text-xs sm:text-sm text-[#cbd5e1] whitespace-pre-wrap leading-relaxed">
                              {WHATSAPP_MESSAGE}
                            </div>
                            <a
                              href={waHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] text-white font-mono text-sm font-semibold uppercase tracking-wider hover:bg-[#20bd5a] shadow-[0_0_30px_rgba(37,211,102,0.35)] transition-colors"
                            >
                              Open WhatsApp
                            </a>
                          </div>
                        )}

                        {active === "form" && (
                          <div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="rounded-xl border border-[#a78bfa]/20 bg-[#a78bfa]/5 px-3 py-3 sm:px-4 sm:py-4">
                                <p className="text-[10px] font-mono text-[#a78bfa] uppercase tracking-widest mb-3">Education</p>
                                <div className="space-y-4">
                                  <label className="block">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                      Degree / program *
                                    </span>
                                    <select
                                      name="degree"
                                      required
                                      value={degreeValue}
                                      onChange={(e) => setDegreeValue(e.target.value)}
                                      className={inputClass}
                                    >
                                      {ENQUIRY_DEGREE_OPTIONS.map((o) => (
                                        <option key={o.value || "empty"} value={o.value}>
                                          {o.label}
                                        </option>
                                      ))}
                                    </select>
                                  </label>
                                  {degreeValue === "other_degree" && (
                                    <label className="block">
                                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                        Your degree / program *
                                      </span>
                                      <input
                                        name="degreeOther"
                                        required
                                        autoComplete="off"
                                        maxLength={200}
                                        minLength={2}
                                        className={inputClass}
                                        placeholder="e.g. B.Com, BBA, B.Sc (Physics), open university…"
                                      />
                                    </label>
                                  )}
                                  <label className="block">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                      College / university *
                                    </span>
                                    <input
                                      name="college"
                                      required
                                      autoComplete="organization"
                                      className={inputClass}
                                      placeholder="e.g. KLE Tech, VTU-affiliated college…"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                      Pass-out year *
                                    </span>
                                    <select name="passoutYear" required className={inputClass}>
                                      {PASSOUT_YEAR_OPTIONS.map((o) => (
                                        <option key={o.value || "py-empty"} value={o.value}>
                                          {o.label}
                                        </option>
                                      ))}
                                    </select>
                                  </label>
                                </div>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <label className="block">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                    Full name *
                                  </span>
                                  <input name="fullName" required autoComplete="name" className={inputClass} placeholder="Your name" />
                                </label>
                                <label className="block">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                    Email *
                                  </span>
                                  <input
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className={inputClass}
                                    placeholder="you@example.com"
                                  />
                                </label>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2 space-y-2">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] block">
                                    Mobile (WhatsApp) * — India +91 only
                                  </span>
                                  <div className="flex flex-col sm:flex-row gap-2 sm:items-stretch">
                                    <div className="shrink-0 flex flex-col justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-center sm:text-left">
                                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#64748b]">
                                        Country
                                      </span>
                                      <span className="text-sm font-mono font-semibold text-white tabular-nums">IN +91</span>
                                    </div>
                                    <input
                                      value={phone}
                                      onChange={(e) => setPhone(e.target.value)}
                                      disabled={status === "loading"}
                                      autoComplete="tel"
                                      inputMode="numeric"
                                      className={`${inputClass} flex-1 min-w-0`}
                                      placeholder="98765 43210"
                                    />
                                  </div>
                                  {phone.trim() && !phoneValidation.ok && (
                                    <p className="text-xs text-amber-400/95 font-mono" role="status">
                                      {phoneValidation.error}
                                    </p>
                                  )}
                                  {phoneValidation.ok && phoneValidation.e164 && (
                                    <p className="text-[10px] font-mono text-[#64748b]">
                                      Saved as <span className="text-[#cbd5e1]">{phoneValidation.e164}</span>
                                    </p>
                                  )}
                                </div>
                                <label className="block sm:col-span-2">
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                    City
                                  </span>
                                  <input name="city" autoComplete="address-level2" className={inputClass} placeholder="Belagavi" />
                                </label>
                              </div>
                              <label className="block">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                  Preferred batch
                                </span>
                                <select name="preferredBatch" className={inputClass}>
                                  {BATCH_OPTIONS.map((o) => (
                                    <option key={o.value || "none"} value={o.value}>
                                      {o.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="block">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] mb-1.5 block">
                                  Message
                                </span>
                                <textarea
                                  name="message"
                                  rows={3}
                                  className={`${inputClass} min-h-[88px] resize-y`}
                                  placeholder="Background, goals, or questions…"
                                />
                              </label>
                              {status === "error" && errorMsg && (
                                <p className="text-sm text-amber-400/90 font-mono" role="alert">
                                  {errorMsg}
                                </p>
                              )}
                              <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00d4ff]/20 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono uppercase tracking-wider hover:bg-[#00d4ff]/30 disabled:opacity-50 transition-colors"
                              >
                                {status === "loading" ? "Sending…" : "Submit enquiry"}
                              </button>
                            </form>
                          </div>
                        )}

                        {active === "courses" && (
                          <div className="space-y-6">
                            <p className="text-sm text-[#94a3b8] leading-relaxed">
                              Full-Stack + AI + DevOps — one ongoing 6-month program in Belagavi. Explore batch timings,
                              pillars, roadmap, and why we train for production.
                            </p>
                            <ul className="space-y-2 text-sm text-[#cbd5e1]">
                              <li className="flex gap-2">
                                <span className="text-[#ffd700]">▸</span>
                                Morning / afternoon / evening batches · 30 students per batch
                              </li>
                              <li className="flex gap-2">
                                <span className="text-[#ffd700]">▸</span>
                                React, Django, PostgreSQL, Linux, Nginx, Docker, CI/CD, AWS VPS
                              </li>
                              <li className="flex gap-2">
                                <span className="text-[#ffd700]">▸</span>
                                Exams & mentorship to match your level
                              </li>
                            </ul>
                            <Link
                              href="/courses"
                              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#ffd700]/15 border border-[#ffd700]/55 text-[#ffd700] font-mono text-sm uppercase tracking-wider hover:bg-[#ffd700]/25 transition-colors"
                            >
                              Open full courses page →
                            </Link>
                          </div>
                        )}

                        {active === "home" && (
                          <div className="space-y-6">
                            <p className="text-sm text-[#94a3b8] leading-relaxed">
                              The main experience: gold hero logo, journey radar, live student HUD, offers, and marquee — the
                              full AZ Deploy Academy vibe.
                            </p>
                            <Link
                              href="/home"
                              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#00d4ff]/15 border border-[#00d4ff]/50 text-[#00d4ff] font-mono text-sm uppercase tracking-wider hover:bg-[#00d4ff]/25 transition-colors"
                            >
                              Go to home →
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </section>

                {/* Side rail — other options */}
                <aside className="w-full lg:w-[min(100%,260px)] xl:w-[280px] shrink-0 order-2 lg:order-1">
                  <div className="lg:sticky lg:top-24 rounded-2xl border border-[#00d4ff]/20 bg-black/50 backdrop-blur-sm p-3 sm:p-4">
                    <p className="text-[10px] font-mono text-[#64748b] uppercase tracking-[0.2em] mb-3 px-1">Switch path</p>
                    <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0 [scrollbar-width:thin]">
                      {OPTION_CARDS.map((opt) => {
                        const isOn = active === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setActive(opt.id);
                              setStatus("idle");
                              setErrorMsg("");
                            }}
                            className={`flex shrink-0 items-center gap-3 w-full min-w-[200px] lg:min-w-0 text-left rounded-xl border px-3 py-3 transition-all duration-200 ${
                              isOn
                                ? "border-[#00d4ff]/70 bg-[#00d4ff]/10 shadow-[0_0_20px_rgba(0,212,255,0.12)] ring-1 ring-[#00d4ff]/30"
                                : "border-white/10 bg-black/30 hover:border-[#00d4ff]/35 hover:bg-[#00d4ff]/5 opacity-90 hover:opacity-100"
                            }`}
                          >
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 ${opt.accent}`}>
                              <span className="scale-75">
                                <OptionIcon id={opt.id} />
                              </span>
                            </span>
                            <span className="min-w-0">
                              <span className="block text-xs font-bold text-white truncate">{opt.title}</span>
                              <span className="block text-[10px] text-[#64748b] truncate">{opt.subtitle}</span>
                            </span>
                            {isOn && (
                              <span className="ml-auto text-[#00d4ff] text-[10px] font-mono shrink-0" aria-hidden>
                                ●
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <RegistrationMarquee />
      </div>
      <FloatingActions />
    </div>
  );
}
