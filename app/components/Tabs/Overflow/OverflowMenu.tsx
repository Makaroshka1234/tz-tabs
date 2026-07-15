"use client";

import { useEffect, useRef, useState } from "react";
import type { ITabData } from "../../../types/tabs";
import { ChevronDown } from "lucide-react";
import Button from "../../UI/Button";
import OverflowMenuItem from "./OverflowMenuItem";
import OverflowList from "./OverflowList";

interface OverflowMenuProps {
  tabs: (ITabData & { isActive: boolean })[];
  onClose: (id: string) => void;
}

function OverflowMenu({ tabs, onClose }: OverflowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (tabs.length === 0) return null;

  const hasActiveTab = tabs.some((t) => t.isActive);

  return (
    <div ref={menuRef} className="relative flex-shrink-0 flex flex-col">
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`px-2 flex-1 ${isOpen ? "bg-tab-overflow-active text-white" : `hover:bg-tab-hover ${hasActiveTab ? "text-blue-600" : "text-tab-text-muted"}`}`}
        title={`${tabs.length} more tab${tabs.length > 1 ? "s" : ""}`}
      >
        <ChevronDown size={20} strokeWidth={2.5} />
      </Button> 

      {isOpen && (
     <OverflowList tabs={tabs} onClose={onClose} setIsOpen={setIsOpen}/>
      )}
    </div>
  );
}

export default OverflowMenu;
