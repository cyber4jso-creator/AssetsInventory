import type { Asset, BusinessCriticality } from "../../../types";
import { getDepartmentById } from "../../../data/orgConstants";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp?: string;
  };
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code?: string;
    message?: string | string[];
  };
}

type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

interface PaginatedAssets {
  items: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type CreateAssetCategory =
  | "نظام"
  | "تطبيق"
  | "شبكة"
  | "دائرة"
  | "ترخيص";

export interface CreateAssetInput {
  name: string;
  serial: string;
  model: string;
  category: CreateAssetCategory;
  businessCriticality: BusinessCriticality;
  manufacturer: string;
  departmentId: string;
  location: string;
  assignedUserId: string | null;
  purchaseDate: string;
  warrantyExpiration: string;
  value: number;
}

interface CreateSystemPayload {
  assetId: string;
  systemName: string;
  type?: string;
  location?: string;
  department?: string;
  criticality?: BusinessCriticality;
  status?: string;
  purchaseDate?: string;
  vendor?: string;
  purchasePrice?: number;
  warrantyEnd?: string;
}

interface CreateApplicationPayload {
  assetId: string;
  applicationName: string;
  type?: string;
  vendor?: string;
  criticality?: BusinessCriticality;
  status?: string;
  department?: string;
  supportEndDate?: string;
}

interface CreateNetworkPayload {
  assetId: string;
  name: string;
  category?: string;
  department?: string;
  type?: string;
  vendor?: string;
  model?: string;
  location?: string;
  status?: string;
}

interface CreateCircuitPayload {
  assetId: string;
  circuitName: string;
  type?: string;
  status?: string;
  department?: string;
  contractExpiry?: string;
}

interface CreateLicensePayload {
  assetId: string;
  productSystem: string;
  vendor?: string;
  type?: string;
  department?: string;
  expiryDate?: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://10.27.57.24:3000/api/v1";

const CATEGORY_PREFIX: Record<CreateAssetCategory, string> = {
  "نظام": "SYS",
  "تطبيق": "APP",
  "شبكة": "NET",
  "دائرة": "CIR",
  "ترخيص": "LIC",
};

const CATEGORY_ENDPOINT: Record<CreateAssetCategory, string> = {
  "نظام": "/systems",
  "تطبيق": "/applications",
  "شبكة": "/networks",
  "دائرة": "/circuits",
  "ترخيص": "/licenses",
};

function formatApiErrorMessage(message?: string | string[]): string {
  if (!message) {
    return "فشل الطلب";
  }

  if (Array.isArray(message)) {
    return message.join(" · ");
  }

  return message;
}

function omitEmpty<T extends Record<string, unknown>>(payload: T): T {
  const result = {} as T;

  for (const [key, value] of Object.entries(payload) as [keyof T, T[keyof T]][]) {
    if (value !== "" && value !== undefined && value !== null) {
      result[key] = value;
    }
  }

  return result;
}

function generateAssetId(category: CreateAssetCategory): string {
  const year = new Date().getFullYear();
  const suffix = Date.now().toString(36).toUpperCase();
  return `${CATEGORY_PREFIX[category]}-${year}-${suffix}`;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  console.log("API RESPONSE DEBUG:", result);

  if (!response.ok || !result.success) {
    const errorResult = result as ApiErrorResponse;
    const message = formatApiErrorMessage(errorResult.error?.message);
    throw new Error(message || `فشل الطلب: ${response.status}`);
  }

  return result.data;
}

async function postCreate<T>(endpoint: string, payload: T): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  await parseApiResponse<unknown>(response);
}

function buildSystemPayload(
  input: CreateAssetInput,
  assetId: string,
  department: string,
): CreateSystemPayload {
  return omitEmpty({
    assetId,
    systemName: input.name,
    type: "System",
    location: input.location,
    department,
    criticality: input.businessCriticality,
    status: "active",
    purchaseDate: input.purchaseDate,
    vendor: input.manufacturer,
    purchasePrice: input.value,
    warrantyEnd: input.warrantyExpiration || undefined,
  });
}

function buildApplicationPayload(
  input: CreateAssetInput,
  assetId: string,
  department: string,
): CreateApplicationPayload {
  return omitEmpty({
    assetId,
    applicationName: input.name,
    type: "Application",
    vendor: input.manufacturer,
    criticality: input.businessCriticality,
    status: "active",
    department,
    supportEndDate: input.warrantyExpiration || undefined,
  });
}

function buildNetworkPayload(
  input: CreateAssetInput,
  assetId: string,
  department: string,
): CreateNetworkPayload {
  return omitEmpty({
    assetId,
    name: input.name,
    category: "Network Device",
    department,
    type: "Network Device",
    vendor: input.manufacturer,
    model: input.model,
    location: input.location,
    status: "active",
  });
}

function buildCircuitPayload(
  input: CreateAssetInput,
  assetId: string,
  department: string,
): CreateCircuitPayload {
  return omitEmpty({
    assetId,
    circuitName: input.name,
    type: "Circuit",
    status: "active",
    department,
    contractExpiry: input.warrantyExpiration || undefined,
  });
}

function buildLicensePayload(
  input: CreateAssetInput,
  assetId: string,
  department: string,
): CreateLicensePayload {
  return omitEmpty({
    assetId,
    productSystem: input.name,
    vendor: input.manufacturer,
    type: "Enterprise",
    department,
    expiryDate: input.warrantyExpiration || undefined,
  });
}

async function fetchAssetsPage(page: number): Promise<PaginatedAssets> {
  const response = await fetch(
    `${API_BASE_URL}/assets?page=${page}&limit=100`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch assets: ${response.status}`);
  }

  const result = (await response.json()) as ApiResponse<PaginatedAssets>;

  if (!result.success) {
    throw new Error("The assets API returned an unsuccessful response");
  }

  return result.data;
}

export async function fetchAllAssets(): Promise<Asset[]> {
  const firstPage = await fetchAssetsPage(1);

  if (firstPage.pagination.totalPages <= 1) {
    return firstPage.items;
  }

  const remainingPages = await Promise.all(
    Array.from(
      { length: firstPage.pagination.totalPages - 1 },
      (_, index) => fetchAssetsPage(index + 2),
    ),
  );

  return [
    ...firstPage.items,
    ...remainingPages.flatMap((page) => page.items),
  ];
}

export async function createAsset(input: CreateAssetInput): Promise<string> {
  const department = getDepartmentById(input.departmentId)?.name ?? "";
  const assetId = generateAssetId(input.category);
  const endpoint = CATEGORY_ENDPOINT[input.category];

  switch (input.category) {
    case "نظام":
      await postCreate(endpoint, buildSystemPayload(input, assetId, department));
      break;
    case "تطبيق":
      await postCreate(endpoint, buildApplicationPayload(input, assetId, department));
      break;
    case "شبكة":
      await postCreate(endpoint, buildNetworkPayload(input, assetId, department));
      break;
    case "دائرة":
      await postCreate(endpoint, buildCircuitPayload(input, assetId, department));
      break;
    case "ترخيص":
      await postCreate(endpoint, buildLicensePayload(input, assetId, department));
      break;
  }

  return assetId;
}

