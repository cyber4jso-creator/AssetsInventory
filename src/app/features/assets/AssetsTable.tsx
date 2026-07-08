import { Eye, Edit, QrCode, FileText, Inbox } from "lucide-react";
import type { Asset, Screen } from "../../types";
import { Chip, CriticalityChip, EmptyState } from "../../components/shared";
import { WARRANTY_META, getWarrantyState } from "../../utils/warranty";

// ─────────────────────────────────────────────
// Assets Table — جدول الأصول
// ─────────────────────────────────────────────

const COLUMNS = ["", "رقم الأصل", "الاسم", "القسم", "المسؤول", "الحالة", "Business Criticality", "الضمان", "الموقع", ""];

export function AssetsTable({ assets, selectedId, checkedIds, onSelect, onOpenAsset, onToggleCheck }: {
  assets: Asset[];
  selectedId: string | null;
  checkedIds: Set<string>;
  onSelect: (assetId: string) => void;
  onOpenAsset: (assetId: string, screen: Screen) => void;
  onToggleCheck: (assetId: string) => void;
}) {
  if (assets.length === 0) {
    return (
      <EmptyState icon={Inbox} title="لا توجد نتائج تطابق معايير البحث"
        subtitle="جرّب تعديل كلمة البحث أو إزالة بعض الفلاتر" />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[1040px]">
        <thead>
          <tr className="border-b border-[#F0EDE7] bg-[#FAFAF8]">
            {COLUMNS.map((h, i) => (
              <th key={i} className="text-right text-xs text-[#8B7F72] font-medium px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((a, i) => {
            const warranty = WARRANTY_META[getWarrantyState(a.warrantyExpiration)];
            const selected = selectedId === a.id;
            return (
              <tr key={a.id}
                onClick={() => onSelect(a.id)}
                onDoubleClick={() => onOpenAsset(a.id, "asset-detail")}
                className={`cursor-pointer transition-colors ${i < assets.length - 1 ? "border-b border-[#F7F5F0]" : ""} ${
                  selected ? "bg-[#EEF1E8]" : "hover:bg-[#FAFAF8]"
                }`}>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={checkedIds.has(a.id)} onChange={() => onToggleCheck(a.id)}
                    className="w-3.5 h-3.5 rounded border-[#D8D3C8] text-[#556B2F] focus:ring-[#556B2F]/25 cursor-pointer" />
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-[#6B7D45] font-medium">{a.id}</td>
                <td className="px-4 py-3.5 max-w-[180px]">
                  <p className="text-[#3E3124] font-medium truncate">{a.name}</p>
                  <p className="text-xs font-mono text-[#A09580] mt-0.5">{a.serial}</p>
                </td>
                <td className="px-4 py-3.5 text-[#6B7060] text-sm">{a.department}</td>
                <td className="px-4 py-3.5 text-[#6B7060] text-sm">
                  {a.assignedTo || <span className="text-[#C4B9A8]">—</span>}
                </td>
                <td className="px-4 py-3.5"><Chip status={a.status} /></td>
                <td className="px-4 py-3.5"><CriticalityChip criticality={a.businessCriticality} /></td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    style={{ background: warranty.bg, color: warranty.text }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: warranty.dot }} />
                    {warranty.label}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-[#8B7F72] text-xs">{a.location}</td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onOpenAsset(a.id, "asset-detail")}
                      className="p-1.5 text-[#8B7F72] hover:text-[#556B2F] hover:bg-[#EEF1E8] rounded-md transition-colors" title="عرض">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => onOpenAsset(a.id, "add-asset")}
                      className="p-1.5 text-[#8B7F72] hover:text-[#556B2F] hover:bg-[#EEF1E8] rounded-md transition-colors" title="تعديل">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => onOpenAsset(a.id, "qr")}
                      className="p-1.5 text-[#8B7F72] hover:text-[#5B7C99] hover:bg-[#E8F0F8] rounded-md transition-colors" title="رمز QR">
                      <QrCode size={14} />
                    </button>
                    <button onClick={() => onOpenAsset(a.id, "asset-report")}
                      className="p-1.5 text-[#8B7F72] hover:text-[#556B2F] hover:bg-[#EEF1E8] rounded-md transition-colors" title="عرض تقرير الأصل">
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
