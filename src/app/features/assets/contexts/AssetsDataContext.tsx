import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Asset, BusinessCriticality } from "../../../types";
import { ASSETS as INITIAL_ASSETS } from "../../../data/mock";
import { getDepartmentById } from "../../../data/orgConstants";
import { MOCK_TODAY } from "../../../data/mockReferenceDate";

// ─────────────────────────────────────────────
// Assets data — local mock state for Sprint 2.
// Mirrors the AssetFieldConfigProvider pattern: in-memory only,
// no persistence across refresh. Sprint 3 replaces this with
// scoped API calls (see auth/scope).
// ─────────────────────────────────────────────

export interface NewAssetInput {
  name: string;
  serial: string;
  model: string;
  category: string;
  businessCriticality: BusinessCriticality;
  manufacturer: string;
  departmentId: string;
  location: string;
  assignedUserId: string | null;
  purchaseDate: string;
  warrantyExpiration: string;
  value: number;
}

interface AssetsDataContextValue {
  assets: Asset[];
  addAsset: (input: NewAssetInput) => Asset;
  updateAsset: (id: string, input: NewAssetInput) => void;
  archiveAsset: (id: string) => void;
  deleteAsset: (id: string) => void;
}

const AssetsDataContext = createContext<AssetsDataContextValue | null>(null);

function nextAssetId(existing: Asset[]): string {
  const year = MOCK_TODAY.getFullYear();
  const seq = existing.length + 1;
  return `AST-${year}-${String(seq).padStart(4, "0")}`;
}

function toAssetFields(input: NewAssetInput) {
  const dept = getDepartmentById(input.departmentId);
  return {
    name: input.name,
    serial: input.serial,
    model: input.model,
    category: input.category,
    type: input.category,
    businessCriticality: input.businessCriticality,
    manufacturer: input.manufacturer,
    supplier: "—",
    department: dept?.name ?? "",
    departmentId: input.departmentId,
    sectorId: dept?.sectorId ?? "",
    location: input.location,
    assignedUserId: input.assignedUserId,
    purchaseDate: input.purchaseDate,
    warrantyExpiration: input.warrantyExpiration,
    value: input.value,
  };
}

export function AssetsDataProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);

  const addAsset = useCallback((input: NewAssetInput): Asset => {
    let created!: Asset;
    setAssets(prev => {
      created = {
        id: nextAssetId(prev),
        status: "active",
        ...toAssetFields(input),
      };
      return [created, ...prev];
    });
    return created;
  }, []);

  const updateAsset = useCallback((id: string, input: NewAssetInput) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...toAssetFields(input) } : a));
  }, []);

  const archiveAsset = useCallback((id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: "inactive" } : a));
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <AssetsDataContext.Provider value={{ assets, addAsset, updateAsset, archiveAsset, deleteAsset }}>
      {children}
    </AssetsDataContext.Provider>
  );
}

export function useAssetsData() {
  const ctx = useContext(AssetsDataContext);
  if (!ctx) throw new Error("useAssetsData must be used inside AssetsDataProvider");
  return ctx;
}
