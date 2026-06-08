"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CompilerIDE from "@/components/compiler/CompilerIDE";
import { academyFetch } from "@/lib/academy-client";

type Profile = {
  email: string;
  fullName: string;
  courses: Array<{ slug: string; title: string }>;
};

export default function AcademyIdePage() {
  const params = useParams<{ courseSlug: string }>();
  const router = useRouter();
  const courseSlug = params.courseSlug;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await academyFetch<{ item: Profile }>("/api/academy/me", undefined, {
          suppressSuccessToast: true,
        });
        const enrolled = data.item.courses.some((c) => c.slug === courseSlug);
        if (!enrolled) {
          router.replace("/academy");
          return;
        }
        setProfile(data.item);
      } catch {
        router.replace("/academy/login");
      }
    })();
  }, [courseSlug, router]);

  const course = profile?.courses.find((c) => c.slug === courseSlug);

  if (!profile || !course) {
    return <div className="h-screen flex items-center justify-center bg-[#0d1117] text-[#8b949e]">Loading IDE…</div>;
  }

  return (
    <CompilerIDE
      courseSlug={course.slug}
      courseTitle={course.title}
      studentEmail={profile.email}
      studentName={profile.fullName}
    />
  );
}
