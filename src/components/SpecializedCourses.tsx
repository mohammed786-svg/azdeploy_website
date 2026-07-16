"use client";

import { useEffect, useState } from "react";
import LeadCaptureMiniForm from "@/components/LeadCaptureMiniForm";
import EnrollNowButton from "@/components/EnrollNowButton";
import CourseOverviewRoadmap from "@/components/CourseOverviewRoadmap";
import { ACADEMY_CONTACT_NUMBERS } from "@/lib/contact-info";

type CurriculumModule = {
  title: string;
  items: string[];
};

type CourseTrack = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  accent: string;
  border: string;
  bg: string;
  topics: string[];
  modules: CurriculumModule[];
  outcomes: string[];
};

const SPECIALIZED_TRACKS: CourseTrack[] = [
  {
    id: "ai",
    title: "AI",
    subtitle: "Artificial Intelligence",
    duration: "3 months",
    accent: "text-[#7dd3fc]",
    border: "border-[#00d4ff]/40",
    bg: "bg-[#00d4ff]/[0.06]",
    topics: ["AI fundamentals & use-case design", "ML basics for intelligent apps", "LLM integration & prompt patterns", "Capstone AI project"],
    modules: [
      {
        title: "Module 1 — AI Foundations",
        items: ["What AI is (and is not) in production", "Problem framing & success metrics", "Data readiness for AI features", "Ethics, bias, and responsible AI basics"],
      },
      {
        title: "Module 2 — Applied Machine Learning",
        items: ["Classification & regression for product features", "Training/validation split & evaluation", "Scikit-learn workflows", "When to use rules vs models"],
      },
      {
        title: "Module 3 — LLMs & Intelligent Apps",
        items: ["Prompt design patterns", "API-based model integration", "Tool calling & structured outputs", "Guardrails and fallback behavior"],
      },
      {
        title: "Module 4 — AI Project Delivery",
        items: ["End-to-end AI feature in a web app", "Logging, monitoring, and cost control", "Demo + documentation", "Interview-ready project story"],
      },
    ],
    outcomes: ["Build AI-powered features with clear evaluation", "Integrate LLM APIs safely in real apps", "Ship a portfolio AI capstone project"],
  },
  {
    id: "ml",
    title: "ML",
    subtitle: "Machine Learning",
    duration: "3 months",
    accent: "text-[#86efac]",
    border: "border-[#22c55e]/40",
    bg: "bg-[#22c55e]/[0.06]",
    topics: ["Supervised learning (regression & classification)", "Unsupervised learning & clustering", "Feature engineering & model tuning", "End-to-end model building projects"],
    modules: [
      {
        title: "Module 1 — Data & Python for ML",
        items: ["NumPy & Pandas for ML datasets", "Exploratory data analysis", "Data cleaning & missing values", "Train/test methodology"],
      },
      {
        title: "Module 2 — Supervised Learning",
        items: ["Linear & logistic regression", "Decision trees & random forests", "Model accuracy, precision, recall, F1", "Overfitting & regularization"],
      },
      {
        title: "Module 3 — Unsupervised Learning",
        items: ["Clustering (K-Means, hierarchical)", "Dimensionality reduction basics", "Anomaly detection use cases", "Choosing the right algorithm"],
      },
      {
        title: "Module 4 — Model Building Projects",
        items: ["Feature engineering in practice", "Hyperparameter tuning", "Model persistence & inference", "Real-world ML mini-project"],
      },
    ],
    outcomes: ["Train and evaluate ML models confidently", "Select algorithms based on business problems", "Deliver end-to-end ML project artifacts"],
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    subtitle: "Neural Networks & Advanced Models",
    duration: "3 months",
    accent: "text-[#c4b5fd]",
    border: "border-[#a78bfa]/40",
    bg: "bg-[#a78bfa]/[0.06]",
    topics: ["Neural network foundations", "CNN for computer vision", "RNN & sequence models", "Advanced deep learning projects"],
    modules: [
      {
        title: "Module 1 — Neural Network Core",
        items: ["Perceptrons to deep networks", "Activation functions & loss functions", "Backpropagation intuition", "Training loops with PyTorch/TensorFlow basics"],
      },
      {
        title: "Module 2 — CNN (Computer Vision)",
        items: ["Conv layers, pooling, feature maps", "Image classification pipelines", "Transfer learning with pre-trained models", "Vision project: object/scene classification"],
      },
      {
        title: "Module 3 — Sequence Models",
        items: ["RNN/LSTM fundamentals", "Text & time-series use cases", "Sequence-to-sequence basics", "Evaluation for sequential data"],
      },
      {
        title: "Module 4 — Advanced DL Project",
        items: ["Model optimization & GPU basics", "Experiment tracking", "Deploying a small DL model", "Capstone deep learning build"],
      },
    ],
    outcomes: ["Design CNN/RNN solutions for real inputs", "Use transfer learning effectively", "Complete an advanced DL portfolio project"],
  },
  {
    id: "ethical-hacking",
    title: "Ethical Hacking",
    subtitle: "Offensive Security Basics",
    duration: "3 months",
    accent: "text-[#fdba74]",
    border: "border-[#f97316]/40",
    bg: "bg-[#f97316]/[0.06]",
    topics: ["Network security fundamentals", "Penetration testing methodology", "Vulnerability assessment labs", "Security hardening projects"],
    modules: [
      {
        title: "Module 1 — Security Foundations",
        items: ["CIA triad & threat landscape", "Networking refresher for security", "Linux tools for reconnaissance", "Legal/ethical boundaries in pentesting"],
      },
      {
        title: "Module 2 — Network Security",
        items: ["Ports, services, and scanning", "Wireshark & traffic analysis", "Firewall & ACL basics", "Common misconfigurations"],
      },
      {
        title: "Module 3 — Penetration Testing",
        items: ["Recon → exploit → report workflow", "Web app vulnerability basics", "Password & auth weaknesses", "Lab-based exploitation exercises"],
      },
      {
        title: "Module 4 — Security Project",
        items: ["Vulnerability assessment report writing", "Remediation recommendations", "Hardening checklist implementation", "Final security audit mini-project"],
      },
    ],
    outcomes: ["Perform structured vulnerability assessments", "Understand offensive security methodology", "Document findings like a professional pentester"],
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    subtitle: "Defensive Security Operations",
    duration: "3 months",
    accent: "text-[#7dd3fc]",
    border: "border-[#38bdf8]/40",
    bg: "bg-[#38bdf8]/[0.06]",
    topics: ["Threat detection & incident response", "Malware analysis fundamentals", "Security monitoring & logging", "Security operations projects"],
    modules: [
      {
        title: "Module 1 — Security Operations Basics",
        items: ["SOC mindset & incident lifecycle", "Asset inventory & risk prioritization", "Identity & access fundamentals", "Security policies in organizations"],
      },
      {
        title: "Module 2 — Threat Detection",
        items: ["Log sources & SIEM concepts", "Alert triage workflows", "Indicators of compromise (IOCs)", "Phishing & social engineering defense"],
      },
      {
        title: "Module 3 — Malware & Response",
        items: ["Malware categories & behavior", "Static/dynamic analysis intro", "Containment & eradication steps", "Post-incident review"],
      },
      {
        title: "Module 4 — Security Project",
        items: ["Build a monitoring checklist", "Incident response tabletop exercise", "Security dashboard/report", "Operational security capstone"],
      },
    ],
    outcomes: ["Detect and respond to common threats", "Analyze suspicious activity systematically", "Deliver practical SecOps project work"],
  },
  {
    id: "ai-engineering",
    title: "AI Engineering",
    subtitle: "Production AI Systems",
    duration: "Structured track",
    accent: "text-[#5eead4]",
    border: "border-[#00f5d4]/40",
    bg: "bg-[#00f5d4]/[0.06]",
    topics: ["Production AI architecture", "API & local model deployment", "RAG pipelines & embeddings", "MLOps basics for AI services"],
    modules: [
      {
        title: "Module 1 — AI System Design",
        items: ["Architecture for AI microservices", "Latency, cost, and reliability trade-offs", "Caching & batching strategies", "Versioning AI features"],
      },
      {
        title: "Module 2 — Model Serving",
        items: ["REST/gRPC inference APIs", "Local vs cloud model hosting", "Batch inference pipelines", "Load testing AI endpoints"],
      },
      {
        title: "Module 3 — RAG & Embeddings",
        items: ["Document ingestion & chunking", "Vector search fundamentals", "Retrieval-augmented generation flow", "Grounding and hallucination control"],
      },
      {
        title: "Module 4 — MLOps for AI",
        items: ["Experiment tracking & reproducibility", "CI for model + app changes", "Monitoring drift & quality", "Production AI capstone"],
      },
    ],
    outcomes: ["Design deployable AI architectures", "Build RAG-powered applications", "Operate AI services with MLOps practices"],
  },
  {
    id: "data-engineering",
    title: "Data Engineering",
    subtitle: "Pipelines & Data Platforms",
    duration: "Structured track",
    accent: "text-[#a5b4fc]",
    border: "border-[#818cf8]/40",
    bg: "bg-[#818cf8]/[0.06]",
    topics: ["SQL & PostgreSQL at scale", "ETL/ELT pipeline design", "Batch vs streaming data flows", "Data warehouse fundamentals"],
    modules: [
      {
        title: "Module 1 — SQL & Data Modeling",
        items: ["Advanced SQL (joins, windows, CTEs)", "Normalization vs denormalization", "Indexing & query performance", "PostgreSQL in production"],
      },
      {
        title: "Module 2 — ETL / ELT Pipelines",
        items: ["Batch ingestion patterns", "Data validation & quality checks", "Orchestration basics", "Error handling & retries"],
      },
      {
        title: "Module 3 — Streaming & Integration",
        items: ["Batch vs stream processing mindset", "Event-driven data flows", "API + DB integration patterns", "Data contracts between teams"],
      },
      {
        title: "Module 4 — Data Platform Project",
        items: ["Warehouse/lakehouse concepts", "Pipeline monitoring", "End-to-end data pipeline build", "Documentation & handover"],
      },
    ],
    outcomes: ["Build reliable data pipelines", "Optimize SQL for analytics workloads", "Deliver production-style data engineering projects"],
  },
  {
    id: "mobile",
    title: "Android & iOS Development",
    subtitle: "Cross-Platform Mobile Engineering",
    duration: "Structured track",
    accent: "text-[#f9a8d4]",
    border: "border-[#f472b6]/40",
    bg: "bg-[#f472b6]/[0.06]",
    topics: ["Mobile UI patterns & navigation", "API integration & offline storage", "Android (Kotlin) & iOS (Swift) basics", "Publish-ready mobile app projects"],
    modules: [
      {
        title: "Module 1 — Mobile UX & Architecture",
        items: ["Mobile design patterns & navigation", "State management fundamentals", "REST API consumption", "Error/loading UX best practices"],
      },
      {
        title: "Module 2 — Android (Kotlin)",
        items: ["Activities/Fragments or Compose basics", "Layouts & responsive UI", "Local storage (Room/SharedPreferences)", "Android app structure"],
      },
      {
        title: "Module 3 — iOS (Swift)",
        items: ["SwiftUI/UIKit fundamentals", "Navigation & lifecycle", "Core Data / local persistence", "iOS app packaging basics"],
      },
      {
        title: "Module 4 — Mobile Project Delivery",
        items: ["Auth + API integrated app", "Offline-first patterns", "Testing on devices/emulators", "Store-ready project checklist"],
      },
    ],
    outcomes: ["Build functional Android & iOS apps", "Integrate backend APIs in mobile clients", "Ship portfolio-ready mobile projects"],
  },
  {
    id: "devops",
    title: "DevOps Engineering",
    subtitle: "Build, Deploy & Operate",
    duration: "Structured track",
    accent: "text-[#fde68a]",
    border: "border-[#ffd700]/40",
    bg: "bg-[#ffd700]/[0.06]",
    topics: ["Linux, Nginx & server hardening", "Docker & container workflows", "CI/CD pipelines & automation", "Cloud VPS deploy with HTTPS & monitoring"],
    modules: [
      {
        title: "Module 1 — Linux & Systems",
        items: ["Users, permissions, processes", "Networking & DNS basics", "SSH, systemd, and logs", "Server hardening checklist"],
      },
      {
        title: "Module 2 — Nginx & Web Ops",
        items: ["Reverse proxy configuration", "SSL/TLS with Let's Encrypt", "Static vs upstream routing", "Performance & timeout tuning"],
      },
      {
        title: "Module 3 — Docker & CI/CD",
        items: ["Images, containers, compose", "Multi-stage Docker builds", "GitHub Actions / pipeline basics", "Automated test + deploy flow"],
      },
      {
        title: "Module 4 — Cloud Deployment Project",
        items: ["AWS/VPS provisioning", "Environment variables & secrets", "Monitoring & health checks", "Production deploy capstone"],
      },
    ],
    outcomes: ["Operate Linux servers confidently", "Containerize and automate deployments", "Deploy secure production services end-to-end"],
  },
];

function trackWhatsAppHref(courseTitle: string): string {
  const text = `Hi AZ Deploy Academy,

I'm interested in the ${courseTitle} specialized track after reviewing the curriculum.

Please share enrollment next steps, batch timings (morning / afternoon / evening), fees, and online/offline options.

Thank you.`;
  return `https://wa.me/${ACADEMY_CONTACT_NUMBERS[0].raw}?text=${encodeURIComponent(text)}`;
}

function CurriculumEnquiryBar({
  courseTitle,
  onEnquiry,
  className = "",
}: {
  courseTitle: string;
  onEnquiry: () => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-2.5 ${className}`}>
      <button
        type="button"
        onClick={onEnquiry}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#00d4ff]/50 bg-[#00d4ff]/20 px-4 py-2.5 text-sm font-semibold text-[#bff3ff] hover:bg-[#00d4ff]/30 transition-colors"
      >
        Enquiry form
      </button>
      <a
        href={trackWhatsAppHref(courseTitle)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/60 bg-[#25D366]/15 px-4 py-2.5 text-sm font-semibold text-[#86efac] hover:bg-[#25D366]/25 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
    </div>
  );
}

export default function SpecializedCourses() {
  const [active, setActive] = useState<CourseTrack | null>(null);
  const [modalView, setModalView] = useState<"curriculum" | "enroll">("curriculum");

  function openCourse(course: CourseTrack) {
    setActive(course);
    setModalView("curriculum");
  }

  function closeCourseModal() {
    setActive(null);
    setModalView("curriculum");
  }

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modalView === "enroll") setModalView("curriculum");
        else closeCourseModal();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, modalView]);

  return (
    <>
      <section id="specialized-courses" className="courses-fade-in courses-fade-in-delay-2 mb-14 sm:mb-16">
        <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
          <p className="text-[10px] sm:text-xs font-mono text-[#64748b] tracking-[0.28em] uppercase mb-2">
            Specialized tracks
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4]">
            Choose your focus area
          </h2>
          <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">
            AI, security, data, mobile, and DevOps — each track has a short preview on the card.{" "}
            <span className="text-[#00d4ff]">Click any course</span> to open the full detailed curriculum.
            Online + offline modes available.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {SPECIALIZED_TRACKS.map((course) => (
            <button
              key={course.id}
              type="button"
              onClick={() => openCourse(course)}
              className={`hud-panel p-5 sm:p-6 text-left transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_28px_rgba(0,212,255,0.14)] border cursor-pointer w-full ${course.border} ${course.bg}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className={`text-lg sm:text-xl font-black font-mono uppercase tracking-wide ${course.accent}`}>
                    {course.title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-white/75 mt-0.5">{course.subtitle}</p>
                </div>
                <span className="shrink-0 rounded-full border border-white/15 bg-black/40 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-[#94a3b8]">
                  {course.duration}
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] mb-2">What you&apos;ll learn</p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-white/80 leading-relaxed">
                {course.topics.map((topic) => (
                  <li key={topic} className="flex items-start gap-2">
                    <span className={`${course.accent} shrink-0 mt-0.5`}>▸</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className={`mt-4 text-[10px] font-mono uppercase tracking-wide ${course.accent}`}>
                Click for detailed curriculum →
              </p>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <EnrollNowButton
            source="courses_specialized_general"
            label="Enquire about a specialized track"
            modalTitle="Enquire about a specialized track"
            modalSubtitle="Submit the form for a callback, or open WhatsApp with a ready enrollment message."
          />
        </div>
      </section>

      {active ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={closeCourseModal}
          role="presentation"
        >
          <div
            className={`relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border ${active.border} bg-gradient-to-br from-[#071321]/98 via-[#0a0a12]/98 to-[#12101f]/98 shadow-[0_0_80px_rgba(0,212,255,0.15)] p-5 sm:p-7`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-curriculum-title"
          >
            <button
              type="button"
              onClick={closeCourseModal}
              className="absolute right-3 top-3 text-white/70 hover:text-white border border-white/15 rounded-lg w-8 h-8"
              aria-label="Close curriculum"
            >
              ×
            </button>

            {modalView === "curriculum" ? (
              <>
                <p className={`text-[10px] font-mono uppercase tracking-[0.25em] ${active.accent}`}>Detailed curriculum</p>
                <h3 id="course-curriculum-title" className={`mt-1 text-2xl sm:text-3xl font-black font-mono uppercase ${active.accent} pr-8`}>
                  {active.title}
                </h3>
                <p className="text-sm text-white/80 mt-1">{active.subtitle}</p>
                <p className="mt-2 inline-flex rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">
                  {active.duration} · Online + Offline
                </p>

                <CurriculumEnquiryBar
                  className="mt-4"
                  courseTitle={active.title}
                  onEnquiry={() => setModalView("enroll")}
                />

                <CourseOverviewRoadmap
                  key={active.id}
                  courseId={active.id}
                  courseTitle={active.title}
                  accentClass={active.accent}
                />

                <div className="mt-6 space-y-5">
                  {active.modules.map((mod) => (
                    <div key={mod.title} className="rounded-xl border border-white/10 bg-black/35 p-4">
                      <h4 className={`text-sm font-semibold font-mono ${active.accent}`}>{mod.title}</h4>
                      <ul className="mt-3 space-y-2 text-sm text-white/80">
                        {mod.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className={`${active.accent} shrink-0`}>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl border border-[#00d4ff]/25 bg-[#00d4ff]/[0.05] px-4 py-3.5">
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#7dd3fc] mb-2">
                    Curriculum preview
                  </p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    The modules listed above provide a structured overview of this track. The complete syllabus—including extended topics,
                    project milestones, assessments, and batch-specific pacing—is shared during admissions consultation.
                  </p>
                  <p className="mt-2 text-sm text-[#94a3b8] leading-relaxed">
                    For the full program outline tailored to your preferred batch and learning mode (online or offline), please submit an enquiry
                    and our admissions team will assist you promptly.
                  </p>
                </div>

                <div className="mt-6 rounded-xl border border-[#ffd700]/30 bg-[#ffd700]/[0.06] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#fde68a] mb-2">Outcomes</p>
                  <ul className="space-y-1.5 text-sm text-white/85">
                    {active.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2">
                        <span className="text-[#ffd700] shrink-0">✓</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <CurriculumEnquiryBar
                  className="mt-6"
                  courseTitle={active.title}
                  onEnquiry={() => setModalView("enroll")}
                />

                <button
                  type="button"
                  onClick={closeCourseModal}
                  className="mt-3 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setModalView("curriculum")}
                  className="text-xs text-[#94a3b8] hover:text-white font-mono mb-3"
                >
                  ← Back to curriculum
                </button>
                <h3 id="course-curriculum-title" className="text-xl sm:text-2xl font-bold text-white pr-8">
                  Enroll — {active.title}
                </h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">
                  Submit the form for a callback, or message us on WhatsApp with this track pre-filled.
                </p>

                <a
                  href={trackWhatsAppHref(active.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#25D366]/60 bg-[#25D366]/15 px-4 py-3 text-sm font-semibold text-[#86efac] hover:bg-[#25D366]/25 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp — enquire about {active.title}
                </a>

                <div className="my-4 flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-white/35">
                  <span className="flex-1 h-px bg-white/10" />
                  or submit the form
                  <span className="flex-1 h-px bg-white/10" />
                </div>

                <LeadCaptureMiniForm
                  source={`courses_track_${active.id}`}
                  stacked
                  onSubmitted={closeCourseModal}
                />
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
