// src/context/app-focus-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from 'next/navigation';

type FocusableElement = HTMLElement;
type FocusableGroups = { [key: string]: FocusableElement[] };

interface AppFocusContextType {
  activeElement: string | null;
  setFocus: (id: string | null) => void;
  focusableElements: FocusableGroups;
  setFocusableElements: React.Dispatch<React.SetStateAction<FocusableGroups>>;
  navigate: (direction: "up" | "down" | "left" | "right") => void;
}

const AppFocusContext = createContext<AppFocusContextType | undefined>(
  undefined
);

// Pre-create audio element to avoid delay on first play
let navSound: HTMLAudioElement | null = null;
if (typeof window !== 'undefined') {
  navSound = new Audio('/audio/nav-sound.mp3');
  navSound.volume = 0.3; // Lower volume for a subtle effect
}

const playNavSound = () => {
    if (navSound) {
      navSound.currentTime = 0;
      navSound.play().catch(error => {
        // Autoplay can be blocked, handle silently
        console.warn("Navigation sound was blocked by the browser.", error);
      });
    }
}


export const AppFocusProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [focusableElements, setFocusableElements] = useState<FocusableGroups>({});
  const router = useRouter();


  const setFocus = useCallback((id: string | null) => {
    setActiveElement(id);
  }, []);

  const getElementById = (id: string): FocusableElement | null => {
    if (!id) return null;
    return document.getElementById(id) as FocusableElement | null;
  };
  
  const findClosestElement = (
    currentElement: FocusableElement,
    direction: "up" | "down" | "left" | "right"
  ): FocusableElement | null => {
    const currentRect = currentElement.getBoundingClientRect();
    let bestCandidate: FocusableElement | null = null;
    let minDistance = Infinity;

    const allElements = Object.values(focusableElements).flat().filter(el => {
      const elRect = el.getBoundingClientRect();
      // Ensure element is visible before considering it
      return el.offsetParent !== null && elRect.width > 0 && elRect.height > 0;
    });

    for (const el of allElements) {
       if (el.id === currentElement.id) continue;
      
      const elRect = el.getBoundingClientRect();
      const dx = (elRect.left + elRect.width / 2) - (currentRect.left + currentRect.width / 2);
      const dy = (elRect.top + elRect.height / 2) - (currentRect.top + currentRect.height / 2);

      let isPrimaryAxis = false;
      let distance = Infinity;

      // Penalize movement in the secondary axis
      const horizontalPenalty = 1.5;
      const verticalPenalty = 1.5;

      switch (direction) {
        case "down":
          isPrimaryAxis = dy > 5; // Must be below current
          if (isPrimaryAxis) {
              distance = Math.abs(dx) * horizontalPenalty + dy;
          }
          break;
        case "up":
          isPrimaryAxis = dy < -5; // Must be above current
          if (isPrimaryAxis) {
              distance = Math.abs(dx) * horizontalPenalty - dy;
          }
          break;
        case "right":
          isPrimaryAxis = dx > 5; // Must be to the right
          if (isPrimaryAxis) {
              distance = dx + Math.abs(dy) * verticalPenalty;
          }
          break;
        case "left":
          isPrimaryAxis = dx < -5; // Must be to the left
          if (isPrimaryAxis) {
              distance = -dx + Math.abs(dy) * verticalPenalty;
          }
          break;
      }
      
      if (isPrimaryAxis && distance < minDistance) {
        minDistance = distance;
        bestCandidate = el;
      }
    }
    return bestCandidate;
  };


  const navigate = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!activeElement) {
         // Try to find the first focusable element from all groups
        const firstElement = Object.values(focusableElements).flat()[0];
        if (firstElement) {
          playNavSound();
          setActiveElement(firstElement.id);
          firstElement.focus();
        }
        return;
      }

      const currentElement = getElementById(activeElement);
      if (!currentElement) return;

      const nextElement = findClosestElement(currentElement, direction);
      
      if (nextElement) {
        playNavSound();
        setActiveElement(nextElement.id);
        nextElement.focus(); // Use browser focus for accessibility
      }
    },
    [activeElement, focusableElements]
  );
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // Allow default behavior for inputs, textareas, and dropdown menus
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.closest('[role="menu"]')) {
        return;
      }
      
      // Also check if an alert dialog is open, let its internal focus management work
      const isAlertOpen = document.querySelector('[role="alertdialog"]');


      let handled = true;
      switch (e.key) {
        case "ArrowUp":
          if (!isAlertOpen) navigate("up");
          break;
        case "ArrowDown":
          if (!isAlertOpen) navigate("down");
          break;
        case "ArrowLeft":
           if (!isAlertOpen) navigate("left");
          break;
        case "ArrowRight":
           if (!isAlertOpen) navigate("right");
          break;
        case "Enter":
          if (activeElement) {
            const el = getElementById(activeElement);
            el?.click();
          }
          break;
        case "Escape":
           // This is handled in player-client, but a global handler could be here.
           // For now, let local components handle it.
           // router.back();
           break;
        default:
          handled = false;
          break;
      }

      if (handled) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, activeElement, router]);

  return (
    <AppFocusContext.Provider
      value={{
        activeElement,
        setFocus,
        focusableElements,
        setFocusableElements,
        navigate,
      }}
    >
      {children}
    </AppFocusContext.Provider>
  );
};

export const useAppFocus = (): AppFocusContextType => {
  const context = useContext(AppFocusContext);
  if (context === undefined) {
    throw new Error("useAppFocus must be used within an AppFocusProvider");
  }
  return context;
};
