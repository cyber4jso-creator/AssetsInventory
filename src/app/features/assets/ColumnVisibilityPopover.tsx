import { useState } from "react";
import { Columns3 } from "lucide-react";
import { useAssetFieldConfig } from "./contexts/AssetFieldConfigContext";
import { ASSET_COLUMNS, getColumnLabel } from "./config/assetColumns";
import { CORE_COLUMN_IDS } from "./types/fieldConfig";
import type { AssetColumnId } from "./types/fieldConfig";
import { Btn } from "../../components/shared";

// ─────────────────────────────────────────────
// Column Visibility — per-user table preferences
// ─────────────────────────────────────────────

export function ColumnVisibilityPopover() {
  const {
    adminEnabledColumns,
    customFields,
    isUserColumnVisible,
    isUserCustomFieldVisible,
    toggleUserColumnVisibility,
    toggleUserCustomFieldVisibility,
  } = useAssetFieldConfig();

  const [open, setOpen] = useState(false);

  const toggleableColumns = ASSET_COLUMNS.filter(
    c => !c.core && adminEnabledColumns.includes(c.id),
  );

  const visibleCustomFields = customFields.filter(f => f.visible);

  if (toggleableColumns.length === 0 && visibleCustomFields.length === 0) return null;

  return (
    <div className="relative">
      <Btn variant="secondary" size="sm" icon={<Columns3 size={13} />} onClick={() => setOpen(o => !o)}>
        الأعمدة
      </Btn>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-20 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-2">
            <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide px-2 py-1.5">
              إظهار الأعمدة
            </p>

            {CORE_COLUMN_IDS.map(id => (
              <label key={id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-[#6B7280] cursor-not-allowed">
                <input type="checkbox" checked disabled
                  className="w-3.5 h-3.5 rounded border-[#E5E7EB] opacity-50" />
                {getColumnLabel(id as AssetColumnId)}
              </label>
            ))}

            {toggleableColumns.map(col => (
              <label key={col.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#F7F6F3] cursor-pointer">
                <input type="checkbox" checked={isUserColumnVisible(col.id)}
                  onChange={() => toggleUserColumnVisibility(col.id)}
                  className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30 cursor-pointer" />
                <span className="text-xs text-[#2B2B2B]">{col.label}</span>
              </label>
            ))}

            {visibleCustomFields.length > 0 && (
              <>
                <div className="border-t border-[#E5E7EB] my-1.5" />
                <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide px-2 py-1.5">
                  حقول مخصصة
                </p>
                {visibleCustomFields.map(field => (
                  <label key={field.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#F7F6F3] cursor-pointer">
                    <input type="checkbox" checked={isUserCustomFieldVisible(field.id)}
                      onChange={() => toggleUserCustomFieldVisibility(field.id)}
                      className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30 cursor-pointer" />
                    <span className="text-xs text-[#2B2B2B]">{field.label}</span>
                  </label>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
