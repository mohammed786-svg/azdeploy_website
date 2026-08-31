"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { resolveApiDbName, resolveApiOrigin } from "@/lib/api-http";
import { firebaseSignOut, isFirebaseAuthConfigured, signInWithGoogle } from "@/lib/firebase-auth";
import { LIBRARY_API_LOCAL_STORAGE_KEY, LIBRARY_API_SESSION_STORAGE_KEY } from "@/lib/library-session-keys";
import { libraryFetch } from "@/lib/library-client";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/library";
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await libraryFetch("/api/library/me", undefined, { suppressSuccessToast: true, redirectOn401: false });
        if (!alive) return;
        router.replace(next.startsWith("/library") ? next : "/library");
      } catch {
        if (alive) setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router, next]);

  async function onGoogleLogin() {
    setErr("");
    setLoading(true);
    try {
      if (!isFirebaseAuthConfigured()) {
        throw new Error("Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env vars.");
      }
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();
      const base = resolveApiOrigin();
      // Get approximate client IP via a lightweight approach: Django will also read REMOTE_ADDR / X-Forwarded-For
      const r = await fetch(`${base.replace(/\/$/, "")}/api/v1/library/auth`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Database-Name": resolveApiDbName(),
        },
        body: JSON.stringify({
          email: (user.email || "").toLowerCase(),
          firebaseUid: user.uid,
          fullName: user.displayName || "",
          photoUrl: user.photoURL || "",
          idToken,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });
      const json = await r.json();
      if (!r.ok || !json?.success) {
        throw new Error(json?.message || "Login failed");
      }
      const token = json?.data?.apiSession;
      if (!token) throw new Error("Missing session token");
      window.sessionStorage.setItem(LIBRARY_API_SESSION_STORAGE_KEY, token);
      window.localStorage.setItem(LIBRARY_API_LOCAL_STORAGE_KEY, token);
      router.replace(next.startsWith("/library") ? next : "/library");
    } catch (e) {
      await firebaseSignOut().catch(() => undefined);
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] text-slate-500 text-sm">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <Image src="/logo_gold.png" alt="AZ Deploy" width={160} height={48} className="mx-auto h-12 w-auto object-contain" />
        <p className="mt-4 text-center text-[10px] font-mono uppercase tracking-[0.3em] text-sky-700">Customer library</p>
        <h1 className="mt-2 text-center text-2xl font-bold text-slate-900">Sign in with Google</h1>
        <p className="mt-3 text-center text-sm text-slate-600 leading-relaxed">
          Use the <strong>same Gmail / Google account email</strong> you entered at checkout. Access is limited to{" "}
          <strong>2 IP addresses</strong>. Session lasts <strong>3 days</strong>. Logging out frees your current IP.
        </p>
        {err ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p> : null}
        <button
          type="button"
          disabled={loading}
          onClick={() => void onGoogleLogin()}
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 flex items-center justify-center gap-3"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-xs font-bold text-slate-900">G</span>
          {loading ? "Signing in…" : "Continue with Google"}
        </button>
        <p className="mt-4 text-center text-xs text-slate-500">
          No PDF downloads — read purchased ebooks only inside this library.
        </p>
        <Link href="/ebooks" className="mt-4 block text-center text-sm text-sky-700 hover:underline">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}

export default function LibraryLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
