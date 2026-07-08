import {
  ChevronRight, Printer, FileDown, MapPin, Building2, User, Calendar,
  ArrowLeftRight, Wrench, FileText, Shield, BookOpen, Image as ImageIcon, Cpu,
} from "lucide-react";
import type { NavigateFn } from "../../types";
import { ASSETS, ASSET_HISTORY } from "../../data/mock";
import { Btn, Card, Chip, CriticalityChip, QrCodeGraphic } from "../../components/shared";
import { formatDateTime } from "../../utils/date";

// ─────────────────────────────────────────────
// Asset Report — تقرير الأصل الكامل
// ─────────────────────────────────────────────

const DOCUMENT_PLACEHOLDERS = [
  { label: "الفاتورة",  icon: FileText   },
  { label: "الضمان",    icon: Shield     },
  { label: "الدليل",    icon: BookOpen   },
  { label: "الصور",     icon: ImageIcon  },
];

export function AssetReportScreen({ assetId, onNavigate }: { assetId: string | null; onNavigate: NavigateFn }) {
  const asset = ASSETS.find(a => a.id === assetId) ?? ASSETS[0];
  const history = ASSET_HISTORY.filter(h => h.assetId === asset.id);

  const byNewest = (a: { timestamp: string }, b: { timestamp: string }) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();

  const createdEvent = history.find(h => h.type === "created");
  const transfers     = history.filter(h => h.type === "transferred").sort(byNewest);
  const maintenances   = history.filter(h => h.type === "maintenance").sort(byNewest);
  const dateCreated    = createdEvent?.timestamp ?? asset.purchaseDate;

  const infoFields: { label: string; value?: string; mono?: boolean; criticality?: typeof asset.businessCriticality; status?: typeof asset.status }[] = [
    { label: "اسم الأصل",              value: asset.name },
    { label: "رقم الأصل",              value: asset.id,                      mono: true },
    { label: "الفئة",                   value: asset.category },
    { label: "نوع الأصل",               value: asset.type },
    { label: "القسم",                   value: asset.department },
    { label: "الموقع",                  value: asset.location },
    { label: "المالك الحالي",           value: asset.assignedTo || "—" },
    { label: "الرقم التسلسلي",          value: asset.serial,                  mono: true },
    { label: "الموديل",                 value: asset.model },
    { label: "الشركة المصنّعة",         value: asset.manufacturer },
    { label: "المورّد",                 value: asset.supplier },
    { label: "تاريخ الشراء",            value: asset.purchaseDate,            mono: true },
    { label: "تاريخ انتهاء الضمان",     value: asset.warrantyExpiration,      mono: true },
    { label: "Business Criticality",   criticality: asset.businessCriticality },
    { label: "الحالة",                  status: asset.status },
  ];

  const lifecycleStats = [
    { label: "تاريخ الإنشاء",        value: formatDateTime(dateCreated).date, icon: Calendar,       bg: "#EBF4E8", color: "#2E5E23" },
    { label: "المالك الحالي",        value: asset.assignedTo || "—",          icon: User,           bg: "#E8F0F8", color: "#2E4F6A" },
    { label: "إجمالي عمليات النقل",  value: String(transfers.length),         icon: ArrowLeftRight, bg: "#EEF1E8", color: "#3E5228" },
    { label: "عدد أعمال الصيانة",    value: String(maintenances.length),      icon: Wrench,         bg: "#FDF4DC", color: "#7A5A15" },
    { label: "الموقع الحالي",        value: asset.location,                   icon: MapPin,         bg: "#FDF0E8", color: "#9A4E12" },
    { label: "القسم الحالي",         value: asset.department,                 icon: Building2,      bg: "#F5F0E6", color: "#8B6F47" },
  ];

  const generated = formatDateTime(new Date().toISOString());

  return (
    <div className="space-y-5 print:space-y-4">
      {/* Toolbar — hidden on print */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2 text-sm text-[#8B7F72]">
          <button onClick={() => onNavigate("assets")} className="hover:text-[#556B2F] transition-colors">قائمة الأصول</button>
          <ChevronRight size={14} className="rotate-180" />
          <span className="text-[#3E3124] font-medium">تقرير الأصل</span>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" size="sm" icon={<Printer size={13} />} onClick={() => window.print()}>طباعة</Btn>
          <span title="قريباً">
            <Btn variant="secondary" size="sm" icon={<FileDown size={13} />} disabled>تصدير PDF</Btn>
          </span>
        </div>
      </div>

      {/* 1. Header */}
      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EEF1E8] flex items-center justify-center flex-shrink-0">
            <Cpu size={22} className="text-[#556B2F]" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-[#3E3124]">{asset.name}</h1>
              <Chip status={asset.status} />
              <CriticalityChip criticality={asset.businessCriticality} />
            </div>
            <p className="text-sm text-[#8B7F72] font-mono">{asset.id}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#8B7F72] flex-wrap">
              <span className="flex items-center gap-1"><Building2 size={12} />{asset.department}</span>
              <span className="flex items-center gap-1"><User size={12} />{asset.assignedTo || "بدون مسؤول حالي"}</span>
            </div>
          </div>
        </div>
        <div className="w-24 h-24 bg-white border border-[#D8D3C8] rounded-xl p-2.5 flex-shrink-0">
          <QrCodeGraphic className="w-full h-full" />
        </div>
      </Card>

      {/* 2. Asset Information */}
      <Card>
        <h3 className="text-sm font-semibold text-[#3E3124] mb-5">بيانات الأصل</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {infoFields.map(f => (
            <div key={f.label} className="flex flex-col gap-1 pb-4 border-b border-[#F0EDE7]">
              <span className="text-xs text-[#A09580]">{f.label}</span>
              {f.criticality ? (
                <CriticalityChip criticality={f.criticality} />
              ) : f.status ? (
                <Chip status={f.status} />
              ) : (
                <span className={`text-sm font-medium text-[#3E3124] ${f.mono ? "font-mono" : ""}`}>{f.value}</span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 3. Asset Lifecycle Summary */}
      <div>
        <h3 className="text-sm font-semibold text-[#3E3124] mb-3">ملخص دورة حياة الأصل</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {lifecycleStats.map(s => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-xs text-[#8B7F72] leading-tight">{s.label}</p>
                  <p className="text-sm font-bold text-[#3E3124] mt-1 truncate">{s.value}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. Transfer History */}
      <Card p={false}>
        <div className="p-5 border-b border-[#F0EDE7]">
          <h3 className="text-sm font-semibold text-[#3E3124]">سجل عمليات النقل</h3>
        </div>
        {transfers.length === 0 ? (
          <p className="text-center text-sm text-[#8B7F72] py-10">لا يوجد سجل نقل لهذا الأصل</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-[#F0EDE7] bg-[#FAFAF8]">
                  {["التاريخ", "من", "إلى", "تم النقل بواسطة", "السبب"].map(h => (
                    <th key={h} className="text-right text-xs text-[#8B7F72] font-medium px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transfers.map((t, i) => (
                  <tr key={t.id} className={i < transfers.length - 1 ? "border-b border-[#F7F5F0]" : ""}>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#8B7F72]">{formatDateTime(t.timestamp).date}</td>
                    <td className="px-5 py-3.5 text-[#6B7060]">{t.fromDepartment ?? t.from ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[#6B7060]">{t.toDepartment ?? t.to ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[#3E3124] font-medium">{t.performedBy}</td>
                    <td className="px-5 py-3.5 text-[#8B7F72] text-xs">{t.reason ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* 5. Maintenance History */}
      <Card p={false}>
        <div className="p-5 border-b border-[#F0EDE7]">
          <h3 className="text-sm font-semibold text-[#3E3124]">سجل الصيانة</h3>
        </div>
        {maintenances.length === 0 ? (
          <p className="text-center text-sm text-[#8B7F72] py-10">لا يوجد سجل صيانة لهذا الأصل</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-[#F0EDE7] bg-[#FAFAF8]">
                  {["تاريخ الصيانة", "تم بواسطة", "الوصف", "النتيجة", "الحالة"].map(h => (
                    <th key={h} className="text-right text-xs text-[#8B7F72] font-medium px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {maintenances.map((m, i) => (
                  <tr key={m.id} className={i < maintenances.length - 1 ? "border-b border-[#F7F5F0]" : ""}>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#8B7F72]">{formatDateTime(m.timestamp).date}</td>
                    <td className="px-5 py-3.5 text-[#3E3124] font-medium">{m.performedBy}</td>
                    <td className="px-5 py-3.5 text-[#6B7060] text-xs max-w-xs">{m.reason ?? "—"}</td>
                    <td className="px-5 py-3.5 text-[#6B7060] text-xs max-w-xs">{m.result ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        style={{ background: "#EBF4E8", color: "#2E5E23" }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#5E8B4A" }} />
                        مكتملة
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* 6. Documents */}
      <Card>
        <h3 className="text-sm font-semibold text-[#3E3124] mb-4">المستندات المرفقة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DOCUMENT_PLACEHOLDERS.map(d => (
            <div key={d.label} className="border-2 border-dashed border-[#D8D3C8] rounded-xl p-4 text-center">
              <d.icon size={18} className="mx-auto text-[#C4B9A8] mb-2" />
              <p className="text-xs font-medium text-[#6B7060]">{d.label}</p>
              <p className="text-[10px] text-[#A09580] mt-0.5">لا يوجد ملف</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#A09580] mt-4">لا توجد مستندات مرفقة لهذا الأصل حالياً</p>
      </Card>

      {/* 7. Footer */}
      <div className="text-center text-xs text-[#A09580] pt-5 border-t border-[#E8E3D8] space-y-1">
        <p>تاريخ إنشاء التقرير: <span className="font-mono">{generated.date} · {generated.time}</span></p>
        <p>أُنشئ بواسطة: محمد العتيبي · رقم الأصل: <span className="font-mono">{asset.id}</span></p>
        <p>نظام حصر الأصول — تقرير مُولّد آلياً · الإصدار 2.4.1</p>
      </div>
    </div>
  );
}
