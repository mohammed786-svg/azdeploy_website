'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/courses', label: 'COURSES' },
  { href: '/services', label: 'SERVICES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/trainer', label: 'TRAINER' },
  { href: '/contact', label: 'CONTACT' },
];

export default function HudHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hud-bg border-b border-[#00d4ff]/30 backdrop-blur-md">
      <nav className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/80 hover:text-[#00d4ff]"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex flex-col shrink-0 min-w-0">
              <span className="text-base sm:text-xl font-bold text-white text-glow-teal truncate">AZDeploy</span>
              <span className="text-[10px] sm:text-xs font-mono text-[#00d4ff] tracking-widest truncate">ACADEMY_2026</span>
            </Link>
          </div>

          {/* Center: ONLINE + Nav */}
          <div className="hidden md:flex flex-col items-center gap-1">
            <span className="text-[10px] font-mono text-[#22c55e] tracking-[0.2em] flex items-center gap-1.5">
              <span className="live-dot" />
              ONLINE
            </span>
            <div className="flex items-center gap-3 lg:gap-6 flex-wrap justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-mono uppercase tracking-[0.2em] transition-colors ${
                    pathname === link.href || (link.href === '/' && pathname === '/home')
                      ? 'text-[#00d4ff]'
                      : 'text-white/70 hover:text-[#00d4ff]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: ENROLL */}
          <a
            href="https://wa.me/918296565587"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-[#00d4ff]/20 border border-[#00d4ff] text-[#00d4ff] text-xs sm:text-sm font-mono uppercase tracking-wider hover:bg-[#00d4ff]/30 transition-colors shrink-0"
          >
            ENROLL
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[#00d4ff]/20">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-[#22c55e] flex items-center gap-1.5">
                <span className="live-dot" />
                ONLINE
              </span>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-mono uppercase ${
                    pathname === link.href || (link.href === '/' && pathname === '/home') ? 'text-[#00d4ff]' : 'text-white/70'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-[#00d4ff]"
              >
                ENROLL →
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
