import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, Info, Inbox, Search } from "lucide-react";
import type { NotificationItem } from "../../types";
import { EmptyState } from "../../components/shared";
import { matchesQuery } from "../../utils/search";

export function NotificationsScreen({ notifications, onChange }: {
  notifications: NotificationItem[];
  onChange: (next: NotificationItem[]) => void;
}) {
  const [search, setSearch] = useState("");
  const markAllRead = () => onChange(notifications.map(n => ({ ...n, read: true })));

  const filtered = useMemo(
    () => notifications.filter(n => matchesQuery(search, n.title, n.body, n.time)),
    [notifications, search],
  );

  const iconStyle = {
    warning: { bg: "#FDF6ED", icon: <AlertTriangle size={14} className="text-[#D0A165]" /> },
    success: { bg: "#EDF3EF", icon: <CheckCircle size={14} className="text-[#4F7C5A]" /> },
    info:    { bg: "#EEF0F8", icon: <Info size={14} className="text-[#3D4589]" /> },
  };

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#2B2B2B]">الإشعارات</h1>
        {notifications.some(n => !n.read) && (
          <button type="button" onClick={markAllRead} className="text-sm text-[#2A3172] hover:underline cursor-pointer">
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      <div className="relative max-w-xl">
        <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" aria-hidden />
        <input
          placeholder="بحث في الإشعارات..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="بحث في الإشعارات"
          className="w-full pr-9 pl-3 py-2.5 text-sm rounded-lg border border-[#E5E7EB] bg-white
            placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={notifications.length === 0 ? "لا توجد إشعارات" : "لا توجد إشعارات مطابقة"}
          subtitle={notifications.length === 0 ? "ستظهر هنا التنبيهات والتحديثات" : "جرّب تعديل كلمة البحث"}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const is = iconStyle[n.type];
            return (
              <div
                key={n.id}
                role="button"
                tabIndex={0}
                onClick={() => onChange(notifications.map(x => x.id === n.id ? { ...x, read: true } : x))}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onChange(notifications.map(x => x.id === n.id ? { ...x, read: true } : x)); }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer
                  ${n.read ? "bg-white border-[#E5E7EB] opacity-70" : "bg-white border-[#9CA3AF] shadow-sm"}`}
              >
                {!n.read && <span className="w-2 h-2 rounded-full bg-[#2A3172] mt-2 flex-shrink-0" aria-hidden />}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: is.bg }}>
                  {is.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? "text-[#6B7280] font-normal" : "text-[#2B2B2B] font-semibold"}`}>{n.title}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">{n.body}</p>
                </div>
                <span className="text-xs text-[#6B7280] flex-shrink-0 mt-0.5 whitespace-nowrap">{n.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
