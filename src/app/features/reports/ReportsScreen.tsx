import {
  Download, FileText, ArrowLeftRight, AlertTriangle, RefreshCw, BarChart3,
} from "lucide-react";
import { Btn, Card } from "../../components/shared";

// ─────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────

export function ReportsScreen() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3E3124]">التقارير والتحليلات</h1>
          <p className="text-sm text-[#8B7F72] mt-0.5">تقارير تفاعلية معتمدة على Power BI وتحليلات متقدمة</p>
        </div>
        <Btn variant="secondary" icon={<Download size={14} />}>تصدير تقرير</Btn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "تقرير الجرد السنوي",            desc: "قائمة كاملة بجميع الأصول مع حالتها وقيمتها الإجمالية والدفترية",        icon: FileText,       lastRun: "15 يونيو 2024"  },
          { title: "تقرير حركة الأصول",             desc: "سجل جميع عمليات النقل والتحويل خلال الفترة المحددة مع تفاصيل الموافقة",  icon: ArrowLeftRight, lastRun: "10 يونيو 2024"  },
          { title: "تقرير الأصول منتهية الضمان",   desc: "الأصول التي انتهى أو يوشك ضمانها على الانتهاء خلال 90 يوماً",            icon: AlertTriangle,  lastRun: "1 يونيو 2024"   },
        ].map(r => {
          const Icon = r.icon;
          return (
            <Card key={r.title} className="hover:border-[#556B2F] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[#EEF1E8] flex items-center justify-center mb-3">
                <Icon size={18} className="text-[#556B2F]" />
              </div>
              <h3 className="text-sm font-semibold text-[#3E3124] mb-1.5">{r.title}</h3>
              <p className="text-xs text-[#8B7F72] leading-relaxed mb-4">{r.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#A09580]">آخر تشغيل: {r.lastRun}</span>
                <Btn variant="ghost" size="sm">تشغيل</Btn>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Power BI container */}
      <Card p={false}>
        <div className="p-5 border-b border-[#F0EDE7] flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[#3E3124]">لوحة Power BI التفاعلية</h3>
            <p className="text-xs text-[#8B7F72] mt-0.5">التقارير المضمّنة — يتطلب اتصالاً بـ Microsoft Power BI Embedded</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-[#C79A32] bg-[#FDF4DC] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C79A32]" />
              غير متصل — بيئة التطوير
            </span>
            <Btn variant="secondary" size="sm" icon={<RefreshCw size={13} />}>إعادة الاتصال</Btn>
          </div>
        </div>
        <div className="h-72 flex items-center justify-center bg-[#FAFAF8]"
          style={{ backgroundImage: "radial-gradient(circle, #D8D3C8 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
          <div className="text-center">
            <BarChart3 size={36} className="mx-auto text-[#C4B9A8] mb-3" />
            <p className="text-sm font-medium text-[#8B7F72]">حاوية Power BI</p>
            <p className="text-xs text-[#A09580] mt-1 max-w-xs">
              سيتم تضمين التقارير التفاعلية هنا بعد تكوين اتصال Power BI Embedded وتوفير بيانات الاعتماد
            </p>
            <Btn variant="secondary" size="sm" className="mt-4 mx-auto">تكوين الاتصال</Btn>
          </div>
        </div>
      </Card>
    </div>
  );
}
