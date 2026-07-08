import type { Permission, Role } from "../types";

// ─────────────────────────────────────────────
// Role → Permission mapping — single source of truth.
// Each tier is composed from the one below it so no
// permission list is ever retyped.
// ─────────────────────────────────────────────

const EMPLOYEE_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "requests.create",
];

const DEPARTMENT_MANAGER_PERMISSIONS: Permission[] = [
  ...EMPLOYEE_PERMISSIONS,
  "requests.approve",
  "reports.view",
];

const ASSET_MANAGER_PERMISSIONS: Permission[] = [
  ...DEPARTMENT_MANAGER_PERMISSIONS,
  "assets.create",
  "assets.edit",
  "assets.transfer",
  "reports.export",
];

const AUDITOR_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "reports.view",
  "reports.export",
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  ...ASSET_MANAGER_PERMISSIONS,
  "assets.delete",
  "users.manage",
  "settings.manage",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "employee":            EMPLOYEE_PERMISSIONS,
  "department-manager":  DEPARTMENT_MANAGER_PERMISSIONS,
  "asset-manager":       ASSET_MANAGER_PERMISSIONS,
  "auditor":             AUDITOR_PERMISSIONS,
  "super-admin":         SUPER_ADMIN_PERMISSIONS,
};

export const ROLE_LABELS: Record<Role, string> = {
  "super-admin":         "مدير عام النظام",
  "asset-manager":       "مدير الأصول",
  "department-manager":  "مدير القسم",
  "employee":            "موظف",
  "auditor":             "مراجع",
};
