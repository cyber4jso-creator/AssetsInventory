import { useState } from "react";
import {
  ChevronRight, QrCode, ArrowLeftRight, Edit, MapPin, Building2, User,
  Plus, Upload, Printer, Download, Cpu,
} from "lucide-react";
import type { NavigateFn } from "../../types";
import { ASSETS, ASSET_HISTORY } from "../../data/mock";
import { Btn, Card, Chip, CriticalityChip } from "../../components/shared";
import { AssetHistoryTimeline } from "./AssetHistoryTimeline";

// ─────────────────────────────────────────────
// Asset Detail
// ─────────────────────────────────────────────

export function AssetDetailScreen({ onNavigate, assetId }: { onNavigate: NavigateFn; assetId?: string | null }) {
  const [tab, setTab] = useState("details");
  const asset = ASSETS.find(a => a.id === assetId) ?? ASSETS[0];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-[#8B7F72]">
        <button onClick={() => onNavigate("assets")} className="hover:text-[#556B2F] transition-colors">قائمة الأصول</button>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-[#3E3124] font-medium">تفاصيل الأصل</span>
      </div>

      {/* Header */}
      <Card className="flex items-start justify-between gap-4">
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
            <p className="text-sm text-[#8B7F72] font-mono">{asset.id} · {asset.category}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#8B7F72] flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={12} />{asset.location}</span>
              <span className="flex items-center gap-1"><Building2 size={12} />{asset.department}</span>
              <span className="flex items-center gap-1"><User size={12} />{asset.assignedTo}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Btn variant="secondary" size="sm" icon={<QrCode size={13} />}       onClick={() => onNavigate("qr")}>QR</Btn>
          <Btn variant="secondary" size="sm" icon={<ArrowLeftRight size={13} />} onClick={() => onNavigate("transfer")}>نقل</Btn>
          <Btn variant="primary"   size="sm" icon={<Edit size={13} />}          onClick={() => onNavigate("add-asset")}>تعديل</Btn>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#F7F5F0] p-1 rounded-xl w-fit">
            {[
              { id: "details",     label: "التفاصيل"     },
              { id: "history",     label: "سجل الحركات"  },
              { id: "maintenance", label: "الصيانة"      },
              { id: "attachments", label: "المرفقات"     },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white text-[#3E3124] shadow-sm" : "text-[#8B7F72] hover:text-[#3E3124]"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "details" && (
            <Card>
              <h3 className="text-sm font-semibold text-[#3E3124] mb-5">البيانات الأساسية</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: "رقم الأصل",           value: asset.id,                                          mono: true  },
                  { label: "الرقم التسلسلي",      value: asset.serial,                                      mono: true  },
                  { label: "فئة الأصل",           value: asset.category,                                    mono: false },
                  { label: "Business Criticality", criticality: asset.businessCriticality                   },
                  { label: "القسم المسؤول",       value: asset.department,                                  mono: false },
                  { label: "الموقع",              value: asset.location,                                    mono: false },
                  { label: "المسؤول المباشر",     value: asset.assignedTo,                                  mono: false },
                  { label: "تاريخ الشراء",        value: asset.purchaseDate,                                mono: true  },
                  { label: "قيمة الشراء",         value: `${asset.value.toLocaleString("ar-SA")} ريال`,    mono: true  },
                ].map(f => (
                  <div key={f.label} className="flex flex-col gap-1 pb-4 border-b border-[#F0EDE7] last:border-0 last:pb-0">
                    <span className="text-xs text-[#A09580]">{f.label}</span>
                    {"criticality" in f && f.criticality
                      ? <CriticalityChip criticality={f.criticality} />
                      : <span className={`text-sm font-medium text-[#3E3124] ${f.mono ? "font-mono" : ""}`}>{f.value}</span>
                    }
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "history" && (
            <AssetHistoryTimeline events={ASSET_HISTORY.filter(h => h.assetId === asset.id)} />
          )}

          {tab === "maintenance" && (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[#3E3124]">سجل الصيانة</h3>
                <Btn variant="secondary" size="sm" icon={<Plus size={13} />}>طلب صيانة</Btn>
              </div>
              <div className="text-center py-10 text-[#A09580] text-sm">لا يوجد سجل صيانة سابق لهذا الأصل</div>
            </Card>
          )}

          {tab === "attachments" && (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[#3E3124]">المرفقات</h3>
                <Btn variant="secondary" size="sm" icon={<Upload size={13} />}>رفع ملف</Btn>
              </div>
              <div className="border-2 border-dashed border-[#D8D3C8] rounded-xl p-10 text-center hover:border-[#556B2F] hover:bg-[#F7F4EE] transition-all cursor-pointer">
                <Upload size={22} className="mx-auto text-[#C4B9A8] mb-2" />
                <p className="text-sm text-[#8B7F72]">اسحب وأفلت الملفات هنا، أو انقر للاختيار</p>
                <p className="text-xs text-[#A09580] mt-1">PDF, DOCX, JPG — الحجم الأقصى 20MB</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* QR */}
          <Card className="text-center">
            <h3 className="text-sm font-semibold text-[#3E3124] mb-4">رمز QR</h3>
            <div className="w-36 h-36 mx-auto bg-[#F7F5F0] rounded-xl border border-[#E8E3D8] flex items-center justify-center mb-4 p-3">
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                {/* Simulated QR — finder patterns */}
                <rect x="10" y="10" width="30" height="30" fill="none" stroke="#3E3124" strokeWidth="5"/>
                <rect x="17" y="17" width="16" height="16" fill="#3E3124"/>
                <rect x="60" y="10" width="30" height="30" fill="none" stroke="#3E3124" strokeWidth="5"/>
                <rect x="67" y="17" width="16" height="16" fill="#3E3124"/>
                <rect x="10" y="60" width="30" height="30" fill="none" stroke="#3E3124" strokeWidth="5"/>
                <rect x="17" y="67" width="16" height="16" fill="#3E3124"/>
                {[60,70,80,90].map(x => [60,65,70,75,80,85,90,95].map(y =>
                  Math.sin(x * y) > 0.2 ? <rect key={`${x}${y}`} x={x} y={y} width="4" height="4" fill="#3E3124"/> : null
                ))}
              </svg>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Btn variant="secondary" size="sm" icon={<Printer size={13} />}>طباعة</Btn>
              <Btn variant="ghost"     size="sm" icon={<Download size={13} />}>PNG</Btn>
            </div>
          </Card>

          {/* Value */}
          <Card>
            <h3 className="text-sm font-semibold text-[#3E3124] mb-4">القيمة المالية</h3>
            <div className="space-y-3">
              {[
                { label: "قيمة الشراء",    value: `${asset.value.toLocaleString()} ر.س` },
                { label: "سنوات الاستهلاك", value: "5 سنوات"                             },
                { label: "الاستهلاك السنوي", value: `${(asset.value / 5).toLocaleString()} ر.س` },
              ].map(f => (
                <div key={f.label} className="flex justify-between text-sm">
                  <span className="text-[#8B7F72]">{f.label}</span>
                  <span className="font-mono font-medium text-[#3E3124]">{f.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-[#F0EDE7] pt-3 mt-1">
                <span className="text-[#8B7F72]">القيمة الدفترية الحالية</span>
                <span className="font-mono font-bold text-[#556B2F]">{(asset.value * 0.7).toLocaleString()} ر.س</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
