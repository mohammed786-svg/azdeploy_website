import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AZDeploy Academy services: up to 12 LPA job assistance track, custom software solutions from idea to deployment, customized ERP for schools/colleges/universities, hospital management systems, and enterprise web applications.",
};

const OFFICE_ADDRESS = {
  addressLine1: "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590016",
  addressLine2: "VFF GROUP - First Floor",
};

export default function ServicesPage() {
  const trainingServices = [
    {
      title: "UPTO_12_LPA_JOB_ASSISTANCE",
      desc: "Structured 6-month industry-ready training with placement support, interview practice, project reviews, and portfolio guidance. We focus on employability outcomes, not just course completion.",
      points: ["Placement-oriented curriculum", "Interview preparation", "Resume + GitHub portfolio building", "Dedicated placement support roadmap"],
    },
    {
      title: "ONLINE_OFFLINE_TRAINING_MODES",
      desc: "Students can choose online or offline learning based on location and schedule. The curriculum depth, mentoring quality, and project standards remain consistent in both modes.",
      points: ["Live instructor-led sessions", "Offline classroom mentoring", "Online attendance with guided labs", "Hybrid-friendly support"],
    },
    {
      title: "INDUSTRY_MENTORSHIP",
      desc: "Learn from trainers with 8+ years experience and 500+ products deployed. No theory-only approach — everything is hands-on, use-case driven, and deployment-focused.",
      points: ["Architecture discussions", "Code review feedback", "Production practices", "Career direction support"],
    },
    {
      title: "REAL_WORLD_PROJECT_TRACK",
      desc: "Every learner is trained on real production-style projects with source control workflows, deployment pipelines, and debugging practices used in real engineering teams.",
      points: ["Client-style project execution", "Deployment and monitoring basics", "API + DB + frontend integration", "Documentation and handover practices"],
    },
  ];

  const softwareSolutions = [
    {
      title: "CUSTOM_SOFTWARE_FROM_CLIENT_IDEA",
      desc: "If a client has an idea, thought, workflow, or business challenge, we design and build a custom software solution from planning to deployment.",
      points: ["Requirement discovery workshops", "System design and module breakdown", "UI/UX prototypes and approval loops", "Secure build, testing, and go-live support"],
    },
    {
      title: "CUSTOMIZED_ERP_FOR_EDUCATION",
      desc: "Tailored ERP systems for schools, colleges, universities, and degree colleges with role-based workflows and reporting aligned to institution operations.",
      points: ["Admissions, fees, attendance, exams", "Faculty, timetable, department workflows", "Parent/student/staff portals", "Reports, analytics, and admin controls"],
    },
    {
      title: "HOSPITAL_MANAGEMENT_SYSTEMS",
      desc: "Custom HMS solutions for clinics and hospitals covering patient lifecycle, billing, records, operational tracking, and management visibility.",
      points: ["Patient registration and appointment flow", "OPD/IPD workflows and billing", "Doctor, nurse, and admin role access", "Clinical records and operational reports"],
    },
    {
      title: "BUSINESS_DIGITAL_TRANSFORMATION",
      desc: "We build web platforms, dashboards, internal tools, and process automation systems for any software requirement across industries.",
      points: ["Web and mobile-friendly business systems", "Workflow automation and integrations", "Custom modules as business scales", "Support, maintenance, and upgrades"],
    },
  ];

  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white text-glow-teal text-center mb-4 hud-label">
            [OUR_SERVICES]
          </h1>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-16 font-mono text-sm">
            Professional training and software services focused on real outcomes: employability, product quality, and business transformation.
          </p>

          <div className="max-w-5xl mx-auto mb-10 rounded-2xl border border-[#00d4ff]/35 bg-[#00d4ff]/10 p-5 sm:p-7 text-center">
            <p className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#7dd3fc]">Up to 12 LPA Job Assistance</p>
            <p className="mt-2 text-sm text-white/85 leading-relaxed">
              AZDeploy Academy delivers career-focused training with project execution, deployment experience, interview preparation, resume building, GitHub portfolio support, and guided placement assistance.
            </p>
            <p className="mt-2 text-xs sm:text-sm font-mono text-[#00f5d4]">Online + Offline training services available.</p>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-5 font-mono tracking-wide">TRAINING_AND_PLACEMENT_SERVICES</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-14">
            {trainingServices.map((s) => (
              <div key={s.title} className="hud-panel p-8">
                <h2 className="text-lg font-bold text-[#00d4ff] mb-3 font-mono">{s.title}</h2>
                <p className="text-white/70 text-sm mb-4">{s.desc}</p>
                <ul className="text-xs text-[#00d4ff]/80 font-mono space-y-1">
                  {s.points.map((pt) => (
                    <li key={pt}>▸ {pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-5 font-mono tracking-wide">CUSTOM_SOFTWARE_AND_ENTERPRISE_SOLUTIONS</h2>
          <p className="text-sm text-white/70 mb-6 max-w-4xl">
            We provide customer software solutions for any thought or idea the client has — from concept and technical planning to development, deployment, and ongoing support.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {softwareSolutions.map((s) => (
              <div key={s.title} className="hud-panel p-8 border border-[#ffd700]/20">
                <h3 className="text-base font-bold text-[#ffd700] mb-3 font-mono">{s.title}</h3>
                <p className="text-white/75 text-sm mb-4 leading-relaxed">{s.desc}</p>
                <ul className="text-xs text-[#fde68a]/90 font-mono space-y-1">
                  {s.points.map((pt) => (
                    <li key={pt}>▸ {pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Office location */}
          <div className="hud-panel p-6 max-w-2xl mx-auto mb-12 text-left sm:text-center">
            <h3 className="text-[#00d4ff] text-sm font-mono uppercase tracking-wider mb-3">OFFICE_LOCATION</h3>
            <p className="text-white/80 text-sm">{OFFICE_ADDRESS.addressLine1}</p>
            <p className="text-white/80 text-sm font-semibold text-[#00d4ff]/90 mt-1">{OFFICE_ADDRESS.addressLine2}</p>
          </div>

          <div className="text-center hud-panel p-8 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4 hud-label">READY_TO_START</h2>
            <p className="text-white/70 mb-6 text-sm">
              Visit us at the office or connect on WhatsApp for training admissions, placement support details, customized ERP requirements, hospital systems, or any business software idea.
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono hover:bg-[#00d4ff]/20 transition-colors mr-4"
            >
              VIEW_COURSES
            </Link>
            <a
              href="https://wa.me/918296565587"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 border border-[#00e5cc] text-[#00e5cc] text-sm font-mono hover:bg-[#00e5cc]/20 transition-colors"
            >
              WHATSAPP
            </a>
          </div>
        </section>
      </main>
      <FloatingActions />
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4 z-30">
        <p className="text-[10px] font-mono text-white/40">/// UPDATES: ENROLLMENT_OPEN</p>
      </footer>
    </div>
  );
}
