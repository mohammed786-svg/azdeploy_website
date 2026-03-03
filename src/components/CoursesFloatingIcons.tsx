'use client';

const FLOATING_ICONS = [
  /* Left side of cards */
  { name: 'Python', delay: 0, duration: 20, reverse: false, x: '2%', y: '18%' },
  { name: 'Django', delay: 3.5, duration: 25, reverse: false, x: '2%', y: '38%' },
  { name: 'Postgres', delay: 1.2, duration: 21, reverse: true, x: '2%', y: '58%' },
  { name: 'Node', delay: 0.8, duration: 20, reverse: true, x: '2%', y: '78%' },
  /* Right side of cards */
  { name: 'React', delay: 2, duration: 24, reverse: true, x: '98%', y: '18%' },
  { name: 'Android', delay: 0.5, duration: 21, reverse: true, x: '98%', y: '38%' },
  { name: 'Kotlin', delay: 1, duration: 19, reverse: true, x: '98%', y: '58%' },
  { name: 'Java', delay: 1, duration: 22, reverse: false, x: '98%', y: '78%' },
  /* Top row */
  { name: 'Docker', delay: 2.5, duration: 23, reverse: false, x: '18%', y: '2%' },
  { name: 'Nginx', delay: 2, duration: 22, reverse: false, x: '50%', y: '2%' },
  { name: 'Linux', delay: 3, duration: 18, reverse: true, x: '82%', y: '2%' },
  /* Bottom row (around coming soon) */
  { name: 'Ubuntu', delay: 1.5, duration: 26, reverse: false, x: '25%', y: '98%' },
  { name: 'Nginx', delay: 1, duration: 22, reverse: true, x: '75%', y: '98%' },
];

function IconPython({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.36-.1.34-.07.3-.04.24-.02.17v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.02h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05z" />
    </svg>
  );
}

function IconReact({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.236-2.235 2.236 2.236 0 0 1 2.235 2.235zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.092-1.106.276-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.184.69.275 1.102.275 1.342 0 3.104-.96 4.888-2.624 1.78 1.654 3.543 2.603 4.888 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.183-.688-.275-1.1-.275z" />
    </svg>
  );
}

function IconJava({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.851 18.56s-.917.534.653.714c1.902.172 2.874.117 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.116-7.942-1.218" />
    </svg>
  );
}

function IconLinux({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.413 1.684-.347 2.455.106 1.222.592 2.381 1.332 3.298.723.995 1.752 1.807 2.956 2.346 1.267.563 2.655.863 4.034.863 1.395 0 2.792-.293 4.076-.878 1.21-.541 2.246-1.348 3.004-2.345.754-.992 1.268-2.156 1.389-3.383.071-.769-.054-1.621-.327-2.451-.585-1.769-1.817-3.457-2.698-4.504-.754-1.065-.981-1.925-1.058-3.015-.065-1.491.944-5.965-3.182-6.298-.165-.013-.325-.021-.48-.021z" />
    </svg>
  );
}

function IconUbuntu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.001 0C5.359.028.028 5.359 0 12.001c.028 6.642 5.359 11.973 12.001 12 6.642-.027 11.973-5.358 12-12 .027-6.642-5.358-11.973-12-12z" />
    </svg>
  );
}

function IconAndroid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.523 2.332A1.747 1.747 0 0 0 16.255 2c-.593 0-1.124.236-1.523.61A4.992 4.992 0 0 0 12 4.028a4.992 4.992 0 0 0-2.732-1.418A1.747 1.747 0 0 0 7.745 2c-.593 0-1.124.236-1.523.61-1.407 1.267-2.384 3.165-2.796 5.423H2.074A1.01 1.01 0 0 0 1.06 8.9l.893 15.102c.054.457.435.81.901.81h6.292a.994.994 0 0 0 .994-.994v-5.242h2.92v5.242c0 .549.445.994.994.994h6.292a.994.994 0 0 0 .901-.81L22.94 8.9a1.01 1.01 0 0 0-1.014-1.145h-1.352c-.412-2.258-1.389-4.156-2.796-5.423z" />
    </svg>
  );
}

function IconDocker({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.983 10.642h2.794v2.748h-2.794zm-3.587 0h2.794v2.748h-2.794zm-3.586 0h2.794v2.748H6.81zm7.173-3.587h2.794v2.748h-2.794zM6.81 7.055h2.794v2.748H6.81zm-3.586 0h2.794v2.748H3.224zm14.348 0h2.794v2.748h-2.794z" />
    </svg>
  );
}

function IconKotlin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M1.5 2.5v19L12 14l10.5 7.5V2.5L12 10L1.5 2.5z" />
    </svg>
  );
}

function IconDjango({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.009-7.288-6.26 0-4.04 2.744-6.526 7.06-6.526.64 0 1.22.05 1.75.146V0z" />
    </svg>
  );
}

function IconNode({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.564-.203.678-.25 1.298-.604.065-.037.151-.023.218.028l2.256 1.339a.29.29 0 0 0 .272 0l8.795-5.076a.29.29 0 0 0 .135-.247V6.921a.284.284 0 0 0-.135-.243l-8.791-5.072a.278.278 0 0 0-.271 0L3.075 6.68a.284.284 0 0 0-.135.242v10.15a.29.29 0 0 0 .135.247l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.255-.253h1.115c.14 0 .255.111.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.505 0-.909 0-2.026-.551L2.28 18.675a1.857 1.857 0 0 1-.922-1.606V6.921c0-.659.353-1.275.922-1.605l8.795-5.082a1.93 1.93 0 0 1 1.846 0l8.794 5.082c.57.33.924.946.924 1.605v10.148c0 .659-.353 1.273-.922 1.605l-8.795 5.078a1.857 1.857 0 0 1-.924.247z" />
    </svg>
  );
}

function IconNginx({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0L1.75 6v12L12 24l10.25-6V6L12 0zm0 2.333l8.5 5v9.334L12 21.667l-8.5-4.999V7.333L12 2.333z" />
    </svg>
  );
}

function IconPostgres({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C6.324 0 1.5 2.25 1.5 6.75v10.5C1.5 21.75 6.324 24 12 24s10.5-2.25 10.5-6.75V6.75C22.5 2.25 17.676 0 12 0z" />
    </svg>
  );
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Python: IconPython,
  React: IconReact,
  Java: IconJava,
  Linux: IconLinux,
  Ubuntu: IconUbuntu,
  Android: IconAndroid,
  Docker: IconDocker,
  Kotlin: IconKotlin,
  Django: IconDjango,
  Node: IconNode,
  Nginx: IconNginx,
  Postgres: IconPostgres,
};

export default function CoursesFloatingIcons() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {FLOATING_ICONS.map((item) => {
        const Icon = ICON_MAP[item.name];
        if (!Icon) return null;
        return (
          <div
            key={`${item.name}-${item.x}-${item.y}`}
            className={`absolute w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-[#00d4ff]/20 courses-float-icon ${
              item.reverse ? 'courses-float-rotate-rev' : 'courses-float-rotate'
            }`}
            style={{
              left: item.x,
              top: item.y,
              animationDuration: `${item.duration}s`,
              animationDelay: `${item.delay}s`,
            }}
          >
            <Icon className="w-full h-full" />
          </div>
        );
      })}
    </div>
  );
}
