import type { Metadata } from "next";
import HudHeader from "@/components/HudHeader";
import FloatingActions from "@/components/FloatingActions";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "AZDeploy Academy courses: Python Full Stack and Android Development. Limited batches, 25 seats per batch. First 10 students get 30% off. Enroll now.",
};

const PYTHON_DESC = `Without Python, students can't build their career. Our Python Full Stack program covers everything from fundamentals to deployment—real projects, real stacks.`;
const ANDROID_DESC = `Master Android development with industry-standard tools. Build real apps, understand the ecosystem, and become interview-ready.`;

export default function CoursesPage() {
  return (
    <div className="min-h-screen hud-bg hud-grid">
      <HudHeader />
      <main className="pt-16 pb-24 sm:pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] text-center mb-4">
            Our Courses
          </h1>
          <p className="text-[#94a3b8] text-center max-w-2xl mx-auto mb-16">
            Focused on what matters most. Python Full Stack and Android Development—the top skills in demand right now.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Python Full Stack */}
            <div className="hud-panel p-8 border-[#00d4ff]/40">
              <div className="text-[#00d4ff] text-sm uppercase tracking-wider mb-2">Primary Course</div>
              <h2 className="text-2xl font-bold text-[#e8f4f8] mb-4">Python Full Stack</h2>
              <p className="text-[#94a3b8] mb-6">{PYTHON_DESC}</p>
              <div className="space-y-2 text-sm text-[#94a3b8] mb-6">
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
            <div className="hud-panel p-8 border-[#00e5cc]/40">
              <div className="text-[#00f5d4] text-sm uppercase tracking-wider mb-2">Primary Course</div>
              <h2 className="text-2xl font-bold text-[#e8f4f8] mb-4">Android Developer</h2>
              <p className="text-[#94a3b8] mb-6">{ANDROID_DESC}</p>
              <div className="space-y-2 text-sm text-[#94a3b8] mb-6">
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

          {/* Coming Soon */}
          <h2 className="text-xl font-bold text-[#64748b] text-center mb-8">More courses coming soon</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["CYBER_SECURITY", "DEVOPS_NGINX", "LINUX_UBUNTU", "KALI_LINUX"].map((name) => (
              <div key={name} className="hud-panel p-4 text-center opacity-70">
                <h3 className="text-[#94a3b8] font-medium">{name}</h3>
                <p className="text-[#00d4ff] text-xs mt-1 font-mono">COMING_SOON</p>
              </div>
            ))}
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
