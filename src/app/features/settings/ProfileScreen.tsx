import { Mail, Building2, Shield, User } from "lucide-react";
import { Card } from "../../components/shared";
import { useAuth, ROLE_LABELS } from "../../auth";

// ─────────────────────────────────────────────
// Profile — read-only view of the signed-in user
// ─────────────────────────────────────────────

export function ProfileScreen() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const fields = [
    { label: "الاسم", value: currentUser.name, icon: User },
    { label: "البريد الإلكتروني", value: currentUser.email, icon: Mail },
    { label: "الدور", value: ROLE_LABELS[currentUser.role], icon: Shield },
    { label: "القسم", value: currentUser.department, icon: Building2 },
  ];

  return (
    <div className="space-y-5 w-full">
      <div>
        <h1 className="text-2xl font-bold text-[#2B2B2B]">الملف الشخصي</h1>
        <p className="text-sm text-[#6B7280] mt-0.5">عرض بيانات حسابك الحالية</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E7EB]">
          <div className="w-14 h-14 rounded-full bg-[#EEF0F8] flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-[#2A3172]">{currentUser.avatar}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#2B2B2B]">{currentUser.name}</p>
            <p className="text-sm text-[#6B7280]">{ROLE_LABELS[currentUser.role]}</p>
          </div>
        </div>

        <div className="space-y-4">
          {fields.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F7F6F3] flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#2A3172]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">{f.label}</p>
                  <p className="text-sm font-medium text-[#2B2B2B]">{f.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
