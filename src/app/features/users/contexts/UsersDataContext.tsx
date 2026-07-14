import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Role } from "../../../auth";
import { ROLE_LABELS } from "../../../auth";
import { USERS as INITIAL_USERS } from "../../../data/mock";
import { getDepartmentById } from "../../../data/orgConstants";

// ─────────────────────────────────────────────
// Users data — local mock state for Sprint 2.
// In-memory only, no persistence across refresh.
// Sprint 3 replaces this with scoped API calls.
// ─────────────────────────────────────────────

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export interface NewUserInput {
  firstName: string;
  email: string;
  role: Role;
  departmentId: string;
  status: "active" | "inactive";
}

interface UsersDataContextValue {
  users: UserRecord[];
  isDuplicateEmail: (email: string) => boolean;
  addUser: (input: NewUserInput) => UserRecord;
  toggleUserStatus: (id: number) => void;
}

const UsersDataContext = createContext<UsersDataContextValue | null>(null);

export function UsersDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);

  const isDuplicateEmail = useCallback((email: string) => {
    const normalized = email.trim().toLowerCase();
    return users.some(u => u.email.toLowerCase() === normalized);
  }, [users]);

  const addUser = useCallback((input: NewUserInput): UserRecord => {
    let created!: UserRecord;
    setUsers(prev => {
      created = {
        id: (prev.length > 0 ? prev[prev.length - 1].id : 0) + 1,
        name: input.firstName,
        email: input.email,
        role: ROLE_LABELS[input.role],
        department: getDepartmentById(input.departmentId)?.name ?? "",
        status: input.status,
        lastLogin: "—",
      };
      return [...prev, created];
    });
    return created;
  }, []);

  const toggleUserStatus = useCallback((id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  }, []);

  return (
    <UsersDataContext.Provider value={{ users, isDuplicateEmail, addUser, toggleUserStatus }}>
      {children}
    </UsersDataContext.Provider>
  );
}

export function useUsersData() {
  const ctx = useContext(UsersDataContext);
  if (!ctx) throw new Error("useUsersData must be used inside UsersDataProvider");
  return ctx;
}
