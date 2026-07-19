import type { Role } from "../../../auth/types";
import type { Asset, AssetStatus } from "../../../types";
import { getDepartmentsBySector } from "../../../data/orgConstants";
import { STATUS } from "../../../data/mock";
import { getCategoryFilterLabel } from "../../../utils/assetMappings";

export interface RoleFilterUserOption {
  apiId: string;
  name: string;
  departmentId: string;
}

// ─────────────────────────────────────────────
// Role-aware asset filters — organizational scope in UI
// ─────────────────────────────────────────────

export const UNASSIGNED_ASSIGNEE = "__unassigned__";

export type RoleFilterKey = "sectorId" | "departmentId" | "assignedUserId" | "status" | "category" | "location";

export interface RoleAssetFilters {
  sectorId: string[];
  departmentId: string[];
  assignedUserId: string[];
  status: string[];
  category: string[];
  location: string[];
}

export const EMPTY_ROLE_FILTERS: RoleAssetFilters = {
  sectorId: [],
  departmentId: [],
  assignedUserId: [],
  status: [],
  category: [],
  location: [],
};

export const ROLE_FILTER_LABELS: Record<RoleFilterKey, string> = {
  sectorId: "القطاع",
  departmentId: "القسم",
  assignedUserId: "الموظف المسؤول",
  status: "الحالة",
  category: "الفئة",
  location: "الموقع",
};

function unique(values: string[]) {
  return [...new Set(values)].filter(Boolean).sort((a, b) => a.localeCompare(b, "ar"));
}

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function assetsHaveScopeIds(
  assets: Asset[],
  key: "departmentId" | "sectorId" | "assignedUserId",
): boolean {
  return assets.some((asset) => {
    if (key === "assignedUserId") {
      return Boolean(asset.assignedUserId);
    }
    return Boolean(asset[key]?.trim());
  });
}

export function getVisibleFilterKeys(role: Role, visibleAssets: Asset[]): RoleFilterKey[] {
  const base: RoleFilterKey[] = (() => {
    switch (role) {
      case "employee":
        return ["status", "category", "location"];
      case "department-manager":
        return ["assignedUserId", "status", "category", "location"];
      case "sector-manager":
        return ["departmentId", "assignedUserId", "status", "category", "location"];
      case "asset-manager":
      case "auditor":
        return ["sectorId", "departmentId", "assignedUserId", "status", "category", "location"];
      default:
        return ["status", "category", "location"];
    }
  })();

  return base.filter((key) => {
    if (key === "sectorId") {
      return assetsHaveScopeIds(visibleAssets, "sectorId");
    }
    if (key === "assignedUserId") {
      return assetsHaveScopeIds(visibleAssets, "assignedUserId");
    }
    return true;
  });
}

function getApiUsersForRole(
  role: Role,
  apiUsers: RoleFilterUserOption[],
  userDepartmentId: string,
  userSectorId: string,
  selectedDepartmentIds: string[],
  selectedSectorIds: string[],
): RoleFilterUserOption[] {
  if (role === "department-manager") {
    return apiUsers.filter((user) => user.departmentId === userDepartmentId);
  }

  if (role === "sector-manager") {
    const departmentIds = selectedDepartmentIds.length > 0
      ? selectedDepartmentIds
      : getDepartmentsBySector(userSectorId).map((department) => department.id);

    return apiUsers.filter((user) => departmentIds.includes(user.departmentId));
  }

  if (role === "asset-manager" || role === "auditor") {
    let departmentIds = unique(apiUsers.map((user) => user.departmentId));

    if (selectedSectorIds.length > 0) {
      const sectorDepartments = new Set(
        selectedSectorIds.flatMap((sectorId) =>
          getDepartmentsBySector(sectorId).map((department) => department.id),
        ),
      );
      departmentIds = departmentIds.filter((id) => sectorDepartments.has(id));
    }

    if (selectedDepartmentIds.length > 0) {
      departmentIds = departmentIds.filter((id) => selectedDepartmentIds.includes(id));
    }

    return apiUsers.filter((user) => departmentIds.includes(user.departmentId));
  }

  return [];
}

export function buildRoleFilterOptions(
  role: Role,
  visibleAssets: Asset[],
  userDepartmentId: string,
  userSectorId: string,
  filters: RoleAssetFilters,
  apiUsers: RoleFilterUserOption[],
) {
  const category = unique(visibleAssets.map((asset) => asset.category));
  const status = unique(visibleAssets.map((asset) => asset.status));
  const location = unique(visibleAssets.map((asset) => asset.location));

  const sectorId = assetsHaveScopeIds(visibleAssets, "sectorId")
    ? unique(visibleAssets.map((asset) => asset.sectorId).filter(Boolean))
    : [];

  let departmentId: string[] = [];
  if (assetsHaveScopeIds(visibleAssets, "departmentId")) {
    departmentId = unique(visibleAssets.map((asset) => asset.departmentId).filter(Boolean));
  } else if (role === "sector-manager") {
    departmentId = unique(
      visibleAssets
        .map((asset) => asset.department)
        .filter(Boolean),
    );
  } else if (role === "asset-manager" || role === "auditor") {
    departmentId = unique(
      visibleAssets
        .map((asset) => asset.department)
        .filter(Boolean),
    );
  }

  const employees = getApiUsersForRole(
    role,
    apiUsers,
    userDepartmentId,
    userSectorId,
    filters.departmentId,
    filters.sectorId,
  );
  const assignedUserId = employees.map((user) => user.apiId);

  return { sectorId, departmentId, assignedUserId, status, category, location };
}

export function getRoleFilterOptionLabel(
  key: RoleFilterKey,
  value: string,
  apiUsers: ReadonlyArray<RoleFilterUserOption> = [],
): string {
  if (key === "status") return STATUS[value as AssetStatus]?.label ?? value;
  if (key === "category") return getCategoryFilterLabel(value);
  if (key === "assignedUserId") {
    if (value === UNASSIGNED_ASSIGNEE) return "أصول غير مسندة";
    return apiUsers.find((user) => user.apiId === value)?.name ?? value;
  }
  return value;
}

export function getRoleFilterAllLabel(key: RoleFilterKey): string | null {
  if (key === "sectorId") return "جميع القطاعات";
  if (key === "departmentId") return "جميع الأقسام";
  if (key === "assignedUserId") return "جميع الموظفين";
  return null;
}

export function shouldShowUnassignedOption(key: RoleFilterKey, role: Role): boolean {
  return key === "assignedUserId" && role !== "employee";
}

function matchesDepartmentFilter(asset: Asset, selectedDepartments: string[]): boolean {
  if (selectedDepartments.length === 0) return true;

  if (asset.departmentId?.trim()) {
    return selectedDepartments.includes(asset.departmentId);
  }

  return selectedDepartments.includes(asset.department);
}

export function matchesRoleFilters(asset: Asset, filters: RoleAssetFilters): boolean {
  const assigneeMatch =
    filters.assignedUserId.length === 0 ||
    filters.assignedUserId.some((value) =>
      value === UNASSIGNED_ASSIGNEE ? !asset.assignedUserId : asset.assignedUserId === value,
    );

  return (
    (filters.sectorId.length === 0 || (asset.sectorId?.trim() && filters.sectorId.includes(asset.sectorId))) &&
    matchesDepartmentFilter(asset, filters.departmentId) &&
    assigneeMatch &&
    (filters.status.length === 0 || filters.status.includes(asset.status)) &&
    (filters.category.length === 0 || filters.category.includes(asset.category)) &&
    (filters.location.length === 0 || filters.location.includes(asset.location))
  );
}

export function countActiveRoleFilters(filters: RoleAssetFilters): number {
  return Object.values(filters).reduce((n, values) => n + values.length, 0);
}

export function hasActiveRoleExplorerState(
  filters: RoleAssetFilters,
  search: string,
  tab: string,
): boolean {
  return countActiveRoleFilters(filters) > 0 || search.trim().length > 0 || tab !== "all";
}
