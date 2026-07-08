import type { AssetColumnDefinition, AssetColumnId } from "../types/fieldConfig";

// ─────────────────────────────────────────────
// Built-in asset table column registry
// ─────────────────────────────────────────────

export const ASSET_COLUMNS: AssetColumnDefinition[] = [
  { id: "id",                   label: "رقم الأصل",            core: true  },
  { id: "name",                 label: "الاسم",                core: true  },
  { id: "department",           label: "القسم",                core: true  },
  { id: "status",               label: "الحالة",               core: true  },
  { id: "assignedTo",           label: "المسؤول",              core: false },
  { id: "businessCriticality",  label: "Business Criticality", core: false },
  { id: "warranty",             label: "الضمان",               core: false },
  { id: "location",             label: "الموقع",               core: false },
  { id: "serial",               label: "الرقم التسلسلي",       core: false },
  { id: "category",             label: "الفئة",                core: false },
];

export const OPTIONAL_COLUMN_IDS: AssetColumnId[] = ASSET_COLUMNS
  .filter(c => !c.core)
  .map(c => c.id);

export const DEFAULT_ENABLED_OPTIONAL: AssetColumnId[] = [
  "assignedTo",
  "businessCriticality",
  "warranty",
  "location",
];

export function getColumnLabel(id: AssetColumnId): string {
  return ASSET_COLUMNS.find(c => c.id === id)?.label ?? id;
}
