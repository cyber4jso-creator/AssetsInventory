import type { Asset } from "../../../types";
import { ASSET_HISTORY } from "../../../data/mock";
import { getAssetAssigneeName } from "../../../utils/userDisplay";
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

const SYSTEM_CATEGORIES = new Set([
  "أجهزة حاسوب",
  "أجهزة طباعة",
  "أجهزة عرض",
  "أجهزة مسح",
  "أجهزة تكييف",
]);

const NETWORK_CATEGORIES = new Set(["أجهزة خوادم"]);
const APPLICATION_CATEGORIES = new Set(["أثاث مكتبي"]);
const CIRCUIT_CATEGORIES = new Set(["مركبات"]);

const lastUpdatedByAsset = new Map<string, string>();

function buildLastUpdatedIndex() {
  if (lastUpdatedByAsset.size > 0) return;
  for (const event of ASSET_HISTORY) {
    const current = lastUpdatedByAsset.get(event.assetId);
    if (!current || event.timestamp > current) {
      lastUpdatedByAsset.set(event.assetId, event.timestamp);
    }
  }
}

export function getAssetExplorerTab(asset: Asset): ExplorerTabId | "other" {
  if (NETWORK_CATEGORIES.has(asset.category)) return "networks";
  if (SYSTEM_CATEGORIES.has(asset.category)) return "systems";
  if (APPLICATION_CATEGORIES.has(asset.category)) return "applications";
  if (CIRCUIT_CATEGORIES.has(asset.category)) return "circuits";
  return "other";
}

export function matchesExplorerTab(asset: Asset, tab: ExplorerTabId): boolean {
  if (tab === "all") return true;
  return getAssetExplorerTab(asset) === tab;
}

export function getAssetLastUpdated(assetId: string): string {
  buildLastUpdatedIndex();
  const iso = lastUpdatedByAsset.get(assetId);
  if (!iso) return "—";
  return formatDateTime(iso).date;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function optionalField(asset: Asset, key: "hostname" | "ipAddress"): string {
  const value = (asset as Asset & Partial<Record<typeof key, string>>)[key];
  return value?.trim() ?? "";
}

export function matchesSearch(asset: Asset, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;

  const haystack = [
    asset.id,
    asset.name,
    asset.category,
    asset.manufacturer,
    asset.supplier,
    getAssetAssigneeName(asset) ?? "",
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
