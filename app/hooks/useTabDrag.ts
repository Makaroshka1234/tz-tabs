"use client";

import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DRAG_COOLDOWN_MS = 250;

export function useTabDrag(id: string) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [localIsDragging, setLocalIsDragging] = useState(false);

  useEffect(() => {
    if (isDragging) {
      setLocalIsDragging(true);
    } else {
      const timer = setTimeout(() => setLocalIsDragging(false), DRAG_COOLDOWN_MS);
      return () => clearTimeout(timer);
    }
  }, [isDragging]);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: localIsDragging ? "var(--color-tab-dragging)" : undefined,
    cursor: localIsDragging ? "grabbing" : "grab",
    zIndex: localIsDragging ? 10 : undefined,
    touchAction: "none",
  };

  return {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    localIsDragging,
    style,
  };
}
