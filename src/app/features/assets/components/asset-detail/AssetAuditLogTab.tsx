import { Inbox } from "lucide-react";
import type { AuditLogEntry } from "../../../../types";
import { EmptyState } from "../../../../components/shared";
import { getUserFirstName } from "../../../../utils/userDisplay";
import { InfoSectionCard } from "./InfoSectionCard";

const TYPE_LABELS: Record<AuditLogEntry["type"], { label: string; bg: string; text: string }> = {
  create: { label: "إنشاء", bg: "#EDF3EF", text: "#3D6B47" },
  update: { label: "تعديل", bg: "#EEF0F8", text: "#2A3172" },
  delete: { label: "حذف", bg: "#FAEDED", text: "#9E3A3A" },
  auth: { label: "مصادقة", bg: "#FDF6ED", text: "#8B6914" },
};

export function AssetAuditLogTab({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <InfoSectionCard title="سجل التدقيق" subtitle="أحداث التدقيق المرتبطة بهذا الأصل">
      {entries.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="لا توجد أحداث تدقيق مرتبطة بهذا الأصل"
          subtitle="ستظهر هنا عمليات الإنشاء والتعديل والنقل المسجلة في سجل المراجعة"
        />
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                {["التوقيت", "المستخدم", "الإجراء", "النوع", "التفاصيل"].map(col => (
                  <th key={col} className="text-right text-xs text-[#6B7280] font-medium px-3 py-3 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => {
                const ts = TYPE_LABELS[entry.type];
                const userLabel = entry.userId ? (getUserFirstName(entry.userId) ?? "—") : "النظام";
                return (
                  <tr key={entry.id} className={i < entries.length - 1 ? "border-b border-[#F7F6F3]" : ""}>
                    <td className="px-3 py-3.5 font-mono text-xs text-[#6B7280] whitespace-nowrap">{entry.time}</td>
                    <td className="px-3 py-3.5 text-xs font-medium text-[#2B2B2B]">{userLabel}</td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280]">{entry.action}</td>
                    <td className="px-3 py-3.5">
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background: ts.bg, color: ts.text }}>
                        {ts.label}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280] max-w-xs truncate">{entry.details}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </InfoSectionCard>
  );
}
