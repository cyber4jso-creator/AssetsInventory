import type { ElementType } from "react";
import {
  LayoutDashboard, Package, ArrowLeftRight, QrCode, ClipboardList, BarChart3,
  Users, Shield, Bell, Settings, LogOut, Bot, History, Menu,
} from "lucide-react";
import type { Screen } from "../../types";
import { useAuth, hasPermission, ROLE_LABELS } from "../../auth";

const NAV_ITEMS: Array<{ id?: Screen; label: string; icon?: ElementType; permission?: "users.manage" }> = [
  { id: "dashboard",       label: "لوحة التحكم",        icon: LayoutDashboard },
  {                        label: "إدارة الأصول"                               },
  { id: "assets",          label: "قائمة الأصول",        icon: Package         },
  { id: "transfer",        label: "نقل الأصول",          icon: ArrowLeftRight  },
  { id: "qr",              label: "إدارة QR",             icon: QrCode          },
  {                        label: "العمليات"                                    },
  { id: "requests",        label: "الطلبات",              icon: ClipboardList   },
  { id: "reports",         label: "التقارير",             icon: BarChart3       },
  {                        label: "الإدارة"                                     },
  { id: "user-management", label: "المستخدمون",           icon: Users,   permission: "users.manage" },
  { id: "roles",           label: "الأدوار والصلاحيات",  icon: Shield,  permission: "users.manage" },
  { id: "audit-log",       label: "سجل المراجعة",        icon: History         },
];

const BTM_NAV: Array<{ id: Screen; label: string; icon: ElementType }> = [
  { id: "ai-assistant",  label: "المساعد الذكي", icon: Bot      },
  { id: "notifications", label: "الإشعارات",     icon: Bell     },
  { id: "settings",      label: "الإعدادات",     icon: Settings },
];

export function Sidebar({ screen, onNavigate, collapsed, onToggle, onLogout }: {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  const { currentUser } = useAuth();

  return (
    <aside className="flex flex-col h-full flex-shrink-0 transition-all duration-300 overflow-hidden print:hidden"
      style={{ width: collapsed ? 60 : 232, background: "#3E3124" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 h-14 px-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="w-8 h-8 rounded-lg bg-[#556B2F] flex items-center justify-center flex-shrink-0">
          <Package size={15} className="text-[#F7F4EE]" />
        </div>
        {!collapsed && (
          <span className="text-[#F7F4EE] font-bold text-sm leading-tight truncate flex-1">نظام حصر الأصول</span>
        )}
        <button onClick={onToggle}
          className="text-[#8B7F72] hover:text-[#F7F4EE] transition-colors p-1 rounded flex-shrink-0 cursor-pointer">
          <Menu size={15} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
        {NAV_ITEMS.filter(item => !item.permission || hasPermission(currentUser, item.permission)).map((item, i) => {
          if (!item.id) {
            if (collapsed) return null;
            return (
              <p key={i} className="px-2 pt-5 pb-1 text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#5E4F40" }}>
                {item.label}
              </p>
            );
          }
          const Icon = item.icon!;
          const active = screen === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id!)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-right cursor-pointer
                ${active ? "bg-[#556B2F] text-[#F7F4EE]" : "text-[#B8A99A] hover:text-[#F7F4EE]"}`}
              style={{ background: active ? "#556B2F" : undefined }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = ""; }}>
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-2 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="pt-2">
          {BTM_NAV.map(item => {
            const Icon = item.icon;
            const active = screen === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all cursor-pointer
                  ${active ? "bg-[#556B2F] text-[#F7F4EE]" : "text-[#B8A99A]"}`}
                style={{ background: active ? "#556B2F" : undefined }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = ""; }}>
                <Icon size={15} className="flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-2 py-2.5 mt-1"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-7 h-7 rounded-full bg-[#556B2F] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#F7F4EE]">{currentUser?.avatar}</span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F7F4EE] truncate">{currentUser?.name}</p>
                <p className="text-[10px] truncate" style={{ color: "#5E4F40" }}>
                  {currentUser && ROLE_LABELS[currentUser.role]}
                </p>
              </div>
              <button onClick={onLogout} title="تسجيل الخروج" className="flex-shrink-0 cursor-pointer" style={{ color: "#5E4F40" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#F7F4EE"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#5E4F40"; }}>
                <LogOut size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

