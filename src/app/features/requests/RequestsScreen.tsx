import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Btn, Card } from "../../components/shared";
import { useAuth, hasPermission } from "../../auth";

// ─────────────────────────────────────────────
// Requests
// ─────────────────────────────────────────────

export function RequestsScreen() {
  const [tab, setTab] = useState("transfer");
  const { currentUser } = useAuth();
  const canCreate = hasPermission(currentUser, "requests.create");

  const requests = [
    { id: "REQ-2024-0041", asset: "حاسوب Dell OptiPlex",   from: "تقنية المعلومات", to: "المالية",          date: "2024-06-14", status: "pending"   as const },
    { id: "REQ-2024-0038", asset: "جهاز عرض Epson",        from: "الإدارة",         to: "الموارد البشرية",  date: "2024-06-12", status: "approved"  as const },
    { id: "REQ-2024-0035", asset: "طابعة HP LaserJet",     from: "السجلات",          to: "المالية",          date: "2024-06-10", status: "rejected"  as const },
    { id: "REQ-2024-0031", asset: "ماسح ضوئي Canon",       from: "تقنية المعلومات", to: "الإدارة",          date: "2024-06-08", status: "completed" as const },
  ];

  const reqStatus = {
    pending:   { label: "بانتظار الموافقة", bg: "#FDF6ED", text: "#8B6914" },
    approved:  { label: "معتمد",            bg: "#EDF3EF", text: "#3D6B47" },
    rejected:  { label: "مرفوض",            bg: "#FAEDED", text: "#9E3A3A" },
    completed: { label: "مكتمل",            bg: "#EEF0F8", text: "#2A3172" },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2B2B2B]">الطلبات</h1>
        {canCreate && <Btn variant="primary" icon={<Plus size={15} />}>طلب جديد</Btn>}
      </div>

      <div className="flex gap-1 bg-[#F7F6F3] p-1 rounded-xl w-fit">
        {[
          { id: "transfer",    label: "طلبات النقل",   count: 4 },
          { id: "maintenance", label: "طلبات الصيانة", count: 7 },
          { id: "disposal",    label: "طلبات الشطب",   count: 1 },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
              ${tab === t.id ? "bg-white text-[#2B2B2B] shadow-sm" : "text-[#6B7280] hover:text-[#2B2B2B]"}`}>
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
              ${tab === t.id ? "bg-[#EEF0F8] text-[#2A3172]" : "bg-[#E5E7EB] text-[#6B7280]"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <Card p={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#FAFAF9]">
                {["رقم الطلب", "الأصل", "من", "إلى", "التاريخ", "الحالة", ""].map(h => (
                  <th key={h} className="text-right text-xs text-[#6B7280] font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r, i) => {
                const s = reqStatus[r.status];
                return (
                  <tr key={r.id} className={`hover:bg-[#FAFAF9] ${i < requests.length - 1 ? "border-b border-[#F7F6F3]" : ""}`}>
                    <td className="px-5 py-3.5 font-mono text-xs text-[#3D4589] font-medium">{r.id}</td>
                    <td className="px-5 py-3.5 text-[#2B2B2B] font-medium">{r.asset}</td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{r.from}</td>
                    <td className="px-5 py-3.5 text-[#6B7280]">{r.to}</td>
                    <td className="px-5 py-3.5 text-[#6B7280] font-mono text-xs">{r.date}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.text }}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="p-1.5 text-[#6B7280] hover:text-[#2A3172] hover:bg-[#EEF0F8] rounded-md transition-colors">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
