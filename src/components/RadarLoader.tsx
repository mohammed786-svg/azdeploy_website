'use client';

import { useState, useEffect } from 'react';

export default function RadarLoader() {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setAngle((a) => (a + 3) % 360), 40);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen hud-bg hud-grid flex flex-col items-center justify-center gap-6">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[1, 2, 3, 4, 5].map((r) => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={100 - r * 15}
              fill="none"
              stroke="rgba(0, 212, 255, 0.15)"
              strokeWidth="0.5"
            />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="100"
              x2={100 + 85 * Math.cos((deg * Math.PI) / 180)}
              y2={100 + 85 * Math.sin((deg * Math.PI) / 180)}
              stroke="rgba(0, 212, 255, 0.1)"
              strokeWidth="0.5"
            />
          ))}
          <path
            d={`M 100 100 L 100 15 A 85 85 0 0 1 ${100 + 85 * Math.sin((angle * Math.PI) / 180)} ${100 - 85 * Math.cos((angle * Math.PI) / 180)} Z`}
            fill="rgba(0, 212, 255, 0.25)"
          />
          <circle cx="100" cy="100" r="4" fill="#00d4ff" className="opacity-90" />
        </svg>
      </div>
      <p className="text-xs font-mono text-[#00d4ff] tracking-[0.3em] uppercase">
        LOADING...
      </p>
    </div>
  );
}
