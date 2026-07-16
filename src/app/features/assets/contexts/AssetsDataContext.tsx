import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Asset, BusinessCriticality } from "../../../types";
import { ASSETS as INITIAL_ASSETS } from "../../../data/mock";
import { getDepartmentById } from "../../../data/orgConstants";
import { MOCK_TODAY } from "../../../data/mockReferenceDate";
import { fetchAllAssets } from "../services/assetsApiService";

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
  loading: boolean;
  error: string | null;
  refreshAssets: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAssets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiAssets = await fetchAllAssets();
      setAssets(apiAssets);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Failed to load assets";

      setError(message);
      console.error("Assets API error:", requestError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAssets();
  }, [refreshAssets]);

  const addAsset = useCallback((input: NewAssetInput): Asset => {
    let created!: Asset;

    setAssets((previous) => {
      created = {
        id: nextAssetId(previous),
        status: "active",
        ...toAssetFields(input),
      };

      return [created, ...previous];
    });

    return created;
  }, []);

  const updateAsset = useCallback((id: string, input: NewAssetInput) => {
    setAssets((previous) =>
      previous.map((asset) =>
        asset.id === id
          ? { ...asset, ...toAssetFields(input) }
          : asset,
      ),
    );
  }, []);

  const archiveAsset = useCallback((id: string) => {
    setAssets((previous) =>
      previous.map((asset) =>
        asset.id === id
          ? { ...asset, status: "inactive" }
          : asset,
      ),
    );
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets((previous) =>
      previous.filter((asset) => asset.id !== id),
    );
  }, []);

  return (
    <AssetsDataContext.Provider
      value={{
        assets,
        loading,
        error,
        refreshAssets,
        addAsset,
        updateAsset,
        archiveAsset,
        deleteAsset,
      }}
    >
      {children}
    </AssetsDataContext.Provider>
  );
}

export function useAssetsData() {
  const context = useContext(AssetsDataContext);

  if (!context) {
    throw new Error(
      "useAssetsData must be used inside AssetsDataProvider",
    );
  }

  return context;
}
