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
        // console.warn("Navigation sound was blocked by the browser.", error);
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
      return el.offsetParent !== null && elRect.width > 0 && elRect.height > 0;
    });
  
    for (const el of allElements) {
      if (el.id === currentElement.id) continue;
  
      const elRect = el.getBoundingClientRect();
      const dx = (elRect.left + elRect.width / 2) - (currentRect.left + currentRect.width / 2);
      const dy = (elRect.top + elRect.height / 2) - (currentRect.top + currentRect.height / 2);
  
      let isPrimaryAxis = false;
      let distance = Infinity;
  
      // Increased penalty for secondary axis movement to favor straight lines
      const axisPenalty = 2.0;
  
      switch (direction) {
        case "down":
          // Element must be primarily below the current one.
          if (dy > Math.abs(dx)) {
            isPrimaryAxis = true;
            distance = Math.sqrt(dx * dx * 0.5 + dy * dy); // Prioritize vertical distance
          }
          break;
        case "up":
          // Element must be primarily above the current one.
          if (-dy > Math.abs(dx)) {
            isPrimaryAxis = true;
            distance = Math.sqrt(dx * dx * 0.5 - dy * dy);
          }
          break;
        case "right":
           // Element must be primarily to the right.
          if (dx > Math.abs(dy)) {
            isPrimaryAxis = true;
            distance = Math.sqrt(dx * dx + dy * dy * axisPenalty); // Penalize vertical deviation
          }
          break;
        case "left":
           // Element must be primarily to the left.
          if (-dx > Math.abs(dy)) {
            isPrimaryAxis = true;
            distance = Math.sqrt(dx * dx + dy * dy * axisPenalty);
          }
          break;
      }
  
      if (isPrimaryAxis && distance < minDistance) {
        minDistance = distance;
        bestCandidate = el;
      }
    }
    // Fallback for simple horizontal navigation if no "best" candidate is found
    if (!bestCandidate && (direction === 'left' || direction === 'right')) {
        const currentGroupKey = Object.keys(focusableElements).find(key => focusableElements[key].some(el => el.id === currentElement.id));
        if (currentGroupKey) {
            const currentGroup = focusableElements[currentGroupKey];
            const currentIndex = currentGroup.findIndex(el => el.id === currentElement.id);
            if (direction === 'left' && currentIndex > 0) {
                return currentGroup[currentIndex - 1];
            }
            if (direction === 'right' && currentIndex < currentGroup.length - 1) {
                return currentGroup[currentIndex + 1];
            }
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
      
      let handled = true;
      switch (e.key) {
        case "ArrowUp":
          navigate("up");
          break;
        case "ArrowDown":
          navigate("down");
          break;
        case "ArrowLeft":
           navigate("left");
          break;
        case "ArrowRight":
           navigate("right");
          break;
        case "Enter":
           // Handle synthetic click for Enter key
          if (activeElement) {
            const el = getElementById(activeElement);
            if(el) {
              el.click();
            }
          }
          break;
        case "Escape":
           router.back();
           break;
        default:
          handled = false;
          break;
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true); // Use capture phase
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
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
