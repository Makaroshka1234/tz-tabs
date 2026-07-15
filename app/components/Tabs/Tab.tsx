"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
import { CircleX } from "lucide-react";
import Link from "next/link";
import Button from "../UI/Button";
import TabTooltip from "./TabTooltip";
import { useTabDrag } from "../../hooks/useTabDrag";
import { useOutsideTouch } from "../../hooks/useOutsideTouch";
import { resolveIcon } from "../../utils/iconResolver";

export interface ITabProps {
  id: string;
  label: string;
  icon: string;
  url: string;
  isPinned: boolean;
  isActive: boolean;
  onPin: () => void;
  onClose: () => void;
}

const Tab = forwardRef<HTMLLIElement, ITabProps>(function Tab(
  { id, label, icon: iconName, url, isPinned, isActive, onPin, onClose },
  externalRef
) {
  const Icon = resolveIcon(iconName);
  const [isHover, setIsHover] = useState(false);
  const liRef = useRef<HTMLLIElement | null>(null);

  const { attributes, listeners, setNodeRef, isDragging, localIsDragging, style } =
    useTabDrag(id);

  useOutsideTouch(liRef, isHover, useCallback(() => setIsHover(false), []));

  const mergedRef = (el: HTMLLIElement | null) => {
    liRef.current = el;
    setNodeRef(el);
    if (typeof externalRef === "function") {
      externalRef(el);
    } else if (externalRef) {
      (externalRef as React.MutableRefObject<HTMLLIElement | null>).current = el;
    }
  };

  function handleTouchEnd() {
    if (localIsDragging) return;
    setIsHover((prev) => !prev);
  }

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  }

  function handlePin(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    onPin();
    setIsHover(false);
  }

  return (
    <li
      ref={mergedRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onTouchEnd={handleTouchEnd}
      className={`relative flex-shrink-0 group
        ${localIsDragging ? " shadow-lg rounded" : ""}
      `}
    >
      <div className="absolute right-0 top-3 bottom-3 w-px bg-tab-divider group-last:hidden z-10 pointer-events-none" />
      <Link
        href={url}
        draggable={false}
        onClick={(e) => { if (localIsDragging) e.preventDefault(); }}
        className={`flex items-center min-w-0 justify-center py-3 select-none whitespace-nowrap
          transition-colors h-full text-tab-text
          ${isPinned ? "w-12 px-0" : "gap-2 px-4 max-w-[200px]"}
          ${localIsDragging 
            ? "bg-transparent border-t-2 border-transparent"
            : isActive
              ? "bg-transparent border-t-2 border-tab-active-accent"
              : "bg-tab-bg border-t-2 border-transparent hover:bg-tab-hover"
          }
        `}
      >
        <Icon size={16} className="flex-shrink-0" />

        {!isPinned && (
          <span className="font-medium text-sm truncate flex-1 text-left">{label}</span>
        )}

        {!isPinned && (
          <div className="flex items-center gap-0.5 ml-1 transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto">
            <Button 
              className="hover:bg-tab-close-btn-hover rounded-full p-0.5"
              onClick={handleClose} 
            >
              <CircleX size={14} className="text-red-500" />
            </Button>
          </div>
        )}
      </Link>

      {isHover && !isDragging && (
        <TabTooltip
          isActive={isActive}
          isPinned={isPinned}
          label={label}
          onPin={handlePin}
        />
      )}
    </li>
  );
});

export default Tab;
