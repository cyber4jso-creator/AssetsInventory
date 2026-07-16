import type { Asset } from "../../../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp?: string;
  };
}

interface PaginatedAssets {
  items: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://10.27.57.24:3000/api/v1";

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
