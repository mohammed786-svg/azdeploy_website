'use client';

const PYTHON_ROADMAP = {
  title: 'Python Full Stack',
  duration: '6 months',
  accent: '#00d4ff',
  phases: [
    {
      label: 'Month 1 – 3',
      title: 'Foundation & core learning',
      topics: [
        'Python fundamentals, OOP, data structures & algorithms',
        'Django / Flask: models, views, templates, auth, REST APIs',
        'Database: PostgreSQL/MySQL, ORM, migrations',
        'Frontend: HTML/CSS/JS, templates, state management',
        'Version control: Git, branching, collaboration',
        'Linux basics, command line, deployment concepts',
      ],
    },
    {
      label: 'Month 4 – 6',
      title: 'Practice · real projects · mock interviews',
      topics: [
        'Build & deploy 2–3 real full-stack projects (end-to-end)',
        'Gunicorn, VPS server setup, local machine setup & deployment',
        'Code reviews & one-on-one mentorship on your code',
        'Resume building, LinkedIn, portfolio site',
        'Mock technical & HR interviews with detailed feedback',
        'Placement prep: company patterns, negotiation',
      ],
    },
  ],
};

const ANDROID_ROADMAP = {
  title: 'Android Developer',
  duration: '5 months',
  accent: '#00e5cc',
  phases: [
    {
      label: 'Month 1 – 3',
      title: 'Foundation & core learning',
      topics: [
        'Kotlin & Java fundamentals, OOP, collections',
        'Android Studio, layouts, Material Design, Jetpack Compose',
        'Activities, fragments, navigation, lifecycle',
        'Room database, Retrofit, REST APIs, coroutines',
        'MVVM, repository pattern, dependency injection',
        'Testing basics, debugging, performance',
      ],
    },
    {
      label: 'Month 4 – 5',
      title: 'Practice · real apps · mock interviews',
      topics: [
        'Build & publish 2+ real apps on Play Store',
        'Exact cloning of UI provided by UI/UX, animations, accessibility',
        'Background work: WorkManager, notifications',
        'Code reviews & one-on-one mentorship on your apps',
        'Resume, portfolio, GitHub profile',
        'Mock interviews (technical + HR) & placement prep',
      ],
    },
  ],
};

type RoadmapConfig = typeof PYTHON_ROADMAP;

function RoadmapFlow({ config, id }: { config: RoadmapConfig; id: string }) {
  const accent = config.accent;

  return (
    <div className="course-roadmap relative">
      <h3 className="text-lg font-mono font-semibold text-center mb-2 text-white/90">
        {config.title} — {config.duration} roadmap
      </h3>
      <p className="text-center text-xs text-white/50 font-mono mb-8">Day 1 → Job ready. What makes us different.</p>

      <div className="relative pl-6 sm:pl-8">
        {/* Vertical flow line */}
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
            {/* Node dot */}
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

            <div className="course-roadmap-card border rounded-lg p-4 sm:p-5 bg-black/40" style={{ borderColor: `${accent}40`, animationDelay: `${phaseIndex * 0.35 + 0.15}s` }}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] sm:text-xs font-mono font-semibold px-2 py-0.5 rounded" style={{ color: accent, background: `${accent}20` }}>
                  {phase.label}
                </span>
                <span className="text-sm font-medium text-white/90">{phase.title}</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-white/70">
                {phase.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 course-roadmap-bullet" style={{ animationDelay: `${phaseIndex * 0.35 + 0.2 + i * 0.05}s` }}>
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
          → JOB READY
        </span>
      </div>
    </div>
  );
}

export function PythonRoadmap() {
  return <RoadmapFlow config={PYTHON_ROADMAP} id="python" />;
}

export function AndroidRoadmap() {
  return <RoadmapFlow config={ANDROID_ROADMAP} id="android" />;
}
