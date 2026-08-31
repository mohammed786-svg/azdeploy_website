"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

/** Legacy download URLs redirect to Library — PDF download disabled. */
function RedirectInner() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get("slug") || "";

  useEffect(() => {
    const next = slug ? `/library/ebooks/${slug}` : "/library";
    router.replace(`/library/login?next=${encodeURIComponent(next)}`);
  }, [router, slug]);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-3 px-4">
      <p className="text-sm text-neutral-700 text-center max-w-md">
        PDF download is disabled. Sign in to your Library with Google to read purchased ebooks.
      </p>
      <Link href="/library/login" className="text-sm text-sky-700 underline">
        Go to Library login
      </Link>
    </div>
  );
}

export default function EbookDownloadRedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm">Redirecting…</div>}>
      <RedirectInner />
    </Suspense>
  );
}
