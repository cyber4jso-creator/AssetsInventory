# Mock Data Audit — Asset Inventory Management System

Audit date: 2026-07-19  
Scope: Frontend (`src/app`) alignment with NestJS backend (`GET /api/v1/assets`, users, roles, permissions).

---

## Summary

| Classification | Count | Notes |
|----------------|-------|-------|
| Backend connected | 5 modules | Assets, Dashboard KPIs, Reports, Users, Auth (demo login) |
| Mock-only pending backend | 6 areas | Requests, Notifications, Audit Log, Asset history/attachments, AI Assistant, Dashboard activity chart |
| UI configuration only | 4 areas | STATUS, CRITICALITY, HISTORY_EVENT_META, BUSINESS_CRITICALITY_OPTIONS |
| Auth-only demo data | 2 files | `demoUsers.ts`, `auth/mockUsers.ts` |
| Org constants (unverified) | 1 file | `orgConstants.ts` — TODO until sectors/departments API |

---

## Audit Table

| File | Export / symbol | Consumers | Module | API exists? | Safe action |
|------|-----------------|-----------|--------|-------------|-------------|
| `src/app/data/mock.ts` | `ASSETS` | *(none — dead)* `AssetsFilterSidebar` unused | Assets | Yes `GET /assets` | **Remove usage** — not imported by live screens |
| `src/app/data/mock.ts` | `ASSET_HISTORY` | AssetDetailScreen, AssetReportScreen, AssetDetailsPanel, assetDetailFields, AssetHistoryTimeline, AssetMovementHistoryTable | Asset detail / history | No | **Keep** — mock-only pending `GET /assets/:id/history` |
| `src/app/data/mock.ts` | `ASSET_ATTACHMENTS` | AssetDetailScreen | Attachments | No | **Keep** — mock-only pending backend |
| `src/app/data/mock.ts` | `AUDIT_LOGS` | AssetDetailScreen, AuditLogScreen | Audit | No | **Keep** — mock-only pending backend |
| `src/app/data/mock.ts` | `REQUESTS` | RequestsDataContext | Requests | No | **Keep** — mock-only pending backend |
| `src/app/data/mock.ts` | `NOTIFICATIONS` | App.tsx (header bell) | Notifications | No | **Keep** — mock-only pending backend |
| `src/app/data/mock.ts` | `AI_INIT`, `AI_SUGGESTIONS` | AIAssistantScreen | AI Assistant | No | **Keep** — mock-only pending backend |
| `src/app/data/mock.ts` | `STATUS` | primitives, roleAssetFilters, AssetDetailsPanel | Shared UI | N/A | **Keep** — UI configuration (Arabic status labels) |
| `src/app/data/mock.ts` | `CRITICALITY`, `BUSINESS_CRITICALITY_OPTIONS` | primitives, AddAssetScreen | Shared UI | N/A | **Keep** — UI configuration |
| `src/app/data/mock.ts` | `HISTORY_EVENT_META` | AssetHistoryTimeline, AssetMovementHistoryTable | History UI | N/A | **Keep** — UI configuration |
| `src/app/data/mock.ts` | `KPI_DATA`, `MONTHLY`, `DEPT_PIE`, `USERS` | *(none — dead exports)* | Dashboard / Users | N/A | **Remove usage** — superseded by API-driven dashboard |
| `src/app/data/demoUsers.ts` | `DEMO_USERS`, getters | auth/mockUsers, userDisplay (fallback), mock.ts USERS | Authentication | N/A | **Keep for authentication only** |
| `src/app/auth/mockUsers.ts` | `DEMO_ACCOUNTS` | authService | Login | N/A | **Keep for authentication only** |
| `src/app/data/orgConstants.ts` | `ORG_SECTORS`, `ORG_DEPARTMENTS` | org forms, roleAssetFilters, user.mapper, assetScope, AddAssetScreen | Organization | **No** — 404 on `/sectors`, `/departments` | **Keep temporarily + TODO** — replace when API available |
| `src/app/data/mockReferenceDate.ts` | `MOCK_TODAY` | dashboardStats, assetScope, RequestsDataContext | Date anchor | N/A | **Keep** — chart window reference until live dates from API |
| `src/app/features/assets/contexts/AssetsDataContext.tsx` | state `[]` + API | AssetsScreen, Dashboard, Reports, etc. | Assets | Yes | **Replace with API** — done; no mock fallback on error |
| `src/app/features/assets/AssetsFilterSidebar.tsx` | uses `ASSETS` | *(unused component)* | Assets filters | Yes | **Do not wire** — superseded by `AssetsFilterBar` + API |
| `src/app/features/requests/contexts/RequestsDataContext.tsx` | `INITIAL_REQUESTS` | RequestsScreen | Requests | No | **Keep** — mock-only pending backend |
| `src/app/utils/assetMappings.ts` | category/source maps | Assets, Reports, Dashboard tabs | Shared mappings | N/A | **Keep** — canonical display mapping |
| `src/app/features/users/contexts/UsersDataContext.tsx` | API fetch | UserManagementScreen, filters | Users | Yes | **Replace with API** — done |

---

## Organization Data Findings

**Verified from API (not inventing IDs):**

- Assets return Arabic `department` text from PostgreSQL; `departmentId`, `sectorId`, `assignedUserId` are currently empty strings / null.
- Users API returns mixed `department_id` values (e.g. `"1"`, `"DEPT-IT"`) — partial overlap with frontend `DEPT-*` placeholders.
- No seed files or Prisma schema in this repository.
- `GET /api/v1/sectors` and `GET /api/v1/departments` return 404.

**Current `orgConstants.ts`:**

- Contains demo sectors such as `قطاع التقنية والعمليات` and departments such as `تقنية المعلومات` — **not confirmed** against database IDs.
- Marked with TODO; used only for Add Asset form labels and RBAC text fallback when scope IDs are empty.

**Required backend endpoints:**

```
GET /api/v1/sectors
GET /api/v1/departments
```

---

## Feature Classification

| Feature | Status |
|---------|--------|
| Assets list / table / cards | **Backend connected** — `GET /assets` only; error state on failure |
| Asset details (core fields) | **Backend connected** — asset from API context |
| Asset history / attachments / audit tabs | **Mock-only pending backend** |
| Dashboard KPI counts (total, active, maintenance) | **Backend connected** — from scoped API assets |
| Dashboard monthly activity / transfers KPI | **Mock-only pending backend** — history empty until API |
| Reports (inventory, warranty CSV) | **Backend connected** |
| Reports (movement) | **Deferred** — no history API |
| Users Management | **Backend connected** |
| Login / session | **Demo auth** — `DEMO_USERS` retained |
| Requests | **Mock-only pending backend** |
| Notifications (header) | **Mock-only pending backend** |
| Audit Log screen | **Mock-only pending backend** |
| AI Assistant | **Mock-only pending backend** |
| Profile / Settings | **UI only** — reads `currentUser` from auth session |
| Roles screen | **UI shell** — roles API exists but screen not fully wired |

---

## Changes Applied (this pass)

1. Removed mock asset fallback from `AssetsDataContext` — starts `[]`, shows error on API failure.
2. Added `assetMappings.ts` for backend source/category → Arabic labels.
3. Filters derive options from API assets; sector/assignee filters hidden when scope IDs unavailable.
4. Dashboard asset KPIs and dept pie from API assets only; activity chart uses empty history (zeros).
5. Users Management API-only; demo users isolated to auth + history performer fallback.
6. `orgConstants.ts` annotated with TODO pending sectors/departments API.
