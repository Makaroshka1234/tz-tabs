import { ITabData } from "@/app/types/tabs";
import OverflowMenuItem from "./OverflowMenuItem";



interface IOverflowList {
     tabs: (ITabData & { isActive: boolean })[];
     onClose: (id: string) => void;
     setIsOpen: (isOpen: boolean) => void
}


function OverflowList(props: IOverflowList) {
    const {tabs, onClose, setIsOpen} = props
    return (
           <ul
          className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg
            border border-tab-border py-1 min-w-[200px] z-50"
        >
          {tabs.map((tab) => (
            <OverflowMenuItem
              key={tab.id}
              tab={tab}
              onNavigate={() => setIsOpen(false)}
              onClose={(id) => {
                onClose(id);
                if (tabs.length === 1) {
                  setIsOpen(false);
                }
              }}
            />
          ))}
        </ul>
    );
}

export default OverflowList