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
    warning: { bg: "#FDF4DC", icon: <AlertTriangle size={14} className="text-[#C79A32]" /> },
    success: { bg: "#EBF4E8", icon: <CheckCircle   size={14} className="text-[#5E8B4A]" /> },
    info:    { bg: "#E8F0F8", icon: <Info          size={14} className="text-[#5B7C99]" /> },
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3E3124]">الإشعارات</h1>
        <button onClick={markAllRead} className="text-sm text-[#556B2F] hover:underline">
          تحديد الكل كمقروء
        </button>
      </div>

      <div className="space-y-2">
        {notifs.map(n => {
          const is = iconStyle[n.type as keyof typeof iconStyle];
          return (
            <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer
                ${n.read ? "bg-white border-[#D8D3C8] opacity-70" : "bg-white border-[#C4B9A8] shadow-sm"}`}>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#556B2F] mt-2 flex-shrink-0" />}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: is.bg }}>
                {is.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? "text-[#6B7060] font-normal" : "text-[#3E3124] font-semibold"}`}>{n.title}</p>
                <p className="text-xs text-[#8B7F72] mt-0.5 leading-relaxed">{n.body}</p>
              </div>
              <span className="text-xs text-[#A09580] flex-shrink-0 mt-0.5 whitespace-nowrap">{n.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
