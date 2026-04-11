'use client';

import { useState, useEffect } from 'react';

/** One ongoing program — pillars show where you lean; not separate courses. */
const journeyPillars = [
  { pillar: 'FULLSTACK_AI_DEVOPS', fit: 'CORE_TRACK' },
  { pillar: 'DEVELOPMENT', fit: 'BUILD_FOCUS' },
  { pillar: 'DEVOPS_SYSTEMS', fit: 'OPS_FOCUS' },
  { pillar: 'AI_DATA', fit: 'AI_DATA_FOCUS' },
];

export default function CourseRadar() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 2) % 360), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hud-corner-border p-4 w-full max-w-[280px] flex flex-col min-w-0">
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="hud-label text-white">[JOURNEY_RADAR]</span>
          <span className="text-[10px] font-mono text-[#22c55e] tracking-wide">ONE_PROGRAM</span>
        </div>
        <p className="text-[9px] sm:text-[10px] font-mono text-[#64748b] leading-snug">
          Same ongoing track — pick the emphasis that fits how you want to grow. Not four separate courses.
        </p>
      </div>

      {/* Radar SVG */}
      <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[1, 2, 3, 4].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={100 - r * 20}
              fill="none"
              stroke="rgba(0, 212, 255, 0.2)"
              strokeWidth="0.5"
            />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="100"
              x2={100 + 90 * Math.cos((deg * Math.PI) / 180)}
              y2={100 + 90 * Math.sin((deg * Math.PI) / 180)}
              stroke="rgba(0, 212, 255, 0.15)"
              strokeWidth="0.5"
            />
          ))}
          <path
            d={`M 100 100 L 100 20 A 80 80 0 0 1 ${100 + 80 * Math.sin((angle * Math.PI) / 180)} ${100 - 80 * Math.cos((angle * Math.PI) / 180)} Z`}
            fill="rgba(0, 212, 255, 0.2)"
          />
          <circle cx="100" cy="60" r="3" fill="#ffd700" className="opacity-80" />
          <circle cx="130" cy="90" r="2" fill="#ef4444" className="opacity-80" />
          <circle cx="75" cy="110" r="2" fill="#fff" className="opacity-80" />
          <circle cx="115" cy="135" r="2" fill="#ffd700" className="opacity-60" />
        </svg>
      </div>

      <div className="space-y-1.5 overflow-hidden mb-2">
        <div className="flex justify-between gap-2 text-[9px] sm:text-[10px] font-mono text-[#64748b] uppercase tracking-wide border-b border-[#00d4ff]/15 pb-1">
          <span>Pillar</span>
          <span className="text-right">Your fit</span>
        </div>
        {journeyPillars.map((row) => (
          <div key={row.pillar} className="flex justify-between gap-2 text-[10px] sm:text-xs min-w-0">
            <span className="text-white/90 font-mono truncate" title={row.pillar}>
              {row.pillar}
            </span>
            <span className="text-[#00d4ff] font-mono shrink-0">{row.fit}</span>
          </div>
        ))}
      </div>
      <p className="text-[9px] font-mono text-[#475569] leading-relaxed border-t border-[#00d4ff]/10 pt-2">
        /// Mentors help you map projects to the path that matches your strengths.
      </p>
    </div>
  );
}
