'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'HOME' },
  { href: '/courses', label: 'COURSES' },
  { href: '/blog', label: 'BLOG' },
  { href: '/enquiry', label: 'ENQUIRY' },
  { href: '/services', label: 'SERVICES' },
  { href: '/about', label: 'ABOUT' },
  { href: '/trainer', label: 'TRAINER' },
  { href: '/contact', label: 'CONTACT' },
];

function EnrollCta({ className = '' }: { className?: string }) {
  return (
    <a
      href="https://wa.me/918296565587"
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-2.5 bg-[#00d4ff]/20 border border-[#00d4ff] text-[#00d4ff] text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-wider hover:bg-[#00d4ff]/30 transition-colors shrink-0 whitespace-nowrap ${className}`}
    >
      ENROLL
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </a>
  );
}

function LogoMark({ compact }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className={`flex items-center justify-center shrink-0 min-w-0 leading-none ${
        compact ? 'h-10 py-0' : 'h-10 sm:h-11'
      }`}
    >
      <Image
        src="/logo_gold.png"
        alt="AZ Deploy Academy"
        width={520}
        height={200}
        className={`block object-contain object-center mx-auto ${
          compact
            ? 'h-8 w-auto max-h-8 max-w-[min(180px,46vw)]'
            : 'h-9 w-auto max-h-9 sm:h-10 sm:max-h-10 max-w-[min(200px,52vw)]'
        }`}
        priority
        quality={100}
        sizes="(max-width: 768px) 200px, 240px"
      />
    </Link>
  );
}

export default function HudHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hud-bg border-b border-[#00d4ff]/30 backdrop-blur-md">
      <nav className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: 3 equal columns — logo truly centered between menu and ENROLL */}
        <div className="md:hidden grid grid-cols-3 items-center gap-1 h-16 min-h-[4rem] w-full">
          <div className="flex justify-start items-center min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg border border-transparent text-white/90 hover:text-[#00d4ff] hover:bg-white/[0.06] hover:border-[#00d4ff]/25 transition-colors"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6 block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center items-center min-w-0 px-0.5">
            <LogoMark compact />
          </div>
          <div className="flex justify-end items-center min-w-0">
            <EnrollCta />
          </div>
        </div>

        {/* Desktop: logo left · nav center · ENROLL right */}
        <div className="hidden md:flex items-center justify-between h-16 min-h-[4rem] w-full gap-4">
          <LogoMark />
          <div className="flex flex-col items-center gap-1 flex-1 min-w-0 justify-center">
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
          <EnrollCta />
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
