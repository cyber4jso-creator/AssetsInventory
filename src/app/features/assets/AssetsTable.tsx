import { Eye, Edit, QrCode, FileText, Inbox } from "lucide-react";
import type { Asset, Screen } from "../../types";
import { Chip, CriticalityChip, EmptyState, Btn } from "../../components/shared";
import { useAuth, hasPermission } from "../../auth";
import { WARRANTY_META, getWarrantyState } from "../../utils/warranty";
import { useAssetFieldConfig } from "./contexts/AssetFieldConfigContext";
import { getColumnLabel } from "./config/assetColumns";
import type { AssetColumnId, TableColumnKey } from "./types/fieldConfig";
import { CategoryChip } from "./components/CategoryChip";
import { getAssetLastUpdated } from "./utils/assetExplorer";
import { getAssetAssigneeName } from "../../utils/userDisplay";

// ─────────────────────────────────────────────
// Assets Table — جدول الأصول
// ─────────────────────────────────────────────

function renderCell(columnId: AssetColumnId, asset: Asset) {
  const warranty = WARRANTY_META[getWarrantyState(asset.warrantyExpiration)];

  switch (columnId) {
    case "id":
      return <td key={columnId} className="px-3 py-3.5 font-mono text-xs text-[#3D4589] font-medium">{asset.id}</td>;
    case "name":
      return (
        <td key={columnId} className="px-3 py-3.5">
          <p className="text-[#2B2B2B] font-medium leading-snug break-words">{asset.name}</p>
        </td>
      );
    case "category":
      return (
        <td key={columnId} className="px-3 py-3.5">
          <CategoryChip label={asset.category} />
        </td>
      );
    case "department":
      return <td key={columnId} className="px-3 py-3.5 text-[#6B7280] text-xs leading-snug break-words">{asset.department}</td>;
    case "assignedTo":
      return (
        <td key={columnId} className="px-3 py-3.5 text-[#6B7280] text-xs leading-snug break-words">
          {getAssetAssigneeName(asset) || <span className="text-[#9CA3AF]">—</span>}
        </td>
      );
    case "status":
      return <td key={columnId} className="px-3 py-3.5"><Chip status={asset.status} /></td>;
    case "businessCriticality":
      return <td key={columnId} className="px-3 py-3.5"><CriticalityChip criticality={asset.businessCriticality} /></td>;
    case "lastUpdated":
      return (
        <td key={columnId} className="px-3 py-3.5 font-mono text-xs text-[#6B7280] whitespace-nowrap">
          {getAssetLastUpdated(asset.id)}
        </td>
      );
    case "warranty":
      return (
        <td key={columnId} className="px-3 py-3.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
            style={{ background: warranty.bg, color: warranty.text }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: warranty.dot }} />
            {warranty.label}
          </span>
        </td>
      );
    case "location":
      return <td key={columnId} className="px-3 py-3.5 text-[#6B7280] text-[10px] leading-snug break-words">{asset.location}</td>;
    case "serial":
      return <td key={columnId} className="px-3 py-3.5 font-mono text-xs text-[#6B7280]">{asset.serial}</td>;
    default:
      return null;
  }
}

export function AssetsTable({ assets, selectedId, checkedIds, onSelect, onOpenAsset, onToggleCheck, onResetFilters }: {
  assets: Asset[];
  selectedId: string | null;
  checkedIds: Set<string>;
  onSelect: (assetId: string) => void;
  onOpenAsset: (assetId: string, screen: Screen) => void;
  onToggleCheck: (assetId: string) => void;
  onResetFilters?: () => void;
}) {
  const { currentUser } = useAuth();
  const { tableColumnKeys, customFields } = useAssetFieldConfig();
  const canEdit = hasPermission(currentUser, "assets.edit");
  const canQr   = hasPermission(currentUser, "assets.qr");

  if (assets.length === 0) {
    return (
      <div className="py-6">
        <EmptyState
          icon={Inbox}
          title="لا توجد أصول تطابق معايير البحث"
          subtitle="جرّب تعديل البحث أو إزالة بعض الفلاتر لعرض المزيد من النتائج"
        />
        {onResetFilters && (
          <div className="flex justify-center mt-4">
            <Btn variant="secondary" size="sm" onClick={onResetFilters}>إعادة تعيين الفلاتر</Btn>
          </div>
        )}
      </div>
    );
  }

  const headerLabel = (key: TableColumnKey): string => {
    if (key.startsWith("custom:")) {
      const id = key.slice(7);
      return customFields.find(f => f.id === id)?.label ?? id;
    }
    return getColumnLabel(key as AssetColumnId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[960px]">
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
            <th className="text-right text-xs text-[#6B7280] font-medium px-3 py-3.5 w-10" />
            {tableColumnKeys.map(key => (
              <th key={key} className="text-right text-xs text-[#6B7280] font-medium px-3 py-3.5 whitespace-nowrap">
                {headerLabel(key)}
              </th>
            ))}
            <th className="text-right text-xs text-[#6B7280] font-medium px-3 py-3.5 w-[108px]" />
          </tr>
        </thead>
        <tbody>
          {assets.map((a, i) => {
            const selected = selectedId === a.id;
            return (
              <tr key={a.id}
                onClick={() => onSelect(a.id)}
                onDoubleClick={() => onOpenAsset(a.id, "asset-detail")}
                className={`cursor-pointer transition-all duration-150 ${i < assets.length - 1 ? "border-b border-[#F7F6F3]" : ""} ${
                  selected
                    ? "bg-[#EEF0F8] shadow-[inset_3px_0_0_0_#2A3172]"
                    : "hover:bg-[#FAFAF9]"
                }`}>
                <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={checkedIds.has(a.id)} onChange={() => onToggleCheck(a.id)}
                    className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30 cursor-pointer" />
                </td>
                {tableColumnKeys.map(key => {
                  if (key.startsWith("custom:")) {
                    return (
                      <td key={key} className="px-3 py-3.5 text-[#9CA3AF] text-xs">—</td>
                    );
                  }
                  return renderCell(key as AssetColumnId, a);
                })}
                <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => onOpenAsset(a.id, "asset-detail")} aria-label="عرض تفاصيل الأصل"
                      className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors cursor-pointer" title="عرض">
                      <Eye size={14} />
                    </button>
                    {canEdit && (
                      <button onClick={() => onOpenAsset(a.id, "add-asset")} aria-label="تعديل الأصل"
                        className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors cursor-pointer" title="تعديل">
                        <Edit size={14} />
                      </button>
                    )}
                    {canQr && (
                      <button onClick={() => onOpenAsset(a.id, "qr")} aria-label="رمز QR"
                        className="p-1.5 text-[#6B7280] hover:text-[#3D4589] hover:bg-[#EEF0F8] rounded-md transition-colors cursor-pointer" title="رمز QR">
                        <QrCode size={14} />
                      </button>
                    )}
                    <button onClick={() => onOpenAsset(a.id, "asset-report")} aria-label="تقرير الأصل"
                      className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors cursor-pointer" title="عرض تقرير الأصل">
                      <FileText size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
