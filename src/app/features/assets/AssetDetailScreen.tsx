import { useState } from "react";
import {
  ChevronRight, QrCode, ArrowLeftRight, Edit, MapPin, Building2, User,
  Plus, Upload, Printer, Download, Cpu,
} from "lucide-react";
import type { NavigateFn, Screen } from "../../types";
import { ASSETS, ASSET_HISTORY } from "../../data/mock";
import { Btn, Card, Chip, CriticalityChip } from "../../components/shared";
import { useAuth, hasPermission } from "../../auth";
import { AssetHistoryTimeline } from "./AssetHistoryTimeline";

// ─────────────────────────────────────────────
// Asset Detail
// ─────────────────────────────────────────────

export function AssetDetailScreen({ onNavigate, onOpenAsset, assetId }: {
  onNavigate: NavigateFn;
  onOpenAsset: (assetId: string | null, screen: Screen) => void;
  assetId?: string | null;
}) {
  const [tab, setTab] = useState("details");
  const asset = ASSETS.find(a => a.id === assetId) ?? ASSETS[0];
  const { currentUser } = useAuth();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
        <button onClick={() => onNavigate("assets")} className="hover:text-[#2A3172] transition-colors">قائمة الأصول</button>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-[#2B2B2B] font-medium">تفاصيل الأصل</span>
      </div>

      {/* Header */}
      <Card className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EEF0F8] flex items-center justify-center flex-shrink-0">
            <Cpu size={22} className="text-[#2A3172]" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-[#2B2B2B]">{asset.name}</h1>
              <Chip status={asset.status} />
              <CriticalityChip criticality={asset.businessCriticality} />
            </div>
            <p className="text-sm text-[#6B7280] font-mono">{asset.id} · {asset.category}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#6B7280] flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={12} />{asset.location}</span>
              <span className="flex items-center gap-1"><Building2 size={12} />{asset.department}</span>
              <span className="flex items-center gap-1"><User size={12} />{asset.assignedTo}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasPermission(currentUser, "assets.qr") && (
            <Btn variant="secondary" size="sm" icon={<QrCode size={13} />} onClick={() => onOpenAsset(asset.id, "qr")}>QR</Btn>
          )}
          {hasPermission(currentUser, "assets.transfer") && (
            <Btn variant="secondary" size="sm" icon={<ArrowLeftRight size={13} />} onClick={() => onOpenAsset(asset.id, "transfer")}>نقل</Btn>
          )}
          {hasPermission(currentUser, "assets.edit") && (
            <Btn variant="primary" size="sm" icon={<Edit size={13} />} onClick={() => onOpenAsset(asset.id, "add-asset")}>تعديل</Btn>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#F7F6F3] p-1 rounded-xl w-fit">
            {[
              { id: "details",     label: "التفاصيل"     },
              { id: "history",     label: "سجل الحركات"  },
              { id: "maintenance", label: "الصيانة"      },
              { id: "attachments", label: "المرفقات"     },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white text-[#2B2B2B] shadow-sm" : "text-[#6B7280] hover:text-[#2B2B2B]"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "details" && (
            <Card>
              <h3 className="text-sm font-semibold text-[#2B2B2B] mb-5">البيانات الأساسية</h3>
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
                  <div key={f.label} className="flex flex-col gap-1 pb-4 border-b border-[#E5E7EB] last:border-0 last:pb-0">
                    <span className="text-xs text-[#6B7280]">{f.label}</span>
                    {"criticality" in f && f.criticality
                      ? <CriticalityChip criticality={f.criticality} />
                      : <span className={`text-sm font-medium text-[#2B2B2B] ${f.mono ? "font-mono" : ""}`}>{f.value}</span>
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
                <h3 className="text-sm font-semibold text-[#2B2B2B]">سجل الصيانة</h3>
                <Btn variant="secondary" size="sm" icon={<Plus size={13} />}>طلب صيانة</Btn>
              </div>
              <div className="text-center py-10 text-[#6B7280] text-sm">لا يوجد سجل صيانة سابق لهذا الأصل</div>
            </Card>
          )}

          {tab === "attachments" && (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[#2B2B2B]">المرفقات</h3>
                <Btn variant="secondary" size="sm" icon={<Upload size={13} />}>رفع ملف</Btn>
              </div>
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-10 text-center hover:border-[#2A3172] hover:bg-[#F7F6F3] transition-all cursor-pointer">
                <Upload size={22} className="mx-auto text-[#9CA3AF] mb-2" />
                <p className="text-sm text-[#6B7280]">اسحب وأفلت الملفات هنا، أو انقر للاختيار</p>
                <p className="text-xs text-[#6B7280] mt-1">PDF, DOCX, JPG — الحجم الأقصى 20MB</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* QR */}
          <Card className="text-center">
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">رمز QR</h3>
            <div className="w-36 h-36 mx-auto bg-[#F7F6F3] rounded-xl border border-[#E5E7EB] flex items-center justify-center mb-4 p-3">
              <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                {/* Simulated QR — finder patterns */}
                <rect x="10" y="10" width="30" height="30" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
                <rect x="17" y="17" width="16" height="16" fill="#2B2B2B"/>
                <rect x="60" y="10" width="30" height="30" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
                <rect x="67" y="17" width="16" height="16" fill="#2B2B2B"/>
                <rect x="10" y="60" width="30" height="30" fill="none" stroke="#2B2B2B" strokeWidth="5"/>
                <rect x="17" y="67" width="16" height="16" fill="#2B2B2B"/>
                {[60,70,80,90].map(x => [60,65,70,75,80,85,90,95].map(y =>
                  Math.sin(x * y) > 0.2 ? <rect key={`${x}${y}`} x={x} y={y} width="4" height="4" fill="#2B2B2B"/> : null
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
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4">القيمة المالية</h3>
            <div className="space-y-3">
              {[
                { label: "قيمة الشراء",    value: `${asset.value.toLocaleString()} ر.س` },
                { label: "سنوات الاستهلاك", value: "5 سنوات"                             },
                { label: "الاستهلاك السنوي", value: `${(asset.value / 5).toLocaleString()} ر.س` },
              ].map(f => (
                <div key={f.label} className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">{f.label}</span>
                  <span className="font-mono font-medium text-[#2B2B2B]">{f.value}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm border-t border-[#E5E7EB] pt-3 mt-1">
                <span className="text-[#6B7280]">القيمة الدفترية الحالية</span>
                <span className="font-mono font-bold text-[#2A3172]">{(asset.value * 0.7).toLocaleString()} ر.س</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
