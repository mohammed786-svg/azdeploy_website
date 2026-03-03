'use client';

export default function HeroSplineBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Smooth spline curves - behind text, muted glow, no overlap with rings */}
      <div className="absolute w-[min(70vw,480px)] h-[min(50vh,380px)] opacity-30">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <defs>
            <linearGradient id="spline-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="spline-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5cc" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Smooth flowing bezier curves - organic spline feel */}
          <path
            d="M 0 150 Q 80 80, 150 120 T 300 100 T 400 150"
            fill="none"
            stroke="url(#spline-grad-1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="animate-spline-flow"
            style={{ animationDelay: '0s' }}
          />
          <path
            d="M 0 180 Q 100 220, 200 160 T 400 200"
            fill="none"
            stroke="url(#spline-grad-2)"
            strokeWidth="1"
            strokeLinecap="round"
            className="animate-spline-flow"
            style={{ animationDelay: '0.5s' }}
          />
          <path
            d="M 0 120 Q 120 60, 250 140 T 400 100"
            fill="none"
            stroke="rgba(0, 212, 255, 0.2)"
            strokeWidth="0.8"
            strokeLinecap="round"
            className="animate-spline-flow"
            style={{ animationDelay: '1s' }}
          />
          <path
            d="M 0 200 Q 150 250, 300 180 T 400 220"
            fill="none"
            stroke="rgba(0, 229, 204, 0.15)"
            strokeWidth="0.6"
            strokeLinecap="round"
            className="animate-spline-flow"
            style={{ animationDelay: '1.5s' }}
          />
          <path
            d="M 50 0 Q 200 80, 350 50 Q 380 100, 350 150"
            fill="none"
            stroke="rgba(0, 212, 255, 0.18)"
            strokeWidth="0.6"
            strokeLinecap="round"
            className="animate-spline-flow-slow"
          />
        </svg>
      </div>
    </div>
  );
}
