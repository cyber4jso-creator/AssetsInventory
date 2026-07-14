import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Upload, Download, ListChecks, X,
} from "lucide-react";
import type { Asset, Screen } from "../../types";
import { Btn, Card, Skeleton, PaginationBar, toast } from "../../components/shared";
import { useAuth, hasPermission, hasReportsExport } from "../../auth";
import { getVisibleAssetsForUser } from "../../utils/assetScope";
import { exportToCsv } from "../../utils/csvExport";
import { useAssetsData } from "./contexts/AssetsDataContext";
import { AssetsFilterBar } from "./components/AssetsFilterBar";
import { CategoryTabs } from "./components/CategoryTabs";
import {
  EMPTY_ROLE_FILTERS,
  hasActiveRoleExplorerState,
  matchesRoleFilters,
  type RoleAssetFilters,
} from "./utils/roleAssetFilters";
import type { ExplorerTabId } from "./utils/assetExplorer";
import { matchesExplorerTab, matchesSearch } from "./utils/assetExplorer";
import { getTotalPages } from "../../utils/paginate";
import { AssetsTable } from "./AssetsTable";
import { AssetDetailsPanel } from "./AssetDetailsPanel";
import { ColumnVisibilityPopover } from "./ColumnVisibilityPopover";

// ─────────────────────────────────────────────
// Assets Management — Enterprise Asset Explorer
// ─────────────────────────────────────────────

const PER_PAGE = 10;

type AssetSortKey = "id" | "name" | "department" | "status" | "category";

const SORT_OPTIONS: { key: AssetSortKey; label: string }[] = [
  { key: "id", label: "رقم الأصل" },
  { key: "name", label: "الاسم" },
  { key: "department", label: "القسم" },
  { key: "status", label: "الحالة" },
  { key: "category", label: "الفئة" },
];

export function AssetsScreen({ onOpenAsset, initialSearch }: {
  onOpenAsset: (assetId: string | null, screen: Screen) => void;
  initialSearch?: string;
}) {
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState(initialSearch ?? "");
  const [activeTab, setActiveTab]           = useState<ExplorerTabId>("all");
  const [filters, setFilters]               = useState<RoleAssetFilters>(EMPTY_ROLE_FILTERS);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds]         = useState<Set<string>>(new Set());
  const [page, setPage]                     = useState(1);
  const [sortKey, setSortKey]               = useState<AssetSortKey>("id");
  const [sortAsc, setSortAsc]               = useState(true);

  const { currentUser } = useAuth();
  const { assets } = useAssetsData();

  const visibleAssets = useMemo(
    () => getVisibleAssetsForUser(assets, currentUser),
    [assets, currentUser],
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearch]);

  const filtered = useMemo(
    () => visibleAssets.filter(a =>
      matchesExplorerTab(a, activeTab) &&
      matchesRoleFilters(a, filters) &&
      matchesSearch(a, search),
    ),
    [visibleAssets, activeTab, filters, search],
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      const cmp = av.localeCompare(bv, "ar");
      return sortAsc ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortAsc]);

  const totalPages = getTotalPages(sorted.length, PER_PAGE);
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);
  const selectedAsset = visibleAssets.find(a => a.id === selectedAssetId) ?? null;

  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page]);

  useEffect(() => {
    if (selectedAssetId && !filtered.some(a => a.id === selectedAssetId)) {
      setSelectedAssetId(null);
    }
  }, [filtered, selectedAssetId]);

  const resetExplorer = () => {
    setSearch("");
    setActiveTab("all");
    setFilters(EMPTY_ROLE_FILTERS);
    setPage(1);
  };

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const updateFilters = (next: RoleAssetFilters) => {
    setFilters(next);
    setPage(1);
  };

  const updateTab = (tab: ExplorerTabId) => {
    setActiveTab(tab);
    setPage(1);
  };

  const toggleChecked = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canCreate = hasPermission(currentUser, "assets.create");
  const canExport = hasReportsExport(currentUser);

  const exportAssets = (list: Asset[]) => {
    exportToCsv(
      "assets-export",
      ["رقم الأصل", "الاسم", "الفئة", "القسم", "الحالة", "المسؤول", "تاريخ الشراء", "القيمة"],
      list.map(a => [a.id, a.name, a.category, a.department, a.status, a.assignedUserId ?? "", a.purchaseDate, a.value]),
    );
    toast.success("تم تصدير الملف بنجاح", `${list.length} أصل تم تصديرهم إلى CSV`);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-5 w-full">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#2B2B2B]">إدارة الأصول</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">استكشف وإدارة أصول المؤسسة عبر منصة موحدة</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Btn variant="secondary" size="sm" icon={<Upload size={13} />} onClick={() => toast.deferred("استيراد الأصول")}>استيراد</Btn>
          {canExport && (
            <Btn variant="secondary" size="sm" icon={<Download size={13} />} onClick={() => exportAssets(filtered)}>تصدير</Btn>
          )}
          {canCreate && (
            <Btn variant="primary" icon={<Plus size={15} />} onClick={() => onOpenAsset(null, "add-asset")}>إضافة أصل</Btn>
          )}
        </div>
      </div>

      {/* Explorer workspace */}
      <div className="space-y-4 min-w-0 w-full">
        <div className="relative">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-[#6B7280]" aria-hidden />
          <input
            placeholder="ابحث برقم الأصل، الاسم، الفئة، المورّد، المسؤول، القسم، الرقم التسلسلي، اسم المضيف، أو عنوان IP..."
            value={search}
            onChange={e => updateSearch(e.target.value)}
            aria-label="بحث في الأصول"
            className="w-full pr-11 pl-4 py-3 text-sm rounded-xl border border-[#E5E7EB] bg-white
              placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#D0A165]/30 focus:border-[#D0A165]"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs text-[#6B7280]">ترتيب حسب</label>
          <select
            value={sortKey}
            onChange={e => { setSortKey(e.target.value as AssetSortKey); setPage(1); }}
            aria-label="ترتيب الأصول"
            className="text-sm px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#2B2B2B] focus:outline-none appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
          <button
            type="button"
            onClick={() => setSortAsc(a => !a)}
            aria-label={sortAsc ? "ترتيب تصاعدي" : "ترتيب تنازلي"}
            className="text-xs px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-[#2A3172] hover:bg-[#F7F6F3] cursor-pointer"
          >
            {sortAsc ? "↑ تصاعدي" : "↓ تنازلي"}
          </button>
        </div>

        <AssetsFilterBar
          filters={filters}
          onChange={updateFilters}
          visibleAssets={visibleAssets}
          currentUser={currentUser}
        />

        {checkedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#EEF0F8] border border-[#D5DCE8] rounded-xl">
            <ListChecks size={15} className="text-[#2A3172] flex-shrink-0" />
            <span className="text-sm font-medium text-[#2A3172]">{checkedIds.size} محدد</span>
            {canExport && (
              <Btn variant="ghost" size="sm" onClick={() => exportAssets(visibleAssets.filter(a => checkedIds.has(a.id)))}>
                تصدير المحدد
              </Btn>
            )}
            <button
              type="button"
              onClick={() => setCheckedIds(new Set())}
              className="mr-auto flex items-center gap-1 text-xs text-[#2A3172] hover:text-[#222966] transition-colors cursor-pointer"
            >
              <X size={12} /> إلغاء التحديد
            </button>
          </div>
        )}

        <Card p={false} className="w-full">
          <div className="px-4 pt-2 border-b border-[#E5E7EB] flex items-end justify-between gap-3 flex-wrap">
            <CategoryTabs active={activeTab} onChange={updateTab} assets={visibleAssets} />
            <div className="pb-2">
              <ColumnVisibilityPopover />
            </div>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : (
            <>
              <AssetsTable
                assets={paginated}
                selectedId={selectedAssetId}
                checkedIds={checkedIds}
                onSelect={setSelectedAssetId}
                onOpenAsset={onOpenAsset}
                onToggleCheck={toggleChecked}
                onResetFilters={
                  hasActiveRoleExplorerState(filters, search, activeTab) ? resetExplorer : undefined
                }
              />

              <PaginationBar
                page={safePage}
                totalPages={totalPages}
                totalItems={sorted.length}
                perPage={PER_PAGE}
                onPageChange={setPage}
              />
            </>
          )}
        </Card>

        <AssetDetailsPanel selectedAsset={selectedAsset} />
      </div>
    </div>
  );
}
