"use client";

import React, { useState, useEffect } from 'react';
import { AmbianceGridClient } from '@/components/ambiance-grid-client';
import { Header } from '@/components/header';
import { SplashScreen } from '@/components/splash-screen';
import { ambiancePacks } from '@/data/ambiance';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Splash screen duration
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }
  
  const freePacks = ambiancePacks.filter(p => !p.isPremium);
  const premiumPacks = ambiancePacks.filter(p => p.isPremium);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        
        <div className="mb-12">
           <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4 font-headline">
            Free Escapes
          </h2>
          <AmbianceGridClient packs={freePacks} gridId="free" />
        </div>

        <div>
           <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4 font-headline">
            Premium Escapes
          </h2>
          <AmbianceGridClient packs={premiumPacks} gridId="premium" />
        </div>

      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Immersive Escapes. All Rights Reserved.
      </footer>
    </div>
  );
}
