import { Wrench } from "lucide-react";
import type { AssetHistoryEvent } from "../../../../types";
import { EmptyState } from "../../../../components/shared";
import { formatDateTime } from "../../../../utils/date";
import { resolvePerformerLabel } from "../../../../utils/userDisplay";
import { InfoSectionCard } from "./InfoSectionCard";

export function AssetMaintenanceTab({ events }: { events: AssetHistoryEvent[] }) {
  const rows = events
    .filter(e => e.type === "maintenance")
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <InfoSectionCard title="سجل الصيانة" subtitle="أعمال الصيانة والإصلاح المسجلة لهذا الأصل">
      {rows.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="لا توجد سجلات صيانة لهذا الأصل حتى الآن"
          subtitle="ستظهر هنا طلبات الصيانة والإصلاح عند تسجيلها في النظام"
        />
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                {["التاريخ", "بواسطة", "السبب", "النتيجة", "الموقع"].map(col => (
                  <th key={col} className="text-right text-xs text-[#6B7280] font-medium px-3 py-3 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((event, i) => {
                const { date, time } = formatDateTime(event.timestamp);
                return (
                  <tr key={event.id} className={i < rows.length - 1 ? "border-b border-[#F7F6F3]" : ""}>
                    <td className="px-3 py-3.5 font-mono text-xs text-[#6B7280] whitespace-nowrap">
                      {date} · {time}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280]">{resolvePerformerLabel(event)}</td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280]">{event.reason ?? "—"}</td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280]">{event.result ?? "—"}</td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280]">{event.location ?? event.department ?? "—"}</td>
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
