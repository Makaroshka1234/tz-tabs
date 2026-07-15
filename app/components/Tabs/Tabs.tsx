"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";


import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import Tab from "./Tab";
import OverflowMenu from "../Overflow/OverflowMenu";
import { useTabOverflow } from "../../hooks/useTabOverflow";
import { useTabsState } from "../../hooks/useTabsState";
import { ITabData } from "@/app/types/tabs";


export interface ITabsProps {
  maxWidth?: number | string;
  defaultTabs?: ITabData[];
}

export default function Tabs({ maxWidth, defaultTabs }: ITabsProps = {}) {
  const pathname = usePathname();

  const {
    tabs,
    pinnedIds,
    mounted,
    isDraggingRef,
    handleDragStart,
    handleDragEnd,
    handlePin,
    handleClose,
  } = useTabsState(defaultTabs);

  const { containerRef, setTabRef, visibleTabs, hiddenTabs, recalculate } =
    useTabOverflow(tabs);

  useEffect(() => {
    if (mounted) recalculate();
  }, [mounted, pinnedIds, recalculate]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  return (
    <div 
      ref={containerRef}
      className={`w-full bg-tab-bar flex items-stretch justify-between transition-opacity duration-200 ${!mounted ? "opacity-0" : "opacity-100"}`}
      style={{ maxWidth: maxWidth !== undefined ? maxWidth : "100%" }}
    >
      <DndContext
        id="dnd-tabs-context"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleTabs.map((t) => t.id)}
          strategy={horizontalListSortingStrategy}
        >
          <ul
            className="flex items-stretch"
            onClickCapture={(e) => {
              if (isDraggingRef.current) {
                e.stopPropagation();
                e.preventDefault();
              }
            }}
          >
            {visibleTabs.map((tab) => (
              <Tab
                key={tab.id}
                ref={setTabRef(tab.id)}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                url={tab.url}
                isPinned={pinnedIds.has(tab.id)}
                isActive={pathname === tab.url}
                onPin={() => handlePin(tab.id)}
                onClose={() => handleClose(tab.id)}
              />
            ))}
          </ul>
        </SortableContext>
        <OverflowMenu
          tabs={hiddenTabs.map((t) => ({
            ...t,
            isActive: pathname === t.url,
          }))}
          onClose={handleClose}
        />
      </DndContext>
    </div>
  );
}
