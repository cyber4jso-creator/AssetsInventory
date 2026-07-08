import { useState } from "react";
import { Inbox } from "lucide-react";
import type { AssetHistoryEvent, AssetHistoryEventType } from "../../types";
import { HISTORY_EVENT_META } from "../../data/mock";
import { Card, Chip, EmptyState } from "../../components/shared";
import { formatDateTime } from "../../utils/date";

// ─────────────────────────────────────────────
// Asset History Timeline — سجل دورة حياة الأصل
// ─────────────────────────────────────────────

type HistoryFilter = "all" | AssetHistoryEventType;

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: "all",            label: "الكل" },
  { value: "transferred",    label: "عمليات النقل" },
  { value: "assigned",       label: "الإسناد" },
  { value: "maintenance",    label: "الصيانة" },
  { value: "status-changed", label: "تغييرات الحالة" },
  { value: "warranty",       label: "الضمان" },
  { value: "created",        label: "الإنشاء" },
];

export function AssetHistoryTimeline({ events }: { events: AssetHistoryEvent[] }) {
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const filtered = events
    .filter(e => filter === "all" || e.type === filter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border cursor-pointer ${
              filter === f.value
                ? "bg-[#2A3172] text-white border-[#2A3172]"
                : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#2A3172] hover:text-[#2A3172]"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Inbox} title="لا يوجد سجل حركات لهذا الأصل"
            subtitle="ستظهر هنا جميع أحداث دورة حياة الأصل فور تسجيلها" />
        </Card>
      ) : (
        <div className="relative">
          <div className="absolute right-[19px] top-2 bottom-2 w-px bg-[#E5E7EB]" aria-hidden="true" />
          <div className="space-y-4">
            {filtered.map(event => (
              <HistoryEventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryEventCard({ event }: { event: AssetHistoryEvent }) {
  const meta = HISTORY_EVENT_META[event.type];
  const Icon = meta.icon;
  const { date, time } = formatDateTime(event.timestamp);
  const fields = meta.getFields(event).filter(f => f.value);

  return (
    <div className="relative flex gap-4">
      <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-[#F7F6F3]"
        style={{ background: meta.bg }}>
        <Icon size={16} style={{ color: meta.text }} />
      </div>
      <Card className="flex-1 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-[#2B2B2B]">{meta.label}</h4>
            {event.status && <Chip status={event.status} />}
          </div>
          <span className="text-xs font-mono text-[#6B7280]">{date} · {time}</span>
        </div>

        {fields.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mt-4 pt-4 border-t border-[#E5E7EB]">
            {fields.map(f => (
              <div key={f.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] text-[#6B7280]">{f.label}</span>
                <span className="text-xs font-medium text-[#2B2B2B]">{f.value}</span>
              </div>
            ))}
          </div>
        )}

        {event.notes && (
          <p className="text-xs text-[#6B7280] mt-3 leading-relaxed">{event.notes}</p>
        )}
      </Card>
    </div>
  );
}
