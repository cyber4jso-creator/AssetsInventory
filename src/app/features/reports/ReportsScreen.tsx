import { useMemo, useState } from "react";
import {
  Download, FileText, ArrowLeftRight, AlertTriangle, RefreshCw, BarChart3, Search, Inbox,
} from "lucide-react";
import { Btn, Card, EmptyState, toast } from "../../components/shared";
import { useAuth, hasReportsExport, hasPermission } from "../../auth";
import { getVisibleAssetsForUser } from "../../utils/assetScope";
import { useAssetsData } from "../assets/contexts/AssetsDataContext";
import { exportToCsv } from "../../utils/csvExport";
import { formatDateTime } from "../../utils/date";
import { matchesQuery } from "../../utils/search";
import type { Asset } from "../../types";

const DAY_MS = 24 * 60 * 60 * 1000;
const WARRANTY_WINDOW_DAYS = 90;

const REPORT_DEFS = [
  {
    id: "inventory",
    title: "تقرير الجرد السنوي",
    desc: "قائمة بالأصول ضمن نطاق صلاحياتك مع حالتها وقيمتها",
    icon: FileText,
    lastRun: "لم يُشغّل بعد",
  },
  {
    id: "movement",
    title: "تقرير حركة الأصول",
    desc: "يتطلب اتصال واجهة برمجة سجل حركة الأصول — غير متاح حالياً",
    icon: ArrowLeftRight,
    lastRun: "لم يُشغّل بعد",
  },
  {
    id: "warranty",
    title: "تقرير الأصول منتهية الضمان",
    desc: "الأصول التي انتهى أو يوشك ضمانها على الانتهاء خلال 90 يوماً",
    icon: AlertTriangle,
    lastRun: "لم يُشغّل بعد",
  },
];

function isValidWarrantyDate(value: string): boolean {
  if (!value.trim()) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

function warrantyStatusLabel(expiration: string): string {
  const daysLeft = (new Date(expiration).getTime() - Date.now()) / DAY_MS;
  if (daysLeft < 0) return "منتهي";
  return "قريب الانتهاء";
}

function getReportDescription(id: string, scopedCount: number, warrantyCount: number): string {
  if (id === "inventory") {
    return `قائمة بـ ${scopedCount} أصل ضمن نطاق صلاحياتك مع حالتها وقيمتها`;
  }
  if (id === "warranty") {
    return `${warrantyCount} أصل انتهى أو يوشك ضمانها على الانتهاء خلال 90 يوماً`;
  }
  if (id === "movement") {
    return "يتطلب اتصال واجهة برمجة سجل حركة الأصول — غير متاح حالياً";
  }
  return "";
}

export function ReportsScreen() {
  const { currentUser } = useAuth();
  const { assets, loading, error, refreshAssets } = useAssetsData();
  const canExport = hasReportsExport(currentUser);
  const canManageSettings = hasPermission(currentUser, "settings.manage");
  const [search, setSearch] = useState("");
  const [lastRun, setLastRun] = useState<Record<string, string>>(
    () => Object.fromEntries(REPORT_DEFS.map(r => [r.id, r.lastRun])),
  );

  const scopedAssets = useMemo(() => {
    if (loading || error) return [];
    return getVisibleAssetsForUser(assets, currentUser);
  }, [assets, currentUser, loading, error]);

  const warrantyAssets = useMemo(() => {
    const cutoff = Date.now() + WARRANTY_WINDOW_DAYS * DAY_MS;

    return scopedAssets
      .filter((asset) => {
        if (!isValidWarrantyDate(asset.warrantyExpiration)) return false;
        return new Date(asset.warrantyExpiration).getTime() <= cutoff;
      })
      .sort(
        (a, b) =>
          new Date(a.warrantyExpiration).getTime() - new Date(b.warrantyExpiration).getTime(),
      );
  }, [scopedAssets]);

  const scopedCount = scopedAssets.length;
  const warrantyCount = warrantyAssets.length;

  const filteredReports = useMemo(
    () => REPORT_DEFS.filter(r => {
      const desc = getReportDescription(r.id, scopedCount, warrantyCount);
      return matchesQuery(search, r.title, desc, r.id);
    }),
    [search, scopedCount, warrantyCount],
  );

  const exportInventoryReport = () => {
    exportToCsv(
      "inventory-report",
      ["رقم الأصل", "الاسم", "الفئة", "القسم", "الموقع", "الحالة", "القيمة", "تاريخ الشراء", "انتهاء الضمان"],
      scopedAssets.map((asset: Asset) => [
        asset.id,
        asset.name,
        asset.category,
        asset.department,
        asset.location,
        asset.status,
        asset.value,
        asset.purchaseDate,
        asset.warrantyExpiration,
      ]),
    );
    toast.success("تم تصدير تقرير الجرد بنجاح", `${scopedCount} أصل`);
  };

  const exportWarrantyReport = () => {
    exportToCsv(
      "warranty-report",
      ["رقم الأصل", "الاسم", "الفئة", "القسم", "الموقع", "انتهاء الضمان", "حالة الضمان", "القيمة"],
      warrantyAssets.map((asset: Asset) => [
        asset.id,
        asset.name,
        asset.category,
        asset.department,
        asset.location,
        asset.warrantyExpiration,
        warrantyStatusLabel(asset.warrantyExpiration),
        asset.value,
      ]),
    );
    toast.success("تم تصدير تقرير الضمان بنجاح", `${warrantyCount} أصل`);
  };

  const runReport = (id: string, title: string) => {
    if (loading || error) return;

    if (id === "inventory") {
      exportInventoryReport();
      setLastRun(prev => ({ ...prev, [id]: formatDateTime(new Date().toISOString()).date }));
      return;
    }

    if (id === "warranty") {
      exportWarrantyReport();
      setLastRun(prev => ({ ...prev, [id]: formatDateTime(new Date().toISOString()).date }));
      return;
    }

    if (id === "movement") {
      toast.deferred("تقرير حركة الأصول سيتاح بعد ربط سجل الحركة");
    }
  };

  const dataUnavailable = loading || !!error;

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B]">التقارير والتحليلات</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {loading
              ? "جاري تحميل بيانات الأصول..."
              : error
                ? `تقارير تفاعلية — ${currentUser?.name}`
                : `تقارير تفاعلية — ${scopedCount} أصل ضمن نطاقك · ${currentUser?.name}`}
          </p>
        </div>
        {canExport && (
          <Btn
            variant="secondary"
            icon={<Download size={14} />}
            disabled={dataUnavailable}
            onClick={exportInventoryReport}
          >
            تصدير تقرير
          </Btn>
        )}
      </div>

      <div className="relative max-w-xl">
        <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" aria-hidden />
        <input
          placeholder="بحث في التقارير..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="بحث في التقارير"
          className="w-full pr-9 pl-3 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white
            placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]"
        />
      </div>

      {loading && (
        <p className="text-sm text-[#6B7280]">جاري تحميل بيانات الأصول من الخادم...</p>
      )}

      {error && !loading && (
        <div className="flex items-center justify-between gap-3 flex-wrap p-4 rounded-lg border border-[#FAEDED] bg-[#FFF5F5]">
          <p className="text-sm text-[#9E3A3A]">
            تعذر تحميل بيانات الأصول من الخادم. يرجى المحاولة مرة أخرى.
          </p>
          <Btn variant="secondary" size="sm" icon={<RefreshCw size={13} />} onClick={() => void refreshAssets()}>
            إعادة المحاولة
          </Btn>
        </div>
      )}

      {filteredReports.length === 0 ? (
        <EmptyState icon={Inbox} title="لا توجد تقارير مطابقة" subtitle="جرّب تعديل كلمة البحث" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {filteredReports.map(r => {
            const Icon = r.icon;
            const desc = getReportDescription(r.id, scopedCount, warrantyCount);
            const isMovement = r.id === "movement";
            return (
              <Card key={r.id}>
                <div className="w-10 h-10 rounded-xl bg-[#EEF0F8] flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#2A3172]" />
                </div>
                <h3 className="text-sm font-semibold text-[#2B2B2B] mb-1.5">{r.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6B7280]">آخر تشغيل: {lastRun[r.id]}</span>
                  {canExport && (
                    isMovement ? (
                      <Btn
                        variant="ghost"
                        size="sm"
                        className="opacity-50"
                        onClick={() => toast.deferred("تقرير حركة الأصول سيتاح بعد ربط سجل الحركة")}
                      >
                        تشغيل
                      </Btn>
                    ) : (
                      <Btn
                        variant="ghost"
                        size="sm"
                        disabled={dataUnavailable}
                        onClick={() => runReport(r.id, r.title)}
                      >
                        تشغيل
                      </Btn>
                    )
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card p={false} className="w-full">
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B]">لوحة Power BI التفاعلية</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">التقارير المضمّنة — يتطلب اتصالاً بـ Microsoft Power BI Embedded</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-[#D0A165] bg-[#FDF6ED] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D0A165]" />
              غير متصل — بيئة التطوير
            </span>
            <Btn variant="secondary" size="sm" icon={<RefreshCw size={13} />} onClick={() => toast.deferred("الاتصال بـ Power BI")}>إعادة الاتصال</Btn>
          </div>
        </div>
        <div className="h-72 flex items-center justify-center bg-[#FAFAF9]"
          style={{ backgroundImage: "radial-gradient(circle, #E5E7EB 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
          <div className="text-center">
            <BarChart3 size={36} className="mx-auto text-[#9CA3AF] mb-3" />
            <p className="text-sm font-medium text-[#6B7280]">حاوية Power BI</p>
            <p className="text-xs text-[#6B7280] mt-1">
              سيتم تضمين التقارير التفاعلية هنا بعد تكوين اتصال Power BI Embedded
            </p>
            {canManageSettings && (
              <Btn variant="secondary" size="sm" className="mt-4 mx-auto" onClick={() => toast.deferred("تكوين اتصال Power BI")}>
                تكوين الاتصال
              </Btn>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
