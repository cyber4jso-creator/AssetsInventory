import type { ElementType } from "react";
import {
  Plus, Package, CheckCircle, Clock, ArrowLeftRight, QrCode, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import type { NavigateFn, Screen } from "../../types";
import { ASSETS, KPI_DATA, MONTHLY, DEPT_PIE } from "../../data/mock";
import { Btn, Card, Chip } from "../../components/shared";

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────

export function DashboardScreen({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B]">مرحباً، محمد</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Btn variant="primary" icon={<Plus size={15} />} onClick={() => onNavigate("add-asset")}>إضافة أصل</Btn>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map(k => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#6B7280] mb-2 leading-tight">{k.label}</p>
                <p className="text-3xl font-bold text-[#2B2B2B] leading-none">{k.value}</p>
                <p className={`text-xs mt-2 font-medium ${k.up ? "text-[#4F7C5A]" : "text-[#C44D4D]"}`}>
                  {k.change} عن الشهر الماضي
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: k.bg }}>
                <Icon size={18} style={{ color: k.color }} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2" p={false}>
          <div className="p-5 pb-0 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#2B2B2B]">نشاط الأصول — آخر 6 أشهر</h3>
            <span className="text-xs text-[#6B7280]">2024</span>
          </div>
          <div className="px-2 pt-2 pb-4" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2A3172" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2A3172" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#3D4589" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3D4589" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "IBM Plex Sans Arabic" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "IBM Plex Sans Arabic" }} />
                <Area type="monotone" dataKey="إضافات" stroke="#2A3172" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="نقل"     stroke="#3D4589" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card p={false}>
          <div className="p-5 pb-2">
            <h3 className="text-sm font-semibold text-[#2B2B2B]">توزيع الأصول بالقسم</h3>
          </div>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DEPT_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2}>
                  {DEPT_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 11, fontFamily: "IBM Plex Sans Arabic" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-5 space-y-1.5">
            {DEPT_PIE.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[#6B7280]">{d.name}</span>
                </div>
                <span className="font-mono font-medium text-[#2B2B2B]">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent assets */}
      <Card p={false}>
        <div className="p-5 flex items-center justify-between border-b border-[#E5E7EB]">
          <h3 className="text-sm font-semibold text-[#2B2B2B]">آخر الأصول المضافة</h3>
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("assets")}>عرض الكل</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E5E7EB]">
                {["رقم الأصل", "الاسم", "القسم", "الحالة", "تاريخ الإضافة"].map(h => (
                  <th key={h} className="text-right text-xs text-[#6B7280] font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ASSETS.slice(0, 5).map((a, i) => (
                <tr key={a.id}
                  className={`hover:bg-[#FAFAF9] transition-colors cursor-pointer ${i < 4 ? "border-b border-[#F7F6F3]" : ""}`}
                  onClick={() => onNavigate("asset-detail")}>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#3D4589] font-medium">{a.id}</td>
                  <td className="px-5 py-3.5 text-[#2B2B2B] font-medium">{a.name}</td>
                  <td className="px-5 py-3.5 text-[#6B7280]">{a.department}</td>
                  <td className="px-5 py-3.5"><Chip status={a.status} /></td>
                  <td className="px-5 py-3.5 text-[#6B7280] font-mono text-xs">{a.purchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          { label: "نقل أصل",     icon: ArrowLeftRight, screen: "transfer"    as Screen },
          { label: "طلب صيانة",   icon: Clock,          screen: "requests"    as Screen },
          { label: "إنشاء QR",    icon: QrCode,         screen: "qr"          as Screen },
          { label: "التقارير",    icon: BarChart3,       screen: "reports"     as Screen },
        ] as Array<{ label: string; icon: ElementType; screen: Screen }>).map(a => {
          const Icon = a.icon;
          return (
            <button key={a.label} onClick={() => onNavigate(a.screen)}
              className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3
                hover:bg-[#F7F6F3] hover:border-[#9CA3AF] transition-all cursor-pointer text-right">
              <div className="w-9 h-9 rounded-lg bg-[#EEF0F8] flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#2A3172]" />
              </div>
              <span className="text-sm font-medium text-[#2B2B2B]">{a.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
