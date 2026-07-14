import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { AuthUser } from "../../../auth/types";
import type { Asset } from "../../../types";
import {
  EMPTY_ROLE_FILTERS,
  ROLE_FILTER_LABELS,
  UNASSIGNED_ASSIGNEE,
  buildRoleFilterOptions,
  countActiveRoleFilters,
  getRoleFilterAllLabel,
  getRoleFilterOptionLabel,
  getVisibleFilterKeys,
  shouldShowUnassignedOption,
  type RoleAssetFilters,
  type RoleFilterKey,
} from "../utils/roleAssetFilters";

// ─────────────────────────────────────────────
// Role-aware compact filter bar
// ─────────────────────────────────────────────

export function AssetsFilterBar({ filters, onChange, visibleAssets, currentUser }: {
  filters: RoleAssetFilters;
  onChange: (filters: RoleAssetFilters) => void;
  visibleAssets: Asset[];
  currentUser: AuthUser;
}) {
  const filterKeys = getVisibleFilterKeys(currentUser.role);
  const options = buildRoleFilterOptions(
    currentUser.role,
    visibleAssets,
    currentUser.departmentId,
    currentUser.sectorId,
    filters,
  );
  const activeCount = countActiveRoleFilters(filters);

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] px-3 py-3 w-full">
      <div className="flex items-center justify-between gap-3 mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#2B2B2B]">الفلاتر</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#2A3172] text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_ROLE_FILTERS)}
            className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#C44D4D] transition-colors cursor-pointer"
          >
            <RotateCcw size={11} /> إعادة تعيين
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterKeys.map(key => (
          <FilterDropdown
            key={key}
            filterKey={key}
            label={ROLE_FILTER_LABELS[key]}
            options={options[key]}
            selected={filters[key]}
            role={currentUser.role}
            onChange={values => {
              const next = { ...filters, [key]: values };
              if (key === "sectorId") next.departmentId = [];
              if (key === "sectorId" || key === "departmentId") next.assignedUserId = [];
              onChange(next);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FilterDropdown({ filterKey, label, options, selected, onChange, role }: {
  filterKey: RoleFilterKey;
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  role: AuthUser["role"];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const showUnassigned = shouldShowUnassignedOption(filterKey, role);
  const allOptions = showUnassigned ? [...options, UNASSIGNED_ASSIGNEE] : options;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter(v => v !== value)
        : [...selected, value],
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
          selected.length > 0
            ? "border-[#2A3172] bg-[#EEF0F8] text-[#2A3172]"
            : "border-[#E5E7EB] bg-white text-[#2B2B2B] hover:bg-[#FAFAF9]"
        }`}
      >
        {label}
        {selected.length > 0 && (
          <span className="text-[10px] font-bold bg-[#2A3172] text-white rounded-full min-w-[16px] h-4 px-1 inline-flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <ChevronDown size={12} className={`text-[#6B7280] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 z-20 min-w-[200px] max-h-56 overflow-y-auto bg-white rounded-lg border border-[#E5E7EB] shadow-lg py-1">
          {allOptions.length === 0 ? (
            <p className="px-3 py-2 text-xs text-[#6B7280]">لا توجد خيارات</p>
          ) : (
            allOptions.map(option => (
              <label
                key={option || "__empty__"}
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#F7F6F3] cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggle(option)}
                  className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30 cursor-pointer"
                />
                <span className="text-xs text-[#2B2B2B] truncate">
                  {getRoleFilterOptionLabel(filterKey, option)}
                </span>
              </label>
            ))
          )}
          {getRoleFilterAllLabel(filterKey) && selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full text-right px-3 py-2 text-xs text-[#6B7280] hover:text-[#2A3172] border-t border-[#F7F6F3] mt-1 cursor-pointer"
            >
              {getRoleFilterAllLabel(filterKey)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
