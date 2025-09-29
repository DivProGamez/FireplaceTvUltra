"use client";

import { Sparkles } from "lucide-react";

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background animate-fade-out pointer-events-none">
      <div className="relative flex flex-col items-center justify-center gap-4">
        <Sparkles className="w-24 h-24 text-primary animate-subtle-pulse" />
        <h1 className="text-4xl font-bold font-headline text-primary-foreground animate-fade-in-slow">
          Immersive Escapes
        </h1>
      </div>
       <style jsx>{`
        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes fade-in-slow {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
         @keyframes subtle-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        .animate-fade-out {
          animation: fade-out 2.5s ease-in-out forwards;
        }
        .animate-fade-in-slow {
            animation: fade-in-slow 1.5s ease-in-out forwards;
        }
        .animate-subtle-pulse {
            animation: subtle-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
