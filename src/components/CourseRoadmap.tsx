'use client';

/** Curriculum from AZ Deploy Academy program — Full-Stack + AI + DevOps (6 months). */
const PROGRAM_ROADMAP = {
  title: 'Full-Stack + AI + DevOps',
  duration: '6 months',
  accent: '#00d4ff',
  phases: [
    {
      label: 'Development',
      title: 'Frontend · Backend · Database',
      topics: [
        'React: components, hooks, state, routing, forms, consuming REST APIs, modern UI patterns',
        'Django: project/apps, MVT, ORM, auth, REST APIs, error handling, structure for growth',
        'System design: APIs, pagination, caching concepts, async where it fits, trade-offs',
        'PostgreSQL: schema design, migrations, indexes, EXPLAIN, query tuning, avoiding N+1',
        'End-to-end: feature from UI → API → DB with realistic constraints',
      ],
    },
    {
      label: 'DevOps & Systems',
      title: 'Linux · Nginx · Docker · Deployment',
      topics: [
        'Linux (server level): shell, users & permissions, processes, logs, networking basics',
        'Nginx: reverse proxy, static files, SSL concepts, upstreams, common prod patterns',
        'Docker: images, Dockerfile, compose for local/prod parity, volumes & networks',
        'CI/CD: automated test & build on push, staging vs production mindset',
        'VPS on AWS: instance basics, SSH, deploy app, domain & HTTPS, service reliability',
      ],
    },
    {
      label: 'AI & Data',
      title: 'Real use cases & fundamentals',
      topics: [
        'AI in products: when to use APIs, costs, limits, safety & UX for AI features',
        'Integrating AI with Django/React: request flow, keys, fallbacks',
        'Data engineering basics: batch vs stream intuition, ETL-shaped thinking, quality',
        'Connecting data work to PostgreSQL and APIs you already built',
      ],
    },
  ],
};

type RoadmapConfig = typeof PROGRAM_ROADMAP;

function RoadmapFlow({ config }: { config: RoadmapConfig }) {
  const accent = config.accent;

  return (
    <div className="course-roadmap relative">
      <h3 className="text-lg font-mono font-semibold text-center mb-2 text-white/90">
        {config.title} — {config.duration}
      </h3>
      <p className="text-center text-xs text-white/50 font-mono mb-2">
        What you will master — Learn. Build. Deploy. Scale. Get hired.
      </p>
      <p className="text-center text-[11px] text-[#64748b] mb-8 max-w-md mx-auto">
        Below is the skill stack in teaching order; batch timings (morning / afternoon / evening) use the same syllabus.
      </p>

      <div className="relative pl-6 sm:pl-8">
        <div
          className="absolute left-[11px] sm:left-[13px] top-6 bottom-6 w-0.5 rounded-full course-roadmap-line"
          style={{ background: `linear-gradient(180deg, ${accent}40, ${accent}, ${accent}40)` }}
        />
        <div
          className="absolute left-[11px] sm:left-[13px] top-6 bottom-6 w-0.5 rounded-full course-roadmap-line-fill"
          style={{ background: accent }}
        />

        {config.phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="relative course-roadmap-phase mb-10 last:mb-0">
            <div
              className="absolute left-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 course-roadmap-dot"
              style={{
                left: '-2px',
                borderColor: accent,
                background: 'var(--background)',
                animationDelay: `${phaseIndex * 0.35}s`,
              }}
            />
            <div
              className="absolute left-[5px] sm:left-[6px] top-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full course-roadmap-dot-inner"
              style={{ background: accent, animationDelay: `${phaseIndex * 0.35 + 0.1}s` }}
            />

            <div
              className="course-roadmap-card border rounded-lg p-4 sm:p-5 bg-black/40"
              style={{ borderColor: `${accent}40`, animationDelay: `${phaseIndex * 0.35 + 0.15}s` }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="text-[10px] sm:text-xs font-mono font-semibold px-2 py-0.5 rounded"
                  style={{ color: accent, background: `${accent}20` }}
                >
                  {phase.label}
                </span>
                <span className="text-sm font-medium text-white/90">{phase.title}</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-white/70">
                {phase.topics.map((topic, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 course-roadmap-bullet"
                    style={{ animationDelay: `${phaseIndex * 0.35 + 0.2 + i * 0.05}s` }}
                  >
                    <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full" style={{ background: accent }} />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6 course-roadmap-end" style={{ animationDelay: '0.8s' }}>
        <span className="text-xs font-mono px-3 py-1 rounded-full border" style={{ color: accent, borderColor: `${accent}50` }}>
          → REAL SOFTWARE ENGINEER
        </span>
      </div>
    </div>
  );
}

export function ProgramRoadmap() {
  return <RoadmapFlow config={PROGRAM_ROADMAP} />;
}

/** @deprecated Use ProgramRoadmap — kept for any stale imports */
export function PythonRoadmap() {
  return <ProgramRoadmap />;
}

/** @deprecated Use ProgramRoadmap — kept for any stale imports */
export function AndroidRoadmap() {
  return <ProgramRoadmap />;
}
