import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";
import CoursesFloatingIcons from "@/components/CoursesFloatingIcons";
import { PythonRoadmap, AndroidRoadmap } from "@/components/CourseRoadmap";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "AZDeploy Academy courses: Python Full Stack and Android Development. Limited batches, 25 seats per batch. First 10 students get 30% off. Enroll now.",
};

const PYTHON_DESC = `Without Python, students can't build their career. Our Python Full Stack program covers everything from fundamentals to deployment—real projects, real stacks.`;
const ANDROID_DESC = `Master Android development with industry-standard tools. Build real apps, understand the ecosystem, and become interview-ready.`;

const OFFICE_ADDRESS = {
  addressLine1: "Plot no. 516, Main Road, Ramteerth Nagar, Lakshmipuri Layout, Auto Nagar, Belagavi, Karnataka 590017",
  addressLine2: "VFF GROUP - First Floor",
};

const COMING_SOON_COURSES = [
  {
    id: "forex-trading",
    name: "FOREX TRADING",
    desc: "Learn currency markets, technical & fundamental analysis, risk management, and live trading strategies. From basics to disciplined execution.",
    highlight: true,
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    desc: "SEO, SEM, social media, content marketing, analytics, and campaigns. Build real skills to grow brands and drive traffic.",
  },
  {
    id: "ui-ux-designer",
    name: "UI/UX Designer",
    desc: "User research, wireframes, prototypes, Figma/Adobe XD, design systems, and usability. Ship interfaces users love.",
  },
  {
    id: "cyber-security",
    name: "Cyber Security",
    desc: "Ethical hacking, penetration testing, network security, and defensive practices. Hands-on with industry tools.",
  },
  {
    id: "devops-nginx",
    name: "DevOps & Nginx",
    desc: "CI/CD, containers, Nginx, deployment pipelines, and infrastructure as code. Ship and scale reliably.",
  },
  {
    id: "linux-ubuntu",
    name: "Linux / Ubuntu",
    desc: "Command line, scripting, system administration, and server management. Essential for every developer.",
  },
  {
    id: "kali-linux",
    name: "Kali Linux",
    desc: "Security-focused distro, reconnaissance, exploitation tools, and ethical hacking workflows. For security practitioners.",
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid relative">
      <HudHeader />
      <main className="relative z-10 pt-16 pb-24 sm:pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <h1 className="courses-fade-in text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] text-center mb-4">
            Our Courses
          </h1>
          <p className="courses-fade-in courses-fade-in-delay-1 text-[#94a3b8] text-center max-w-2xl mx-auto mb-12">
            Focused on what matters most. Python Full Stack and Android Development—the top skills in demand right now.
          </p>

          {/* Cards area with floating icons around it */}
          <div className="relative min-h-[480px]">
            <CoursesFloatingIcons />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 mb-16">
              {/* Python Full Stack */}
            <div className="hud-panel p-8 border-[#00d4ff]/40 courses-fade-in courses-fade-in-delay-2 transition-all duration-300 hover:border-[#00d4ff]/60 hover:shadow-[0_0_24px_rgba(0,212,255,0.12)]">
              <div className="text-[#00d4ff] text-sm uppercase tracking-wider mb-2">Primary Course · 6 months</div>
              <h2 className="text-2xl font-bold text-[#e8f4f8] mb-4">Python Full Stack</h2>
              <p className="text-[#94a3b8] mb-4">{PYTHON_DESC}</p>
              <ul className="text-sm text-[#94a3b8] mb-4 space-y-1">
                <li>• Backend (Django/Flask), Frontend, DB, APIs</li>
                <li>• Real projects & deployment</li>
                <li>• Interview prep & placement focus</li>
              </ul>
              <div className="space-y-2 text-sm text-[#94a3b8] mb-6">
                <p>• 6 months program · one-on-one mentorship</p>
                <p>• 3 batches only</p>
                <p>• 25 seats per batch</p>
                <p>• First 10 students: 30% off</p>
              </div>
              <a
                href="https://wa.me/918296565587?text=Hi,%20I%20am%20interested%20in%20Python%20Full%20Stack%20course"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00d4ff]/20 border border-[#00d4ff]/50 text-[#00d4ff] font-medium hover:bg-[#00d4ff]/30 transition-colors"
              >
                Enroll — WhatsApp
              </a>
            </div>

            {/* Android Developer */}
            <div className="hud-panel p-8 border-[#00e5cc]/40 courses-fade-in courses-fade-in-delay-3 transition-all duration-300 hover:border-[#00e5cc]/60 hover:shadow-[0_0_24px_rgba(0,229,204,0.12)]">
              <div className="text-[#00f5d4] text-sm uppercase tracking-wider mb-2">Primary Course · 5 months</div>
              <h2 className="text-2xl font-bold text-[#e8f4f8] mb-4">Android Developer</h2>
              <p className="text-[#94a3b8] mb-4">{ANDROID_DESC}</p>
              <ul className="text-sm text-[#94a3b8] mb-4 space-y-1">
                <li>• Kotlin/Java, Android Studio, UI/UX</li>
                <li>• Build & publish real apps</li>
                <li>• Industry-ready portfolio</li>
              </ul>
              <div className="space-y-2 text-sm text-[#94a3b8] mb-6">
                <p>• 5 months program · one-on-one mentorship</p>
                <p>• 3 batches only</p>
                <p>• 25 seats per batch</p>
                <p>• First 10 students: 30% off</p>
              </div>
              <a
                href="https://wa.me/918296565587?text=Hi,%20I%20am%20interested%20in%20Android%20Developer%20course"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00f5d4]/20 border border-[#00f5d4]/50 text-[#00f5d4] font-medium hover:bg-[#00f5d4]/30 transition-colors"
              >
                Enroll — WhatsApp
              </a>
            </div>
          </div>
        </div>

          {/* Animated roadmaps – what you'll learn, what makes us different */}
          <div className="courses-fade-in courses-fade-in-delay-4 mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
              What you&apos;ll learn — roadmap
            </h2>
            <p className="text-[#94a3b8] text-sm text-center max-w-2xl mx-auto mb-10">
              Day 1 to job ready. Last months are practice, real projects & mock interviews — not just theory.
            </p>
            <div className="grid md:grid-cols-2 gap-10 md:gap-12">
              <div className="hud-corner-border p-6 md:p-8">
                <PythonRoadmap />
              </div>
              <div className="hud-corner-border p-6 md:p-8">
                <AndroidRoadmap />
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <h2 className="courses-fade-in courses-fade-in-delay-4 text-xl font-bold text-[#94a3b8] text-center mb-8">More courses coming soon</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {COMING_SOON_COURSES.map((course) => (
              <div
                key={course.id}
                className={`hud-panel p-5 text-left transition-all duration-300 hover:scale-[1.02] ${
                  course.highlight
                    ? "border-2 border-[#ffd700]/60 bg-[#ffd700]/5 shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                    : "opacity-90 border border-[#00d4ff]/20"
                }`}
              >
                <h3 className={`font-bold font-mono text-sm ${course.highlight ? "text-[#ffd700]" : "text-[#94a3b8]"}`}>
                  {course.name}
                </h3>
                <p className="text-[#64748b] text-xs mt-2 leading-relaxed line-clamp-3">{course.desc}</p>
                <p className="text-[#00d4ff] text-xs font-mono mt-3">COMING_SOON</p>
              </div>
            ))}
          </div>

          {/* Office location */}
          <div className="hud-panel p-6 max-w-2xl mx-auto mt-12 text-left sm:text-center transition-all duration-300 hover:border-[#00d4ff]/40">
            <h3 className="text-[#00d4ff] text-sm font-mono uppercase tracking-wider mb-3">OFFICE_LOCATION</h3>
            <p className="text-white/80 text-sm">{OFFICE_ADDRESS.addressLine1}</p>
            <p className="text-white/80 text-sm font-semibold text-[#00d4ff]/90 mt-1">{OFFICE_ADDRESS.addressLine2}</p>
          </div>

          <div className="text-center mt-12">
            <p className="text-[#94a3b8] mb-4">For more information, contact us on WhatsApp</p>
            <a
              href="https://wa.me/918296565587"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d4ff] link-underline"
            >
              +91 82965 65587
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
