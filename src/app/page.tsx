"use client";

import React, { useState, useEffect } from 'react';
import { AmbianceGridClient } from '@/components/ambiance-grid-client';
import { Header } from '@/components/header';
import { SplashScreen } from '@/components/splash-screen';
import { ambiancePacks } from '@/data/ambiance';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppFocus } from '@/context/app-focus-context';
import { cn } from '@/lib/utils';
import type { AmbiancePack } from '@/data/ambiance';

type Filter = "all" | "free" | "premium";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [filteredPacks, setFilteredPacks] = useState<AmbiancePack[]>(ambiancePacks);
  const { setFocusableElements, activeElement, setFocus } = useAppFocus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500); // Splash screen duration
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let packsToShow = ambiancePacks;
    if (filter === 'free') {
      packsToShow = ambiancePacks.filter(p => !p.isPremium);
    } else if (filter === 'premium') {
      packsToShow = ambiancePacks.filter(p => p.isPremium);
    }
    setFilteredPacks(packsToShow);
  }, [filter]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-focusable-tab]'));
    setFocusableElements(prev => ({...prev, tabs: elements}));
  }, [setFocusableElements]);


  if (loading) {
    return <SplashScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Welcome to Immersive Escapes
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Find your focus and peace with our collection of soundscapes.
          </p>
        </div>

        <div className="flex justify-center mb-8">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
                <TabsList>
                    <TabsTrigger 
                      value="all" 
                      id="tab-all"
                      data-focusable-tab
                      onFocus={() => setFocus('tab-all')}
                      className={cn(activeElement === 'tab-all' && 'ring-2 ring-primary')}
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      value="free" 
                      id="tab-free"
                      data-focusable-tab
                      onFocus={() => setFocus('tab-free')}
                      className={cn(activeElement === 'tab-free' && 'ring-2 ring-primary')}
                    >
                      Free
                    </TabsTrigger>
                    <TabsTrigger 
                      value="premium" 
                      id="tab-premium"
                      data-focusable-tab
                      onFocus={() => setFocus('tab-premium')}
                      className={cn(activeElement === 'tab-premium' && 'ring-2 ring-primary')}
                    >
                      Premium
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        
        <AmbianceGridClient packs={filteredPacks} gridId="main-grid" />

      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Immersive Escapes. All Rights Reserved.
      </footer>
    </div>
  );
}
