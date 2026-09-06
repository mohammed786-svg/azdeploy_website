export const WORKSHOP_CERT_ASSETS = {
  academyLogo: "/color_logo.PNG",
  skillIndiaLogo: "/certificates/skill_india.png",
  signature: "/signature.png",
} as const;

export type WorkshopCertificateData = {
  studentName: string;
  workshopTitle: string;
  workshopSubtitle: string;
  workshopOverview: string;
  workshopDate: string;
  duration: string;
  durationType: string;
  venue: string;
  institutionPartnerName: string;
  institutionPartnerLogoUrl?: string;
};

export const DEFAULT_WORKSHOP_CERTIFICATE: WorkshopCertificateData = {
  studentName: "",
  workshopTitle: "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING",
  workshopSubtitle: "FROM BASICS TO REAL-WORLD APPLICATIONS",
  workshopOverview:
    "This workshop provided hands-on knowledge of AI & ML concepts, including data preprocessing, model building, training, and evaluation using real-world datasets and Python tools.",
  workshopDate: "",
  duration: "",
  durationType: "",
  venue: "",
  institutionPartnerName: "",
  institutionPartnerLogoUrl: "",
};

type Props = {
  data: WorkshopCertificateData;
  className?: string;
};

const NAVY = "#0b1f3f";
const GOLD = "#c9a24d";
const GOLD_DARK = "#9a7b2f";
const PAPER = "#f0ede8";

function GoldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[8mm] w-[8mm] shrink-0 items-center justify-center rounded-full border border-[#e8d49a] bg-gradient-to-br from-[#f4e4b8] via-[#d4af37] to-[#a8841f] text-[#4a3810] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
      {children}
    </span>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-[2.5mm]">
      <GoldIcon>{icon}</GoldIcon>
      <div className="min-w-0 pt-[0.6mm]">
        <p className="wc-body text-[5pt] font-extrabold uppercase leading-none tracking-[0.06em]" style={{ color: GOLD_DARK }}>
          {label}:
        </p>
        <p className="wc-body mt-[1mm] text-[5.8pt] font-bold uppercase leading-snug" style={{ color: NAVY }}>
          {value}
        </p>
      </div>
    </div>
  );
}

function CornerTopLeft() {
  return (
    <svg className="pointer-events-none absolute left-0 top-0 z-[1] h-[44mm] w-[54mm]" viewBox="0 0 220 180" aria-hidden>
      <path d="M0 0 H220 V62 C132 54 78 88 0 132 Z" fill="#0a0a0a" />
      <path d="M0 0 H205 V54 C120 48 70 78 0 116 Z" fill={GOLD} />
    </svg>
  );
}

function CornerBottomRight() {
  return (
    <svg className="pointer-events-none absolute bottom-[13mm] right-0 z-[1] h-[50mm] w-[60mm]" viewBox="0 0 240 200" aria-hidden>
      <path d="M240 200 H0 V138 C92 146 148 112 240 68 Z" fill="#0a0a0a" />
      <path d="M240 200 H18 V145 C98 151 150 120 240 86 Z" fill={GOLD} />
    </svg>
  );
}

function GoldSeal() {
  return (
    <div className="pointer-events-none absolute bottom-[10mm] right-[6mm] z-[2] flex h-[32mm] w-[32mm] items-center justify-center">
      <svg className="absolute inset-0 h-full w-full drop-shadow-md" viewBox="0 0 140 140" aria-hidden>
        <circle cx="70" cy="70" r="62" fill="url(#wcSealGold)" />
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i * Math.PI * 2) / 28;
          return (
            <line
              key={i}
              x1={70 + Math.cos(a) * 54}
              y1={70 + Math.sin(a) * 54}
              x2={70 + Math.cos(a) * 66}
              y2={70 + Math.sin(a) * 66}
              stroke="#8f6f1f"
              strokeWidth="2.5"
            />
          );
        })}
        <circle cx="70" cy="70" r="40" fill={NAVY} />
        <defs>
          <linearGradient id="wcSealGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d78c" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9a7b1a" />
          </linearGradient>
        </defs>
      </svg>
      <p className="wc-body relative z-10 max-w-[20mm] text-center text-[4pt] font-extrabold uppercase leading-[1.15] tracking-[0.05em] text-white">
        Empowering Skills Building Futures
      </p>
      <div className="absolute -bottom-[1.5mm] left-1/2 z-10 flex -translate-x-1/2 gap-[1mm]">
        <span className="h-[5.5mm] w-[3.2mm] -rotate-[18deg] rounded-[1px] border border-[#d4af37]/50" style={{ background: NAVY }} />
        <span className="h-[5.5mm] w-[3.2mm] rotate-[18deg] rounded-[1px] border border-[#d4af37]/50" style={{ background: NAVY }} />
      </div>
    </div>
  );
}

const FEATURES = [
  {
    label: "Practical Learning",
    icon: (
      <svg className="h-[3mm] w-[3mm]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
      </svg>
    ),
  },
  {
    label: "Expert Mentors",
    icon: (
      <svg className="h-[3mm] w-[3mm]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    label: "Hands-on Experience",
    icon: (
      <svg className="h-[3mm] w-[3mm]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M9.4 16.6L4.8 12l-1.4 1.4L9.4 19 21 7.4 19.6 6l-10.2 10.6z" />
      </svg>
    ),
  },
  {
    label: "Skill Development",
    icon: (
      <svg className="h-[3mm] w-[3mm]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
      </svg>
    ),
  },
  {
    label: "Career Growth",
    icon: (
      <svg className="h-[3mm] w-[3mm]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
      </svg>
    ),
  },
] as const;

/** Pure CSS workshop certificate — A4 landscape, no background image. */
export default function WorkshopCertificateDocument({ data, className = "" }: Props) {
  return (
    <div
      className={`workshop-cert-bg relative flex h-full w-full flex-col overflow-hidden ${className}`}
      style={{ background: PAPER, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", color: NAVY }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Great+Vibes&family=Montserrat:wght@500;600;700;800&display=swap');
            .wc-body { font-family: 'Montserrat', system-ui, sans-serif; }
            .wc-title { font-family: 'Cinzel', Georgia, serif; }
            .wc-script { font-family: 'Great Vibes', 'Brush Script MT', cursive; }
            .wc-img-dark-bg { background: #fff; mix-blend-mode: multiply; }
          `,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(0,0,0,0.015) 7px, rgba(0,0,0,0.015) 8px)",
        }}
      />

      <CornerTopLeft />
      <CornerBottomRight />
      <GoldSeal />

      {/* Header */}
      <header className="wc-body relative z-10 grid grid-cols-[1fr_auto] items-start gap-[4mm] px-[9mm] pb-[1mm] pt-[6mm]">
        <div className="min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WORKSHOP_CERT_ASSETS.academyLogo}
            alt="AZ Deploy Academy"
            className="h-[16mm] w-auto max-w-[76mm] object-contain object-left"
          />
          <p className="mt-[0.8mm] text-[4.6pt] font-medium tracking-[0.2em] text-[#6f675c]">
            • LEARN. • BUILD. • DEPLOY. • SUCCEED. •
          </p>
        </div>

        <div className="shrink-0 text-center">
          <p className="text-[4.6pt] font-semibold uppercase tracking-[0.14em] text-[#6f675c]">In collaboration with</p>
          <div className="mx-auto mt-[1mm] flex h-[11mm] w-[44mm] items-center justify-center rounded bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WORKSHOP_CERT_ASSETS.skillIndiaLogo}
              alt="Skill India"
              className="wc-img-dark-bg h-[9mm] w-auto max-w-full object-contain"
            />
          </div>
          <div className="mt-[1.5mm] flex min-h-[18mm] w-[52mm] flex-col items-center justify-center rounded-[3px] border border-[#d2ccc2] bg-white px-[2mm] py-[1.5mm] text-center">
            {data.institutionPartnerLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.institutionPartnerLogoUrl}
                alt={data.institutionPartnerName || "Institution partner"}
                className="mb-[0.5mm] max-h-[9mm] max-w-full object-contain"
              />
            ) : null}
            {data.institutionPartnerName ? (
              <p className="text-[4.6pt] font-bold uppercase leading-tight tracking-wide" style={{ color: NAVY }}>
                {data.institutionPartnerName}
              </p>
            ) : (
              <p className="text-[4.6pt] text-[#94a3b8]">Institution logo & name</p>
            )}
            <p className="mt-[0.8mm] text-[4pt] font-bold uppercase tracking-[0.12em]" style={{ color: GOLD_DARK }}>
              Institution Partner
            </p>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="wc-body relative z-10 flex min-h-0 flex-1 px-[7mm]">
        <aside className="flex w-[48mm] shrink-0 flex-col gap-[4.5mm] pr-[3mm] pt-[1mm]">
          <DetailRow
            label="Date"
            value={data.workshopDate}
            icon={
              <svg className="h-[3.4mm] w-[3.4mm]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <DetailRow
            label="Duration"
            value={data.duration}
            icon={
              <svg className="h-[3.4mm] w-[3.4mm]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <DetailRow
            label="Duration Type"
            value={data.durationType}
            icon={
              <svg className="h-[3.4mm] w-[3.4mm]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <DetailRow
            label="Venue"
            value={data.venue}
            icon={
              <svg className="h-[3.4mm] w-[3.4mm]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col items-center px-[2mm] pt-[0.5mm] text-center">
          <h1 className="wc-title text-[23pt] font-bold uppercase leading-none tracking-[0.08em] text-[#111]">Certificate</h1>
          <div className="mt-[1.5mm] flex items-center gap-[3mm]">
            <span className="h-[0.55mm] w-[15mm] rounded-full" style={{ background: GOLD }} />
            <span className="wc-title text-[8pt] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
              of Participation
            </span>
            <span className="h-[0.55mm] w-[15mm] rounded-full" style={{ background: GOLD }} />
          </div>

          <p className="mt-[4mm] text-[6.8pt] font-medium text-[#4a5568]">This is to certify that</p>

          {data.studentName ? (
            <p className="wc-script mt-[1.5mm] text-[30pt] leading-none text-[#2b5aa0]">{data.studentName}</p>
          ) : (
            <p className="wc-script mt-[1.5mm] text-[22pt] text-[#94a3b8]">Student Name</p>
          )}

          <p className="mt-[3.5mm] text-[6.8pt] font-medium text-[#4a5568]">has successfully participated in the</p>

          <div className="mt-[2.5mm] flex w-full max-w-[155mm] items-center gap-[2mm]">
            <span className="h-[0.45mm] flex-1 rounded-full" style={{ background: GOLD }} />
            <span className="text-[6.8pt] font-extrabold uppercase tracking-[0.16em] text-[#c47a1a]">Workshop on</span>
            <span className="h-[0.45mm] flex-1 rounded-full" style={{ background: GOLD }} />
          </div>

          {data.workshopTitle ? (
            <h2 className="mt-[2mm] max-w-[165mm] text-[10pt] font-extrabold uppercase leading-tight tracking-[0.03em]" style={{ color: NAVY }}>
              {data.workshopTitle}
            </h2>
          ) : null}

          {data.workshopSubtitle ? (
            <p className="mt-[1.5mm] max-w-[155mm] text-[7.2pt] font-bold uppercase tracking-[0.05em] text-[#1e3a6e]">
              {data.workshopSubtitle}
            </p>
          ) : null}

          {data.workshopOverview ? (
            <div className="mt-[3.5mm] max-w-[148mm] border-t border-[#e2d8c8] pt-[2.5mm]">
              <p className="text-[6.2pt] font-extrabold uppercase tracking-[0.1em]" style={{ color: GOLD_DARK }}>
                Workshop Overview:
              </p>
              <p className="mt-[1.5mm] text-[6pt] leading-[1.5] text-[#2d3748]">{data.workshopOverview}</p>
            </div>
          ) : null}
        </main>
      </div>

      {/* Signatures */}
      <div className="wc-body relative z-10 grid grid-cols-[1fr_auto_1fr] items-end gap-[3mm] px-[9mm] pb-[1mm] pt-[1mm]">
        <div className="min-w-0 max-w-[62mm] justify-self-start">
          <div className="inline-block rounded bg-white px-[1mm]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WORKSHOP_CERT_ASSETS.signature}
              alt="Signature"
              className="wc-img-dark-bg h-[11mm] w-auto max-w-[56mm] object-contain object-left"
            />
          </div>
          <p className="mt-[0.5mm] border-t border-[#c8bfb0] pt-[0.8mm] text-[4.6pt] font-extrabold uppercase leading-tight" style={{ color: NAVY }}>
            Mr. Mohammed Shaheed R Maniyar
          </p>
          <p className="text-[4pt] font-semibold uppercase tracking-[0.06em] text-[#6b7280]">Founder & CEO, AZDeploy Academy</p>
        </div>

        <div className="flex flex-col items-center pb-[1.5mm] text-[#d4af37]">
          <svg className="h-[10mm] w-[17mm]" viewBox="0 0 90 44" fill="currentColor" aria-hidden>
            <path d="M45 2 C28 9 14 20 10 34 C22 29 35 27 45 31 C55 27 68 29 80 34 C76 20 62 9 45 2Z" opacity="0.9" />
            <circle cx="45" cy="38" r="2.8" />
          </svg>
        </div>

        <div className="min-w-0 max-w-[56mm] justify-self-end text-right">
          <div className="ml-auto h-[10mm] w-[34mm] border-b border-[#9ca3af]" />
          <p className="mt-[0.8mm] text-[4.6pt] font-extrabold uppercase leading-tight" style={{ color: NAVY }}>
            Authorized Signature
          </p>
          <p className="text-[4pt] font-semibold uppercase tracking-[0.06em] text-[#6b7280]">Institution Partner</p>
        </div>
      </div>

      {/* Feature bar */}
      <div className="wc-body relative z-10 border-y border-[#e4ddd2] bg-[#f7f4ee]/95 px-[5mm] py-[2mm]">
        <ul className="flex flex-wrap items-center justify-center gap-x-[5.5mm] gap-y-[1mm]">
          {FEATURES.map(({ label, icon }) => (
            <li key={label} className="flex items-center gap-[1.5mm] text-[4.1pt] font-bold uppercase tracking-[0.05em] text-[#4a5568]">
              <span className="inline-flex h-[4.8mm] w-[4.8mm] items-center justify-center rounded-full border border-[#d4af37] bg-white text-[#b8860b]">
                {icon}
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <footer className="wc-body relative z-10 flex flex-wrap items-center justify-center gap-x-[9mm] gap-y-[1mm] bg-[#0a0a0a] px-[6mm] py-[2.5mm] text-[5pt] font-semibold text-white">
        <span className="inline-flex items-center gap-[1.5mm]">
          <svg className="h-[3mm] w-[3mm]" style={{ color: GOLD }} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
          </svg>
          82965 65587
        </span>
        <span className="hidden h-[3.5mm] w-px bg-[#d4af37]/60 sm:inline-block" aria-hidden />
        <span className="inline-flex items-center gap-[1.5mm]">
          <svg className="h-[3mm] w-[3mm]" style={{ color: GOLD }} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.03 8.03 0 015.08 16zm2.95-8H5.08a8.03 8.03 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
          </svg>
          www.azdeploy.com
        </span>
        <span className="hidden h-[3.5mm] w-px bg-[#d4af37]/60 sm:inline-block" aria-hidden />
        <span className="inline-flex items-center gap-[1.5mm]">
          <svg className="h-[3mm] w-[3mm]" style={{ color: GOLD }} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
          </svg>
          Belagavi, Karnataka
        </span>
      </footer>
    </div>
  );
}
