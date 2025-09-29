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
import React from "react";
import { cn } from "@/lib/utils";

export function AmbianceGridClient({ packs }: { packs: AmbiancePack[] }) {
  const { isPremiumUnlocked, unlockPremium } = usePremium();
  const [showPremiumDialog, setShowPremiumDialog] = React.useState(false);

  const handlePackClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    pack: AmbiancePack
  ) => {
    if (pack.isPremium && !isPremiumUnlocked) {
      e.preventDefault();
      setShowPremiumDialog(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packs.map((pack) => {
          const isLocked = pack.isPremium && !isPremiumUnlocked;
          const image = PlaceHolderImages.find(
            (img) => img.id === pack.thumbnailUrlId
          );
          return (
            <Link
              key={pack.id}
              href={`/ambiance/${pack.id}`}
              onClick={(e) => handlePackClick(e, pack)}
              aria-label={
                isLocked
                  ? `${pack.title} (Premium, Locked)`
                  : pack.title
              }
              className="group focus-visible:outline-none"
            >
              <Card className="overflow-hidden h-full transition-all duration-300 ease-in-out hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <CardContent className="p-0 relative">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={image?.imageUrl || "/placeholder.png"}
                      alt={image?.description || pack.title}
                      width={600}
                      height={400}
                      data-ai-hint={image?.imageHint}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="w-10 h-10 text-primary-foreground/80" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "p-4 bg-card-foreground/5 dark:bg-card/60 backdrop-blur-sm",
                      isLocked && "text-muted-foreground"
                    )}
                  >
                    <h3 className="font-bold font-headline truncate">
                      {pack.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
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
              Unlock Premium Content
            </AlertDialogTitle>
            <AlertDialogDescription>
              This is a premium ambiance pack. Unlock all content to enjoy this
              and many other exclusive soundscapes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                unlockPremium();
                setShowPremiumDialog(false);
              }}
            >
              Unlock Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
