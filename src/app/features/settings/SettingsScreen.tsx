import { useState } from "react";
import { Card } from "../../components/shared";

// ─────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────

export function SettingsScreen() {
  const [emailNotif, setEmail]    = useState(true);
  const [pushNotif,  setPush]     = useState(false);
  const [twoFA,      setTwoFA]    = useState(true);
  const [sessionTTL, setSession]  = useState("30");

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)}
      className="w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0"
      style={{ background: value ? "#556B2F" : "#D8D3C8" }}>
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
            <select className="text-sm px-3 py-1.5 rounded-lg border border-[#D8D3C8] bg-white focus:outline-none appearance-none cursor-pointer">
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          ),
        },
        {
          label: "المنطقة الزمنية", desc: "التوقيت الرسمي للمملكة العربية السعودية",
          control: (
            <select className="text-sm px-3 py-1.5 rounded-lg border border-[#D8D3C8] bg-white focus:outline-none appearance-none cursor-pointer">
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
              className="text-sm px-3 py-1.5 rounded-lg border border-[#D8D3C8] bg-white focus:outline-none appearance-none cursor-pointer">
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

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#3E3124]">الإعدادات</h1>
      {sections.map(sec => (
        <Card key={sec.title}>
          <h3 className="text-sm font-semibold text-[#3E3124] mb-4 pb-3 border-b border-[#F0EDE7]">{sec.title}</h3>
          <div className="space-y-4">
            {sec.items.map(item => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3E3124]">{item.label}</p>
                  <p className="text-xs text-[#8B7F72] mt-0.5">{item.desc}</p>
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
