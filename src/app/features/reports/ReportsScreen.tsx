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

const REPORT_DEFS = [
  { id: "inventory", title: "تقرير الجرد السنوي", desc: "قائمة بالأصول ضمن نطاق صلاحياتك مع حالتها وقيمتها", icon: FileText, lastRun: "15 يونيو 2024" },
  { id: "movement", title: "تقرير حركة الأصول", desc: "سجل عمليات النقل والتحويل خلال الفترة المحددة مع تفاصيل الموافقة", icon: ArrowLeftRight, lastRun: "10 يونيو 2024" },
  { id: "warranty", title: "تقرير الأصول منتهية الضمان", desc: "الأصول التي انتهى أو يوشك ضمانها على الانتهاء خلال 90 يوماً", icon: AlertTriangle, lastRun: "1 يونيو 2024" },
];

export function ReportsScreen() {
  const { currentUser } = useAuth();
  const { assets } = useAssetsData();
  const canExport = hasReportsExport(currentUser);
  const canManageSettings = hasPermission(currentUser, "settings.manage");
  const [search, setSearch] = useState("");
  const [lastRun, setLastRun] = useState<Record<string, string>>(
    () => Object.fromEntries(REPORT_DEFS.map(r => [r.id, r.lastRun])),
  );

  const scopedAssets = useMemo(
    () => getVisibleAssetsForUser(assets, currentUser),
    [assets, currentUser],
  );
  const scopedCount = scopedAssets.length;

  const filteredReports = useMemo(
    () => REPORT_DEFS.filter(r => {
      const desc = r.id === "inventory" ? `قائمة بـ ${scopedCount} أصل ضمن نطاق صلاحياتك` : r.desc;
      return matchesQuery(search, r.title, desc, r.id);
    }),
    [search, scopedCount],
  );

  const runReport = (id: string, title: string) => {
    setLastRun(prev => ({ ...prev, [id]: formatDateTime(new Date().toISOString()).date }));
    toast.success(`تم تشغيل "${title}"`, "البيانات محدثة الآن");
  };

  const exportReport = () => {
    exportToCsv(
      "reports-export",
      ["رقم الأصل", "الاسم", "الفئة", "القسم", "الحالة", "القيمة", "انتهاء الضمان"],
      scopedAssets.map(a => [a.id, a.name, a.category, a.department, a.status, a.value, a.warrantyExpiration]),
    );
    toast.success("تم تصدير التقرير بنجاح");
  };

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B]">التقارير والتحليلات</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            تقارير تفاعلية — {scopedCount} أصل ضمن نطاقك · {currentUser?.name}
          </p>
        </div>
        {canExport && <Btn variant="secondary" icon={<Download size={14} />} onClick={exportReport}>تصدير تقرير</Btn>}
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

      {filteredReports.length === 0 ? (
        <EmptyState icon={Inbox} title="لا توجد تقارير مطابقة" subtitle="جرّب تعديل كلمة البحث" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {filteredReports.map(r => {
            const Icon = r.icon;
            const desc = r.id === "inventory" ? `قائمة بـ ${scopedCount} أصل ضمن نطاق صلاحياتك مع حالتها وقيمتها` : r.desc;
            return (
              <Card key={r.id}>
                <div className="w-10 h-10 rounded-xl bg-[#EEF0F8] flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#2A3172]" />
                </div>
                <h3 className="text-sm font-semibold text-[#2B2B2B] mb-1.5">{r.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6B7280]">آخر تشغيل: {lastRun[r.id]}</span>
                  {canExport && <Btn variant="ghost" size="sm" onClick={() => runReport(r.id, r.title)}>تشغيل</Btn>}
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
