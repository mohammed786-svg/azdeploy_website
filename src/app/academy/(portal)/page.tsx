"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { academyFetch } from "@/lib/academy-client";
import { useCompilerTheme } from "@/components/compiler/CompilerThemeProvider";

type Course = { id: string; slug: string; title: string; description: string };
type Profile = { email: string; fullName: string; courses: Course[] };

export default function AcademyDashboardPage() {
  const { theme, toggleTheme } = useCompilerTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [err, setErr] = useState("");
  const shell = theme === "dark" ? "bg-[#0d1117] text-white" : "bg-[#f8fafc] text-slate-900";

  useEffect(() => {
    (async () => {
      try {
        const data = await academyFetch<{ item: Profile }>("/api/academy/me", undefined, {
          suppressSuccessToast: true,
        });
        setProfile(data.item);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to load dashboard");
      }
    })();
  }, []);

  async function logout() {
    await fetch("/api/academy/logout", { method: "POST", credentials: "include" });
    window.location.href = "/academy/login";
  }

  return (
    <div className={`min-h-screen ${shell}`}>
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">AZ Deploy Academy Compiler</h1>
          <p className="text-sm opacity-70 mt-1">Your enrolled coding workspace</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={toggleTheme} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs">
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button type="button" onClick={() => void logout()} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {err ? <p className="text-amber-400 text-sm mb-6">{err}</p> : null}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 mb-8">
          <p className="text-xs uppercase tracking-[0.25em] opacity-60">Welcome back</p>
          <h2 className="text-2xl font-semibold mt-2">{profile?.fullName || profile?.email || "Student"}</h2>
          <p className="text-sm opacity-70 mt-1">{profile?.email}</p>
          <p className="text-sm opacity-80 mt-4">
            Open a course below to access shared labs, run code online, and practice with the AZ Deploy compiler.
            Notes and tasks will appear here in future updates.
          </p>
        </section>

        <h3 className="text-sm font-mono uppercase tracking-[0.2em] opacity-60 mb-4">Your courses</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(profile?.courses || []).map((course) => (
            <Link
              key={course.id}
              href={`/academy/ide/${course.slug}`}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#7c3aed]/15 to-[#00d4ff]/10 p-5 hover:border-[#7c3aed]/40 transition-colors"
            >
              <h4 className="text-lg font-semibold">{course.title}</h4>
              <p className="text-sm opacity-75 mt-2 line-clamp-3">{course.description || "Course workspace"}</p>
              <span className="inline-block mt-4 text-xs font-semibold text-[#00d4ff]">Open compiler →</span>
            </Link>
          ))}
        </div>
        {!profile?.courses?.length && !err ? (
          <p className="text-sm opacity-70">No active course enrollments yet. Contact AZ Deploy Academy support.</p>
        ) : null}
      </main>
    </div>
  );
}
