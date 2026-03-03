'use client';

import { useState, useEffect } from 'react';

const courses = [
  { name: 'PYTHON_FULL_STACK', status: 'ONLINE' },
  { name: 'ANDROID_DEV', status: 'ACTIVE' },
  { name: 'CYBER_SECURITY', status: 'WAITING' },
  { name: 'DEVOPS_NGINX', status: 'COMING_SOON' },
];

export default function CourseRadar() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 2) % 360), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hud-corner-border p-4 w-full max-w-[280px] flex flex-col min-w-0">
      <div className="flex items-center gap-2 mb-4">
        <span className="hud-label text-white">[COURSE_RADAR]</span>
        <span className="live-dot" />
        <span className="text-xs font-mono text-[#22c55e]">LIVE</span>
      </div>

      {/* Radar SVG */}
      <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-4">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Concentric circles */}
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
          {/* Radial lines */}
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
          {/* Sweep - rotates from top clockwise */}
          <path
            d={`M 100 100 L 100 20 A 80 80 0 0 1 ${100 + 80 * Math.sin((angle * Math.PI) / 180)} ${100 - 80 * Math.cos((angle * Math.PI) / 180)} Z`}
            fill="rgba(0, 212, 255, 0.2)"
          />
          {/* Dots */}
          <circle cx="100" cy="60" r="3" fill="#ffd700" className="opacity-80" />
          <circle cx="130" cy="90" r="2" fill="#ef4444" className="opacity-80" />
          <circle cx="75" cy="110" r="2" fill="#fff" className="opacity-80" />
          <circle cx="115" cy="135" r="2" fill="#ffd700" className="opacity-60" />
        </svg>
      </div>

      {/* Course list */}
      <div className="space-y-2 overflow-hidden">
        {courses.map((c) => (
          <div key={c.name} className="flex justify-between gap-2 text-[10px] sm:text-xs min-w-0">
            <span className="text-white/90 font-mono truncate">{c.name}:</span>
            <span className="text-[#00d4ff] font-mono shrink-0">{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
