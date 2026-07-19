export interface ApiRole {
  role_id: number;
  role_name: string;
  description?: string | null;
}

export interface ApiUser {
  user_id: string;
  full_name: string;
  email: string;
  department_id: string | null;
  status: "Active" | "Inactive";
  roles: ApiRole | null;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code?: string;
    message?: string | string[];
  };
}

type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface CreateUserPayload {
  fullName: string;
  email: string;
  roleId: number;
  departmentId?: string;
  status?: "Active" | "Inactive";
}

export interface UpdateUserStatusPayload {
  status: "Active" | "Inactive";
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

function formatApiErrorMessage(message?: string | string[]): string {
  if (!message) {
    return "فشل الطلب";
  }

  if (Array.isArray(message)) {
    return message.join(" · ");
  }

  return message;
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;

  if (!response.ok || !result.success) {
    const errorResult = result as ApiErrorResponse;
    const message = formatApiErrorMessage(errorResult.error?.message);
    throw new Error(message || `فشل الطلب: ${response.status}`);
  }

  return result.data;
}

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

  return parseApiResponse<T>(response);
}

export function fetchUsers(signal?: AbortSignal): Promise<ApiUser[]> {
  return request<ApiUser[]>("/users", { signal });
}

export function fetchRoles(signal?: AbortSignal): Promise<ApiRole[]> {
  return request<ApiRole[]>("/roles", { signal });
}

export function createUser(payload: CreateUserPayload): Promise<ApiUser> {
  return request<ApiUser>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUserStatus(
  userId: string,
  payload: UpdateUserStatusPayload,
): Promise<ApiUser> {
  return request<ApiUser>(`/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
