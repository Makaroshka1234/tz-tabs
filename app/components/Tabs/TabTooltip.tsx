import { Pin, PinOff } from "lucide-react";
import Button from "../UI/Button";

interface TabTooltipProps {
  isActive: boolean;
  isPinned: boolean;
  label: string;
  onPin: (e: React.MouseEvent) => void;
}

export default function TabTooltip({ isActive, isPinned, label, onPin }: TabTooltipProps) {
  return (
    <div className={`absolute left-0 top-full pt-1 z-50 ${isActive ? "min-w-[160px]" : "min-w-max whitespace-nowrap"}`}>
      <div className="bg-white rounded-lg shadow-lg border border-tab-border py-1">
        {isActive ? (
          <Button
            onClick={onPin}
            onTouchEnd={(e) => e.stopPropagation()}
            className="gap-2.5 w-full px-4 py-2 hover:bg-tab-hover text-left text-sm text-tab-text justify-start"
          >
            {isPinned ? <PinOff size={14} className="text-tab-text-muted" /> : <Pin size={14} className="text-tab-text-muted" />}
            {isPinned ? "Unpin tab" : "Pin tab"}
          </Button>
        ) : (
          <div className="px-4 py-1 text-sm text-tab-text">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
