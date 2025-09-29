"use client";

import { usePremium } from "@/context/premium-context";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export function Header() {
  const { isPremiumUnlocked, unlockPremium } = usePremium();

  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="text-xl font-bold font-headline text-primary">
        Immersive Escapes
      </div>
      <Button
        onClick={unlockPremium}
        disabled={isPremiumUnlocked}
        className="font-bold focus-visible:ring-ring focus-visible:ring-offset-background"
        variant="outline"
      >
        <Sparkles className="mr-2" />
        {isPremiumUnlocked ? "Premium Unlocked" : "Unlock All"}
      </Button>
    </header>
  );
}
