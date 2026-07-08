import { useState } from "react";
import { Settings2, Table2, FormInput } from "lucide-react";
import { useAuth, hasPermission } from "../../auth";
import { Card } from "../../components/shared";
import { TableColumnsSettings } from "./TableColumnsSettings";
import { CustomFieldsSettings } from "./CustomFieldsSettings";

// ─────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────

type SettingsTab = "general" | "table-columns" | "custom-fields";

export function SettingsScreen() {
  const { currentUser } = useAuth();
  const isSuperAdmin = hasPermission(currentUser, "settings.manage");

  const [emailNotif, setEmail]    = useState(true);
  const [pushNotif,  setPush]     = useState(false);
  const [twoFA,      setTwoFA]    = useState(true);
  const [sessionTTL, setSession]  = useState("30");
  const [tab, setTab]             = useState<SettingsTab>("general");

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0"
      style={{ background: value ? "#2A3172" : "#E5E7EB" }}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200
        ${value ? "right-1" : "right-6"}`} />
    </button>
  );

  const sections = [
    {
      title: "عام",
      items: [
        {
          label: "لغة الواجهة", desc: "اختر اللغة المفضلة لعرض النظام",
          control: (
            <select className="text-sm px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none appearance-none cursor-pointer">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          ),
        },
        {
          label: "المنطقة الزمنية", desc: "التوقيت الرسمي للمملكة العربية السعودية",
          control: (
            <select className="text-sm px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none appearance-none cursor-pointer">
              <option>GMT+3 — الرياض</option>
            </select>
          ),
        },
      ],
    },
    {
      title: "الإشعارات",
      items: [
        { label: "إشعارات البريد الإلكتروني", desc: "استلام تنبيهات النظام عبر البريد الإلكتروني",    control: <Toggle value={emailNotif} onChange={setEmail} /> },
        { label: "الإشعارات الفورية",          desc: "إشعارات المتصفح للأحداث والتنبيهات العاجلة",   control: <Toggle value={pushNotif}  onChange={setPush}  /> },
      ],
    },
    {
      title: "الأمان",
      items: [
        { label: "المصادقة الثنائية",  desc: "طبقة أمان إضافية عند كل تسجيل دخول",              control: <Toggle value={twoFA} onChange={setTwoFA} /> },
        {
          label: "مهلة انتهاء الجلسة", desc: "تسجيل الخروج تلقائياً بعد فترة عدم النشاط",
          control: (
            <select value={sessionTTL} onChange={e => setSession(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white focus:outline-none appearance-none cursor-pointer">
              <option value="15">15 دقيقة</option>
              <option value="30">30 دقيقة</option>
              <option value="60">60 دقيقة</option>
              <option value="120">ساعتان</option>
            </select>
          ),
        },
      ],
    },
  ];

  const adminTabs: { id: SettingsTab; label: string; icon: typeof Settings2 }[] = [
    { id: "general",        label: "عام",            icon: Settings2  },
    { id: "table-columns",  label: "أعمدة الجدول",   icon: Table2     },
    { id: "custom-fields",  label: "الحقول المخصصة", icon: FormInput  },
  ];

  const visibleTabs = isSuperAdmin ? adminTabs : adminTabs.filter(t => t.id === "general");

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#2B2B2B]">الإعدادات</h1>

      {isSuperAdmin && (
        <div className="flex gap-1 bg-[#F7F6F3] p-1 rounded-xl w-fit flex-wrap">
          {visibleTabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${tab === t.id ? "bg-white text-[#2B2B2B] shadow-sm" : "text-[#6B7280] hover:text-[#2B2B2B]"}`}>
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {tab === "table-columns" && isSuperAdmin && <TableColumnsSettings />}
      {tab === "custom-fields" && isSuperAdmin && <CustomFieldsSettings />}

      {tab === "general" && sections.map(sec => (
        <Card key={sec.title}>
          <h3 className="text-sm font-semibold text-[#2B2B2B] mb-4 pb-3 border-b border-[#E5E7EB]">{sec.title}</h3>
          <div className="space-y-4">
            {sec.items.map(item => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2B2B2B]">{item.label}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
                </div>
                {item.control}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
