import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="scientist-bg border-t border-[#00d4ff]/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#00f5d4] mb-4">
              AZDeploy Academy
            </h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed max-w-md">
              Building student lives with real IT knowledge. We make students job-ready with industry veterans who have deployed 500+ products. Think first, then use AI.
            </p>
          </div>
          <div>
            <h4 className="text-[#00d4ff] text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['/home', '/courses', '/about', '/trainer', '/contact'].map((path) => (
                <li key={path}>
                  <Link href={path} className="text-[#94a3b8] hover:text-[#00d4ff] text-sm transition-colors">
                    {path === '/home' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[#00d4ff] text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <a
              href="https://wa.me/918296565587"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#94a3b8] hover:text-[#00d4ff] text-sm transition-colors block"
            >
              +91 82965 65587
            </a>
          </div>
        </div>
        <div className="border-t border-[#00d4ff]/20 mt-8 pt-8 text-center text-[#64748b] text-sm">
          © {new Date().getFullYear()} AZDeploy Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
