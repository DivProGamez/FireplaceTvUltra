import { PlayerClient } from '@/components/player-client';
import { ambiancePacks } from '@/data/ambiance';
import { notFound } from 'next/navigation';

// This is a server component to fetch data.
// The client component `PlayerClient` will handle the logic for locked content.
export default function AmbiancePage({ params }: { params: { id: string } }) {
  const pack = ambiancePacks.find((p) => p.id === params.id);

  if (!pack) {
    notFound();
  }

  return <PlayerClient pack={pack} />;
}
