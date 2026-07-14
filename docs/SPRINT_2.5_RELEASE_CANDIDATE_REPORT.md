# Sprint 2.5 — Release Candidate Report

**Date:** July 2026  
**Scope:** Frontend QA pass before Backend integration (Sprint 3). No backend, APIs, or redesign.

---

## 1. Files Modified

### New utilities & components
| File | Purpose |
|------|---------|
| `src/app/utils/search.ts` | Case-insensitive `matchesQuery()` (Arabic/English) |
| `src/app/utils/paginate.ts` | `paginateArray`, `getTotalPages`, `getPaginationRange` |
| `src/app/utils/qrExport.ts` | Local SVG → PNG download |
| `src/app/components/shared/PaginationBar.tsx` | Reusable table pagination |

### Updated screens & components
| Area | Files |
|------|-------|
| Search | `AssetsScreen`, `RequestsScreen`, `ReportsScreen`, `NotificationsScreen`, `UserManagementScreen`, `AuditLogScreen`, `QRScreen`, `TopBar` |
| Tables | `AssetsScreen`, `AssetsTable`, `RequestsScreen`, `UserManagementScreen`, `AuditLogScreen` |
| QR | `QRScreen.tsx`, `QrCodeGraphic.tsx` |
| Reports | `AssetReportScreen.tsx` |
| Layout / print | `AppGlobalStyles.tsx`, `TopBar.tsx`, `CategoryTabs.tsx` |
| Explorer | `assetExplorer.ts` (category tab mapping) |

### Removed (dead code)
| File | Reason |
|------|--------|
| `src/app/components/shared/StatCard.tsx` | Unused export |
| `src/app/features/assets/utils/assetFilters.ts` | Superseded by `roleAssetFilters.ts` |

---

## 2. Search Fixes

| Page | Before | After |
|------|--------|-------|
| **Assets** | Working | + `aria-label`, works with filters/tabs |
| **Requests** | No search | Filters id, asset, requester, type, status, reason |
| **Reports** | No search | Filters report titles/descriptions |
| **Users** | Working | Fixed role filter (uses role keys); + `aria-label` |
| **Audit Log** | Working | Uses shared `matchesQuery`; resets pagination |
| **Notifications** | No search | Filters title, body, time; empty state added |
| **QR** | Case-sensitive, partial | Uses `matchesSearch()` (full asset fields, case-insensitive) |
| **TopBar quick search** | Enter → Assets | + `aria-label` |

All search inputs update results immediately on change.

---

## 3. Table Fixes

| Improvement | Applied to |
|-------------|------------|
| **Pagination** | Requests, Users, Audit Log (+ shared `PaginationBar` on Assets) |
| **Sorting** | Assets (column + asc/desc toggle) |
| **Empty states** | All tables when filters return zero rows |
| **Stable header keys** | Requests, Users, Audit Log (`actions` vs empty string) |
| **Category tabs** | Hide empty tabs; map furniture → applications, vehicles → circuits |
| **Row actions** | `aria-label` on icon buttons in Assets, Requests, Users |
| **Asset report access** | `AccessDenied` when asset not in scope (no silent fallback) |

---

## 4. QR Improvements

- **`QrCodeGraphic`** — deterministic pattern per `assetId` (via `forwardRef` for export)
- **Print** — picker hidden (`print:hidden`); card prints with asset name, id, department, location
- **Download PNG** — local canvas export via `downloadSvgAsPng()` (no backend)
- **Search** — aligned with Assets explorer search
- **Empty state** when filter returns no assets

---

## 5. Report Improvements

- **Asset Report** — scope guard, `QrCodeGraphic` tied to asset, print CSS (`asset-report-section`, `@page` margins)
- **Reports page** — search on report cards; scoped asset count in subtitle; CSV export functional
- **Print layout** — sidebar/topbar hidden globally; RTL preserved; tables full width on print

---

## 6. Responsive Fixes

- Full-width wrappers maintained (`w-full`, `min-w-0`) on management pages
- Tables use `overflow-x-auto` with sensible `min-w-*` (horizontal scroll on tablet, no layout break)
- TopBar search hidden below `md` (existing); profile name hidden below `lg`
- QR grid stacks on mobile (`grid-cols-1 lg:grid-cols-2`)

---

## 7. Accessibility Improvements

- `aria-label` on search inputs, notification bell, profile button, table action buttons
- `aria-label` / `aria-current` on pagination controls
- `role="tablist"` / `aria-selected` on asset category tabs
- `QrCodeGraphic` — `role="img"` + descriptive `aria-label`
- Notifications — keyboard activation (`Enter` / `Space`)
- Modal/ConfirmDialog — Radix Dialog (focus trap built-in)
- Date filters — visible labels via `Inp label=`

---

## 8. Performance / Cleanup

- Removed unused `StatCard`, `assetFilters.ts`
- Centralized pagination (removed duplicate pagination markup in Assets)
- Shared search utility (no duplicate `toLowerCase` logic)
- `QrCodeGraphic` keys fixed (no nested array key warnings)

---

## 9. Console Issues Fixed

| Issue | Fix |
|-------|-----|
| Duplicate React keys (`key=""` on action columns) | Named keys: `actions` |
| QR SVG nested map keys | Flat keys `d-{row}-{col}` |
| Invalid asset report fallback | Explicit `AccessDenied` |
| QR download stub toast | Real PNG download |

**Build:** `npm run build` — passes with no TypeScript errors.

---

## 10. Remaining Backend Work (Sprint 3)

- Authentication server / Entra ID / LDAP
- REST APIs for assets, history, attachments, audit, requests, users
- Server-side organizational scope & RBAC enforcement
- Real QR encoding (asset URL payload)
- PDF report generation
- Power BI Embedded connection
- File upload storage
- Persistent user/request state across sessions

---

## 11. Frontend Readiness Score

### **88 / 100**

| Area | Score | Notes |
|------|-------|-------|
| Search & filters | 95% | All listed pages functional |
| Tables & pagination | 90% | Sort on Assets; other tables pre-sorted or small datasets |
| QR | 92% | Local print/PNG; mock QR graphic (not encoded URL) |
| Reports & print | 85% | Asset report strong; PDF still deferred |
| Responsive | 88% | Tablet scroll tables; no dedicated mobile nav |
| Accessibility | 85% | Labels/focus improved; full audit not automated |
| Performance | 90% | Dead code removed; bundle still >500KB (charts) |
| Backend readiness | 80% | Mock contexts in place; APIs not wired |

---

**Status:** Release Candidate complete — awaiting approval before Sprint 3 (Backend).
