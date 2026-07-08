import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Search, Plus, Upload, Download, SlidersHorizontal, ListChecks, X,
  Package, AlertTriangle, UserCheck, ShieldAlert, PackageCheck,
} from "lucide-react";
import type { Screen } from "../../types";
import { ASSETS } from "../../data/mock";
import { getWarrantyState } from "../../utils/warranty";
import { Btn, Card, Skeleton, StatCard } from "../../components/shared";
import { AssetsFilterSidebar, EMPTY_FILTERS, matchesFilters } from "./AssetsFilterSidebar";
import type { AssetFilters } from "./AssetsFilterSidebar";
import { AssetsTable } from "./AssetsTable";
import { AssetDetailsPanel } from "./AssetDetailsPanel";

// ─────────────────────────────────────────────
// Assets Management
// ─────────────────────────────────────────────

const DEFAULT_PANEL_WIDTH = 320;
const MIN_PANEL_WIDTH = 260;
const MAX_PANEL_WIDTH = 480;

export function AssetsScreen({ onOpenAsset }: {
  onOpenAsset: (assetId: string | null, screen: Screen) => void;
}) {
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filters, setFilters]           = useState<AssetFilters>(EMPTY_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId]     = useState<string | null>(null);
  const [checkedIds, setCheckedIds]     = useState<Set<string>>(new Set());
  const [page, setPage]                 = useState(1);
  const [panelWidth, setPanelWidth]     = useState(DEFAULT_PANEL_WIDTH);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelMobileOpen, setPanelMobileOpen] = useState(false);
  const resizing = useRef(false);
  const perPage = 6;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const q = search.trim();
  const filtered = ASSETS.filter(a =>
    matchesFilters(a, filters) &&
    (!q || a.name.includes(q) || a.id.includes(q) || a.assignedTo.includes(q) || a.serial.includes(q))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated   = filtered.slice((page - 1) * perPage, page * perPage);
  const selectedAsset = ASSETS.find(a => a.id === selectedAssetId) ?? null;
  const activeFilterCount = Object.values(filters).reduce((n, v) => n + v.length, 0);

  useEffect(() => {
    if (selectedAssetId && !filtered.some(a => a.id === selectedAssetId)) {
      setSelectedAssetId(null);
      setPanelMobileOpen(false);
    }
  }, [filtered, selectedAssetId]);

  const updateSearch = (v: string) => { setSearch(v); setPage(1); };
  const updateFilters = (f: AssetFilters) => { setFilters(f); setPage(1); };

  const handleSelectAsset = (id: string) => {
    setSelectedAssetId(id);
    setPanelMobileOpen(true);
  };

  const toggleChecked = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizing.current) return;
      const next = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, window.innerWidth - e.clientX));
      setPanelWidth(next);
    };
    const onUp = () => { resizing.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const totalAssets      = ASSETS.length;
  const criticalCount    = ASSETS.filter(a => a.businessCriticality === "Critical").length;
  const assignedCount    = ASSETS.filter(a => a.assignedTo).length;
  const availableCount   = ASSETS.filter(a => !a.assignedTo).length;
  const expiringCount    = ASSETS.filter(a => getWarrantyState(a.warrantyExpiration) === "expiring").length;
  const departmentCount  = new Set(ASSETS.map(a => a.department)).size;
  const pct = (n: number) => `${Math.round((n / totalAssets) * 100)}% من الإجمالي`;

  const stats = [
    { label: "إجمالي الأصول",         value: String(totalAssets),   subtext: `عبر ${departmentCount} أقسام`, icon: Package,       iconBg: "#EEF0F8", iconColor: "#2A3172" },
    { label: "الأصول الحرجة",          value: String(criticalCount), subtext: pct(criticalCount),            icon: AlertTriangle, iconBg: "#FAEDED", iconColor: "#C44D4D" },
    { label: "الأصول المسندة",         value: String(assignedCount), subtext: pct(assignedCount),            icon: UserCheck,     iconBg: "#EEF0F8", iconColor: "#2A3172" },
    { label: "ضمان قارب على الانتهاء", value: String(expiringCount), subtext: "خلال 60 يوماً",                icon: ShieldAlert,   iconBg: "#FDF6ED", iconColor: "#8B6914" },
    { label: "الأصول المتاحة",         value: String(availableCount),subtext: pct(availableCount),           icon: PackageCheck,  iconBg: "#EDF3EF", iconColor: "#3D6B47" },
  ];

  const panelColumn = panelCollapsed ? "36px" : `${panelWidth}px`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B]">إدارة الأصول</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">إدارة ومراقبة أصول المؤسسة بكفاءة</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Btn variant="secondary" size="sm" icon={<SlidersHorizontal size={13} />} className="xl:hidden"
            onClick={() => setMobileFiltersOpen(o => !o)}>
            الفلاتر{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Btn>
          <span title="قريباً">
            <Btn variant="secondary" size="sm" icon={<Upload size={13} />} disabled>استيراد</Btn>
          </span>
          <Btn variant="secondary" size="sm" icon={<Download size={13} />}>تصدير</Btn>
          <Btn variant="primary" icon={<Plus size={15} />} onClick={() => onOpenAsset(null, "add-asset")}>إضافة أصل</Btn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-[92px]" />)
          : stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Three-column layout: Filters (right) | Table | Details (left) in RTL */}
      <div
        className="grid grid-cols-1 gap-5 items-start xl:grid-cols-[260px_1fr_var(--panel)]"
        style={{ "--panel": panelColumn } as CSSProperties}
      >
        {/* Filters — right side in RTL */}
        <div className={`${mobileFiltersOpen ? "block" : "hidden"} xl:block`}>
          <AssetsFilterSidebar filters={filters} onChange={updateFilters} />
        </div>

        {/* Center — Assets table */}
        <div className="space-y-4 min-w-0">
          <div className="relative">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-[#6B7280]" />
            <input placeholder="ابحث باسم الأصل، الرقم، المسؤول، الرقم التسلسلي..." value={search}
              onChange={e => updateSearch(e.target.value)}
              className="w-full pr-11 pl-4 py-3 text-sm rounded-xl border border-[#E5E7EB] bg-white
                placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]" />
          </div>

          {checkedIds.size > 0 && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#EEF0F8] border border-[#D5DCE8] rounded-xl">
              <ListChecks size={15} className="text-[#2A3172] flex-shrink-0" />
              <span className="text-sm font-medium text-[#2A3172]">{checkedIds.size} محدد</span>
              <Btn variant="ghost" size="sm">تصدير المحدد</Btn>
              <button onClick={() => setCheckedIds(new Set())}
                className="mr-auto flex items-center gap-1 text-xs text-[#2A3172] hover:text-[#222966] transition-colors cursor-pointer">
                <X size={12} /> إلغاء التحديد
              </button>
            </div>
          )}

          <Card p={false}>
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : (
              <>
                <AssetsTable assets={paginated} selectedId={selectedAssetId} checkedIds={checkedIds}
                  onSelect={handleSelectAsset} onOpenAsset={onOpenAsset} onToggleCheck={toggleChecked} />

                {totalPages > 1 && (
                  <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-xs text-[#6B7280]">
                      عرض {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} من {filtered.length}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${p === page ? "bg-[#2A3172] text-white" : "text-[#6B7280] hover:bg-[#F0EFE9]"}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Details panel — left side in RTL */}
        <div className={`${panelMobileOpen && selectedAsset ? "block" : "hidden"} xl:block relative min-w-0`}>
          {!panelCollapsed && (
            <div
              className="hidden xl:block absolute -right-1 top-0 bottom-0 w-2 cursor-col-resize z-10 group"
              onMouseDown={() => { resizing.current = true; }}
              title="سحب لتغيير العرض">
              <div className="w-0.5 h-full mx-auto bg-transparent group-hover:bg-[#D0A165]/40 transition-colors rounded-full" />
            </div>
          )}
          <AssetDetailsPanel
            selectedAsset={selectedAsset}
            collapsed={panelCollapsed}
            onToggleCollapse={() => setPanelCollapsed(c => !c)}
          />
          {panelMobileOpen && selectedAsset && (
            <button
              onClick={() => setPanelMobileOpen(false)}
              className="xl:hidden mt-2 w-full py-2 text-xs text-[#6B7280] hover:text-[#2A3172] transition-colors cursor-pointer">
              إخفاء التفاصيل
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
