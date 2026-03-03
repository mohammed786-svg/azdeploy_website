import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen hud-bg hud-grid flex flex-col items-center justify-center px-4">
      <div className="hud-panel p-8 sm:p-12 text-center max-w-md w-full">
        <p className="text-[10px] font-mono text-[#22c55e] flex items-center justify-center gap-2 mb-4">
          <span className="live-dot" />
          ERROR_404
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-glow-teal mb-2">
          SIGNAL_LOST
        </h1>
        <p className="text-white/70 text-sm font-mono mb-6">
          PAGE_NOT_IN_ORBIT
        </p>
        <p className="text-white/50 text-xs font-mono mb-8">
          The requested resource could not be located. Return to base.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[#00d4ff] text-[#00d4ff] text-sm font-mono hover:bg-[#00d4ff]/20 transition-colors"
        >
          RETURN_HOME →
        </Link>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 hud-bg border-t border-[#00d4ff]/20 py-1 px-4">
        <p className="text-[10px] font-mono text-white/40 text-center">
          /// AZDeploy Academy — 404
        </p>
      </footer>
    </div>
  );
}
