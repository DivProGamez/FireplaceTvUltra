import { PlayerClient } from '@/components/player-client';
import { ambiancePacks } from '@/data/ambiance';
import { usePremium } from '@/context/premium-context';
import { notFound } from 'next/navigation';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// This is a server component to fetch data, but it needs to check premium status.
// For this simulation, we make a server component that renders a client component which then checks auth.
// A more robust solution might use middleware or server-side auth checks.
export default function AmbiancePage({ params }: { params: { id: string } }) {
  const pack = ambiancePacks.find((p) => p.id === params.id);

  if (!pack) {
    notFound();
  }

  return <PlayerClient pack={pack} />;
}
