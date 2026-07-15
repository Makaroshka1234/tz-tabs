"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useTabOverflow<T extends { id: string }>(
  tabs: T[],
  overflowButtonWidth = 40
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabWidthsRef = useRef<Map<string, number>>(new Map());
  const tabRefsMap = useRef<Map<string, HTMLElement>>(new Map());
  
  const [visibleTabs, setVisibleTabs] = useState<T[]>(tabs);
  const [hiddenTabs, setHiddenTabs] = useState<T[]>([]);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    let totalWidth = 0;
    const currentWidths: number[] = [];

    for (const tab of tabs) {
      const el = tabRefsMap.current.get(tab.id);
      let w = 120; 
      
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) {
          w = rect.width;
          tabWidthsRef.current.set(tab.id, w);
        }
      } else if (tabWidthsRef.current.has(tab.id)) {
        w = tabWidthsRef.current.get(tab.id)!;
      }
      
      currentWidths.push(w);
      totalWidth += w;
    }

    if (currentWidths.length === 0) {
      setVisibleTabs(tabs);
      setHiddenTabs([]);
      return;
    }

  
    if (totalWidth <= containerWidth) {
      setVisibleTabs(tabs);
      setHiddenTabs([]);
      return;
    }

    
    const availableWidth = containerWidth - overflowButtonWidth;
    let accumulated = 0;
    
    const newVisible: T[] = [];
    const newHidden: T[] = [];


    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const w = currentWidths[i];

      if (newVisible.length === 0) {
        newVisible.push(tab);
        accumulated += w;
      } else if (accumulated + w <= availableWidth) {
        newVisible.push(tab);
        accumulated += w;
      } else {
        newHidden.push(tab);
      }
    }

    setVisibleTabs(newVisible);
    setHiddenTabs(newHidden);
  }, [tabs, overflowButtonWidth]);

  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      recalculate();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [recalculate]);

  const setTabRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) {
        tabRefsMap.current.set(id, el);
      } else {
        tabRefsMap.current.delete(id);
      }
    },
    []
  );

  return {
    containerRef,
    setTabRef,
    visibleTabs,
    hiddenTabs,
    recalculate,
  };
}
