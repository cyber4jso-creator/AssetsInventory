import type { Asset } from "../types";

export type AssetSource =
  | "system"
  | "application"
  | "network"
  | "circuit"
  | "license";

const SOURCE_TO_TAB: Record<AssetSource, string> = {
  system: "systems",
  application: "applications",
  network: "networks",
  circuit: "circuits",
  license: "licenses",
};

const SOURCE_LABELS: Record<AssetSource, string> = {
  system: "نظام",
  application: "تطبيق",
  network: "شبكة",
  circuit: "دائرة",
  license: "ترخيص",
};

const CATEGORY_LABELS: Record<string, string> = {
  system: "نظام",
  systems: "أنظمة",
  application: "تطبيق",
  applications: "تطبيقات",
  network: "شبكة",
  networks: "شبكات",
  circuit: "دائرة",
  circuits: "دوائر",
  license: "ترخيص",
  licenses: "تراخيص",
};

const PLURAL_CATEGORY_TO_SOURCE: Record<string, AssetSource> = {
  system: "system",
  systems: "system",
  application: "application",
  applications: "application",
  network: "network",
  networks: "network",
  circuit: "circuit",
  circuits: "circuit",
  license: "license",
  licenses: "license",
};

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

export function isAssetSource(value: string | undefined): value is AssetSource {
  return (
    value === "system"
    || value === "application"
    || value === "network"
    || value === "circuit"
    || value === "license"
  );
}

export function getAssetSource(asset: Asset): AssetSource | null {
  if (asset.source && isAssetSource(asset.source)) {
    return asset.source;
  }

  const categoryKey = normalizeKey(asset.category);
  return PLURAL_CATEGORY_TO_SOURCE[categoryKey] ?? null;
}

export function getAssetExplorerTabId(asset: Asset): string {
  const source = getAssetSource(asset);
  if (source) {
    return SOURCE_TO_TAB[source];
  }
  return "other";
}

export function getAssetCategoryDisplayLabel(asset: Pick<Asset, "category" | "source">): string {
  const source = asset.source && isAssetSource(asset.source) ? asset.source : getAssetSource(asset as Asset);
  if (source) {
    return SOURCE_LABELS[source];
  }

  const normalized = normalizeKey(asset.category);
  return CATEGORY_LABELS[normalized] ?? asset.category;
}

export function getCategoryFilterLabel(categoryValue: string): string {
  const normalized = normalizeKey(categoryValue);
  return CATEGORY_LABELS[normalized] ?? categoryValue;
}
