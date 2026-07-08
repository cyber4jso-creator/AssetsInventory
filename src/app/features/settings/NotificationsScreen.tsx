import { useState } from "react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { NOTIFICATIONS } from "../../data/mock";

// ─────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────

export function NotificationsScreen() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  const iconStyle = {
    warning: { bg: "#FDF6ED", icon: <AlertTriangle size={14} className="text-[#D0A165]" /> },
    success: { bg: "#EDF3EF", icon: <CheckCircle   size={14} className="text-[#4F7C5A]" /> },
    info:    { bg: "#EEF0F8", icon: <Info          size={14} className="text-[#3D4589]" /> },
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2B2B2B]">الإشعارات</h1>
        <button onClick={markAllRead} className="text-sm text-[#2A3172] hover:underline">
          تحديد الكل كمقروء
        </button>
      </div>

      <div className="space-y-2">
        {notifs.map(n => {
          const is = iconStyle[n.type as keyof typeof iconStyle];
          return (
            <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer
                ${n.read ? "bg-white border-[#E5E7EB] opacity-70" : "bg-white border-[#9CA3AF] shadow-sm"}`}>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#2A3172] mt-2 flex-shrink-0" />}
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
    </div>
  );
}
