# Sprint 1 Addendum Report

**Date:** 2026-07-14  
**Scope:** Final Sprint 1 adjustments before approval

---

## Files modified

| File | Change |
|------|--------|
| `src/app/data/mockReferenceDate.ts` | **New** — prototype reference date (July 2026) |
| `src/app/data/dashboardStats.ts` | **New** — KPI/chart builders tied to reference date |
| `src/app/data/mock.ts` | 2026 history events; KPI/chart use `dashboardStats` |
| `src/app/features/dashboard/DashboardScreen.tsx` | Dynamic chart year; accurate KPI footnotes |
| `src/app/auth/scope/dataScope.ts` | **New** — data scope contract for Sprint 3 APIs |
| `src/app/auth/scope/index.ts` | **New** — scope module exports |
| `src/app/auth/index.ts` | Export scope helpers |
| `src/app/auth/config/rolePermissions.ts` | Comment linking permissions to data scope |
| `docs/SPRINT_ROADMAP.md` | **New** — official 3-sprint roadmap |
| `docs/SPRINT_1_COMPLETION_REPORT.md` | **New** — Sprint 1 summary |
| `docs/SPRINT_1_ADDENDUM_REPORT.md` | This document |
| `README.md` | Demo users, roles, roadmap corrected |
| `PROJECT_TREE.md` | Updated structure note |
| `RBAC_AUDIT_REPORT.md` | Superseded notice added |

---

## KPI adjustments (Option A)

**Problem:** “نقل هذا الشهر” counted June 2024 transfers while the UI implied the current month.

**Fix:**
- Added `MOCK_TODAY = 2026-07-14` as the prototype reference date
- Added seven history events in Feb–Jul 2026, including **two transfers in July 2026**
- KPI “نقل هذا الشهر” now counts **2** (July 2026 transfers only)
- Activity chart shows the **last 6 months** ending July 2026 (Feb–Jul), year label **2026**
- KPI footnote shows “بيانات محدثة” instead of a fake month-over-month delta

---

## Roadmap corrections

Official roadmap documented in `docs/SPRINT_ROADMAP.md`:

| Sprint | Focus |
|--------|--------|
| **1** | Identity, demo users, data consistency, RBAC, frontend stabilization |
| **2** | Frontend polish — UX, forms, layouts, empty/loading states, dialogs, toasts |
| **3** | Backend — NestJS, Prisma, PostgreSQL, auth, REST APIs, integration |

Removed incorrect placement of backend work in Sprint 2 from README and project docs.

---

## Scope-readiness improvements

New module: `src/app/auth/scope/`

| Export | Purpose |
|--------|---------|
| `DataScope` | `own` \| `department` \| `sector` \| `organization` |
| `resolveDataScope(user)` | Maps report permissions → scope (no filtering yet) |
| `buildScopeContext(user)` | `{ scope, userId, department }` for API clients |
| `buildScopeQueryParams(ctx)` | Future query param shape for Sprint 3 |
| `SCOPED_MODULES` | Documents which features will honor scope |

Mock data remains unfiltered in Sprint 1. No API services were added.

---

## Verification

Run `npm run build` — expected to pass.

**Sprint 2 not started.** Awaiting approval.
