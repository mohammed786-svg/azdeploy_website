"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { academyFetch } from "@/lib/academy-client";
import { firebaseSignOut, isFirebaseAuthConfigured, signInWithGoogle } from "@/lib/firebase-auth";

export default function AcademyLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await academyFetch("/api/academy/me", undefined, { suppressSuccessToast: true });
        if (!alive) return;
        router.replace("/academy");
      } catch {
        if (alive) setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  async function onGoogleLogin() {
    setErr("");
    setLoading(true);
    try {
      if (!isFirebaseAuthConfigured()) {
        throw new Error("Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.");
      }
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();
      await academyFetch("/api/academy/auth", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      router.replace("/academy");
      router.refresh();
    } catch (e) {
      await firebaseSignOut().catch(() => undefined);
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-[#8b949e]">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-[#7c3aed]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#00d4ff]/10 blur-[80px]" />
      </div>
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#11131a]/95 backdrop-blur-xl p-8 shadow-2xl">
        <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#64748b] text-center">AZ Deploy Academy</p>
        <h1 className="mt-3 text-2xl font-bold text-center text-white">Online Compiler</h1>
        <p className="mt-3 text-sm text-[#94a3b8] text-center leading-relaxed">
          Sign in with the Google account approved by AZ Deploy Academy HQ. Only enrolled compiler students can access
          shared labs and courses.
        </p>
        <button
          type="button"
          disabled={loading}
          onClick={() => void onGoogleLogin()}
          className="mt-8 w-full rounded-xl border border-white/10 bg-white text-[#111] py-3.5 text-sm font-semibold hover:bg-[#f8fafc] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <span className="text-lg">G</span>
          {loading ? "Signing in…" : "Continue with Google"}
        </button>
        {err ? (
          <p className="mt-4 text-sm text-amber-400 font-mono text-center" role="alert">
            {err}
          </p>
        ) : null}
      </div>
    </div>
  );
}
