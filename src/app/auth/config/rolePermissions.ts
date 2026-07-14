import type { Permission, Role } from "../types";

// ─────────────────────────────────────────────
// Role → Permission mapping — official enterprise model.
// Report permissions imply data scope; see auth/scope/dataScope.ts (Sprint 3 API filtering).
// ─────────────────────────────────────────────

const EMPLOYEE_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "assets.qr",
  "requests.view",
  "requests.create",
  "reports.view.own",
  "reports.export.own",
  "profile.manage",
  "assistant.use",
  "notifications.view",
];

const DEPARTMENT_MANAGER_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "assets.edit",
  "assets.transfer",
  "assets.qr",
  "requests.view",
  "requests.create",
  "requests.approve",
  "reports.view.department",
  "reports.export.department",
  "audit.view",
  "profile.manage",
  "assistant.use",
  "notifications.view",
];

const SECTOR_MANAGER_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "assets.create",
  "assets.edit",
  "assets.transfer",
  "assets.qr",
  "requests.view",
  "requests.create",
  "requests.approve",
  "reports.view.sector",
  "reports.export.sector",
  "audit.view",
  "profile.manage",
  "assistant.use",
  "notifications.view",
];

const ASSET_MANAGER_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "assets.create",
  "assets.edit",
  "assets.delete",
  "assets.transfer",
  "assets.qr",
  "requests.view",
  "requests.create",
  "requests.approve",
  "reports.view",
  "reports.export",
  "audit.view",
  "users.manage",
  "settings.manage",
  "profile.manage",
  "assistant.use",
  "notifications.view",
];

const AUDITOR_PERMISSIONS: Permission[] = [
  "dashboard.view",
  "assets.view",
  "requests.view",
  "reports.view",
  "reports.export",
  "audit.view",
  "profile.manage",
  "assistant.use",
  "notifications.view",
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "employee":            EMPLOYEE_PERMISSIONS,
  "department-manager":  DEPARTMENT_MANAGER_PERMISSIONS,
  "sector-manager":      SECTOR_MANAGER_PERMISSIONS,
  "asset-manager":       ASSET_MANAGER_PERMISSIONS,
  "auditor":             AUDITOR_PERMISSIONS,
};

export const REPORTS_VIEW_PERMISSIONS: Permission[] = [
  "reports.view",
  "reports.view.own",
  "reports.view.department",
  "reports.view.sector",
];

export const REPORTS_EXPORT_PERMISSIONS: Permission[] = [
  "reports.export",
  "reports.export.own",
  "reports.export.department",
  "reports.export.sector",
];

export const ROLE_LABELS: Record<Role, string> = {
  "employee":            "Employee",
  "department-manager":  "Department Manager",
  "sector-manager":      "Sector Manager",
  "asset-manager":       "Asset Manager",
  "auditor":             "Auditor",
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  "dashboard.view":           "View Dashboard",
  "assets.view":              "View Assets",
  "assets.create":            "Add Asset",
  "assets.edit":              "Edit Asset",
  "assets.delete":            "Delete Asset",
  "assets.transfer":          "Transfer Asset",
  "assets.qr":                "Generate QR",
  "requests.view":            "View Requests",
  "requests.create":          "Create Request",
  "requests.approve":         "Approve Requests",
  "reports.view":             "View Reports",
  "reports.export":           "Export Reports",
  "reports.view.own":         "View Own Reports",
  "reports.export.own":       "Export Own Reports",
  "reports.view.department":  "View Department Reports",
  "reports.export.department":"Export Department Reports",
  "reports.view.sector":      "View Sector Reports",
  "reports.export.sector":    "Export Sector Reports",
  "audit.view":               "View Audit Log",
  "users.manage":             "Manage Users & Roles",
  "settings.manage":          "Manage System Settings",
  "profile.manage":           "Manage Profile",
  "assistant.use":            "Use AI Assistant",
  "notifications.view":       "View Notifications",
};
