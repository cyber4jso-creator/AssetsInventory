import type { Role } from "../../../auth/types";
import type { Asset, AssetStatus } from "../../../types";
import { DEMO_USERS } from "../../../data/demoUsers";
import { ORG_DEPARTMENTS, ORG_SECTORS, getDepartmentsBySector } from "../../../data/orgConstants";
import { STATUS } from "../../../data/mock";
import { getUserFirstName } from "../../../utils/userDisplay";

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
  return [...new Set(values)].filter(Boolean).sort();
}

export function getVisibleFilterKeys(role: Role): RoleFilterKey[] {
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
}

export function getEmployeeOptionsForRole(
  role: Role,
  userDepartmentId: string,
  userSectorId: string,
  selectedDepartmentIds: string[],
  selectedSectorIds: string[],
) {
  if (role === "department-manager") {
    return DEMO_USERS.filter(u => u.departmentId === userDepartmentId);
  }
  if (role === "sector-manager") {
    const deptIds = selectedDepartmentIds.length > 0
      ? selectedDepartmentIds
      : getDepartmentsBySector(userSectorId).map(d => d.id);
    return DEMO_USERS.filter(u => deptIds.includes(u.departmentId));
  }
  if (role === "asset-manager" || role === "auditor") {
    let deptIds = ORG_DEPARTMENTS.map(d => d.id);
    if (selectedSectorIds.length > 0) {
      deptIds = ORG_DEPARTMENTS.filter(d => selectedSectorIds.includes(d.sectorId)).map(d => d.id);
    }
    if (selectedDepartmentIds.length > 0) {
      deptIds = deptIds.filter(id => selectedDepartmentIds.includes(id));
    }
    return DEMO_USERS.filter(u => deptIds.includes(u.departmentId));
  }
  return [];
}

export function buildRoleFilterOptions(
  role: Role,
  visibleAssets: Asset[],
  userDepartmentId: string,
  userSectorId: string,
  filters: RoleAssetFilters,
) {
  const category = unique(visibleAssets.map(a => a.category));
  const status = unique(visibleAssets.map(a => a.status));
  const location = unique(visibleAssets.map(a => a.location));

  const sectorId = (role === "asset-manager" || role === "auditor")
    ? ORG_SECTORS.map(s => s.id)
    : [];

  let departmentId: string[] = [];
  if (role === "sector-manager") {
    departmentId = getDepartmentsBySector(userSectorId).map(d => d.id);
  } else if (role === "asset-manager" || role === "auditor") {
    departmentId = filters.sectorId.length > 0
      ? ORG_DEPARTMENTS.filter(d => filters.sectorId.includes(d.sectorId)).map(d => d.id)
      : ORG_DEPARTMENTS.map(d => d.id);
  }

  const employees = getEmployeeOptionsForRole(
    role,
    userDepartmentId,
    userSectorId,
    filters.departmentId,
    filters.sectorId,
  );
  const assignedUserId = employees.map(u => u.id);

  return { sectorId, departmentId, assignedUserId, status, category, location };
}

export function getRoleFilterOptionLabel(key: RoleFilterKey, value: string): string {
  if (key === "status") return STATUS[value as AssetStatus]?.label ?? value;
  if (key === "sectorId") return ORG_SECTORS.find(s => s.id === value)?.name ?? value;
  if (key === "departmentId") return ORG_DEPARTMENTS.find(d => d.id === value)?.name ?? value;
  if (key === "assignedUserId") {
    if (value === UNASSIGNED_ASSIGNEE) return "أصول غير مسندة";
    return getUserFirstName(value) ?? value;
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

export function matchesRoleFilters(asset: Asset, filters: RoleAssetFilters): boolean {
  const assigneeMatch =
    filters.assignedUserId.length === 0 ||
    filters.assignedUserId.some(v =>
      v === UNASSIGNED_ASSIGNEE ? !asset.assignedUserId : asset.assignedUserId === v,
    );

  return (
    (filters.sectorId.length === 0 || filters.sectorId.includes(asset.sectorId)) &&
    (filters.departmentId.length === 0 || filters.departmentId.includes(asset.departmentId)) &&
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
