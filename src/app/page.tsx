import { AmbianceGridClient } from '@/components/ambiance-grid-client';
import { Header } from '@/components/header';
import { ambiancePacks } from '@/data/ambiance';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6 font-headline">
          Choose Your Escape
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8">
          Select an immersive experience to help you relax, focus, or drift off to
          sleep. Optimized for your TV and remote control.
        </p>
        <AmbianceGridClient packs={ambiancePacks} />
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Immersive Escapes. All Rights Reserved.
      </footer>
    </div>
  );
}
