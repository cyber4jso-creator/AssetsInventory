import type { Asset } from "../../../types";
import { getAssetExplorerTabId, getAssetCategoryDisplayLabel } from "../../../utils/assetMappings";
import { getAssetAssigneeName, type UserNameLookup } from "../../../utils/userDisplay";
import { formatDateTime } from "../../../utils/date";

// ─────────────────────────────────────────────
// Enterprise Asset Explorer — filtering & search
// ─────────────────────────────────────────────

export type ExplorerTabId = "all" | "systems" | "applications" | "networks" | "circuits" | "licenses";

export const EXPLORER_TABS: { id: ExplorerTabId; label: string }[] = [
  { id: "all",          label: "جميع الأصول" },
  { id: "systems",      label: "الأنظمة" },
  { id: "applications", label: "التطبيقات" },
  { id: "networks",     label: "الشبكات" },
  { id: "circuits",     label: "الدوائر" },
  { id: "licenses",     label: "التراخيص" },
];

export function getAssetExplorerTab(asset: Asset): ExplorerTabId | "other" {
  const tabId = getAssetExplorerTabId(asset);
  if (tabId === "other") return "other";
  return tabId as ExplorerTabId;
}

export function matchesExplorerTab(asset: Asset, tab: ExplorerTabId): boolean {
  if (tab === "all") return true;
  return getAssetExplorerTab(asset) === tab;
}

export function getAssetLastUpdated(assetId: string): string {
  void assetId;
  return "—";
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function optionalField(asset: Asset, key: "hostname" | "ipAddress"): string {
  const value = (asset as Asset & Partial<Record<typeof key, string>>)[key];
  return value?.trim() ?? "";
}

export function matchesSearch(
  asset: Asset,
  query: string,
  userLookup?: UserNameLookup,
): boolean {
  const q = normalize(query);
  if (!q) return true;

  const categoryLabel = getAssetCategoryDisplayLabel(asset);

  const haystack = [
    asset.id,
    asset.name,
    asset.category,
    categoryLabel,
    asset.source ?? "",
    asset.manufacturer,
    asset.supplier,
    getAssetAssigneeName(asset, userLookup) ?? "",
    asset.department,
    asset.serial,
    optionalField(asset, "hostname"),
    optionalField(asset, "ipAddress"),
  ].map(normalize);

  return haystack.some(value => value.includes(q));
}

export function getPaginationRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);

  return pages;
}
