import { useMemo } from "react";
import type { ElementType } from "react";
import {
  Plus, Package, CheckCircle, Clock, ArrowLeftRight, QrCode, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import type { NavigateFn, Screen } from "../../types";
import { Btn, Card, Chip } from "../../components/shared";
import { useAuth, hasPermission, hasReportsAccess, SCREEN_PERMISSIONS } from "../../auth";
import { buildScopedDashboardView, getVisibleAssetsForUser } from "../../utils/assetScope";
import { useAssetsData } from "../assets/contexts/AssetsDataContext";

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────

const KPI_ICONS = [Package, CheckCircle, Clock, ArrowLeftRight] as const;
const KPI_COLORS = ["#2A3172", "#4F7C5A", "#D0A165", "#3D4589"] as const;
const KPI_BGS = ["#EEF0F8", "#EDF3EF", "#FDF6ED", "#EEF0F8"] as const;

export function DashboardScreen({ onNavigate, onOpenAsset }: {
  onNavigate: NavigateFn;
  onOpenAsset: (id: string | null, target: Screen) => void;
}) {
  const { currentUser } = useAuth();
  const { assets } = useAssetsData();

  const visibleAssets = useMemo(
    () => getVisibleAssetsForUser(assets, currentUser),
    [assets, currentUser],
  );

  const dashboardView = useMemo(
    () => buildScopedDashboardView(visibleAssets, []),
    [visibleAssets],
  );

  const recentAssets = useMemo(
    () => [...visibleAssets].sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate)).slice(0, 5),
    [visibleAssets],
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B]">مرحباً، {currentUser?.name}</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">
            {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        {hasPermission(currentUser, "assets.create") && (
          <Btn variant="primary" icon={<Plus size={15} />} onClick={() => onOpenAsset(null, "add-asset")}>إضافة أصل</Btn>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardView.kpiCards.map((k, i) => {
          const Icon = KPI_ICONS[i];
          return (
            <Card key={k.label} className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[#6B7280] mb-2 leading-tight">{k.label}</p>
                <p className="text-3xl font-bold text-[#2B2B2B] leading-none">{k.value}</p>
                <p className={`text-xs mt-2 font-medium ${k.up ? "text-[#4F7C5A]" : "text-[#C44D4D]"}`}>
                  بيانات محدثة
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: KPI_BGS[i] }}>
                <Icon size={18} style={{ color: KPI_COLORS[i] }} />
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
            <span className="text-xs text-[#6B7280]">{dashboardView.chartYear}</span>
          </div>
          <div className="px-2 pt-2 pb-4" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardView.monthly} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6B7280", fontFamily: "Thmanyah Serif Text" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "Thmanyah Serif Text" }} />
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
                <Pie data={dashboardView.deptPie} dataKey="value" cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={2}>
                  {dashboardView.deptPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 11, fontFamily: "Thmanyah Serif Text" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-5 space-y-1.5">
            {dashboardView.deptPie.map(d => (
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
      <Card p={false} className="w-full">
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
              {recentAssets.map((a, i) => (
                <tr key={a.id}
                  className={`hover:bg-[#FAFAF9] transition-colors cursor-pointer ${i < recentAssets.length - 1 ? "border-b border-[#F7F6F3]" : ""}`}
                  onClick={() => onOpenAsset(a.id, "asset-detail")}>
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
        ] as Array<{ label: string; icon: ElementType; screen: Screen }>)
          .filter(a => {
            if (a.screen === "reports") return hasReportsAccess(currentUser);
            const perm = SCREEN_PERMISSIONS[a.screen];
            return !perm || hasPermission(currentUser, perm);
          })
          .map(a => {
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
