"use client";

import { useEffect } from "react";

export function useOutsideTouch(
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean,
  onDismiss: () => void
) {
  useEffect(() => {
    if (!isActive) return;

    function handleTouchOutside(e: TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onDismiss();
      }
    }

    document.addEventListener("touchstart", handleTouchOutside);
    return () => document.removeEventListener("touchstart", handleTouchOutside);
  }, [isActive, ref, onDismiss]);
}
