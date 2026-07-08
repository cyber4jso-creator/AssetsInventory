import {
  MousePointerClick, Cpu, MapPin, Building2, User, Calendar, Truck, Hash,
  Eye, FileText, ArrowLeftRight, QrCode, Edit,
} from "lucide-react";
import type { Asset, Screen } from "../../types";
import { Card, Chip, CriticalityChip, Btn, EmptyState } from "../../components/shared";
import { WARRANTY_META, getWarrantyState } from "../../utils/warranty";

// ─────────────────────────────────────────────
// Asset Preview Panel — معاينة سريعة للأصل
// ─────────────────────────────────────────────

const QUICK_ACTIONS: { label: string; icon: typeof Eye; screen: Screen }[] = [
  { label: "عرض التفاصيل",     icon: Eye,           screen: "asset-detail" },
  { label: "عرض تقرير الأصل",  icon: FileText,      screen: "asset-report" },
  { label: "نقل الأصل",        icon: ArrowLeftRight, screen: "transfer"     },
  { label: "طباعة QR",         icon: QrCode,        screen: "qr"            },
  { label: "تعديل الأصل",      icon: Edit,          screen: "add-asset"     },
];

export function AssetPreviewPanel({ asset, onOpenAsset }: {
  asset: Asset | null;
  onOpenAsset: (assetId: string, screen: Screen) => void;
}) {
  if (!asset) {
    return (
      <Card className="sticky top-0">
        <EmptyState icon={MousePointerClick} title="لا يوجد أصل محدد"
          subtitle="اختر أصلاً من الجدول لعرض معاينة سريعة له هنا" />
      </Card>
    );
  }

  const warranty = WARRANTY_META[getWarrantyState(asset.warrantyExpiration)];

  const fields = [
    { label: "المالك الحالي", value: asset.assignedTo || "بدون مسؤول حالي", icon: User },
    { label: "القسم",         value: asset.department,                     icon: Building2 },
    { label: "الموقع",        value: asset.location,                       icon: MapPin },
    { label: "تاريخ الشراء",  value: asset.purchaseDate,                   icon: Calendar },
    { label: "المورّد",       value: asset.supplier,                       icon: Truck },
    { label: "الرقم التسلسلي", value: asset.serial,                        icon: Hash },
  ];

  return (
    <Card className="sticky top-0 space-y-5">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#EEF1E8] flex items-center justify-center mx-auto mb-3">
          <Cpu size={26} className="text-[#556B2F]" />
        </div>
        <h3 className="text-base font-bold text-[#3E3124] leading-snug">{asset.name}</h3>
        <p className="text-xs font-mono text-[#8B7F72] mt-0.5">{asset.id}</p>
        <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
          <Chip status={asset.status} />
          <CriticalityChip criticality={asset.businessCriticality} />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
            style={{ background: warranty.bg, color: warranty.text }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: warranty.dot }} />
            الضمان: {warranty.label}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-[#F0EDE7]">
        {fields.map(f => (
          <div key={f.label} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#F7F5F0] flex items-center justify-center flex-shrink-0">
              <f.icon size={13} className="text-[#8B7F72]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#A09580]">{f.label}</p>
              <p className="text-xs font-medium text-[#3E3124] truncate">{f.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 pt-4 border-t border-[#F0EDE7]">
        {QUICK_ACTIONS.map(a => (
          <Btn key={a.label} variant="secondary" size="sm" icon={<a.icon size={13} />}
            className="w-full justify-start" onClick={() => onOpenAsset(asset.id, a.screen)}>
            {a.label}
          </Btn>
        ))}
      </div>
    </Card>
  );
}
