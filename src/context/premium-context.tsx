// src/context/premium-context.tsx
"use client";

import { useToast } from "@/hooks/use-toast";
import React, { createContext, useContext, useState, useCallback } from "react";

interface PremiumContextType {
  unlockedPacks: string[];
  unlockPack: (packId: string) => void;
  isPackUnlocked: (packId: string) => boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unlockedPacks, setUnlockedPacks] = useState<string[]>([]);
  const { toast } = useToast();

  const unlockPack = useCallback((packId: string) => {
    setUnlockedPacks((prev) => [...prev, packId]);
    toast({
      title: "Successfully Unlocked!",
      description: "You now have access to this Immersive Escape.",
      duration: 5000,
    });
  }, [toast]);
  
  const isPackUnlocked = useCallback((packId: string) => {
    return unlockedPacks.includes(packId);
  }, [unlockedPacks]);

  return (
    <PremiumContext.Provider value={{ unlockedPacks, unlockPack, isPackUnlocked }}>
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
