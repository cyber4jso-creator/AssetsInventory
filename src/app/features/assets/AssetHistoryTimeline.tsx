import { useState } from "react";
import { Inbox } from "lucide-react";
import type { AssetHistoryEvent, AssetHistoryEventType } from "../../types";
import { HISTORY_EVENT_META } from "../../data/mock";
import { Card, Chip, EmptyState } from "../../components/shared";
import { formatDateTime } from "../../utils/date";
import { InfoSectionCard } from "./components/asset-detail/InfoSectionCard";

// ─────────────────────────────────────────────
// Asset History Timeline — enterprise lifecycle view
// ─────────────────────────────────────────────

type HistoryFilter = "all" | AssetHistoryEventType;

const FILTERS: { value: HistoryFilter; label: string }[] = [
  { value: "all",            label: "الكل" },
  { value: "created",        label: "الإنشاء" },
  { value: "assigned",       label: "الإسناد" },
  { value: "transferred",    label: "النقل" },
  { value: "maintenance",    label: "الصيانة" },
  { value: "status-changed", label: "تغيير الحالة" },
  { value: "warranty",       label: "الضمان" },
  { value: "disposed",       label: "الإخراج" },
];

const FUTURE_EVENT_LABELS = ["استيراد", "تحديث", "QR"] as const;

export function AssetHistoryTimeline({ events }: { events: AssetHistoryEvent[] }) {
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const filtered = events
    .filter(e => filter === "all" || e.type === filter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <InfoSectionCard title="الخط الزمني" subtitle="دورة حياة الأصل — أحداث النظام المسجّلة">
      <div className="flex items-center gap-2 flex-wrap mb-5">
        {FILTERS.map(f => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border cursor-pointer ${
              filter === f.value
                ? "bg-[#2A3172] text-white border-[#2A3172]"
                : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#2A3172] hover:text-[#2A3172]"
            }`}
          >
            {f.label}
          </button>
        ))}
        {FUTURE_EVENT_LABELS.map(label => (
          <span
            key={label}
            title="قريباً"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-dashed border-[#E5E7EB] text-[#9CA3AF] cursor-default"
          >
            {label}
          </span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="لا توجد أحداث"
          subtitle="ستظهر هنا أحداث دورة حياة الأصل فور تسجيلها في النظام"
        />
      ) : (
        <div className="relative pr-1">
          <div className="absolute right-[21px] top-3 bottom-3 w-0.5 bg-[#E5E7EB]" aria-hidden="true" />
          <div className="space-y-5">
            {filtered.map((event, index) => (
              <HistoryEventCard key={event.id} event={event} isFirst={index === 0} />
            ))}
          </div>
        </div>
      )}
    </InfoSectionCard>
  );
}

function HistoryEventCard({ event, isFirst }: { event: AssetHistoryEvent; isFirst: boolean }) {
  const meta = HISTORY_EVENT_META[event.type];
  const Icon = meta.icon;
  const { date, time } = formatDateTime(event.timestamp);
  const fields = meta.getFields(event).filter(f => f.value);

  return (
    <div className="relative flex gap-4">
      <div
        className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-sm ${
          isFirst ? "ring-2 ring-[#2A3172]/20" : ""
        }`}
        style={{ background: meta.bg }}
      >
        <Icon size={17} style={{ color: meta.text }} />
      </div>
      <Card className={`flex-1 transition-shadow ${isFirst ? "shadow-md" : "hover:shadow-md"}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-[#2B2B2B]">{meta.label}</h4>
            {event.status && <Chip status={event.status} />}
          </div>
          <div className="text-left">
            <p className="text-xs font-mono text-[#2B2B2B] font-medium">{date}</p>
            <p className="text-[10px] font-mono text-[#6B7280]">{time}</p>
          </div>
        </div>

        {fields.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 mt-4 pt-4 border-t border-[#E5E7EB]">
            {fields.map(f => (
              <div key={f.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] text-[#6B7280] uppercase tracking-wide">{f.label}</span>
                <span className="text-xs font-medium text-[#2B2B2B] leading-snug">{f.value}</span>
              </div>
            ))}
          </div>
        )}

        {event.notes && (
          <p className="text-xs text-[#6B7280] mt-3 pt-3 border-t border-[#F7F6F3] leading-relaxed">
            {event.notes}
          </p>
        )}
      </Card>
    </div>
  );
}
