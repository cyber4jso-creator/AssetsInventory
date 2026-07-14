import type { AssetHistoryEventType, AssetHistoryEvent } from "../types";
import type { Asset } from "../types";
import { MOCK_TODAY } from "./mockReferenceDate";

const AR_MONTH_LABELS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

/** Last N calendar months ending at MOCK_TODAY (inclusive). */
export function getRecentMonthWindows(count = 6, ref: Date = MOCK_TODAY) {
  const windows: Array<{ year: number; month: number; label: string; key: string }> = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    windows.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: AR_MONTH_LABELS[d.getMonth()],
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return windows;
}

export function countHistoryInMonth(
  history: AssetHistoryEvent[],
  type: AssetHistoryEventType,
  year: number,
  month: number,
): number {
  return history.filter(e => {
    if (e.type !== type) return false;
    const d = new Date(e.timestamp);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;
}

export function buildMonthlyActivity(history: AssetHistoryEvent[], ref: Date = MOCK_TODAY) {
  return getRecentMonthWindows(6, ref).map(w => ({
    m: w.label,
    إضافات: countHistoryInMonth(history, "created", w.year, w.month),
    نقل: countHistoryInMonth(history, "transferred", w.year, w.month),
    صيانة: countHistoryInMonth(history, "maintenance", w.year, w.month),
  }));
}

export function countTransfersThisMonth(history: AssetHistoryEvent[], ref: Date = MOCK_TODAY) {
  return countHistoryInMonth(history, "transferred", ref.getFullYear(), ref.getMonth());
}

export function buildDashboardKpis(assets: Asset[], history: AssetHistoryEvent[], ref: Date = MOCK_TODAY) {
  const transfersThisMonth = countTransfersThisMonth(history, ref);
  return {
    totalAssets: assets.length,
    activeAssets: assets.filter(a => a.status === "active").length,
    maintenanceAssets: assets.filter(a => a.status === "maintenance").length,
    transfersThisMonth,
    chartYear: ref.getFullYear(),
  };
}

const DEPT_PIE_COLORS = ["#2A3172", "#3D4589", "#D0A165", "#4F7C5A", "#6B7280", "#9CA3AF"];

export function buildDeptPieFromAssets(assets: Asset[]) {
  const counts = new Map<string, number>();
  for (const a of assets) counts.set(a.department, (counts.get(a.department) ?? 0) + 1);
  return Array.from(counts.entries()).map(([name, value], i) => ({
    name,
    value,
    color: DEPT_PIE_COLORS[i % DEPT_PIE_COLORS.length],
  }));
}

export type DashboardKpiSnapshot = ReturnType<typeof buildDashboardKpis>;
