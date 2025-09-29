"use client";

import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useState, useCallback } from "react";

interface PremiumContextType {
  isPremiumUnlocked: boolean;
  unlockPremium: () => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const { toast } = useToast();

  const unlockPremium = useCallback(() => {
    setIsPremiumUnlocked(true);
    toast({
      title: "Premium Unlocked!",
      description: "You now have access to all Immersive Escapes.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <PremiumContext.Provider value={{ isPremiumUnlocked, unlockPremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
