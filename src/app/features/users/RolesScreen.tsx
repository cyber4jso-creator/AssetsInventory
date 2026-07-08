import { Plus, CheckCircle, XCircle } from "lucide-react";
import { Btn, Card } from "../../components/shared";

// ─────────────────────────────────────────────
// Roles & Permissions
// ─────────────────────────────────────────────

export function RolesScreen() {
  const roles = ["مدير النظام", "مشرف أصول", "مدخل بيانات", "مراجع", "مستخدم عام"];
  const perms = [
    "عرض الأصول", "إضافة أصل", "تعديل أصل", "حذف أصل",
    "نقل أصل", "اعتماد الطلبات", "إدارة المستخدمين", "عرض التقارير", "سجل المراجعة",
  ];
  const matrix: boolean[][] = [
    [true,  true,  true,  true,  true,  true,  true,  true,  true ],
    [true,  true,  true,  false, true,  true,  false, true,  true ],
    [true,  true,  false, false, false, false, false, false, false],
    [true,  false, false, false, false, false, false, true,  true ],
    [true,  false, false, false, false, false, false, false, false],
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3E3124]">الأدوار والصلاحيات</h1>
        <Btn variant="secondary" icon={<Plus size={14} />}>إضافة دور</Btn>
      </div>
      <Card p={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F0EDE7] bg-[#FAFAF8]">
                <th className="text-right text-xs text-[#8B7F72] font-medium px-5 py-3 min-w-36">الصلاحية</th>
                {roles.map(r => (
                  <th key={r} className="text-center text-xs text-[#8B7F72] font-medium px-4 py-3 min-w-28">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {perms.map((p, pi) => (
                <tr key={p} className="border-b border-[#F7F5F0] hover:bg-[#FAFAF8] last:border-0">
                  <td className="px-5 py-3.5 text-sm text-[#3E3124] font-medium">{p}</td>
                  {roles.map((_, ri) => (
                    <td key={ri} className="px-4 py-3.5 text-center">
                      {matrix[ri][pi]
                        ? <CheckCircle size={16} className="mx-auto text-[#5E8B4A]" />
                        : <XCircle    size={16} className="mx-auto text-[#D8D3C8]" />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
