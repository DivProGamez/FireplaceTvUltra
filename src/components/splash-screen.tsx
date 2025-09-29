// src/components/splash-screen.tsx
"use client";
import { Sparkles } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
      <div className="relative flex items-center justify-center">
         <Sparkles className="w-24 h-24 text-primary animate-pulse" />
         <h1 className="absolute text-2xl font-bold font-headline text-primary-foreground animate-pulse">
            Immersive
         </h1>
      </div>
      <p className="text-muted-foreground mt-4 animate-pulse">Loading Your Escape...</p>
    </div>
  );
}
