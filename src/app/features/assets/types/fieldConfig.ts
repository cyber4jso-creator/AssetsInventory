// ─────────────────────────────────────────────
// Asset table columns & custom fields — types
// ─────────────────────────────────────────────

export type AssetColumnId =
  | "id"
  | "name"
  | "category"
  | "department"
  | "status"
  | "assignedTo"
  | "businessCriticality"
  | "lastUpdated"
  | "warranty"
  | "location"
  | "serial";

export type CoreAssetColumnId = "id" | "name" | "category" | "department" | "assignedTo" | "status";

export type CustomFieldType = "text" | "number" | "date" | "dropdown" | "checkbox" | "currency";

export interface AssetColumnDefinition {
  id: AssetColumnId;
  label: string;
  core: boolean;
}

export interface AdminColumnConfig {
  enabledOptionalColumns: AssetColumnId[];
}

export interface UserColumnPreferences {
  hiddenColumns: AssetColumnId[];
}

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: CustomFieldType;
  required: boolean;
  visible: boolean;
  searchable: boolean;
  filterable: boolean;
  options?: string[];
}

export type TableColumnKey = AssetColumnId | `custom:${string}`;

export const CORE_COLUMN_IDS: CoreAssetColumnId[] = ["id", "name", "category", "department", "assignedTo", "status"];

export const CUSTOM_FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: "نص",
  number: "رقم",
  date: "تاريخ",
  dropdown: "قائمة منسدلة",
  checkbox: "مربع اختيار",
  currency: "عملة",
};
