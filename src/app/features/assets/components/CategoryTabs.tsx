import type { Asset } from "../../types";
import type { ExplorerTabId } from "../utils/assetExplorer";
import { EXPLORER_TABS, getAssetExplorerTab } from "../utils/assetExplorer";

export function CategoryTabs({ active, onChange, assets }: {
  active: ExplorerTabId;
  onChange: (tab: ExplorerTabId) => void;
  assets: Asset[];
}) {
  const visibleTabs = EXPLORER_TABS.filter(tab => {
    if (tab.id === "all") return true;
    return assets.some(a => getAssetExplorerTab(a) === tab.id);
  });

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 -mb-px" role="tablist" aria-label="تصنيفات الأصول">
      {visibleTabs.map(tab => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg border-b-2 transition-colors cursor-pointer ${
              selected
                ? "text-[#2A3172] border-[#2A3172] bg-[#FAFAF9]"
                : "text-[#6B7280] border-transparent hover:text-[#2B2B2B] hover:bg-[#FAFAF9]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
