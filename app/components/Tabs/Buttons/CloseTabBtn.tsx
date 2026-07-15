import { CircleX } from "lucide-react";

interface CloseTabBtnProps {
  onClick: (e: React.MouseEvent) => void;
}

function CloseTabBtn({ onClick }: CloseTabBtnProps) {
  return (
    <button
      onClick={onClick}
      className="hover:bg-tab-close-btn-hover rounded-full p-0.5 transition-colors cursor-pointer"
    >
      <CircleX size={14} className="text-red-500" />
    </button>
  );
}
export default CloseTabBtn;
