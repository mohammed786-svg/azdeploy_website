'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LaunchCountdown from '@/components/LaunchCountdown';
import RadarLoader from '@/components/RadarLoader';

const COUNTDOWN_SEEN_KEY = 'azdeploy_countdown_seen';

export default function RootPage() {
  const router = useRouter();
  const [showCountdown, setShowCountdown] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = localStorage.getItem(COUNTDOWN_SEEN_KEY) === 'true';
    if (seen) {
      router.replace('/home');
      return;
    }
    setShowCountdown(true);
  }, [router]);

  const onCountdownComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COUNTDOWN_SEEN_KEY, 'true');
    }
    router.replace('/home');
  };

  if (showCountdown === null) {
    return <RadarLoader />;
  }

  return <LaunchCountdown onComplete={onCountdownComplete} />;
}
