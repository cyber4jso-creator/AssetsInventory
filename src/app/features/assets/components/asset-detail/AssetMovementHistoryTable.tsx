import { Inbox } from "lucide-react";
import type { AssetHistoryEvent } from "../../../../types";
import { HISTORY_EVENT_META } from "../../../../data/mock";
import { EmptyState } from "../../../../components/shared";
import { formatDateTime } from "../../../../utils/date";
import { resolvePerformerLabel } from "../../../../utils/userDisplay";
import { InfoSectionCard } from "./InfoSectionCard";

const MOVEMENT_TYPES = new Set<AssetHistoryEvent["type"]>(["transferred", "assigned"]);

export function AssetMovementHistoryTable({ events }: { events: AssetHistoryEvent[] }) {
  const rows = events
    .filter(e => MOVEMENT_TYPES.has(e.type))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <InfoSectionCard title="سجل النقل والإسناد" subtitle="عمليات النقل والحركة المسجلة لهذا الأصل">
      {rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="لا توجد عمليات نقل مسجلة لهذا الأصل"
          subtitle="ستظهر هنا عمليات النقل والإسناد عند تسجيلها في النظام"
        />
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                {["التاريخ", "الإجراء", "من", "إلى", "بواسطة", "ملاحظات"].map(col => (
                  <th key={col} className="text-right text-xs text-[#6B7280] font-medium px-3 py-3 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((event, i) => {
                const meta = HISTORY_EVENT_META[event.type];
                const { date, time } = formatDateTime(event.timestamp);
                const notes = event.reason || event.notes || "—";
                return (
                  <tr
                    key={event.id}
                    className={i < rows.length - 1 ? "border-b border-[#F7F6F3]" : ""}
                  >
                    <td className="px-3 py-3.5 font-mono text-xs text-[#6B7280] whitespace-nowrap">
                      {date} · {time}
                    </td>
                    <td className="px-3 py-3.5 text-xs font-medium text-[#2B2B2B]">{meta.label}</td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280]">{event.from || event.fromDepartment || "—"}</td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280]">{event.to || event.toDepartment || "—"}</td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280]">{resolvePerformerLabel(event)}</td>
                    <td className="px-3 py-3.5 text-xs text-[#6B7280] max-w-xs truncate">{notes}</td>
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
