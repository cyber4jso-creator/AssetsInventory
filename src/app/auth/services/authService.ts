import type { AuthUser } from "../types";
import { findAccount } from "../mockUsers";
import { ROLE_PERMISSIONS } from "../config/rolePermissions";

// ─────────────────────────────────────────────
// Mock auth service — the one module a real backend
// integration would replace. Everything above this
// (context, hooks, components) stays unchanged.
// ─────────────────────────────────────────────

const SESSION_KEY = "ams.auth.session";
const LOGIN_DELAY_MS = 800;

// Permissions are always re-derived from role + the centralized config,
// never trusted verbatim from a stored/returned user object — otherwise
// editing localStorage would be enough to self-grant permissions.
function withCurrentPermissions(user: AuthUser): AuthUser {
  return { ...user, permissions: ROLE_PERMISSIONS[user.role] };
}

export function login(email: string, password: string, rememberMe: boolean): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = findAccount(email, password);
      if (!user) {
        reject(new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة"));
        return;
      }
      if (user.status === "inactive") {
        reject(new Error("هذا الحساب معطّل. تواصل مع مدير النظام"));
        return;
      }
      const resolvedUser = withCurrentPermissions(user);
      persistSession(resolvedUser, rememberMe);
      resolve(resolvedUser);
    }, LOGIN_DELAY_MS);
  });
}

export function persistSession(user: AuthUser, rememberMe: boolean): void {
  const payload = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, payload);
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, payload);
    localStorage.removeItem(SESSION_KEY);
  }
}

export function restoreSession(): AuthUser | null {
  const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as AuthUser;
    if (user.status === "inactive") return null;
    return withCurrentPermissions(user);
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
