"use client";

import { usePremium } from "@/context/premium-context";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { useAppFocus } from "@/context/app-focus-context";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";


export function Header() {
  const { isPremiumUnlocked, unlockPremium } = usePremium();
  const { setFocusableElements, activeElement, setFocus } = useAppFocus();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-focusable-header]'));
    setFocusableElements(prev => ({...prev, header: elements}));
  }, [setFocusableElements]);

  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="text-xl font-bold font-headline text-primary">
        Immersive Escapes
      </div>
      <Button
        id="unlock-btn"
        data-focusable-header
        onClick={unlockPremium}
        disabled={isPremiumUnlocked}
        onFocus={() => setFocus('unlock-btn')}
        className={cn(
          "font-bold",
          activeElement === 'unlock-btn' && "ring-2 ring-ring ring-offset-2 ring-offset-background"
        )}
        variant="outline"
      >
        <Sparkles className="mr-2" />
        {isPremiumUnlocked ? "Premium Unlocked" : "Unlock All"}
      </Button>
    </header>
  );
}
