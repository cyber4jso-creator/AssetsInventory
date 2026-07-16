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

export function mapApiUserToUserRecord(apiUser: ApiUser): UserRecord {
  const normalizedStatus = apiUser.status?.trim().toLowerCase();

  return {
    id: stableNumericId(apiUser.user_id),
    apiId: apiUser.user_id,
    name: apiUser.full_name ?? "",
    email: apiUser.email ?? "",
    role: apiUser.roles?.role_name ?? "",
    department: apiUser.department_id ?? "",
    status: normalizedStatus === "inactive" ? "inactive" : "active",
    lastLogin: "—",
  };
}
