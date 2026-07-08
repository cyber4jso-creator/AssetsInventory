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
          <h1 className="text-2xl font-bold text-[#3E3124]">مرحباً، محمد</h1>
          <p className="text-sm text-[#8B7F72] mt-0.5">
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
                <p className="text-xs text-[#8B7F72] mb-2 leading-tight">{k.label}</p>
                <p className="text-3xl font-bold text-[#3E3124] leading-none">{k.value}</p>
                <p className={`text-xs mt-2 font-medium ${k.up ? "text-[#5E8B4A]" : "text-[#B04A4A]"}`}>
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
            <h3 className="text-sm font-semibold text-[#3E3124]">نشاط الأصول — آخر 6 أشهر</h3>
            <span className="text-xs text-[#8B7F72]">2024</span>
          </div>
          <div className="px-2 pt-2 pb-4" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#556B2F" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#556B2F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#5B7C99" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#5B7C99" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#A09580", fontFamily: "IBM Plex Sans Arabic" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#A09580" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #D8D3C8", fontSize: 12, fontFamily: "IBM Plex Sans Arabic" }} />
                <Area type="monotone" dataKey="إضافات" stroke="#556B2F" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="نقل"     stroke="#5B7C99" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card p={false}>
          <div className="p-5 pb-2">
            <h3 className="text-sm font-semibold text-[#3E3124]">توزيع الأصول بالقسم</h3>
          </div>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={DEPT_PIE} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2}>
                  {DEPT_PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #D8D3C8", fontSize: 11, fontFamily: "IBM Plex Sans Arabic" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-5 space-y-1.5">
            {DEPT_PIE.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-[#5E5040]">{d.name}</span>
                </div>
                <span className="font-mono font-medium text-[#3E3124]">{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent assets */}
      <Card p={false}>
        <div className="p-5 flex items-center justify-between border-b border-[#F0EDE7]">
          <h3 className="text-sm font-semibold text-[#3E3124]">آخر الأصول المضافة</h3>
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("assets")}>عرض الكل</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#F0EDE7]">
                {["رقم الأصل", "الاسم", "القسم", "الحالة", "تاريخ الإضافة"].map(h => (
                  <th key={h} className="text-right text-xs text-[#8B7F72] font-medium px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ASSETS.slice(0, 5).map((a, i) => (
                <tr key={a.id}
                  className={`hover:bg-[#FAFAF8] transition-colors cursor-pointer ${i < 4 ? "border-b border-[#F7F5F0]" : ""}`}
                  onClick={() => onNavigate("asset-detail")}>
                  <td className="px-5 py-3.5 font-mono text-xs text-[#6B7D45] font-medium">{a.id}</td>
                  <td className="px-5 py-3.5 text-[#3E3124] font-medium">{a.name}</td>
                  <td className="px-5 py-3.5 text-[#6B7060]">{a.department}</td>
                  <td className="px-5 py-3.5"><Chip status={a.status} /></td>
                  <td className="px-5 py-3.5 text-[#8B7F72] font-mono text-xs">{a.purchaseDate}</td>
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
              className="bg-white border border-[#D8D3C8] rounded-xl p-4 flex items-center gap-3
                hover:bg-[#F7F4EE] hover:border-[#C4B9A8] transition-all cursor-pointer text-right">
              <div className="w-9 h-9 rounded-lg bg-[#EEF1E8] flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#556B2F]" />
              </div>
              <span className="text-sm font-medium text-[#3E3124]">{a.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
