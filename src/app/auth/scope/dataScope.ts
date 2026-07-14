import type { AuthUser } from "../types";
import { hasPermission } from "../permissions/permissions";

// ─────────────────────────────────────────────
// Data scope — frontend contract for Sprint 3 APIs
//
// Backend list endpoints should accept equivalent query params:
//   scope=own|department|sector|organization
//   userId, departmentId, sectorId (as applicable)
//
// Mock data is NOT filtered by scope in Sprint 1.
// Use resolveDataScope() when wiring API clients in Sprint 3.
// ─────────────────────────────────────────────

export type DataScope = "own" | "department" | "sector" | "organization";

export type ScopedModule =
  | "dashboard"
  | "assets"
  | "requests"
  | "reports"
  | "audit-log"
  | "notifications";

export interface ScopeContext {
  scope: DataScope;
  userId: string;
  department: string;
  departmentId: string;
  sectorId: string;
}

/** Maps RBAC permissions to the broadest data slice the user may request. */
export function resolveDataScope(user: AuthUser | null): DataScope {
  if (!user) return "own";
  if (hasPermission(user, "reports.view")) return "organization";
  if (hasPermission(user, "reports.view.sector")) return "sector";
  if (hasPermission(user, "reports.view.department")) return "department";
  if (hasPermission(user, "reports.view.own")) return "own";
  return "own";
}

export function buildScopeContext(user: AuthUser | null): ScopeContext | null {
  if (!user) return null;
  return {
    scope: resolveDataScope(user),
    userId: user.id,
    department: user.department,
    departmentId: user.departmentId,
    sectorId: user.sectorId,
  };
}

/**
 * Shape for future API query params — no network calls in Sprint 1.
 * Example: GET /assets?scope=department&departmentId=...
 */
export function buildScopeQueryParams(ctx: ScopeContext): Record<string, string> {
  const params: Record<string, string> = { scope: ctx.scope };
  if (ctx.scope === "own") params.userId = ctx.userId;
  if (ctx.scope === "department") params.departmentId = ctx.departmentId;
  if (ctx.scope === "sector") params.sectorId = ctx.sectorId;
  return params;
}

/** Documents which modules will honor scope once APIs exist. */
export const SCOPED_MODULES: Record<ScopedModule, string> = {
  dashboard:     "KPI aggregates, recent activity",
  assets:        "Asset list, detail, history",
  requests:      "Transfer / maintenance / disposal requests",
  reports:       "Report datasets and exports",
  "audit-log":   "Audit entries (organization-wide for privileged roles)",
  notifications: "User inbox (always own scope)",
};
