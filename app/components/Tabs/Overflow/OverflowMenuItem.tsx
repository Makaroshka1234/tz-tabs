import Link from "next/link";
import CloseTabBtn from "../Buttons/CloseTabBtn";
import type { ITabData } from "../../../types/tabs";
import { resolveIcon } from "../../../utils/iconResolver";

interface OverflowMenuItemProps {
  tab: ITabData & { isActive: boolean };
  onClose: (id: string) => void;
  onNavigate: () => void;
}

export default function OverflowMenuItem({ tab, onClose, onNavigate }: OverflowMenuItemProps) {
  const Icon = resolveIcon(tab.icon);

  return (
    <li className="relative group flex items-center">
      <Link
        href={tab.url}
        onClick={onNavigate}
        className={`flex-1 flex items-center gap-2.5 w-full pl-4 pr-8 py-2.5
          hover:bg-tab-hover transition-colors
          ${tab.isActive ? "bg-tab-overflow-item-active-bg text-tab-active-accent" : "text-tab-text"}`}
      >
        <Icon size={16} />
        <span className="text-sm font-medium">{tab.label}</span>
      </Link>
      <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CloseTabBtn onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClose(tab.id);
        }} />
      </div>
    </li>
  );
}
