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
    for (const groupKey in focusableElements) {
      const element = focusableElements[groupKey].find(el => el.id === id);
      if (element) return element;
    }
    return null;
  };
  
  const findClosestElement = (
    currentElement: FocusableElement,
    direction: "up" | "down" | "left" | "right"
  ): FocusableElement | null => {
    const currentRect = currentElement.getBoundingClientRect();
    let bestCandidate: FocusableElement | null = null;
    let minDistance = Infinity;

    const allElements = Object.values(focusableElements).flat();

    for (const el of allElements) {
      if (el === currentElement) continue;

      const elRect = el.getBoundingClientRect();
      let isCandidate = false;
      let distance = Infinity;
      const xOverlap = Math.max(0, Math.min(currentRect.right, elRect.right) - Math.max(currentRect.left, elRect.left));
      const yOverlap = Math.max(0, Math.min(currentRect.bottom, elRect.bottom) - Math.max(currentRect.top, elRect.top));

      switch (direction) {
        case "down":
          if (elRect.top > currentRect.bottom || (elRect.top > currentRect.top && xOverlap === 0)) {
            isCandidate = true;
            distance = Math.hypot( (elRect.left + elRect.width / 2) - (currentRect.left + currentRect.width / 2), elRect.top - currentRect.bottom);
          }
          break;
        case "up":
          if (elRect.bottom < currentRect.top || (elRect.bottom < currentRect.bottom && xOverlap === 0)) {
            isCandidate = true;
             distance = Math.hypot( (elRect.left + elRect.width / 2) - (currentRect.left + currentRect.width / 2), currentRect.top - elRect.bottom);
          }
          break;
        case "right":
           if (elRect.left > currentRect.right || (elRect.left > currentRect.left && yOverlap === 0)) {
             isCandidate = true;
             distance = Math.hypot( elRect.left - currentRect.right, (elRect.top + elRect.height / 2) - (currentRect.top + currentRect.height / 2));
           }
          break;
        case "left":
          if (elRect.right < currentRect.left || (elRect.right < currentRect.right && yOverlap === 0)) {
            isCandidate = true;
            distance = Math.hypot(currentRect.left - elRect.right, (elRect.top + elRect.height / 2) - (currentRect.top + currentRect.height / 2));
          }
          break;
      }
      
      if (isCandidate && distance < minDistance) {
        minDistance = distance;
        bestCandidate = el;
      }
    }
    return bestCandidate;
  };


  const navigate = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (!activeElement) {
        const firstGroupKey = Object.keys(focusableElements)[0];
        if(firstGroupKey && focusableElements[firstGroupKey].length > 0){
           setActiveElement(focusableElements[firstGroupKey][0].id);
        }
        return;
      }

      const currentElement = getElementById(activeElement);
      if (!currentElement) return;

      const nextElement = findClosestElement(currentElement, direction);
      
      if (nextElement) {
        setActiveElement(nextElement.id);
        nextElement.focus();
      }
    },
    [activeElement, focusableElements]
  );
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default behavior for inputs, textareas, etc.
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
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
          if (activeElement) {
            const el = getElementById(activeElement);
            el?.click();
          }
          break;
        case "Escape":
           // Handled in player-client for now, could be centralized here
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
