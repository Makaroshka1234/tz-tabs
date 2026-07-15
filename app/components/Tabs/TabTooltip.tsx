import { Pin, PinOff } from "lucide-react";

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
          <button
            onClick={onPin}
            onTouchEnd={(e) => e.stopPropagation()}
            className="flex items-center gap-2.5 w-full px-4 py-2
              hover:bg-tab-hover transition-colors text-left text-sm text-tab-text cursor-pointer"
          >
            {isPinned ? (
              <>
                <PinOff size={14} className="text-tab-text-muted" />
                Unpin tab
              </>
            ) : (
              <>
                <Pin size={14} className="text-tab-text-muted" />
                Pin tab
              </>
            )}
          </button>
        ) : (
          <div className="px-4 py-1 text-sm text-tab-text">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
