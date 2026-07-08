import type { AuthUser } from "../types";
import { findAccount } from "../mockUsers";

// ─────────────────────────────────────────────
// Mock auth service — the one module a real backend
// integration would replace. Everything above this
// (context, hooks, components) stays unchanged.
// ─────────────────────────────────────────────

const SESSION_KEY = "ams.auth.session";
const LOGIN_DELAY_MS = 800;

export function login(email: string, password: string, rememberMe: boolean): Promise<AuthUser> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = findAccount(email, password);
      if (!user) {
        reject(new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة"));
        return;
      }
      persistSession(user, rememberMe);
      resolve(user);
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
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
