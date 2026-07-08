import { Bell, Search } from "lucide-react";
import type { Screen } from "../../types";
import { useAuth } from "../../auth";

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
  "settings":        "الإعدادات",
};

export function TopBar({ screen, unread, onNotifications }: {
  screen: Screen;
  unread: number;
  onNotifications: () => void;
}) {
  const { currentUser } = useAuth();
  const firstName = currentUser?.name.split(" ")[0] ?? "";

  return (
    <header className="h-14 bg-white flex items-center gap-4 px-5 flex-shrink-0 print:hidden"
      style={{ borderBottom: "1px solid #E8E3D8" }}>
      <span className="text-sm font-semibold text-[#3E3124]">{SCREEN_TITLES[screen]}</span>

      <div className="flex items-center gap-2 mr-auto">
        <div className="relative hidden md:block w-52">
          <Search size={13} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#A09580]" />
          <input placeholder="بحث سريع..."
            className="w-full pr-9 pl-3 py-1.5 text-sm rounded-lg bg-[#F7F5F0] border border-[#E8E3D8]
              placeholder:text-[#A09580] focus:outline-none focus:ring-2 focus:ring-[#556B2F]/25 focus:border-[#556B2F]" />
        </div>

        <button onClick={onNotifications}
          className="relative w-9 h-9 rounded-lg hover:bg-[#F7F5F0] flex items-center justify-center
            text-[#8B7F72] hover:text-[#3E3124] transition-colors cursor-pointer">
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute top-1.5 left-1.5 min-w-[14px] h-3.5 rounded-full bg-[#B04A4A]
              flex items-center justify-center text-[9px] font-bold text-white leading-none px-0.5">
              {unread}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-[#EEF1E8] flex items-center justify-center group-hover:bg-[#E0E8D4] transition-colors">
            <span className="text-xs font-bold text-[#556B2F]">{currentUser?.avatar}</span>
          </div>
          <span className="text-sm font-medium text-[#3E3124] hidden lg:block">{firstName}</span>
        </div>
      </div>
    </header>
  );
}

