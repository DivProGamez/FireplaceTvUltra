"use client";

import type { AmbiancePack } from "@/data/ambiance";
import { usePremium } from "@/context/premium-context";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { CanvasRenderer } from "./canvas-renderer";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Lock,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppFocus } from "@/context/app-focus-context";

const timerOptions = [
  { label: "Off", value: 0 },
  { label: "15 min", value: 15 * 60 },
  { label: "30 min", value: 30 * 60 },
  { label: "60 min", value: 60 * 60 },
  { label: "120 min", value: 120 * 60 },
];

export function PlayerClient({ pack }: { pack: AmbiancePack }) {
  const { isPackUnlocked } = usePremium();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Start paused
  const [isMuted, setIsMuted] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [timer, setTimer] = useState(0); // in seconds
  const [timerKey, setTimerKey] = useState(Date.now());
  const { activeElement, setFocus, setFocusableElements } = useAppFocus();
  const controlsRef = useRef<HTMLDivElement>(null);

  const isLocked = pack.isPremium && !isPackUnlocked(pack.id);

  const resetControlsTimeout = useCallback(() => {
    setIsControlsVisible(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      setIsControlsVisible(false);
    }, 5000);
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      const elements = Array.from(controlsRef.current.querySelectorAll<HTMLElement>('[data-focusable-player]'));
      // Clear previous focusable groups to avoid conflicts
      setFocusableElements({ player: elements });
      if (elements.length > 0) {
         // Focus play/pause button by default
        setTimeout(() => setFocus(elements.find(el => el.id === 'play-pause-btn')?.id || elements[1].id), 0);
      }
    }
     const handleActivity = (e: Event) => {
      // Prevent keyboard events from hiding controls
      if (e instanceof KeyboardEvent && (e.key.includes('Arrow') || e.key === 'Enter')) return;
      resetControlsTimeout();
    };
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    resetControlsTimeout();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
      setFocusableElements({}); // Clear player focus on unmount
    };
  }, [resetControlsTimeout, setFocusableElements, setFocus]);
  

  useEffect(() => {
    // This just marks the component as ready to play, doesn't start it.
    setIsLoaded(true);
  }, [pack.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, router, timerKey]);

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground text-center p-4">
        <Lock className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-3xl font-headline mb-2">Content Locked</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          This is a premium escape. Please unlock it from the main menu to access it.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2" />
            Back to Escapes
          </Link>
        </Button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Off";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  
  const getButtonClass = (id: string) => {
    return cn("transform transition-transform duration-200", activeElement === id && "scale-125 ring-4 ring-primary rounded-full");
  }

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseMove={resetControlsTimeout}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      )}

      {pack.videoUrl ? (
        <video
          src={pack.videoUrl}
          loop
          autoPlay={isPlaying}
          muted
          playsInline
          className="w-full h-full object-cover"
          onCanPlay={() => setIsLoaded(true)}
          onClick={() => setIsPlaying(!isPlaying)}
        />
      ) : (
        <div onClick={() => setIsPlaying(!isPlaying)}>
          <CanvasRenderer animationType={pack.animationType} />
        </div>
      )}
      <audio ref={audioRef} src={pack.audioUrl} loop playsInline />

      <div
        ref={controlsRef}
        className={cn(
          "absolute inset-0 bg-black/30 transition-opacity duration-500",
          isControlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <Button id="back-btn" data-focusable-player variant="ghost" size="icon" onClick={() => router.back()} onFocus={()=>setFocus('back-btn')} className={getButtonClass('back-btn')}>
            <ArrowLeft className="w-8 h-8" />
          </Button>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <Button id="play-pause-btn" data-focusable-player variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)} onFocus={()=>setFocus('play-pause-btn')} className={getButtonClass('play-pause-btn')}>
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </Button>
           <Button id="mute-btn" data-focusable-player variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} onFocus={()=>setFocus('mute-btn')} className={getButtonClass('mute-btn')}>
            {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button id="timer-btn" data-focusable-player variant="ghost" size="icon" onFocus={()=>setFocus('timer-btn')} className={getButtonClass('timer-btn')}>
                <Clock className="w-8 h-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {timerOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => {
                    setTimer(opt.value);
                    setTimerKey(Date.now());
                  }}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-8 right-8 text-lg tabular-nums">
          {formatTime(timer)}
        </div>
      </div>
    </div>
  );
}
