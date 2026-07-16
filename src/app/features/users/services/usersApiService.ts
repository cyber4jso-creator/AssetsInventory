export interface ApiUser {
  user_id: string;
  full_name: string;
  email: string;
  department_id: string | null;
  status: string | null;
  roles: {
    role_id: number;
    role_name: string;
    description: string | null;
  } | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  roleId: number;
  departmentId?: string;
  status?: "Active" | "Inactive";
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://10.27.57.24:3000/api/v1";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(`Users API request failed: ${response.status}`);
  }

  return result.data;
}

export function fetchUsers(signal?: AbortSignal): Promise<ApiUser[]> {
  return request<ApiUser[]>("/users", { signal });
}

export function createUser(
  payload: CreateUserPayload,
): Promise<ApiUser> {
  return request<ApiUser>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUserStatus(
  userId: string,
  status: "Active" | "Inactive",
): Promise<ApiUser> {
  return request<ApiUser>(`/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
