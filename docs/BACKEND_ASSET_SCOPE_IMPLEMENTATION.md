# Backend Asset Scope Fields — Implementation Spec

**Status:** Spec only — backend source code is **not** in this repository.  
**Verified against:** `http://10.27.57.24:3000/api/v1` OpenAPI (`/api/docs-json`) and live responses (July 2026).

---

## 1. Existing schema findings (from API, not Prisma files)

This frontend repo does **not** contain `prisma/schema.prisma`. Findings below are inferred from OpenAPI DTOs and live `GET /assets` responses.

### Five asset create DTOs (current)

| Module | Text department field | Scope ID fields |
|--------|----------------------|-----------------|
| `CreateSystemDto` | `department?: string` | **None** |
| `CreateApplicationDto` | `department?: string` | **None** |
| `CreateNetworkDto` | `department?: string` | **None** |
| `CreateCircuitDto` | `department?: string` | **None** |
| `CreateLicenseDto` | `department?: string` | **None** |

Additional text fields that may help backfill later:

- `owner` (applications, systems, licenses)
- `custodian` (unified response only — not in all create DTOs)

### Unified assets response (current mapper behavior)

Live rows return:

```json
{
  "department": "إدارة تقنية المعلومات",
  "departmentId": "",
  "sectorId": "",
  "assignedUserId": null
}
```

**Root cause:** Unified mapper copies textual `department` from source rows but **hardcodes** empty scope IDs (not read from DB columns).

### Users table (from `GET /users`)

- Primary key: `user_id` (e.g. `U006`, `U008`)
- `department_id` values are **inconsistent**: `"1"`, `"2"`, `"DEPT-IT"`, `"DEPT-HR"`
- Frontend demo org IDs use `DEPT-IT`, `DEPT-HR`, etc. (`src/app/data/orgConstants.ts`)

### Organization endpoints

- `GET /departments` — **404**
- `GET /sectors` — **404**
- Departments/sectors likely exist in PostgreSQL but are not exposed via REST yet.

### GET /assets filters (current)

Supported: `search`, `status`, `source`, `category`, `department` (text name), `manufacturer`, `businessCriticality`, `sortBy`, `sortOrder`, `page`, `limit`

**Not supported yet:** `departmentId`, `sectorId`, `assignedUserId`

---

## 2. Prisma schema changes (apply in backend repo)

Add to **all five models** (`systems`, `applications`, `networks`, `circuits`, `licenses`):

```prisma
departmentId     String?  @map("department_id")
sectorId         String?  @map("sector_id")
assignedUserId   String?  @map("assigned_user_id")

department       departments? @relation(fields: [departmentId], references: [department_id])
sector           sectors?     @relation(fields: [sectorId], references: [sector_id])
assignedUser     users?       @relation("AssetAssignee", fields: [assignedUserId], references: [user_id])
```

**Before applying:** Inspect actual `departments`, `sectors`, and `users` model primary key field names and relation names in the real schema. Use explicit `@relation("...")` names if multiple relations to `users` exist.

Keep existing textual `department` column if present for backward compatibility during migration.

---

## 3. Migration

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name add_asset_scope_fields
```

Do **not** reset the database.

---

## 4. Backfill script

Create `prisma/scripts/backfill-asset-scope.ts` (or SQL migration step):

1. `SELECT DISTINCT department FROM` each of the five tables where `department_id IS NULL`.
2. Match against `departments` table using normalized name comparison:
   - trim whitespace
   - collapse multiple spaces
   - optional Arabic normalization (أ/إ/آ → ا)
3. On exact unique match → set `department_id`, derive `sector_id` from `departments.sector_id`.
4. Log unmatched names — do **not** guess.
5. Never overwrite non-null IDs.

**assignedUserId:** Leave `NULL` unless a reliable mapping exists (e.g. future `owner_user_id` column). Do **not** map `owner`/`custodian` text to users by name alone.

---

## 5. Create DTOs

Add to all five `Create*Dto` classes:

```typescript
@IsOptional()
@IsString()
departmentId?: string;

@IsOptional()
@IsString()
assignedUserId?: string;

// Do NOT accept sectorId from client — derive server-side
```

---

## 6. Create services

Shared helper (e.g. `AssetScopeService`):

```typescript
async resolveScope(input: { departmentId?: string; assignedUserId?: string }) {
  // 1. Verify department exists
  // 2. Derive sectorId from department.sectorId
  // 3. Verify assignedUserId exists if provided
  // 4. Return { departmentId, sectorId, assignedUserId }
}
```

Call from all five create services. Save scope IDs on insert. Optionally mirror `department.nameAr` into legacy text `department` field.

**Reject** client-provided `sectorId` that conflicts with department.

---

## 7. Unified assets mapper

In `AssetsService` / unified mapper:

```typescript
departmentId: row.departmentId ?? row.department?.department_id ?? "",
sectorId: row.sectorId ?? row.department?.sectorId ?? "",
assignedUserId: row.assignedUserId ?? null,
department: row.departmentRelation?.nameAr ?? row.department ?? "",
```

Adapt field names to actual Prisma relation names.

---

## 8. GET /assets filters

Extend query DTO:

```typescript
@IsOptional() @IsString() departmentId?: string;
@IsOptional() @IsString() sectorId?: string;
@IsOptional() @IsString() assignedUserId?: string;
```

Apply `where` clause consistently in the union query across all five source tables.

Preserve existing filters and pagination shape.

---

## 9. Verification checklist

```bash
npx prisma format
npx prisma validate
npm run build
```

Manual tests:

```http
GET /api/v1/assets?page=1&limit=5
GET /api/v1/assets?departmentId=<real-id>
GET /api/v1/assets?sectorId=<real-id>
POST /api/v1/systems  { "assetId": "...", "systemName": "...", "departmentId": "DEPT-IT" }
```

Confirm unified response includes real `departmentId`, `sectorId`, and `assignedUserId` when set.

---

## 10. Remaining limitations

| Item | Status |
|------|--------|
| `assignedUserId` on existing rows | Likely stays `null` until assignment workflow exists |
| `GET /departments`, `GET /sectors` | Not exposed — frontend still uses `orgConstants.ts` |
| User `department_id` format mismatch | Backend uses `"1"`/`"2"` and `DEPT-*` — needs org ID normalization |
| Frontend RBAC scoping | Works once API returns real IDs; currently filters to 0 rows for Employee/Dept/Sector managers |

---

## Next step

Open the **NestJS backend repository** in Cursor and apply this spec against the real `prisma/schema.prisma`.
