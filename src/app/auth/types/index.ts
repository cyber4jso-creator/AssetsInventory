export type Role =
  | "super-admin"
  | "asset-manager"
  | "department-manager"
  | "employee"
  | "auditor";

export type Permission =
  | "assets.view"
  | "assets.create"
  | "assets.edit"
  | "assets.delete"
  | "assets.transfer"
  | "reports.view"
  | "reports.export"
  | "users.manage"
  | "settings.manage"
  | "requests.create"
  | "requests.approve"
  | "dashboard.view";

export type UserStatus = "active" | "inactive";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  department: string;
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
