'use client';

export default function StudentsPanel() {
  return (
    <div className="hud-corner-border p-4 w-full max-w-[280px] flex flex-col min-w-0">
      <div className="flex items-center gap-2 mb-4">
        <span className="hud-label text-white">[STUDENTS]</span>
        <span className="live-dot" />
        <span className="text-xs font-mono text-[#22c55e]">LIVE</span>
      </div>

      <div className="mb-2">
        <p className="text-xs text-white/80 font-mono">STUDENTS_REGISTERED</p>
        <p className="text-4xl font-bold text-[#00d4ff] text-glow-teal mt-1">24</p>
      </div>

      <div className="segmented-bar mb-2">
        {[...Array(10)].map((_, i) => (
          <span key={i} />
        ))}
      </div>
      <p className="text-[10px] text-white/50 font-mono">LOADING_ENROLLMENTS...</p>

      <div className="mt-4 pt-4 border-t border-[#00d4ff]/20 flex justify-between text-[10px] text-white/40 font-mono">
        <span>SEATS_LEFT: 76</span>
        <span>LATENCY: 12ms</span>
      </div>
    </div>
  );
}
