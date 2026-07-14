export type Role =
  | "employee"
  | "department-manager"
  | "sector-manager"
  | "asset-manager"
  | "auditor";

export type Permission =
  | "assets.view"
  | "assets.create"
  | "assets.edit"
  | "assets.delete"
  | "assets.transfer"
  | "assets.qr"
  | "reports.view"
  | "reports.export"
  | "reports.view.own"
  | "reports.export.own"
  | "reports.view.department"
  | "reports.export.department"
  | "reports.view.sector"
  | "reports.export.sector"
  | "users.manage"
  | "settings.manage"
  | "profile.manage"
  | "requests.view"
  | "requests.create"
  | "requests.approve"
  | "dashboard.view"
  | "audit.view"
  | "assistant.use"
  | "notifications.view";

export type UserStatus = "active" | "inactive";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  department: string;
  departmentId: string;
  sectorId: string;
  jobTitle: string;
  avatar: string;
  role: Role;
  permissions: Permission[];
  status: UserStatus;
}

export interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
}
