import type {
  AdminColumnConfig,
  CustomFieldDefinition,
  UserColumnPreferences,
  AssetColumnId,
} from "../types/fieldConfig";
import { CORE_COLUMN_IDS } from "../types/fieldConfig";
import { DEFAULT_ENABLED_OPTIONAL, OPTIONAL_COLUMN_IDS } from "../config/assetColumns";

// ─────────────────────────────────────────────
// Field config persistence — replace with API calls
// ─────────────────────────────────────────────

const ADMIN_COLUMNS_KEY = "ams.admin.columnConfig";
const CUSTOM_FIELDS_KEY = "ams.admin.customFields";
const userPrefsKey = (userId: string) => `ams.user.columnPrefs.${userId}`;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadAdminColumnConfig(): AdminColumnConfig {
  const stored = readJson<AdminColumnConfig | null>(ADMIN_COLUMNS_KEY, null);
  if (!stored) return { enabledOptionalColumns: [...DEFAULT_ENABLED_OPTIONAL] };
  const valid = stored.enabledOptionalColumns.filter(id => OPTIONAL_COLUMN_IDS.includes(id));
  return { enabledOptionalColumns: valid };
}

export function saveAdminColumnConfig(config: AdminColumnConfig): void {
  const valid = config.enabledOptionalColumns.filter(id => OPTIONAL_COLUMN_IDS.includes(id));
  writeJson(ADMIN_COLUMNS_KEY, { enabledOptionalColumns: valid });
}

export function loadCustomFields(): CustomFieldDefinition[] {
  return readJson<CustomFieldDefinition[]>(CUSTOM_FIELDS_KEY, []);
}

export function saveCustomFields(fields: CustomFieldDefinition[]): void {
  writeJson(CUSTOM_FIELDS_KEY, fields);
}

export function loadUserColumnPreferences(userId: string): UserColumnPreferences {
  return readJson<UserColumnPreferences>(userPrefsKey(userId), { hiddenColumns: [] });
}

export function saveUserColumnPreferences(userId: string, prefs: UserColumnPreferences): void {
  const valid = prefs.hiddenColumns.filter(id =>
    !CORE_COLUMN_IDS.includes(id as typeof CORE_COLUMN_IDS[number])
  );
  writeJson(userPrefsKey(userId), { hiddenColumns: valid });
}

export function getAdminEnabledColumnIds(config: AdminColumnConfig): AssetColumnId[] {
  return [...CORE_COLUMN_IDS, ...config.enabledOptionalColumns];
}

export function getUserVisibleColumnIds(
  adminConfig: AdminColumnConfig,
  userPrefs: UserColumnPreferences,
): AssetColumnId[] {
  const enabled = getAdminEnabledColumnIds(adminConfig);
  const hidden = new Set(userPrefs.hiddenColumns);
  return enabled.filter(id => !hidden.has(id));
}

export function createCustomFieldId(): string {
  return `CF-${Date.now().toString(36).toUpperCase()}`;
}
