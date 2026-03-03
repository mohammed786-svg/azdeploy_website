'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen hud-bg hud-grid flex flex-col items-center justify-center px-4">
      <div className="hud-panel p-8 sm:p-12 text-center max-w-md w-full">
        <p className="text-[10px] font-mono text-[#ef4444] flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
          ERROR_500
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-glow-teal mb-2">
          SYSTEM_FAULT
        </h1>
        <p className="text-white/70 text-sm font-mono mb-6">
          INTERNAL_SERVER_ERROR
        </p>
        <p className="text-white/50 text-xs font-mono mb-8">
          Something went wrong on our end. We&apos;re recalibrating.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono hover:bg-[#00d4ff]/20 transition-colors"
          >
            RETRY
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white/80 text-sm font-mono hover:bg-white/10 transition-colors"
          >
            RETURN_HOME →
          </Link>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4">
        <p className="text-[10px] font-mono text-white/40 text-center">
          /// AZDeploy Academy — 500
        </p>
      </footer>
    </div>
  );
}
