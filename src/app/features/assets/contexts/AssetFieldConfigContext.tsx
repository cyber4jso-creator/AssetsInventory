import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  AdminColumnConfig,
  CustomFieldDefinition,
  UserColumnPreferences,
  AssetColumnId,
  TableColumnKey,
} from "../types/fieldConfig";
import { CORE_COLUMN_IDS } from "../types/fieldConfig";
import {
  loadAdminColumnConfig,
  saveAdminColumnConfig,
  loadCustomFields,
  saveCustomFields,
  loadUserColumnPreferences,
  saveUserColumnPreferences,
  getAdminEnabledColumnIds,
  getUserVisibleColumnIds,
  createCustomFieldId,
} from "../services/fieldConfigService";

interface AssetFieldConfigContextValue {
  adminColumnConfig: AdminColumnConfig;
  customFields: CustomFieldDefinition[];
  userColumnPrefs: UserColumnPreferences;
  adminEnabledColumns: AssetColumnId[];
  userVisibleColumns: AssetColumnId[];
  tableColumnKeys: TableColumnKey[];
  setAdminEnabledOptional: (columns: AssetColumnId[]) => void;
  addCustomField: (field: Omit<CustomFieldDefinition, "id">) => void;
  updateCustomField: (id: string, field: Omit<CustomFieldDefinition, "id">) => void;
  removeCustomField: (id: string) => void;
  toggleUserColumnVisibility: (columnId: AssetColumnId) => void;
  toggleUserCustomFieldVisibility: (fieldId: string) => void;
  isUserColumnVisible: (columnId: AssetColumnId) => boolean;
  isUserCustomFieldVisible: (fieldId: string) => boolean;
  hiddenCustomFieldIds: string[];
}

const AssetFieldConfigContext = createContext<AssetFieldConfigContextValue | null>(null);

export function AssetFieldConfigProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [adminColumnConfig, setAdminColumnConfig] = useState(loadAdminColumnConfig);
  const [customFields, setCustomFields] = useState(loadCustomFields);
  const [userColumnPrefs, setUserColumnPrefs] = useState(() => loadUserColumnPreferences(userId));
  const [hiddenCustomFieldIds, setHiddenCustomFieldIds] = useState<string[]>(() => {
    const raw = localStorage.getItem(`ams.user.hiddenCustomFields.${userId}`);
    return raw ? JSON.parse(raw) as string[] : [];
  });

  const adminEnabledColumns = useMemo(
    () => getAdminEnabledColumnIds(adminColumnConfig),
    [adminColumnConfig],
  );

  const userVisibleColumns = useMemo(
    () => getUserVisibleColumnIds(adminColumnConfig, userColumnPrefs),
    [adminColumnConfig, userColumnPrefs],
  );

  const visibleCustomFields = useMemo(
    () => customFields.filter(f => f.visible && !hiddenCustomFieldIds.includes(f.id)),
    [customFields, hiddenCustomFieldIds],
  );

  const tableColumnKeys: TableColumnKey[] = useMemo(
    () => [
      ...userVisibleColumns,
      ...visibleCustomFields.map(f => `custom:${f.id}` as TableColumnKey),
    ],
    [userVisibleColumns, visibleCustomFields],
  );

  const persistUserCustomHidden = useCallback((ids: string[]) => {
    localStorage.setItem(`ams.user.hiddenCustomFields.${userId}`, JSON.stringify(ids));
  }, [userId]);

  const setAdminEnabledOptional = useCallback((columns: AssetColumnId[]) => {
    const next = { enabledOptionalColumns: columns };
    setAdminColumnConfig(next);
    saveAdminColumnConfig(next);
  }, []);

  const addCustomField = useCallback((field: Omit<CustomFieldDefinition, "id">) => {
    setCustomFields(prev => {
      const next = [...prev, { ...field, id: createCustomFieldId() }];
      saveCustomFields(next);
      return next;
    });
  }, []);

  const updateCustomField = useCallback((id: string, field: Omit<CustomFieldDefinition, "id">) => {
    setCustomFields(prev => {
      const next = prev.map(f => f.id === id ? { ...field, id } : f);
      saveCustomFields(next);
      return next;
    });
  }, []);

  const removeCustomField = useCallback((id: string) => {
    setCustomFields(prev => {
      const next = prev.filter(f => f.id !== id);
      saveCustomFields(next);
      return next;
    });
  }, []);

  const toggleUserColumnVisibility = useCallback((columnId: AssetColumnId) => {
    if (CORE_COLUMN_IDS.includes(columnId as typeof CORE_COLUMN_IDS[number])) return;
    if (!adminEnabledColumns.includes(columnId)) return;

    setUserColumnPrefs(prev => {
      const hidden = new Set(prev.hiddenColumns);
      hidden.has(columnId) ? hidden.delete(columnId) : hidden.add(columnId);
      const next = { hiddenColumns: [...hidden] };
      saveUserColumnPreferences(userId, next);
      return next;
    });
  }, [adminEnabledColumns, userId]);

  const toggleUserCustomFieldVisibility = useCallback((fieldId: string) => {
    setHiddenCustomFieldIds(prev => {
      const hidden = new Set(prev);
      hidden.has(fieldId) ? hidden.delete(fieldId) : hidden.add(fieldId);
      const next = [...hidden];
      persistUserCustomHidden(next);
      return next;
    });
  }, [persistUserCustomHidden]);

  const isUserColumnVisible = useCallback(
    (columnId: AssetColumnId) => userVisibleColumns.includes(columnId),
    [userVisibleColumns],
  );

  const isUserCustomFieldVisible = useCallback(
    (fieldId: string) => !hiddenCustomFieldIds.includes(fieldId),
    [hiddenCustomFieldIds],
  );

  const value: AssetFieldConfigContextValue = {
    adminColumnConfig,
    customFields,
    userColumnPrefs,
    adminEnabledColumns,
    userVisibleColumns,
    tableColumnKeys,
    setAdminEnabledOptional,
    addCustomField,
    updateCustomField,
    removeCustomField,
    toggleUserColumnVisibility,
    toggleUserCustomFieldVisibility,
    isUserColumnVisible,
    isUserCustomFieldVisible,
    hiddenCustomFieldIds,
  };

  return (
    <AssetFieldConfigContext.Provider value={value}>
      {children}
    </AssetFieldConfigContext.Provider>
  );
}

export function useAssetFieldConfig() {
  const ctx = useContext(AssetFieldConfigContext);
  if (!ctx) throw new Error("useAssetFieldConfig must be used inside AssetFieldConfigProvider");
  return ctx;
}
