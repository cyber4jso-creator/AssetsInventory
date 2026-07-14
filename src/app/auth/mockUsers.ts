import type { AuthUser } from "./types";
import { ROLE_PERMISSIONS } from "./config/rolePermissions";
import { DEMO_PASSWORD, DEMO_USERS } from "../data/demoUsers";

// ─────────────────────────────────────────────
// Mock accounts — stand in for a real /auth backend.
// The password field never leaves this module.
// ─────────────────────────────────────────────

interface MockAccount extends AuthUser {
  password: string;
}

const MOCK_ACCOUNTS: MockAccount[] = DEMO_USERS.map(user => ({
  id: user.id,
  name: user.firstName,
  email: user.email,
  department: user.department,
  departmentId: user.departmentId,
  sectorId: user.sectorId,
  jobTitle: user.jobTitle,
  avatar: user.avatar,
  role: user.role,
  permissions: ROLE_PERMISSIONS[user.role],
  status: user.status,
  password: DEMO_PASSWORD,
}));

export { DEMO_PASSWORD };

export const DEMO_ACCOUNTS: Pick<AuthUser, "email" | "role">[] =
  MOCK_ACCOUNTS.map(({ email, role }) => ({ email, role }));

export function findAccount(email: string, password: string): AuthUser | null {
  const match = MOCK_ACCOUNTS.find(
    a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  );
  if (!match) return null;
  const { password: _password, ...user } = match;
  return user;
}
