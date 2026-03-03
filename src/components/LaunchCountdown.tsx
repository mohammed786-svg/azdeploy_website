'use client';

import { useState, useEffect } from 'react';

const COUNTDOWN_START = 3;
const TICK_MS = 1000;

type Props = { onComplete?: () => void };

export default function LaunchCountdown({ onComplete }: Props) {
  const [count, setCount] = useState(COUNTDOWN_START);
  const [phase, setPhase] = useState<'countdown' | 'go' | 'reveal'>('countdown');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (phase === 'countdown') {
      if (count > 0) {
        const t = setTimeout(() => setCount((c) => c - 1), TICK_MS);
        return () => clearTimeout(t);
      } else {
        setPhase('go');
        return;
      }
    }

    if (phase === 'go') {
      const t = setTimeout(() => setPhase('reveal'), 800);
      return () => clearTimeout(t);
    }

    if (phase === 'reveal') {
      const t = setTimeout(() => onComplete?.(), 1200);
      return () => clearTimeout(t);
    }
  }, [mounted, count, phase, onComplete]);

  return (
    <div className="min-h-screen scientist-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.06)_0%,transparent_70%)] animate-pulse" />
        <div className="countdown-grid" />
      </div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 md:w-2 md:h-2 rounded-full bg-[#00d4ff] pointer-events-none animate-float"
          style={{
            left: `${10 + (i * 7) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
            animationDelay: `${i * 0.2}s`,
            opacity: 0.3 + (i % 3) * 0.2,
          }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <div
          key={`f-${i}`}
          className="absolute w-1 h-1 rounded-full bg-[#00f5d4] pointer-events-none animate-float-slow"
          style={{
            right: `${5 + (i * 12) % 60}%`,
            bottom: `${10 + (i * 8) % 60}%`,
            animationDelay: `${i * 0.3}s`,
            opacity: 0.2 + (i % 2) * 0.2,
          }}
        />
      ))}

      <div className="relative z-10 text-center px-6 w-full max-w-lg">
        {/* Countdown number or content */}
        {phase === 'countdown' && (
          <div
            key={count}
            className="countdown-number text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#00f5d4] to-[#00d4ff] animate-count-pop"
          >
            {count}
          </div>
        )}

        {phase === 'go' && (
          <div className="animate-go-burst">
            <span className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] drop-shadow-[0_0_40px_rgba(0,212,255,0.6)]">
              GO!
            </span>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="animate-fade-in-up space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4]">
              AZDeploy Academy
            </h1>
            <p className="text-lg text-[#94a3b8]">Welcome — Taking you in...</p>
            <div className="flex justify-center">
              <div className="w-12 h-12 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}

        {/* Static content - visible during countdown */}
        {(phase === 'countdown' || phase === 'go') && (
          <p className="text-sm uppercase tracking-[0.3em] text-[#00d4ff]/80 mt-8 animate-pulse">
            Launching in
          </p>
        )}

        {/* CTA buttons - always visible, animate in */}
        <div className="flex flex-wrap justify-center gap-4 mt-16 animate-fade-in-up">
          <a
            href="https://wa.me/918296565587"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#00d4ff]/20 border border-[#00d4ff]/50 text-[#00d4ff] hover:bg-[#00d4ff]/30 hover:scale-105 transition-all duration-300"
          >
            Contact on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => onComplete?.()}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-[#64748b]/50 text-[#94a3b8] hover:border-[#00d4ff]/50 hover:text-[#00d4ff] hover:scale-105 transition-all duration-300"
          >
            Enter Site
          </button>
        </div>
      </div>
    </div>
  );
}
