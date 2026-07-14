import type { AuthUser } from "../auth/types";
import type { Asset, AssetHistoryEvent } from "../types";
import { MOCK_TODAY } from "../data/mockReferenceDate";
import {
  buildDashboardKpis,
  buildMonthlyActivity,
  buildDeptPieFromAssets,
} from "../data/dashboardStats";

// Frontend scoping is for UX only.
// The Backend must enforce object-level authorization and organizational
// data scope when APIs are implemented.

export function getVisibleAssetsForUser(assets: Asset[], user: AuthUser | null): Asset[] {
  if (!user) return [];

  switch (user.role) {
    case "employee":
      return assets.filter(a => a.assignedUserId === user.id);
    case "department-manager":
      return assets.filter(a => a.departmentId === user.departmentId);
    case "sector-manager":
      return assets.filter(a => a.sectorId === user.sectorId);
    case "asset-manager":
    case "auditor":
      return assets;
    default:
      return [];
  }
}

export function filterHistoryToAssets(
  history: AssetHistoryEvent[],
  visibleAssets: Asset[],
): AssetHistoryEvent[] {
  const ids = new Set(visibleAssets.map(a => a.id));
  return history.filter(h => ids.has(h.assetId));
}

export function buildScopedDashboardView(visibleAssets: Asset[], history: AssetHistoryEvent[]) {
  const scopedHistory = filterHistoryToAssets(history, visibleAssets);
  const kpis = buildDashboardKpis(visibleAssets, scopedHistory, MOCK_TODAY);

  return {
    kpis,
    kpiCards: [
      { label: "إجمالي الأصول", value: String(kpis.totalAssets), change: "—", up: true,  color: "#2A3172", bg: "#EEF0F8" },
      { label: "الأصول النشطة", value: String(kpis.activeAssets), change: "—", up: true,  color: "#4F7C5A", bg: "#EDF3EF" },
      { label: "قيد الصيانة",   value: String(kpis.maintenanceAssets), change: "—", up: false, color: "#D0A165", bg: "#FDF6ED" },
      { label: "نقل هذا الشهر", value: String(kpis.transfersThisMonth), change: "—", up: true,  color: "#3D4589", bg: "#EEF0F8" },
    ],
    monthly: buildMonthlyActivity(scopedHistory, MOCK_TODAY),
    deptPie: buildDeptPieFromAssets(visibleAssets),
    chartYear: kpis.chartYear,
  };
}
