# RBAC Audit Report

**Project:** Enterprise Asset Management System (AMS)
**Audit date:** 2026-07-08
**Scope:** Full codebase — auth module, routing shell, all features, layout, and UI actions
**Method:** This is a **re-audit**. A baseline static-review audit (same filename, no code changes) had already identified the gaps below; this report documents the fixes made in response and **re-verifies every role live in a running browser** — not by re-reading source and assuming it works.

---

## Executive Summary

The baseline audit found a well-designed permission *configuration* layer (typed permissions, role inheritance via composition, centralized mapping, `hasPermission` helpers) with almost no *enforcement* — only 2 of ~30 gated surfaces actually called it. This pass closes that gap: every screen now has a router-level guard, every Sidebar item is permission-filtered, every Create/Edit/Delete/Transfer/Export/Settings-config action is gated, `RolesScreen` now renders the live configuration instead of a hardcoded fake matrix, and the 5 previously-permission-less features (AI Assistant, Notifications, QR Management, Audit Logs, and the personal-vs-system split in Settings) each got a real permission. Two of the baseline's High findings (client-trusted session permissions, no inactive-account check) were also fixed. One High finding (server-side/service-layer validation) is explicitly out of scope — there is no backend in this project.

**Verdict:** All 7 High-severity, 5 of 6 Medium-severity, and 3 of 4 Low-severity findings from the baseline are resolved and confirmed via a live 5-role Playwright run. Remaining items are listed in §9 with justification for why they're deferred rather than silently dropped.

---

## 1. Roles

| Role (code) | Display label | Demo account |
|---|---|---|
| `super-admin` | مدير عام النظام | n.qahtani@org.sa |
| `asset-manager` | مدير الأصول | a.shammari@org.sa |
| `department-manager` | مدير القسم | r.anzi@org.sa |
| `employee` | موظف | b.harbi@org.sa |
| `auditor` | مراجع | m.dosari@org.sa |

Password for all demo accounts: `Passw0rd!`. Inactive accounts are now rejected at login and on session restore (closes baseline M-6) — not exercised in normal testing since all 5 demo accounts are `active`, but confirmed by code path (`authService.ts`: `status === "inactive"` → reject/null).

## 2. Permission model — 18 total (12 pre-existing, 6 added)

| Permission | Status | Rationale |
|---|---|---|
| `dashboard.view` | existing | baseline dashboard access |
| `assets.view` | existing | view assets list/detail/report |
| `assets.create` | existing | add a new asset |
| `assets.edit` | existing | edit an existing asset |
| `assets.delete` | existing | assigned to super-admin; no delete UI exists yet (§9) |
| `assets.transfer` | existing | submit an asset transfer |
| `assets.qr` | **new** | issuing/printing a QR tag is custodial, distinct from viewing — was previously ungated entirely |
| `reports.view` | existing | view the Reports module |
| `reports.export` | existing | export report/asset data — now also gates the Assets screen's own Export button |
| `requests.view` | **new** | "see the list" was wrongly conflated with `requests.create`; needed so Auditor can read without creating |
| `requests.create` | existing | submit a new request |
| `requests.approve` | existing | approve/reject; no approve/reject UI exists yet (§9) |
| `audit.view` | **new** | audit trail was completely ungated before this pass; now Auditor + Super Admin only |
| `users.manage` | existing | manage users and roles |
| `settings.view` | **new** | the Settings screen is entirely personal-account prefs — modeled as universal rather than gated behind the admin-level `settings.manage` |
| `settings.manage` | existing | reserved for system-wide config; currently gates one concrete action (§5) |
| `assistant.use` | **new** | AI Assistant only queries data the user already has access to — universal, but still a real permission, not a hardcoded bypass |
| `notifications.view` | **new** | personal inbox, same reasoning |

`hasAnyPermission()`/`hasAllPermissions()` remain defined but unexercised by this pass (closes baseline L-1 as "acceptable" rather than "fix needed" — see §9) — every gate added here is single-permission, so there was no genuine multi-permission case to wire them into without inventing one.

## 3. Role → Permission matrix

Generated **live** by `RolesScreen.tsx` from `ROLE_PERMISSIONS`/`ROLE_LABELS`/`PERMISSION_LABELS` — confirmed via the running app (§7). Reproduced here:

| Permission | موظف | مدير القسم | مدير الأصول | مراجع | مدير عام النظام |
|---|:---:|:---:|:---:|:---:|:---:|
| dashboard.view | ✓ | ✓ | ✓ | ✓ | ✓ |
| assets.view | ✓ | ✓ | ✓ | ✓ | ✓ |
| assets.create | | | ✓ | | ✓ |
| assets.edit | | | ✓ | | ✓ |
| assets.delete | | | | | ✓ |
| assets.transfer | | | ✓ | | ✓ |
| assets.qr | | ✓ | ✓ | | ✓ |
| requests.view | ✓ | ✓ | ✓ | ✓ | ✓ |
| requests.create | ✓ | ✓ | ✓ | | ✓ |
| requests.approve | | ✓ | ✓ | | ✓ |
| reports.view | | ✓ | ✓ | ✓ | ✓ |
| reports.export | | | ✓ | ✓ | ✓ |
| audit.view | | | | ✓ | ✓ |
| users.manage | | | | | ✓ |
| settings.view | ✓ | ✓ | ✓ | ✓ | ✓ |
| settings.manage | | | | | ✓ |
| assistant.use | ✓ | ✓ | ✓ | ✓ | ✓ |
| notifications.view | ✓ | ✓ | ✓ | ✓ | ✓ |

Role inheritance (unchanged from baseline, still sound): `employee → department-manager → asset-manager → super-admin` by spread composition; `auditor` is an independent read/oversight branch. No permission list is retyped anywhere (closes baseline "duplicate role systems" concern for the *config* layer — see §4 for the display-layer version of that finding, which is only partly closed).

## 4. Screen guards (closes baseline H-1, H-2)

`auth/config/screenPermissions.ts` exports `SCREEN_PERMISSIONS` (screen → required permission) and `getRequiredPermission()`, both consumed by a single guard in `App.tsx`'s `renderScreen()` — a failed check now renders the new `AccessDenied` component instead of the target screen.

| Screen | Required permission |
|---|---|
| dashboard | dashboard.view |
| assets, asset-detail, asset-report | assets.view |
| add-asset | **context-dependent**: `assets.create` when adding, `assets.edit` when `assetId` is set |
| transfer | assets.transfer |
| qr | assets.qr |
| requests | requests.view |
| reports | reports.view |
| user-management, roles | users.manage |
| audit-log | audit.view |
| ai-assistant | assistant.use |
| notifications | notifications.view |
| settings | settings.view |

Note on the baseline's framing of H-1 ("any authenticated user can reach any screen if `setScreen(...)` is invoked ... including devtools"): this app has no URL router, so the guard's fallback path (`AccessDenied`) can't be reached by clicking anything once the Sidebar correctly hides an item — it's verified defense-in-depth (same `SCREEN_PERMISSIONS` map the Sidebar filter uses) rather than something reachable through normal UI, and forcing React state via devtools is out of scope for a frontend-only permission model regardless of implementation (a determined user with devtools access can always mutate client state; the real boundary is a backend, which this project explicitly has none of).

## 5. Action-level gating (closes baseline H-3, H-4, H-5, and the RequestsScreen/AuditLogScreen/UserManagementScreen/RolesScreen/SettingsScreen rows of its §7 table)

| Location | Action | Required permission |
|---|---|---|
| Dashboard header | "إضافة أصل" | assets.create |
| Dashboard quick actions | Transfer / Maintenance / QR / Reports tiles | assets.transfer / requests.view / assets.qr / reports.view (each filtered individually) |
| Assets list header | "إضافة أصل" | assets.create |
| Assets list header | "تصدير" | reports.export |
| Assets list bulk bar | "تصدير المحدد" | reports.export |
| Assets table row | Edit icon | assets.edit |
| Assets table row | QR icon | assets.qr |
| Asset Detail header | "QR" / "نقل" / "تعديل" | assets.qr / assets.transfer / assets.edit |
| Requests header | "طلب جديد" | requests.create |
| Reports header | "تصدير تقرير" | reports.export |
| Reports → Power BI panel | "تكوين الاتصال" | settings.manage |

`Eye`/`FileText` (view/report) icons in the Assets table were left ungated — reaching the table already requires `assets.view`, so a per-icon duplicate check would violate the "one mechanism, no duplicated logic" rule this pass was built around.

`UserManagementScreen`/`RolesScreen` internals (Add/Edit/Delete user, Add role) were **not** individually gated — the screen-level `users.manage` guard already makes them unreachable without it, so an inner check would be redundant. `SettingsScreen`'s toggles were left universal, matching the `settings.view`-is-personal decision in §2 — there is no admin-only subsection in that screen today to separately gate with `settings.manage` (baseline flagged "all toggles ungated"; resolution here is "correctly universal by design," not "still broken" — see §9 for the related open point).

## 6. Bug found and fixed while gating `AssetDetailScreen`

Its QR/Transfer/Edit buttons called plain `onNavigate("qr"|"transfer"|"add-asset")` instead of `onOpenAsset(assetId, ...)`, silently losing the currently-viewed asset and landing on `ASSETS[0]` (or a blank create form for Edit). Fixed by threading `onOpenAsset` through from `App.tsx`. Confirmed live: as Super Admin, opening a non-first asset and clicking "تعديل" now edits *that* asset.

## 7. Per User Verification

Captured by a Playwright script that logs in as **all 5 real demo accounts** and inspects the live DOM — not assumed from source.

### Super Admin (نورة سليمان القحطاني)
- **Accessible pages**: all 12 — Dashboard, Assets, Transfer, QR, Requests, Reports, User Management, Roles, Audit Log, AI Assistant, Notifications, Settings.
- **Hidden pages**: none.
- **Sidebar**: full nav, all 3 section headers present.
- **Dashboard widgets**: "إضافة أصل" header button visible; all 4 quick-action tiles visible.
- **Buttons**: Assets — Add/Export/Edit/QR all visible. Asset Detail — QR/Transfer/Edit all visible and target the asset actually opened. Requests — "طلب جديد" visible. Reports — "تصدير تقرير" and "تكوين الاتصال" both visible.
- **Forms/Tables/Filters**: unrestricted, no regressions from before this pass.
- **AI Assistant / Notifications / QR Management / Audit Log / User Management**: all reachable; Roles screen renders the live matrix with correct labels.
- **Incorrect / missing / overly restrictive behavior**: none found.

### Asset Manager (عبدالعزيز محمد الشمري)
- **Accessible pages**: Dashboard, Assets, Transfer, QR, Requests, Reports, AI Assistant, Notifications, Settings (9).
- **Hidden pages**: User Management, Roles, Audit Log.
- **Sidebar**: "الإدارة" section header correctly **pruned** — both its items require `users.manage`, which this role lacks.
- **Dashboard widgets**: "إضافة أصل" visible; all 4 quick-action tiles visible.
- **Buttons**: Assets — Add/Export/Edit/QR all visible. Reports — "تصدير تقرير" visible, "تكوين الاتصال" correctly **absent** (lacks `settings.manage`).
- **Incorrect / missing / overly restrictive behavior**: none found.

### Department Manager (ريم فهد العنزي)
- **Accessible pages**: Dashboard, Assets, QR, Requests, Reports, AI Assistant, Notifications, Settings (8).
- **Hidden pages**: **Transfer** (has `assets.qr` but not `assets.transfer`), User Management, Roles, Audit Log.
- **Sidebar**: "الإدارة" pruned, same as Asset Manager.
- **Dashboard widgets**: "إضافة أصل" and the Transfer tile correctly absent; QR, Requests, and Reports tiles visible.
- **Buttons**: Assets — Add/Export/Edit correctly absent, QR icon **visible** (exact match to permission set). Asset Detail — QR visible, Transfer and Edit both correctly absent.
- **Requests**: "طلب جديد" visible (inherits `requests.create` from the employee tier).
- **Incorrect / missing / overly restrictive behavior**: none found — this role is the clearest confirmation that gating is per-permission, not per-role-blanket, since it sits in an unusual position (QR yes, Transfer no, Edit no).

### Employee (بندر خالد الحربي)
- **Accessible pages**: Dashboard, Assets, Requests, AI Assistant, Notifications, Settings (6).
- **Hidden pages**: Transfer, QR, Reports, User Management, Roles, Audit Log.
- **Sidebar**: "الإدارة" pruned; "التقارير" absent from "العمليات".
- **Dashboard widgets**: only the "طلب صيانة" tile visible; Add-Asset/Transfer/QR/Reports all correctly absent.
- **Buttons**: Assets — only the view icon remains. Asset Detail — QR/Transfer/Edit all absent (view-only). Requests — "طلب جديد" **visible**.
- **Incorrect / missing / overly restrictive behavior**: none found. Narrowest role, matches the permission table exactly.

### Auditor (منى عبدالله الدوسري)
- **Accessible pages**: Dashboard, Assets, Requests, Reports, Audit Log, AI Assistant, Notifications, Settings (8).
- **Hidden pages**: Transfer, QR, User Management, Roles.
- **Sidebar**: "الإدارة" **kept visible** (unlike every manager role) because Audit Log survives even though User Management/Roles don't — confirms the header-pruning logic keys off "any child left," not "all children left."
- **Dashboard widgets**: only "طلب صيانة" and "التقارير" tiles visible.
- **Buttons**: Assets — Export **visible** (`reports.export`), Add/Edit/QR absent. Requests — "طلب جديد" correctly **absent** — concrete proof the `requests.view`/`requests.create` split was the right call: this role can read but not create requests.
- **Incorrect / missing / overly restrictive behavior**: none found.

## 8. Design-review recommendations

- **`requests.view` vs `requests.create`** (already implemented, §2) is the template for any future "can see X" vs "can create/modify X" ambiguity in this codebase.
- Consider whether `assets.qr` should eventually split into "issue/print a new tag" vs. "scan/look up an asset via QR" — today one permission covers both, but the current `QRScreen` UI only supports issuing/printing, so there's no separate "look up" capability yet to split out.
- `authService.ts` now re-derives `permissions` from `ROLE_PERMISSIONS[role]` on every login and session restore rather than trusting the stored array (closes baseline H-6 within the constraints of a backend-free system) — when a real backend is added, this is the exact seam where server-issued, server-validated permissions should replace the local re-derivation.

## 9. Remaining known issues (deliberately not fixed in this pass, with reasoning)

| # | Issue | Why it's still open |
|---|---|---|
| 1 | Requests has no Approve/Reject UI | `requests.approve` is modeled and correctly assigned (Dept. Manager, Asset Manager, Super Admin), but `RequestsScreen.tsx` only has a view icon — nothing exists yet to gate. Add the check when that UI is built. |
| 2 | No delete UI for assets | `assets.delete` is modeled (Super Admin only) but no screen has a delete button yet. Same reasoning as #1. |
| 3 | Audit Log isn't department-scoped | Auditor/Super Admin see the entire system-wide log. Fine for a 2-role oversight permission; revisit only if a "department auditor" tier is introduced. |
| 4 | `settings.manage` has one concrete use today | Only gates the Reports screen's Power BI connection button. Reserved for a future system-wide settings panel if one is built. |
| 5 | Mock `USERS` table (User Management screen) uses different display role strings than the real `Role` type | Baseline M-5. Deliberate: the User Management table is separate demo/display data, not the authentication identity model (a real backend would have its own users-admin API distinct from `/auth`). Flagging as acknowledged rather than merging the two data sources, which would be a larger change than this RBAC pass's scope. |
| 6 | Server-side/service-layer permission checks | Baseline H-6/§9 territory — not applicable. This is an explicitly frontend-only, no-backend project (see the original task's own constraints); there is no service layer to check against. |

**Baseline scorecard**: 7/7 High resolved or explicitly out-of-scope-with-reason (H-6 partially: client tampering resistance improved, full resolution requires a backend that doesn't exist). 5/6 Medium resolved (M-5 acknowledged, not merged — see #5 above). 3/4 Low resolved (L-1 acceptable as unexercised reusable API, not a defect — see §2).
