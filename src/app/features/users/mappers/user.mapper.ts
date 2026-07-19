import { getDepartmentById } from "../../../data/orgConstants";
import type { UserRecord } from "../contexts/UsersDataContext";
import type { ApiUser } from "../services/usersApiService";

function stableNumericId(value: string): number {
  const numericPart = value.match(/\d+/)?.[0];

  if (numericPart) {
    return Number(numericPart);
  }

  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function mapApiStatus(status: ApiUser["status"]): UserRecord["status"] {
  return status === "Inactive" ? "inactive" : "active";
}

export function mapApiUserToUserRecord(apiUser: ApiUser): UserRecord {
  const departmentId = apiUser.department_id ?? "";

  return {
    id: stableNumericId(apiUser.user_id),
    apiId: apiUser.user_id,
    name: apiUser.full_name,
    email: apiUser.email,
    roleId: apiUser.roles?.role_id ?? null,
    role: apiUser.roles?.role_name ?? "",
    departmentId,
    department:
      getDepartmentById(departmentId)?.name ??
      departmentId,
    status: mapApiStatus(apiUser.status),
    lastLogin: "—",
  };
}
