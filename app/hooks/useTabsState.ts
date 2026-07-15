"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { ITabData } from "../types/tabs";
import { DEFAULT_TABS, ORDER_KEY, PINNED_KEY } from "../constants/tabs";

function loadOrder(fallback: ITabData[]): ITabData[] {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(ORDER_KEY);
    if (!saved) return fallback;
    const order: string[] = JSON.parse(saved);
    const tabMap = new Map(fallback.map((t) => [t.id, t]));
    const ordered: ITabData[] = [];
    for (const id of order) {
      const tab = tabMap.get(id);
      if (tab) {
        ordered.push(tab);
        tabMap.delete(id);
      }
    }
    for (const tab of tabMap.values()) ordered.push(tab);
    return ordered;
  } catch {
    return fallback;
  }
}

function loadPinned(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(PINNED_KEY);
    if (!saved) return new Set();
    return new Set(JSON.parse(saved) as string[]);
  } catch {
    return new Set();
  }
}

export function useTabsState(initialTabs: ITabData[] = DEFAULT_TABS) {
  const [tabs, setTabs] = useState<ITabData[]>(initialTabs);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const isDraggingRef = useRef(false);

  
  useEffect(() => {
   
    setTabs(loadOrder(initialTabs));
   
    setPinnedIds(loadPinned());
   
    setMounted(true);
  }, []);

  
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(ORDER_KEY, JSON.stringify(tabs.map((t) => t.id)));
  }, [tabs, mounted]);

 
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(PINNED_KEY, JSON.stringify([...pinnedIds]));
  }, [pinnedIds, mounted]);

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTabs((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === active.id);
        const newIndex = prev.findIndex((t) => t.id === over.id);

        const activeIsPinned = pinnedIds.has(active.id as string);
        const overIsPinned = pinnedIds.has(over.id as string);

        if (activeIsPinned !== overIsPinned) return prev;

        return arrayMove(prev, oldIndex, newIndex);
      });
    }

    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  }, [pinnedIds]);

  const handlePin = useCallback((id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    setTabs((prev) => {
      const isPinning = !pinnedIds.has(id);
      const tabIndex = prev.findIndex((t) => t.id === id);
      if (tabIndex === -1) return prev;

      const newTabs = [...prev];
      const [tab] = newTabs.splice(tabIndex, 1);

      if (isPinning) {
        let lastPinnedIdx = -1;
        for (let i = 0; i < newTabs.length; i++) {
          if (pinnedIds.has(newTabs[i].id)) lastPinnedIdx = i;
        }
        newTabs.splice(lastPinnedIdx + 1, 0, tab);
      } else {
        let pinnedCount = 0;
        for (const t of newTabs) {
          if (pinnedIds.has(t.id) && t.id !== id) pinnedCount++;
        }
        newTabs.splice(pinnedCount, 0, tab);
      }

      return newTabs;
    });
  }, [pinnedIds]);

  const handleClose = useCallback((id: string) => {
    setTabs((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((t) => t.id !== id);
    });
    setPinnedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return {
    tabs,
    pinnedIds,
    mounted,
    isDraggingRef,
    handleDragStart,
    handleDragEnd,
    handlePin,
    handleClose,
  };
}
