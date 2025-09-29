"use client";

import type { AmbiancePack } from "@/data/ambiance";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { usePremium } from "@/context/premium-context";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Sparkles } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAppFocus } from "@/context/app-focus-context";
import { useRouter } from "next/navigation";


export function AmbianceGridClient({ packs, gridId }: { packs: AmbiancePack[], gridId: string }) {
  const { isPremiumUnlocked, unlockPremium } = usePremium();
  const [showPremiumDialog, setShowPremiumDialog] = React.useState(false);
  const { setFocus, activeElement, setFocusableElements } = useAppFocus();
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  useEffect(() => {
    if (gridRef.current) {
      const elements = Array.from(
        gridRef.current.querySelectorAll<HTMLAnchorElement>('[data-focusable-grid-item]')
      );
      setFocusableElements(prev => ({...prev, [gridId]: elements}));
    }
  }, [packs, gridId, setFocusableElements]);


  const handlePackClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    pack: AmbiancePack
  ) => {
    if (pack.isPremium && !isPremiumUnlocked) {
      e.preventDefault();
      setShowPremiumDialog(true);
      // Set focus to the dialog's default button when it opens
      setTimeout(() => setFocus('alert-cancel'), 0);
    }
  };

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {packs.map((pack, index) => {
          const isLocked = pack.isPremium && !isPremiumUnlocked;
          const image = PlaceHolderImages.find(
            (img) => img.id === pack.thumbnailUrlId
          );
          const elementId = `${gridId}-${index}`;

          return (
            <Link
              key={pack.id}
              id={elementId}
              data-focusable-grid-item
              href={`/ambiance/${pack.id}`}
              onClick={(e) => handlePackClick(e, pack)}
              onFocus={() => setFocus(elementId)}
              aria-label={
                isLocked
                  ? `${pack.title} (Premium, Locked)`
                  : pack.title
              }
              className={cn(
                "group focus:outline-none rounded-lg transition-transform duration-200 ease-in-out",
                 activeElement === elementId ? "scale-110 ring-4 ring-primary ring-offset-4 ring-offset-background z-10" : "scale-100"
              )}
            >
              <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out border-2 border-transparent group-hover:border-primary">
                <CardContent className="p-0 relative">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={image?.imageUrl || "/placeholder.png"}
                      alt={image?.description || pack.title}
                      width={400}
                      height={225}
                      data-ai-hint={image?.imageHint}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-yellow-400" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "p-3 bg-card-foreground/5 dark:bg-card/60 backdrop-blur-sm",
                      isLocked && "text-muted-foreground"
                    )}
                  >
                    <h3 className="font-bold text-sm font-headline truncate">
                      {pack.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {pack.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <AlertDialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              Unlock Premium
            </AlertDialogTitle>
            <AlertDialogDescription>
              Get access to this and all other premium soundscapes for a one-time payment of <strong className="text-foreground">$4.99</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-focusable-alert
              onFocus={() => setFocus('alert-cancel')}
              id="alert-cancel"
               className={cn(activeElement === 'alert-cancel' && 'ring-2 ring-primary')}
            >Maybe Later</AlertDialogCancel>
            <AlertDialogAction
              data-focusable-alert
              id="alert-action"
              onFocus={() => setFocus('alert-action')}
              className={cn(activeElement === 'alert-action' && 'ring-2 ring-primary')}
              onClick={() => {
                unlockPremium();
                setShowPremiumDialog(false);
              }}
            >
              Unlock Now for $4.99
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
