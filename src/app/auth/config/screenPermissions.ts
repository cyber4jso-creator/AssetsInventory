import type { Permission } from "../types";
import type { Screen } from "../../types";

// ─────────────────────────────────────────────
// Screen → required permission — single source of truth
// for the App.tsx route guard, the Sidebar filter, and
// anything else that needs to know "can this user see X".
// ─────────────────────────────────────────────

export const SCREEN_PERMISSIONS: Partial<Record<Screen, Permission>> = {
  "dashboard":       "dashboard.view",
  "assets":          "assets.view",
  "asset-detail":    "assets.view",
  "asset-report":    "assets.view",
  "transfer":        "assets.transfer",
  "qr":              "assets.qr",
  "requests":        "requests.view",
  "reports":         "reports.view",
  "user-management": "users.manage",
  "roles":           "users.manage",
  "audit-log":       "audit.view",
  "ai-assistant":    "assistant.use",
  "notifications":   "notifications.view",
  "settings":        "settings.view",
  // "add-asset" is context-dependent — see getRequiredPermission below.
};

export function getRequiredPermission(screen: Screen, ctx?: { isEditing?: boolean }): Permission | null {
  if (screen === "add-asset") return ctx?.isEditing ? "assets.edit" : "assets.create";
  return SCREEN_PERMISSIONS[screen] ?? null;
}
