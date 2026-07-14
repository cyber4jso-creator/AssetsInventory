import type { AuthUser, Permission } from "../types";
import type { Screen } from "../../types";
import { hasAnyPermission } from "../permissions/permissions";
import { REPORTS_VIEW_PERMISSIONS, REPORTS_EXPORT_PERMISSIONS } from "./rolePermissions";

// ─────────────────────────────────────────────
// Screen → required permission
// ─────────────────────────────────────────────

export const SCREEN_PERMISSIONS: Partial<Record<Screen, Permission>> = {
  "dashboard":       "dashboard.view",
  "assets":          "assets.view",
  "asset-detail":    "assets.view",
  "asset-report":    "assets.view",
  "transfer":        "assets.transfer",
  "qr":              "assets.qr",
  "requests":        "requests.view",
  "user-management": "users.manage",
  "roles":           "users.manage",
  "audit-log":       "audit.view",
  "ai-assistant":    "assistant.use",
  "notifications":   "notifications.view",
  "profile":         "profile.manage",
  "settings":        "settings.manage",
};

export function hasReportsAccess(user: AuthUser | null): boolean {
  return hasAnyPermission(user, REPORTS_VIEW_PERMISSIONS);
}

export function hasReportsExport(user: AuthUser | null): boolean {
  return hasAnyPermission(user, REPORTS_EXPORT_PERMISSIONS);
}

export function getRequiredPermission(screen: Screen, ctx?: { isEditing?: boolean }): Permission | null {
  if (screen === "add-asset") return ctx?.isEditing ? "assets.edit" : "assets.create";
  if (screen === "reports") return null;
  return SCREEN_PERMISSIONS[screen] ?? null;
}

export function canAccessScreen(user: AuthUser | null, screen: Screen, ctx?: { isEditing?: boolean }): boolean {
  if (screen === "reports") return hasReportsAccess(user);
  const required = getRequiredPermission(screen, ctx);
  if (!required) return true;
  return hasAnyPermission(user, [required]);
}
