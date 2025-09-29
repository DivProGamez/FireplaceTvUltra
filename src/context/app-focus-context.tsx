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

    const allElements = Object.values(focusableElements).flat().filter(el => el.id !== currentElement.id);

    for (const el of allElements) {
      const elRect = el.getBoundingClientRect();
      
      const isVisible = el.offsetParent !== null;
      if (!isVisible) continue;

      const dx = (elRect.left + elRect.width / 2) - (currentRect.left + currentRect.width / 2);
      const dy = (elRect.top + elRect.height / 2) - (currentRect.top + currentRect.height / 2);

      let isPrimaryAxis = false;
      let isSecondaryAxis = false;
      let distance = Infinity;

      switch (direction) {
        case "down":
          isPrimaryAxis = dy > 0;
          isSecondaryAxis = Math.abs(dx) <= elRect.width / 2 + currentRect.width / 2;
          distance = Math.sqrt(dx * dx + dy * dy * 4); // Prioritize vertical alignment
          break;
        case "up":
          isPrimaryAxis = dy < 0;
          isSecondaryAxis = Math.abs(dx) <= elRect.width / 2 + currentRect.width / 2;
          distance = Math.sqrt(dx * dx + dy * dy * 4); // Prioritize vertical alignment
          break;
        case "right":
          isPrimaryAxis = dx > 0;
          isSecondaryAxis = Math.abs(dy) <= elRect.height / 2 + currentRect.height / 2;
          distance = Math.sqrt(dx * dx * 4 + dy * dy); // Prioritize horizontal alignment
          break;
        case "left":
          isPrimaryAxis = dx < 0;
          isSecondaryAxis = Math.abs(dy) <= elRect.height / 2 + currentRect.height / 2;
          distance = Math.sqrt(dx * dx * 4 + dy * dy); // Prioritize horizontal alignment
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
          setActiveElement(firstElement.id);
          firstElement.focus();
        }
        return;
      }

      const currentElement = getElementById(activeElement);
      if (!currentElement) return;

      const nextElement = findClosestElement(currentElement, direction);
      
      if (nextElement) {
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
