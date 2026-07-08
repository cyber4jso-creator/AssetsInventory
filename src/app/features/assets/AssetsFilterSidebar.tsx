import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { Asset, AssetStatus } from "../../types";
import { ASSETS, STATUS, CRITICALITY, BUSINESS_CRITICALITY_OPTIONS } from "../../data/mock";
import { WARRANTY_META, getWarrantyState } from "../../utils/warranty";

// ─────────────────────────────────────────────
// Assets Filter Sidebar — فلاتر قائمة الأصول
// ─────────────────────────────────────────────

export interface AssetFilters {
  category: string[];
  department: string[];
  status: string[];
  criticality: string[];
  supplier: string[];
  warranty: string[];
  purchaseYear: string[];
  location: string[];
}

export const EMPTY_FILTERS: AssetFilters = {
  category: [], department: [], status: [], criticality: [],
  supplier: [], warranty: [], purchaseYear: [], location: [],
};

type GroupKey = keyof AssetFilters;

function unique(values: string[]) {
  return [...new Set(values)].sort();
}

export function matchesFilters(asset: Asset, filters: AssetFilters): boolean {
  const warrantyState = getWarrantyState(asset.warrantyExpiration);
  return (
    (filters.category.length === 0     || filters.category.includes(asset.category)) &&
    (filters.department.length === 0   || filters.department.includes(asset.department)) &&
    (filters.status.length === 0       || filters.status.includes(asset.status)) &&
    (filters.criticality.length === 0  || filters.criticality.includes(asset.businessCriticality)) &&
    (filters.supplier.length === 0     || filters.supplier.includes(asset.supplier)) &&
    (filters.warranty.length === 0     || filters.warranty.includes(warrantyState)) &&
    (filters.purchaseYear.length === 0 || filters.purchaseYear.includes(asset.purchaseDate.slice(0, 4))) &&
    (filters.location.length === 0     || filters.location.includes(asset.location))
  );
}

export function AssetsFilterSidebar({ filters, onChange }: {
  filters: AssetFilters;
  onChange: (filters: AssetFilters) => void;
}) {
  const activeCount = Object.values(filters).reduce((n, v) => n + v.length, 0);

  const toggle = (key: GroupKey, value: string) => {
    const current = filters[key];
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const groups: { key: GroupKey; label: string; defaultOpen?: boolean; options: { value: string; label: string; dot?: string }[] }[] = [
    { key: "category",     label: "الفئة",                defaultOpen: true, options: unique(ASSETS.map(a => a.category)).map(v => ({ value: v, label: v })) },
    { key: "department",   label: "القسم",                defaultOpen: true, options: unique(ASSETS.map(a => a.department)).map(v => ({ value: v, label: v })) },
    { key: "status",       label: "الحالة",               defaultOpen: true, options: unique(ASSETS.map(a => a.status)).map(v => ({ value: v, label: STATUS[v as AssetStatus].label, dot: STATUS[v as AssetStatus].dot })) },
    { key: "criticality",  label: "Business Criticality", options: BUSINESS_CRITICALITY_OPTIONS.map(v => ({ value: v, label: CRITICALITY[v].label, dot: CRITICALITY[v].dot })) },
    { key: "supplier",     label: "المورّد",              options: unique(ASSETS.map(a => a.supplier)).map(v => ({ value: v, label: v })) },
    { key: "warranty",     label: "حالة الضمان",          options: (["valid", "expiring", "expired"] as const).map(v => ({ value: v, label: WARRANTY_META[v].label, dot: WARRANTY_META[v].dot })) },
    { key: "purchaseYear", label: "سنة الشراء",           options: unique(ASSETS.map(a => a.purchaseDate.slice(0, 4))).map(v => ({ value: v, label: v })) },
    { key: "location",     label: "الموقع",               options: unique(ASSETS.map(a => a.location)).map(v => ({ value: v, label: v })) },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#2B2B2B]">الفلاتر</h3>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#2A3172] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={() => onChange(EMPTY_FILTERS)}
            className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#C44D4D] transition-colors cursor-pointer">
            <RotateCcw size={11} /> إعادة تعيين
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] divide-y divide-[#E5E7EB]">
        {groups.map(g => (
          <FilterGroup key={g.key} label={g.label} count={filters[g.key].length} defaultOpen={g.defaultOpen}>
            <div className="space-y-1">
              {g.options.map(o => (
                <label key={o.value}
                  className="flex items-center gap-2 px-1 py-1.5 rounded-lg hover:bg-[#F7F6F3] cursor-pointer transition-colors">
                  <input type="checkbox" checked={filters[g.key].includes(o.value)} onChange={() => toggle(g.key, o.value)}
                    className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30 cursor-pointer" />
                  {o.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: o.dot }} />}
                  <span className="text-xs text-[#2B2B2B] truncate">{o.label}</span>
                </label>
              ))}
            </div>
          </FilterGroup>
        ))}
      </div>
    </div>
  );
}

function FilterGroup({ label, count, defaultOpen, children }: {
  label: string; count: number; defaultOpen?: boolean; children: ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-[#2B2B2B] hover:bg-[#FAFAF9] transition-colors cursor-pointer">
        <span className="flex items-center gap-2">
          {label}
          {count > 0 && <span className="text-[10px] font-bold text-[#2A3172] bg-[#EEF0F8] rounded-full px-1.5 py-0.5">{count}</span>}
        </span>
        <ChevronDown size={14} className={`text-[#6B7280] transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
