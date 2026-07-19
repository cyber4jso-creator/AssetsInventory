# Backend RBAC Scope Design — Enterprise Asset Inventory

**Role:** Backend architect specification  
**Status:** Design only — **no code changes in this pass**  
**Stack:** NestJS + Prisma + PostgreSQL  
**Verified inputs:** Live OpenAPI (`/api/docs-json`), `GET /api/v1/assets` sample rows (July 2026), frontend mock audit (`docs/MOCK_DATA_AUDIT.md`)

---

## Executive summary

The unified assets API already **declares** `departmentId`, `sectorId`, and `assignedUserId` on `CreateAssetDto` / unified responses, but the five physical asset tables only persist a **free-text** `department` column (plus optional `owner` / `custodian` text). Mappers therefore emit empty scope IDs, breaking frontend RBAC for Employee, Department Manager, and Sector Manager roles.

**Recommendation:** Add **`department_id`** and **`assigned_user_id`** foreign keys to all five asset tables. **Do not persist `sector_id` on asset rows** — derive it at read time from `departments.sector_id` to preserve a single source of truth. Introduce a shared `AssetScopeService` for validation and derivation, backfill from existing Arabic `department` text, and extend `GET /assets` filters to enforce scope server-side.

---

## 1. Current schema analysis

> **Note:** Backend source and `prisma/schema.prisma` are not in this repository. Analysis below is inferred from OpenAPI DTOs, live API responses, and documented mapper behavior. **First implementation step in the backend repo must be `prisma db pull` + schema inspection to confirm column names and PK types.**

### 1.1 Five asset tables (inferred)

| Table | Text `department` | Text `owner` / custodian | `department_id` | `sector_id` | `assigned_user_id` |
|-------|-------------------|--------------------------|-----------------|-------------|-------------------|
| `systems` | ✅ (`CreateSystemDto.department`) | ✅ `owner` | ❌ not in create DTO | ❌ | ❌ |
| `applications` | ✅ | ✅ `owner` | ❌ | ❌ | ❌ |
| `networks` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `circuits` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `licenses` | ✅ | ✅ `owner` | ❌ | ❌ | ❌ |

**Unified response today** (live `GET /assets`):

```json
{
  "department": "إدارة تقنية المعلومات",
  "departmentId": "",
  "sectorId": "",
  "assignedUserId": null,
  "custodian": "إدارة تقنية المعلومات"
}
```

**Root cause:** `PrismaAssetsRepository` reads text fields from source rows, but mappers (`SystemMapper`, `ApplicationMapper`, `NetworkMapper`, `CircuitMapper`, `LicenseMapper`) **hardcode** empty scope IDs instead of reading DB columns that do not yet exist.

### 1.2 Related org / user tables (inferred)

| Table | Scope-relevant columns | Notes |
|-------|------------------------|-------|
| `users` | `user_id`, `department_id` | Live data shows **mixed ID formats** (`"1"`, `"2"`, `"DEPT-IT"`) |
| `departments` | Likely `department_id`, `name` / `name_ar`, `sector_id` | **Not exposed** — `GET /departments` → 404 |
| `sectors` | Likely `sector_id`, `name` / `name_ar` | **Not exposed** — `GET /sectors` → 404 |

### 1.3 What is *not* a scope field

| Field | Location | Why it is insufficient |
|-------|----------|------------------------|
| `owner` | systems, applications, licenses | Free-text label (often department name), not `users.user_id` |
| `custodian` | unified mapper output | Display-only; not a FK |
| `department` (text) | all five tables | Arabic display string; duplicates org data; unusable for RBAC joins |

### 1.4 Unified layer vs physical layer gap

OpenAPI `CreateAssetDto` already requires:

- `departmentId`, `sectorId`, `location`, `status`, `businessCriticality`, optional `assignedUserId`

Per-table `Create*Dto` classes accept only `department?: string`. **Writes through `/systems`, `/applications`, etc. never persist scope IDs**, even when the frontend sends them via the unified create path (if one exists).

---

## 2. Recommended schema — per-table columns vs normalization

### 2.1 Options compared

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| **A. Denormalize on all 5 tables** | Add `department_id`, `sector_id`, `assigned_user_id` to each table | Fast filtering in union queries; simple mapper | `sector_id` can drift from department; 5× migration + backfill; duplicate validation |
| **B. Shared `asset_scope` table** | One row per `asset_id` with scope FKs; asset tables unchanged | Single scope source; easy global reassignment | Extra join on every union query; must keep in sync on create/delete |
| **C. Hybrid (recommended)** | `department_id` + `assigned_user_id` on each table; **derive `sectorId` from department** | Correct org hierarchy; no sector drift; matches RBAC model | Sector filter requires join to `departments`; slightly more complex read mapper |
| **D. Assignment history table only** | Current assignee in `asset_assignments`; dept on asset | Full audit trail of custody | Heavier reads; overkill for MVP scoping |

### 2.2 Recommendation: **Option C (Hybrid)**

**Persist on every asset table:**

```text
department_id      → FK → departments.department_id
assigned_user_id   → FK → users.user_id (nullable)
```

**Do not persist `sector_id` on asset rows.** Derive in mapper:

```text
sectorId = asset.department?.sector_id ?? ""
```

**Rationale:**

1. Sector is a property of **department** in the org tree — storing it on assets creates dual-write risk.
2. Frontend RBAC already treats sector as derived from department (`getDepartmentsBySector`).
3. Union queries across five tables still filter efficiently on `department_id` and `assigned_user_id` with indexes.
4. Sector-level queries join `departments` once — acceptable at current scale (~400 assets).

**When to add denormalized `sector_id`:** Only if profiling shows sector-filter queries are hot and slow after indexes — then add as a **cached column** maintained by trigger or application transaction, not as the primary source of truth.

### 2.3 Text `department` column — keep during transition

Retain legacy `department VARCHAR` on all five tables until backfill and clients are stable. After backfill:

- **Write path:** populate text from `departments.name_ar` for backward compatibility.
- **Read path:** prefer relation name; fall back to text if FK null.
- **Deprecation:** remove text column in a later major migration once all rows have FKs.

---

## 3. Required Prisma schema changes

> Adjust `@map`, `@id`, and relation names after inspecting the real schema.

### 3.1 Org models (expose if missing)

Ensure canonical models exist (names may differ):

```prisma
model sectors {
  sector_id     String        @id
  name_ar       String
  departments   departments[]
}

model departments {
  department_id   String   @id
  sector_id       String
  name_ar         String
  sector          sectors  @relation(fields: [sector_id], references: [sector_id])
  users           users[]
  // inverse relations to five asset tables — see below
}
```

### 3.2 Add scope columns to all five asset models

Apply the **same three fields** to `systems`, `applications`, `networks`, `circuits`, `licenses`:

```prisma
model systems {
  asset_id           String   @id
  // ... existing columns ...
  department         String?  // legacy text — keep for now

  department_id      String?
  assigned_user_id   String?

  department_rel     departments? @relation(fields: [department_id], references: [department_id])
  assigned_user      users?       @relation("SystemAssignee", fields: [assigned_user_id], references: [user_id])

  @@index([department_id])
  @@index([assigned_user_id])
}
```

Repeat for `applications`, `networks`, `circuits`, `licenses` with distinct `@relation("...Assignee")` names on `users` to avoid Prisma ambiguity.

### 3.3 Users model

Confirm `users.department_id` FK → `departments.department_id`. **Normalize user department IDs** as part of org ID cleanup (see §5.3).

### 3.4 Optional future: assignment audit

Not required for MVP scope, but plan for:

```prisma
model asset_assignments {
  id               String   @id @default(cuid())
  asset_id         String
  source           String   // system | application | ...
  assigned_user_id String
  assigned_at      DateTime @default(now())
  assigned_by      String?
  unassigned_at    DateTime?
}
```

---

## 4. Required SQL migration

### 4.1 Migration phases

Use **three migrations** (not one monolith) to reduce lock time and simplify rollback.

#### Migration 1 — `add_asset_scope_columns_nullable`

```sql
-- Repeat for: systems, applications, networks, circuits, licenses

ALTER TABLE systems
  ADD COLUMN IF NOT EXISTS department_id     VARCHAR(64),
  ADD COLUMN IF NOT EXISTS assigned_user_id  VARCHAR(64);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_systems_department_id
  ON systems (department_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_systems_assigned_user_id
  ON systems (assigned_user_id);

-- FK constraints added AFTER backfill (Migration 2) to avoid failing on orphan values
```

#### Migration 2 — `backfill_asset_scope` (data migration)

Run scripted UPDATEs (see §5). No FK constraints yet.

#### Migration 3 — `enforce_asset_scope_fks`

```sql
ALTER TABLE systems
  ADD CONSTRAINT fk_systems_department
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_systems_assigned_user
    FOREIGN KEY (assigned_user_id) REFERENCES users(user_id)
    ON DELETE SET NULL;

-- Repeat for other four tables
```

### 4.2 Prisma migrate commands

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name add_asset_scope_columns_nullable
# run backfill script (§5)
npx prisma migrate dev --name enforce_asset_scope_fks
```

**Production:** use `prisma migrate deploy` + `CREATE INDEX CONCURRENTLY` in a manual SQL step if Prisma generates blocking indexes.

---

## 5. Data backfill strategy

### 5.1 Prerequisites

1. **Inventory org tables:** `SELECT department_id, name_ar, sector_id FROM departments`.
2. **Normalize names:** build a lookup map with trim + whitespace collapse + optional Arabic alef normalization.
3. **Export unmatched departments** before any UPDATE:

```sql
SELECT DISTINCT department, COUNT(*) AS cnt
FROM (
  SELECT department FROM systems
  UNION ALL SELECT department FROM applications
  UNION ALL SELECT department FROM networks
  UNION ALL SELECT department FROM circuits
  UNION ALL SELECT department FROM licenses
) u
WHERE department IS NOT NULL AND TRIM(department) <> ''
ORDER BY cnt DESC;
```

### 5.2 Department backfill rules

For each asset row where `department_id IS NULL`:

| Condition | Action |
|-----------|--------|
| Exact single match on `departments.name_ar` (normalized) | Set `department_id` |
| Multiple department rows match same name | **Do not guess** — log for manual resolution |
| No match | Leave NULL; add to remediation report |
| Row already has non-null `department_id` | **Never overwrite** |

Optional SQL pattern:

```sql
UPDATE systems s
SET department_id = d.department_id
FROM departments d
WHERE s.department_id IS NULL
  AND normalize_ar(s.department) = normalize_ar(d.name_ar)
  AND (
    SELECT COUNT(*) FROM departments d2
    WHERE normalize_ar(d2.name_ar) = normalize_ar(d.name_ar)
  ) = 1;
```

After FK backfill, optionally sync legacy text:

```sql
UPDATE systems s
SET department = d.name_ar
FROM departments d
WHERE s.department_id = d.department_id;
```

### 5.3 User / org ID normalization (parallel workstream)

Users currently reference departments as `"1"`, `"DEPT-IT"`, etc. Before assignment backfill:

1. Build mapping table `department_id_legacy_map (old_value, department_id)`.
2. `UPDATE users SET department_id = m.department_id FROM department_id_legacy_map m WHERE users.department_id = m.old_value`.
3. Expose `GET /departments` and `GET /sectors` so frontend replaces `orgConstants.ts`.

### 5.4 Assigned user backfill

**Do not** map `owner` or `custodian` text to `users.user_id` by name matching — high false-positive rate in Arabic/English mixed environments.

| Source | Action |
|--------|--------|
| Existing `assigned_user_id` column (if any hidden col) | Use directly |
| `owner` / `custodian` text | Leave `assigned_user_id` NULL |
| Future assignment workflow | Populate on assign API |

Report counts:

```sql
SELECT
  COUNT(*) AS total,
  COUNT(department_id) AS with_dept,
  COUNT(assigned_user_id) AS with_assignee
FROM systems; -- repeat per table
```

**Acceptance target for MVP:** ≥95% rows with `department_id` after backfill; `assigned_user_id` may remain mostly NULL until assignment feature ships.

---

## 6. Mapper changes

Each mapper (`SystemMapper`, `ApplicationMapper`, `NetworkMapper`, `CircuitMapper`, `LicenseMapper`) should map from Prisma entity **with included relations** to the unified DTO.

### 6.1 Prisma query include (shared pattern)

```typescript
include: {
  department_rel: { include: { sector: true } },
  assigned_user: { select: { user_id: true, full_name: true } },
}
```

### 6.2 Unified field mapping (all five mappers)

```typescript
function mapScopeFields(row: AssetRowWithRelations): UnifiedAssetScope {
  const departmentId = row.department_id ?? '';
  const sectorId = row.department_rel?.sector_id ?? row.department_rel?.sector?.sector_id ?? '';
  const assignedUserId = row.assigned_user_id ?? null;

  const departmentDisplay =
    row.department_rel?.name_ar?.trim()
    || row.department?.trim()
    || '';

  return { departmentId, sectorId, assignedUserId, department: departmentDisplay };
}
```

### 6.3 Per-mapper notes

| Mapper | Extra source fields | Scope notes |
|--------|---------------------|-------------|
| `SystemMapper` | `owner` | Map `owner` → display-only field; **do not** use as `assignedUserId` |
| `ApplicationMapper` | `owner`, `usersCount` | Same |
| `NetworkMapper` | — | No owner column |
| `CircuitMapper` | — | No owner column |
| `LicenseMapper` | `owner`, `totalLicenses` | Same |

**Remove** any hardcoded:

```typescript
departmentId: '',
sectorId: '',
assignedUserId: null,
```

### 6.4 Create / update mappers (reverse direction)

On POST/PATCH to per-table endpoints, accept:

```typescript
departmentId?: string;
assignedUserId?: string;
// reject client-provided sectorId — derive server-side
```

Resolve via `AssetScopeService` (§7) before Prisma `create` / `update`.

---

## 7. Repository changes

### 7.1 `PrismaAssetsRepository` — **yes, changes required**

| Area | Change |
|------|--------|
| **findAll union** | Include `department_rel` + `assigned_user` in each sub-query OR batch-load departments after union |
| **Filters** | Add `where: { department_id, assigned_user_id }` per table; sector filter via `department_rel: { sector_id }` |
| **Pagination** | Unchanged shape; ensure filters applied **before** merge/sort |
| **findOne** | Same includes for single asset lookup by `asset_id` + `source` |
| **create/update** | Delegate scope resolution to `AssetScopeService`; write FK columns |

### 7.2 New `AssetScopeService`

Centralize enterprise rules:

```typescript
@Injectable()
export class AssetScopeService {
  async resolve(input: {
    departmentId?: string | null;
    assignedUserId?: string | null;
  }): Promise<{
    departmentId: string | null;
    sectorId: string | null;       // derived, not persisted on asset row
    assignedUserId: string | null;
    departmentText: string | null;  // legacy column mirror
  }> {
    // 1. Validate department exists
    // 2. Derive sectorId from department.sector_id
    // 3. If assignedUserId provided, verify user exists AND user.department_id is compatible
    //    (optional policy: assignee must belong to same department or sector)
    // 4. Return resolved values
  }
}
```

Inject into all five create/update services and unified `AssetsService`.

### 7.3 Server-side RBAC enforcement (critical)

Frontend scoping is UX-only. Repository or guard layer must:

| Role | Query constraint |
|------|------------------|
| Employee | `assigned_user_id = currentUser.user_id` |
| Department Manager | `department_id = currentUser.department_id` |
| Sector Manager | `department_rel.sector_id = currentUser.sector_id` |
| Asset Manager / Auditor | No scope filter (permission-based) |

Apply in `PrismaAssetsRepository.findAll` using JWT claims — **not** optional query params from client.

---

## 8. API compatibility

### 8.1 Response shape — **backward compatible**

Unified asset JSON already includes `departmentId`, `sectorId`, `assignedUserId`. Populating real values **fixes** the frontend without breaking changes.

| Field | Before | After |
|-------|--------|-------|
| `departmentId` | `""` | Real ID or `""` if unset |
| `sectorId` | `""` | Derived from department |
| `assignedUserId` | `null` | Real ID or `null` |
| `department` | Arabic text | Same (from relation or legacy) |

### 8.2 Request shape — **additive changes**

| Endpoint | Change | Frontend impact |
|----------|--------|-----------------|
| `POST /systems`, `/applications`, … | Add optional `departmentId`, `assignedUserId` | Frontend `createAsset()` should send IDs instead of only text `department` |
| `POST /assets` (unified) | Already has scope fields — wire to persistence | Minor: stop relying on text-only creates |
| `GET /assets` | Add optional filters `departmentId`, `sectorId`, `assignedUserId` | Frontend filters already ID-ready; will enable server-side filtering |
| `GET /departments`, `GET /sectors` | **New endpoints** | Replace `orgConstants.ts` |

### 8.3 Frontend changes required (after backend deploy)

| Item | Required? |
|------|-----------|
| Read scope fields from API | Already implemented |
| Send `departmentId` on create | **Yes** — update `assetsApiService` payloads |
| Remove text-only department fallback | After org API available |
| Employee role visibility | Works once `assigned_user_id` populated |
| No UI redesign | Confirmed |

**No breaking changes** if empty string / null semantics are preserved for unset values.

---

## 9. Migration risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Arabic department name mismatches block backfill | High | Rows stay unscoped | Manual mapping CSV; fuzzy match review queue — never auto-guess |
| Mixed `users.department_id` formats | High | Wrong RBAC for managers | Normalize user dept IDs before enforcement |
| Duplicate department names in DB | Medium | Wrong FK assignment | Unique constraint on normalized name OR manual disambiguation |
| Long table locks during FK add | Medium | API downtime | Nullable columns first; `CREATE INDEX CONCURRENTLY`; FK in off-hours |
| Union query perf regression | Low | Slow `GET /assets` | Indexes on `(department_id)`, `(assigned_user_id)` per table |
| Client sends conflicting `sectorId` | Medium | Data inconsistency | Reject client `sectorId`; derive server-side |
| Assigning user outside department | Medium | Policy violation | Validate in `AssetScopeService` |
| Legacy integrations rely on text `department` only | Medium | Break external reports | Mirror text from relation during transition |

---

## 10. Rollback plan

### 10.1 Before production deploy

1. **Full DB snapshot** (pg_dump) immediately before Migration 1.
2. Record migration IDs and row counts per table.
3. Feature flag `ASSET_SCOPE_ENABLED=false` to keep mappers reading legacy behavior if needed.

### 10.2 Rollback per migration

| Stage | Rollback action |
|-------|-----------------|
| After Migration 1 (nullable columns) | Deploy previous API version; columns harmless if unused |
| After backfill | `UPDATE ... SET department_id = NULL, assigned_user_id = NULL` using snapshot diff if needed |
| After Migration 3 (FKs) | `ALTER TABLE ... DROP CONSTRAINT fk_*`; then drop columns if necessary |

### 10.3 Application rollback

```bash
# Revert to previous Docker image / git tag
git checkout <previous-release>
npm run build
# prisma migrate deploy does NOT auto-rollback — run manual SQL if required
```

Deploy previous NestJS build — old code ignores new columns safely if mappers do not require them.

### 10.4 Forward-fix preferred over rollback

For partial backfill failure, **prefer**:

- Publishing remediation report
- Leaving NULL scope for unmatched rows
- Running fix-forward scripts

…over full DB restore, unless FK migration introduced corrupt references.

---

## 11. Implementation sequence (recommended)

| Phase | Deliverable | Duration estimate |
|-------|-------------|-------------------|
| **0** | Schema inspection (`prisma db pull`), org table inventory | 0.5 day |
| **1** | Expose `GET /departments`, `GET /sectors`; normalize user dept IDs | 1–2 days |
| **2** | Migration 1 — nullable scope columns + indexes | 0.5 day |
| **3** | Backfill script + manual remediation report | 1–2 days |
| **4** | `AssetScopeService` + mapper/repository updates | 2 days |
| **5** | Migration 3 — FK constraints | 0.5 day |
| **6** | Server-side RBAC filters on `GET /assets` | 1–2 days |
| **7** | Update create DTOs/services (five modules) | 1 day |
| **8** | Integration tests + OpenAPI refresh | 1 day |

**Total:** ~8–10 working days with QA.

---

## 12. Verification checklist

```bash
npx prisma format && npx prisma validate && npm run build
npm run test:e2e -- assets-scope
```

Manual API tests:

```http
GET  /api/v1/assets?page=1&limit=5
GET  /api/v1/assets?departmentId=<DEPT-ID>
GET  /api/v1/assets?sectorId=<SEC-ID>
GET  /api/v1/assets?assignedUserId=<USER-ID>
POST /api/v1/systems  { "assetId": "SYS-TEST-001", "systemName": "Test", "departmentId": "DEPT-IT" }
```

**Pass criteria:**

- [ ] Unified rows return non-empty `departmentId` for backfilled assets
- [ ] `sectorId` matches department's sector
- [ ] Department Manager JWT sees only own department assets (server-enforced)
- [ ] Employee JWT sees only assigned assets when `assigned_user_id` set
- [ ] Unmatched legacy rows still returned for Asset Manager with empty scope IDs
- [ ] OpenAPI documents new create/filter fields

---

## 13. Open decisions (require product / security sign-off)

1. **Assignee policy:** Must assignee belong to the same department as the asset?
2. **Sector denormalization:** Add cached `sector_id` column later for perf?
3. **Legacy text column removal:** Target sprint for dropping `department VARCHAR`?
4. **Assignment workflow:** Single `assigned_user_id` vs full `asset_assignments` history?
5. **Canonical department PK format:** Standardize on `DEPT-*` vs numeric `"1"` / `"2"`?

---

*Document version: 1.0 — design only, no implementation.*
