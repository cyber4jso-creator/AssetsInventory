import { useState, type ReactNode } from "react";
import {
  MousePointerClick, Image, Cpu, ChevronLeft, ChevronRight,
} from "lucide-react";
import type { Asset } from "../../types";
import { ASSET_HISTORY, STATUS } from "../../data/mock";
import { Card, Chip, EmptyState } from "../../components/shared";
import { WARRANTY_META, getWarrantyState } from "../../utils/warranty";
import { getAssetCategoryDisplayLabel } from "../../utils/assetMappings";
import { getAssetAssigneeName } from "../../utils/userDisplay";

// ─────────────────────────────────────────────
// Asset Details Panel — ملخص كامل للأصل المحدد
// ─────────────────────────────────────────────

type PanelTab = "general" | "maintenance" | "transfers" | "attachments" | "audit";

const FUTURE_TABS: { id: PanelTab; label: string; ready: boolean }[] = [
  { id: "general",     label: "عام",            ready: true  },
  { id: "maintenance", label: "سجل الصيانة",    ready: false },
  { id: "transfers",   label: "سجل النقل",      ready: false },
  { id: "attachments", label: "المرفقات",       ready: false },
  { id: "audit",       label: "سجل التدقيق",    ready: false },
];

function formatDate(iso: string) {
  return iso.slice(0, 10);
}

function parseLocation(location: string) {
  const parts = location.includes(" — ")
    ? location.split(" — ")
    : location.split(" - ");
  if (parts.length >= 2) {
    return { building: parts[0].trim(), room: parts.slice(1).join(" - ").trim() };
  }
  return { building: "—", room: location };
}

function getLifecycleDates(assetId: string) {
  const events = ASSET_HISTORY.filter(e => e.assetId === assetId);
  const created = events.find(e => e.type === "created");
  const maintenance = events
    .filter(e => e.type === "maintenance")
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return {
    createdDate: created ? formatDate(created.timestamp) : "—",
    lastMaintenance: maintenance[0] ? formatDate(maintenance[0].timestamp) : "—",
    lastInventory: "—",
  };
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[10px] text-[#6B7280]">{label}</span>
      <span className={`text-xs font-medium text-[#2B2B2B] break-words leading-snug ${mono ? "font-mono" : ""}`}>
        {value || <span className="text-[#9CA3AF]">—</span>}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2.5">{title}</h4>
      <div className="grid grid-cols-2 gap-x-3 gap-y-3">{children}</div>
    </div>
  );
}

function GeneralContent({ asset }: { asset: Asset }) {
  const warranty = WARRANTY_META[getWarrantyState(asset.warrantyExpiration)];
  const { building, room } = parseLocation(asset.location);
  const lifecycle = getLifecycleDates(asset.id);
  const statusLabel = STATUS[asset.status].label;

  return (
    <div key={asset.id} className="asset-panel-enter space-y-5">
      {/* Header */}
      <div>
        <div className="w-full aspect-[4/3] max-h-28 rounded-xl bg-[#F7F6F3] border border-[#E5E7EB]
          flex flex-col items-center justify-center mb-3 overflow-hidden">
          <Image size={20} className="text-[#9CA3AF] mb-1" />
          <span className="text-[10px] text-[#9CA3AF]">صورة الأصل</span>
        </div>
        <h3 className="text-sm font-bold text-[#2B2B2B] leading-snug break-words">{asset.name}</h3>
        <p className="text-[11px] font-mono text-[#6B7280] mt-0.5">{asset.id}</p>
        <p className="text-xs text-[#6B7280] mt-0.5">{getAssetCategoryDisplayLabel(asset)}</p>
        <div className="flex items-center gap-2 flex-wrap mt-2.5">
          <Chip status={asset.status} />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            style={{ background: warranty.bg, color: warranty.text }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: warranty.dot }} />
            الضمان: {warranty.label}
          </span>
        </div>
      </div>

      <Section title="البيانات الأساسية">
        <DetailRow label="الرقم التسلسلي" value={asset.serial} mono />
        <DetailRow label="رمز QR" value={asset.id} mono />
        <DetailRow label="RFID" value="" />
        <DetailRow label="العلامة التجارية" value={asset.manufacturer} />
        <DetailRow label="الموديل" value={asset.model} />
        <DetailRow label="تاريخ الشراء" value={asset.purchaseDate} mono />
        <DetailRow label="انتهاء الضمان" value={asset.warrantyExpiration} mono />
        <DetailRow label="تكلفة الشراء" value={`${asset.value.toLocaleString("ar-SA")} ريال`} mono />
      </Section>

      <div className="border-t border-[#E5E7EB] pt-4">
        <Section title="الإسناد والموقع">
          <DetailRow label="الموظف المسند" value={getAssetAssigneeName(asset) || "بدون مسؤول"} />
          <DetailRow label="القسم" value={asset.department} />
          <DetailRow label="الموقع" value={asset.location} />
          <DetailRow label="المبنى" value={building} />
          <DetailRow label="الغرفة / الطابق" value={room} />
        </Section>
      </div>

      <div className="border-t border-[#E5E7EB] pt-4">
        <Section title="دورة الحياة">
          <DetailRow label="الحالة الحالية" value={statusLabel} />
          <DetailRow label="آخر جرد" value={lifecycle.lastInventory} mono />
          <DetailRow label="آخر صيانة" value={lifecycle.lastMaintenance} mono />
          <DetailRow label="تاريخ الإنشاء" value={lifecycle.createdDate} mono />
        </Section>
      </div>

      <div className="border-t border-[#E5E7EB] pt-4 space-y-3">
        <div>
          <h4 className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">الوصف</h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {asset.type} — {asset.manufacturer} {asset.model}
          </p>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wide mb-1.5">ملاحظات</h4>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">لا توجد ملاحظات مسجّلة</p>
        </div>
      </div>
    </div>
  );
}

export function AssetDetailsPanel({ selectedAsset, collapsed, onToggleCollapse }: {
  selectedAsset: Asset | null;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [tab, setTab] = useState<PanelTab>("general");

  if (collapsed) {
    return (
      <div className="hidden xl:flex items-start justify-end sticky top-0">
        <button
          onClick={onToggleCollapse}
          className="w-8 h-20 rounded-l-xl bg-white border border-[#E5E7EB] border-r-0
            flex items-center justify-center text-[#6B7280] hover:text-[#2A3172] hover:bg-[#F7F6F3]
            transition-colors cursor-pointer shadow-sm"
          title="عرض تفاصيل الأصل">
          <ChevronLeft size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="sticky top-0 min-w-0">
      <style>{`
        @keyframes assetPanelEnter {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .asset-panel-enter { animation: assetPanelEnter 0.22s ease-out; }
      `}</style>

      <Card p={false} className="relative max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
        {/* Panel header + collapse */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] bg-[#FAFAF9] flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#EEF0F8] flex items-center justify-center flex-shrink-0">
              <Cpu size={14} className="text-[#2A3172]" />
            </div>
            <span className="text-xs font-semibold text-[#2B2B2B] truncate">تفاصيل الأصل</span>
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden xl:flex p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8]
                rounded-md transition-colors cursor-pointer flex-shrink-0"
              title="طي اللوحة">
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Future-ready tab bar */}
        <div className="flex gap-0.5 px-3 py-2 border-b border-[#E5E7EB] overflow-x-auto flex-shrink-0 bg-white">
          {FUTURE_TABS.map(t => (
            <button
              key={t.id}
              disabled={!t.ready}
              onClick={() => t.ready && setTab(t.id)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-all flex-shrink-0
                ${tab === t.id && t.ready
                  ? "bg-[#EEF0F8] text-[#2A3172]"
                  : t.ready
                    ? "text-[#6B7280] hover:text-[#2B2B2B] hover:bg-[#F7F6F3]"
                    : "text-[#C5CAD4] cursor-not-allowed"
                }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {!selectedAsset ? (
            <EmptyState
              icon={MousePointerClick}
              title="لا يوجد أصل محدد"
              subtitle="اختر أصلاً من الجدول لعرض ملخصه الكامل هنا"
            />
          ) : tab === "general" ? (
            <GeneralContent asset={selectedAsset} />
          ) : (
            <div className="text-center py-10 text-xs text-[#9CA3AF]">قريباً</div>
          )}
        </div>
      </Card>
    </div>
  );
}
