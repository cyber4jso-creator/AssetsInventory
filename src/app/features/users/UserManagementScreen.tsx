import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { USERS } from "../../data/mock";
import { Btn, Card } from "../../components/shared";

// ─────────────────────────────────────────────
// User Management
// ─────────────────────────────────────────────

export function UserManagementScreen() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#3E3124]">إدارة المستخدمين</h1>
        <Btn variant="primary" icon={<Plus size={15} />}>إضافة مستخدم</Btn>
      </div>
      <Card p={false}>
        <div className="p-4 flex items-center gap-3 border-b border-[#F0EDE7] flex-wrap">
          <div className="flex-1 min-w-40 relative">
            <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#A09580]" />
            <input placeholder="بحث عن مستخدم..." className="w-full pr-9 pl-3 py-2 text-sm rounded-lg border border-[#D8D3C8]
              placeholder:text-[#A09580] focus:outline-none focus:ring-2 focus:ring-[#556B2F]/25 focus:border-[#556B2F]" />
          </div>
          <select className="text-sm px-3 py-2 rounded-lg border border-[#D8D3C8] bg-white text-[#5E5040] focus:outline-none appearance-none cursor-pointer">
            <option>كل الأدوار</option>
            <option>مدير النظام</option>
            <option>مشرف أصول</option>
            <option>مدخل بيانات</option>
            <option>مراجع</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-[#F0EDE7] bg-[#FAFAF8]">
                {["المستخدم", "الدور", "القسم", "آخر دخول", "الحالة", ""].map(h => (
                  <th key={h} className="text-right text-xs text-[#8B7F72] font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map((u, i) => (
                <tr key={u.id} className={`hover:bg-[#FAFAF8] ${i < USERS.length - 1 ? "border-b border-[#F7F5F0]" : ""}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EEF1E8] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#556B2F]">{u.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#3E3124]">{u.name}</p>
                        <p className="text-xs text-[#A09580]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#6B7060]">{u.role}</td>
                  <td className="px-5 py-3.5 text-[#6B7060]">{u.department}</td>
                  <td className="px-5 py-3.5 text-[#8B7F72] text-xs">{u.lastLogin}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.status === "active" ? "bg-[#EBF4E8] text-[#2E5E23]" : "bg-[#F0EDE7] text-[#8B7F72]"}`}>
                      {u.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-[#8B7F72] hover:text-[#556B2F] hover:bg-[#EEF1E8] rounded-md transition-colors"><Edit size={14} /></button>
                      <button className="p-1.5 text-[#8B7F72] hover:text-[#B04A4A] hover:bg-[#FAEAEA] rounded-md transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
