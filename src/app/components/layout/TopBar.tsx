import { useState } from "react";
import { Bell, Search } from "lucide-react";
import type { Screen } from "../../types";
import { useAuth, hasPermission } from "../../auth";

const SCREEN_TITLES: Record<Screen, string> = {
  "dashboard":       "لوحة التحكم",
  "assets":          "قائمة الأصول",
  "asset-detail":    "تفاصيل الأصل",
  "asset-report":    "تقرير الأصل",
  "add-asset":       "إضافة أصل جديد",
  "transfer":        "نقل الأصول",
  "qr":              "إدارة رموز QR",
  "requests":        "الطلبات",
  "reports":         "التقارير والتحليلات",
  "user-management": "إدارة المستخدمين",
  "roles":           "الأدوار والصلاحيات",
  "audit-log":       "سجل المراجعة",
  "ai-assistant":    "المساعد الذكي",
  "notifications":   "الإشعارات",
  "profile":         "الملف الشخصي",
  "settings":        "الإعدادات",
};

export function TopBar({ screen, unread, onNotifications, onProfile, onSearch }: {
  screen: Screen;
  unread: number;
  onNotifications: () => void;
  onProfile: () => void;
  onSearch: (query: string) => void;
}) {
  const { currentUser } = useAuth();
  const canViewNotifications = hasPermission(currentUser, "notifications.view");
  const [quickSearch, setQuickSearch] = useState("");

  return (
    <header className="h-14 bg-white flex items-center gap-4 px-5 flex-shrink-0 print:hidden"
      style={{ borderBottom: "1px solid #E5E7EB" }}>
      <span className="text-sm font-semibold text-[#2B2B2B]">{SCREEN_TITLES[screen]}</span>

      <div className="flex items-center gap-2 mr-auto">
        <div className="relative hidden md:block w-52">
          <Search size={13} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7280]" aria-hidden />
          <input
            placeholder="بحث سريع..."
            value={quickSearch}
            onChange={e => setQuickSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && quickSearch.trim()) onSearch(quickSearch.trim());
            }}
            aria-label="بحث سريع في الأصول"
            className="w-full pr-9 pl-3 py-1.5 text-sm rounded-lg bg-[#F7F6F3] border border-[#E5E7EB]
              placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]"
          />
        </div>

        {canViewNotifications && (
          <button type="button" onClick={onNotifications} aria-label="الإشعارات"
            className="relative w-9 h-9 rounded-lg hover:bg-[#F7F6F3] flex items-center justify-center
              text-[#6B7280] hover:text-[#2B2B2B] transition-colors cursor-pointer">
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute top-1.5 left-1.5 min-w-[14px] h-3.5 rounded-full bg-[#C44D4D]
                flex items-center justify-center text-[9px] font-bold text-white leading-none px-0.5">
                {unread}
              </span>
            )}
          </button>
        )}

        <button type="button" onClick={onProfile} aria-label="الملف الشخصي" className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-[#EEF0F8] flex items-center justify-center group-hover:bg-[#E5E8F5] transition-colors">
            <span className="text-xs font-bold text-[#2A3172]">{currentUser?.avatar}</span>
          </div>
          <span className="text-sm font-medium text-[#2B2B2B] hidden lg:block">{currentUser?.name}</span>
        </button>
      </div>
    </header>
  );
}
