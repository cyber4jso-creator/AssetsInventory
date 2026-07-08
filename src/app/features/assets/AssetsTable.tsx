import { Eye, Edit, QrCode, FileText, Inbox } from "lucide-react";
import type { Asset, Screen } from "../../types";
import { Chip, CriticalityChip, EmptyState } from "../../components/shared";
import { WARRANTY_META, getWarrantyState } from "../../utils/warranty";

// ─────────────────────────────────────────────
// Assets Table — جدول الأصول
// ─────────────────────────────────────────────

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
      <table className="w-full text-sm min-w-[980px] table-fixed">
        <colgroup>
          <col className="w-10" />
          <col className="w-[108px]" />
          <col className="w-[min(280px,28%)]" />
          <col className="w-[100px]" />
          <col className="w-[120px]" />
          <col className="w-[88px]" />
          <col className="w-[108px]" />
          <col className="w-[96px]" />
          <col className="w-[120px]" />
          <col className="w-[108px]" />
        </colgroup>
        <thead>
          <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
            {["", "رقم الأصل", "الاسم", "القسم", "المسؤول", "الحالة", "Business Criticality", "الضمان", "الموقع", ""].map((h, i) => (
              <th key={i} className="text-right text-xs text-[#6B7280] font-medium px-3 py-3">{h}</th>
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
                className={`cursor-pointer transition-all duration-150 ${i < assets.length - 1 ? "border-b border-[#F7F6F3]" : ""} ${
                  selected
                    ? "bg-[#EEF0F8] shadow-[inset_3px_0_0_0_#2A3172]"
                    : "hover:bg-[#FAFAF9]"
                }`}>
                <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={checkedIds.has(a.id)} onChange={() => onToggleCheck(a.id)}
                    className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#2A3172] focus:ring-[#D0A165]/30 cursor-pointer" />
                </td>
                <td className="px-3 py-3 font-mono text-xs text-[#3D4589] font-medium">{a.id}</td>
                <td className="px-3 py-3">
                  <p className="text-[#2B2B2B] font-medium leading-snug break-words">{a.name}</p>
                  <p className="text-[10px] font-mono text-[#6B7280] mt-0.5 truncate">{a.serial}</p>
                </td>
                <td className="px-3 py-3 text-[#6B7280] text-xs leading-snug break-words">{a.department}</td>
                <td className="px-3 py-3 text-[#6B7280] text-xs leading-snug break-words">
                  {a.assignedTo || <span className="text-[#9CA3AF]">—</span>}
                </td>
                <td className="px-3 py-3"><Chip status={a.status} /></td>
                <td className="px-3 py-3"><CriticalityChip criticality={a.businessCriticality} /></td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                    style={{ background: warranty.bg, color: warranty.text }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: warranty.dot }} />
                    {warranty.label}
                  </span>
                </td>
                <td className="px-3 py-3 text-[#6B7280] text-[10px] leading-snug break-words">{a.location}</td>
                <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => onOpenAsset(a.id, "asset-detail")}
                      className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors" title="عرض">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => onOpenAsset(a.id, "add-asset")}
                      className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors" title="تعديل">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => onOpenAsset(a.id, "qr")}
                      className="p-1.5 text-[#6B7280] hover:text-[#3D4589] hover:bg-[#EEF0F8] rounded-md transition-colors" title="رمز QR">
                      <QrCode size={14} />
                    </button>
                    <button onClick={() => onOpenAsset(a.id, "asset-report")}
                      className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors" title="عرض تقرير الأصل">
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
