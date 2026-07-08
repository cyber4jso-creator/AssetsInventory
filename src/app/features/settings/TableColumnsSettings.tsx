import { useState } from "react";
import { Check, Save } from "lucide-react";
import type { AssetColumnId } from "../assets/types/fieldConfig";
import { ASSET_COLUMNS, OPTIONAL_COLUMN_IDS } from "../assets/config/assetColumns";
import { useAssetFieldConfig } from "../assets/contexts/AssetFieldConfigContext";
import { Btn, Card } from "../../components/shared";

// ─────────────────────────────────────────────
// Settings — Table Columns (Super Admin)
// ─────────────────────────────────────────────

export function TableColumnsSettings() {
  const { adminColumnConfig, setAdminEnabledOptional } = useAssetFieldConfig();
  const [draft, setDraft] = useState<Set<AssetColumnId>>(
    () => new Set(adminColumnConfig.enabledOptionalColumns),
  );
  const [saved, setSaved] = useState(false);

  const toggle = (id: AssetColumnId) => {
    setDraft(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setSaved(false);
  };

  const handleSave = () => {
    setAdminEnabledOptional([...draft]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-sm font-semibold text-[#2B2B2B]">أعمدة الجدول</h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            تحكم في الأعمدة المتاحة لجميع المستخدمين. الأعمدة الأساسية ثابتة ولا يمكن إخفاؤها.
          </p>
        </div>
        <Btn variant="primary" size="sm" icon={saved ? <Check size={13} /> : <Save size={13} />} onClick={handleSave}>
          {saved ? "تم الحفظ" : "حفظ"}
        </Btn>
      </div>

      <div className="space-y-2">
        {ASSET_COLUMNS.map(col => {
          const isCore = col.core;
          const checked = isCore || draft.has(col.id);
          return (
            <label
              key={col.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors
                ${isCore ? "border-[#E5E7EB] bg-[#FAFAF9] cursor-not-allowed" : "border-[#E5E7EB] hover:bg-[#F7F6F3] cursor-pointer"}`}>
              <input
                type="checkbox"
                checked={checked}
                disabled={isCore}
                onChange={() => !isCore && toggle(col.id)}
                className="w-4 h-4 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
              />
              <span className={`text-sm flex-1 ${isCore ? "text-[#6B7280]" : "text-[#2B2B2B] font-medium"}`}>
                {col.label}
              </span>
              {isCore && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF0F8] text-[#2A3172] font-medium">
                  أساسي
                </span>
              )}
            </label>
          );
        })}
      </div>

      <p className="text-[11px] text-[#6B7280] mt-4 leading-relaxed">
        الأعمدة الاختيارية المعطّلة ({OPTIONAL_COLUMN_IDS.length - draft.size}) لن تظهر في قائمة أعمدة المستخدمين.
      </p>
    </Card>
  );
}
