import type { Role } from "../auth/types";

// ─────────────────────────────────────────────
// Demo users — single source of truth for the prototype
// ─────────────────────────────────────────────

export interface DemoUserRecord {
  id: string;
  firstName: string;
  email: string;
  role: Role;
  department: string;
  departmentId: string;
  sectorId: string;
  jobTitle: string;
  avatar: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export const DEMO_PASSWORD = "Passw0rd!";

export const DEMO_USERS: DemoUserRecord[] = [
  {
    id: "USR-EMP-001",
    firstName: "Ahmed",
    email: "employee@org.sa",
    role: "employee",
    department: "الموارد البشرية",
    departmentId: "DEPT-HR",
    sectorId: "SEC-TECH",
    jobTitle: "موظف",
    avatar: "A",
    status: "active",
    lastLogin: "اليوم، 08:05",
  },
  {
    id: "USR-DM-001",
    firstName: "Sara",
    email: "department.manager@org.sa",
    role: "department-manager",
    department: "المالية",
    departmentId: "DEPT-FIN",
    sectorId: "SEC-CORP",
    jobTitle: "مدير القسم",
    avatar: "S",
    status: "active",
    lastLogin: "أمس، 16:32",
  },
  {
    id: "USR-SM-001",
    firstName: "Khalid",
    email: "sector.manager@org.sa",
    role: "sector-manager",
    department: "تقنية المعلومات",
    departmentId: "DEPT-IT",
    sectorId: "SEC-TECH",
    jobTitle: "مدير القطاع",
    avatar: "K",
    status: "active",
    lastLogin: "اليوم، 09:14",
  },
  {
    id: "USR-AM-001",
    firstName: "Fatimah",
    email: "asset.manager@org.sa",
    role: "asset-manager",
    department: "تقنية المعلومات",
    departmentId: "DEPT-IT",
    sectorId: "SEC-TECH",
    jobTitle: "مدير الأصول",
    avatar: "F",
    status: "active",
    lastLogin: "اليوم، 11:47",
  },
  {
    id: "USR-AUD-001",
    firstName: "Omar",
    email: "auditor@org.sa",
    role: "auditor",
    department: "الرقابة الداخلية",
    departmentId: "DEPT-ARCH",
    sectorId: "SEC-TECH",
    jobTitle: "مراجع",
    avatar: "O",
    status: "active",
    lastLogin: "منذ 3 ساعات",
  },
];

export function getDemoUserById(id: string): DemoUserRecord | undefined {
  return DEMO_USERS.find(u => u.id === id);
}

export function getDemoUserByEmail(email: string): DemoUserRecord | undefined {
  return DEMO_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function getDemoUserByFirstName(firstName: string): DemoUserRecord | undefined {
  return DEMO_USERS.find(u => u.firstName === firstName);
}
