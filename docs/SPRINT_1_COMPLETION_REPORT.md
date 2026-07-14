# Sprint 1 Completion Report

**Project:** Enterprise Asset Inventory Management System  
**Sprint:** 1 — Identity, Data Consistency, RBAC, Frontend Stabilization  
**Status:** Complete (see [Addendum](./SPRINT_1_ADDENDUM_REPORT.md) for final adjustments)

---

## Deliverables

### Demo users
Single source of truth in `src/app/data/demoUsers.ts`:

| Name | Role | Email |
|------|------|-------|
| Ahmed | Employee | employee@org.sa |
| Sara | Department Manager | department.manager@org.sa |
| Khalid | Sector Manager | sector.manager@org.sa |
| Fatimah | Asset Manager | asset.manager@org.sa |
| Omar | Auditor | auditor@org.sa |

Password for all accounts: `Passw0rd!`

### Data consistency
- Assets, history, audit logs, requests, notifications, and user management reference the same users and IDs
- Dashboard KPIs derived from mock assets and history (not inflated static numbers)

### RBAC
- Official permission model in `auth/config/rolePermissions.ts`
- Route guards via `canAccessScreen()`
- Sidebar, buttons, and exports gated by role

### Frontend stabilization
- Dashboard asset navigation fix
- Notification badge synchronized with notifications screen
- Profile screen
- Edit asset form prefill
- Add-asset route guard edge case fixed

---

## Sprint 2 (next — not started)

Frontend polish only: UX, forms, QR/print/report layouts, empty/loading states, confirmations, toasts.

## Sprint 3 (after Sprint 2)

Backend: NestJS, Prisma, PostgreSQL, auth integration, REST APIs, frontend wiring.

See [SPRINT_ROADMAP.md](./SPRINT_ROADMAP.md).
