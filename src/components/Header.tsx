'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/trainer', label: 'Trainer' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 scientist-bg border-b border-[#00d4ff]/20 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/home" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4]">
            AZDeploy
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`link-underline text-sm uppercase tracking-wider transition-colors duration-300 ${
                  pathname === link.href ? 'text-[#00d4ff]' : 'text-[#94a3b8] hover:text-[#00d4ff]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/918296565587"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 border border-[#00d4ff]/50 text-[#00d4ff] text-sm font-medium hover:bg-[#00d4ff]/30 hover:scale-105 transition-all duration-300"
            >
              Enroll Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#00d4ff]"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[#00d4ff]/20">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm uppercase tracking-wider ${
                    pathname === link.href ? 'text-[#00d4ff]' : 'text-[#94a3b8]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://wa.me/918296565587"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#00d4ff]/20 border border-[#00d4ff]/50 text-[#00d4ff] text-sm font-medium w-fit"
              >
                Enroll Now
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
