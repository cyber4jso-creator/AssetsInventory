import type { Asset } from "../../../types";
import { ASSET_HISTORY } from "../../../data/mock";
import { formatDateTime } from "../../../utils/date";
import { getAssetSource, getAssetCategoryDisplayLabel } from "../../../utils/assetMappings";
import { getAssetLastUpdated } from "./assetExplorer";
import { getAssetAssigneeName } from "../../../utils/userDisplay";
import { getWarrantyStatus } from "../../../utils/warranty";

// ─────────────────────────────────────────────
// Asset Detail — field resolution (backend-ready)
// ─────────────────────────────────────────────

export type DetailCategoryType = "system" | "application" | "network" | "circuit" | "license" | "general";

export interface DetailField {
  label: string;
  value: string;
  mono?: boolean;
}

function optionalField(asset: Asset, key: string): string {
  const value = (asset as Asset & Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

export function resolveDetailCategoryType(asset: Asset): DetailCategoryType {
  const source = getAssetSource(asset);
  if (source) return source;
  return "general";
}

export function getCreatedDate(assetId: string): string | null {
  const created = ASSET_HISTORY
    .filter(e => e.assetId === assetId && e.type === "created")
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0];
  if (!created) return null;
  return formatDateTime(created.timestamp).date;
}

function field(label: string, value: string | null | undefined, mono?: boolean): DetailField | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return { label, value: trimmed, mono };
}

export function getGeneralInfoFields(asset: Asset): DetailField[] {
  const vendor = asset.manufacturer?.trim() || asset.supplier?.trim();
  const created = getCreatedDate(asset.id);
  const lastUpdated = getAssetLastUpdated(asset.id);

  return [
    field("رقم الأصل", asset.id, true),
    field("الاسم", asset.name),
    field("الفئة", getAssetCategoryDisplayLabel(asset)),
    field("القسم", asset.department),
    field("المسؤول", getAssetAssigneeName(asset)),
    field("المورّد", vendor),
    created ? field("تاريخ الإنشاء", created, true) : null,
    lastUpdated !== "—" ? field("آخر تحديث", lastUpdated, true) : null,
  ].filter((f): f is DetailField => f !== null);
}

export function getCategoryDetailFields(asset: Asset): DetailField[] {
  const type = resolveDetailCategoryType(asset);
  const hostname = optionalField(asset, "hostname");
  const operatingSystem = optionalField(asset, "operatingSystem");
  const ipAddress = optionalField(asset, "ipAddress");
  const managementIp = optionalField(asset, "managementIp");
  const licenseType = optionalField(asset, "licenseType");
  const usersCount = optionalField(asset, "usersCount");
  const isp = optionalField(asset, "isp");
  const bandwidth = optionalField(asset, "bandwidth");
  const publicIp = optionalField(asset, "publicIp");
  const totalLicenses = optionalField(asset, "totalLicenses");
  const expiryDate = optionalField(asset, "expiryDate");

  const configs: Record<DetailCategoryType, DetailField[]> = {
    system: [
      field("اسم المضيف", hostname),
      field("نظام التشغيل", operatingSystem),
      field("عنوان IP", ipAddress, true),
      field("تاريخ الشراء", asset.purchaseDate, true),
      field("الطراز", asset.model),
      field("الرقم التسلسلي", asset.serial, true),
    ].filter((f): f is DetailField => f !== null),

    application: [
      field("المورّد", asset.manufacturer || asset.supplier),
      field("نوع الترخيص", licenseType),
      field("عدد المستخدمين", usersCount),
    ].filter((f): f is DetailField => f !== null),

    network: [
      field("الطراز", asset.model),
      field("IP الإدارة", managementIp || ipAddress, true),
      field("الدور", asset.type),
      field("الرقم التسلسلي", asset.serial, true),
    ].filter((f): f is DetailField => f !== null),

    circuit: [
      field("مزود الخدمة", isp),
      field("عرض النطاق", bandwidth),
      field("IP العام", publicIp, true),
    ].filter((f): f is DetailField => f !== null),

    license: [
      field("نوع الترخيص", licenseType),
      field("تاريخ الانتهاء", expiryDate || asset.warrantyExpiration, true),
      field("إجمالي التراخيص", totalLicenses),
    ].filter((f): f is DetailField => f !== null),

    general: [
      field("النوع", asset.type),
      field("الطراز", asset.model),
      field("الرقم التسلسلي", asset.serial, true),
      field("تاريخ الشراء", asset.purchaseDate, true),
    ].filter((f): f is DetailField => f !== null),
  };

  return configs[type];
}

export function getOwnershipFields(asset: Asset): DetailField[] {
  return [
    field("القسم", asset.department),
    field("المسؤول", getAssetAssigneeName(asset)),
    field("الوصي", optionalField(asset, "custodian")),
    field("الموقع", asset.location),
    field("الوحدة التجارية", optionalField(asset, "businessUnit")),
  ].filter((f): f is DetailField => f !== null);
}

export function getCategoryDetailTitle(asset: Asset): string {
  const titles: Record<DetailCategoryType, string> = {
    system: "تفاصيل النظام",
    application: "تفاصيل التطبيق",
    network: "تفاصيل الشبكة",
    circuit: "تفاصيل الدائرة",
    license: "تفاصيل الترخيص",
    general: "تفاصيل الفئة",
  };
  return titles[resolveDetailCategoryType(asset)];
}

export const RELATIONSHIP_PLACEHOLDERS = [
  { label: "متصل بـ", key: "connectedTo" },
  { label: "يعتمد على", key: "dependsOn" },
  { label: "يعمل على", key: "runsOn" },
  { label: "محمي بواسطة", key: "protectedBy" },
  { label: "ترخيص مرتبط", key: "linkedLicense" },
  { label: "دائرة مرتبطة", key: "linkedCircuit" },
] as const;

export function getWarrantyFields(asset: Asset): { fields: DetailField[]; statusLabel?: string; statusStyle?: { bg: string; text: string; dot: string } } {
  const status = getWarrantyStatus(asset.warrantyExpiration);
  const fields = [
    field("مزود الضمان", asset.supplier || asset.manufacturer),
    field("تاريخ الانتهاء", asset.warrantyExpiration, true),
    field("التغطية", optionalField(asset, "warrantyCoverage")),
  ].filter((f): f is DetailField => f !== null);

  return {
    fields,
    statusLabel: status.label,
    statusStyle: { bg: status.bg, text: status.text, dot: status.dot },
  };
}
