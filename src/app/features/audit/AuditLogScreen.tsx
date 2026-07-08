import { Search, Download } from "lucide-react";
import { AUDIT_LOGS } from "../../data/mock";
import { Btn, Card, Inp } from "../../components/shared";

// ─────────────────────────────────────────────
// Audit Log
// ─────────────────────────────────────────────

export function AuditLogScreen() {
  const typeStyles = {
    create: { bg: "#EDF3EF", text: "#3D6B47", label: "إنشاء"    },
    update: { bg: "#EEF0F8", text: "#2A3172", label: "تعديل"    },
    delete: { bg: "#FAEDED", text: "#9E3A3A", label: "حذف"      },
    auth:   { bg: "#FDF6ED", text: "#8B6914", label: "مصادقة"   },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2B2B2B]">سجل المراجعة</h1>
        <Btn variant="secondary" icon={<Download size={14} />}>تصدير CSV</Btn>
      </div>
      <Card p={false}>
        <div className="p-4 flex items-center gap-3 border-b border-[#E5E7EB] flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" />
            <input placeholder="بحث في السجل..." className="w-full pr-9 pl-3 py-2 text-sm rounded-lg border border-[#E5E7EB]
              placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]" />
          </div>
          <Inp type="date" />
          <Inp type="date" />
          <select className="text-sm px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#6B7280] focus:outline-none appearance-none cursor-pointer">
            <option>كل الأنواع</option>
            <option>إنشاء</option>
            <option>تعديل</option>
            <option>حذف</option>
            <option>مصادقة</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                {["التوقيت", "المستخدم", "الإجراء", "نوع العملية", "الكيان", "التفاصيل"].map(h => (
                  <th key={h} className="text-right text-xs text-[#6B7280] font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map((l, i) => {
                const ts = typeStyles[l.type as keyof typeof typeStyles];
                return (
                  <tr key={l.id} className={`hover:bg-[#FAFAF9] ${i < AUDIT_LOGS.length - 1 ? "border-b border-[#F7F6F3]" : ""}`}>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#6B7280]">{l.time}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-[#2B2B2B]">{l.user}</td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{l.action}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: ts.bg, color: ts.text }}>{ts.label}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#3D4589]">{l.entity}</td>
                    <td className="px-5 py-3.5 text-[#6B7280] text-xs max-w-xs">
                      <span className="line-clamp-1">{l.details}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
