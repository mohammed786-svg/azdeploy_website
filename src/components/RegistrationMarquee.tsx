'use client';

export default function RegistrationMarquee() {
  const text = " /// UPDATES: REGISTRATION OPEN ! | STAGE SET | SECURE YOUR SPOT | PYTHON_FULL_STACK | ANDROID_DEV | LIMITED SEATS — 25 PER BATCH | FIRST 20 GET 30% OFF | CONTACT: +91 82965 65587 | ENROLL NOW ";

  return (
    <div className="w-full overflow-hidden border-t border-[#00d4ff]/20 hud-bg">
      <div className="marquee-wrap py-2 px-2 sm:px-0">
        <div className="marquee-content">
          <span className="font-mono text-[10px] sm:text-xs text-[#00d4ff]/90 whitespace-nowrap">
            {text.repeat(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
