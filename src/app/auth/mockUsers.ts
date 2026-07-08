import type { AuthUser } from "./types";
import { ROLE_PERMISSIONS } from "./config/rolePermissions";

// ─────────────────────────────────────────────
// Mock accounts — stand in for a real /auth backend.
// The password field never leaves this module.
// ─────────────────────────────────────────────

interface MockAccount extends AuthUser {
  password: string;
}

export const DEMO_PASSWORD = "Passw0rd!";

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "USR-AUTH-001",
    name: "نورة سليمان القحطاني",
    email: "n.qahtani@org.sa",
    department: "تقنية المعلومات",
    jobTitle: "مدير عام النظام",
    avatar: "ن",
    role: "super-admin",
    permissions: ROLE_PERMISSIONS["super-admin"],
    status: "active",
    password: DEMO_PASSWORD,
  },
  {
    id: "USR-AUTH-002",
    name: "عبدالعزيز محمد الشمري",
    email: "a.shammari@org.sa",
    department: "تقنية المعلومات",
    jobTitle: "مدير الأصول",
    avatar: "ع",
    role: "asset-manager",
    permissions: ROLE_PERMISSIONS["asset-manager"],
    status: "active",
    password: DEMO_PASSWORD,
  },
  {
    id: "USR-AUTH-003",
    name: "ريم فهد العنزي",
    email: "r.anzi@org.sa",
    department: "المالية",
    jobTitle: "مدير القسم المالي",
    avatar: "ر",
    role: "department-manager",
    permissions: ROLE_PERMISSIONS["department-manager"],
    status: "active",
    password: DEMO_PASSWORD,
  },
  {
    id: "USR-AUTH-004",
    name: "بندر خالد الحربي",
    email: "b.harbi@org.sa",
    department: "الموارد البشرية",
    jobTitle: "أخصائي موارد بشرية",
    avatar: "ب",
    role: "employee",
    permissions: ROLE_PERMISSIONS["employee"],
    status: "active",
    password: DEMO_PASSWORD,
  },
  {
    id: "USR-AUTH-005",
    name: "منى عبدالله الدوسري",
    email: "m.dosari@org.sa",
    department: "الرقابة الداخلية",
    jobTitle: "مراجع داخلي",
    avatar: "م",
    role: "auditor",
    permissions: ROLE_PERMISSIONS["auditor"],
    status: "active",
    password: DEMO_PASSWORD,
  },
];

export const DEMO_ACCOUNTS: Pick<AuthUser, "email" | "role">[] =
  MOCK_ACCOUNTS.map(({ email, role }) => ({ email, role }));

export function findAccount(email: string, password: string): AuthUser | null {
  const match = MOCK_ACCOUNTS.find(
    a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  );
  if (!match) return null;
  const { password: _password, ...user } = match;
  return user;
}
