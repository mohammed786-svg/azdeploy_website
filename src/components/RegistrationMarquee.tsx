'use client';

export default function RegistrationMarquee() {
  const text = " /// ONE_ONGOING_PROGRAM · FULL-STACK + AI + DEVOPS · BELAGAVI · BATCHES: 9AM-11AM | 3PM-5PM | 6PM-8PM · CHOOSE_YOUR_FOCUS · FIRST 10: 30% OFF · TOP PERFORMER: MACBOOK PRO · +91 82965 65587 · +91 89712 44513 · +91 73383 60607 · WWW.AZDEPLOY.COM ";

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
