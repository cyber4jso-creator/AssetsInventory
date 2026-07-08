import type { AuthUser, Permission } from "../types";

// ─────────────────────────────────────────────
// Centralized permission engine — components should
// call these instead of inspecting user.role directly.
// ─────────────────────────────────────────────

export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  return !!user?.permissions.includes(permission);
}

export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(user, p));
}

export function hasAllPermissions(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(user, p));
}
