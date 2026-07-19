import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "../../../auth";
import { ROLE_LABELS } from "../../../auth";

import {
  createUser as createApiUser,
  fetchUsers,
  updateUserStatus as updateApiUserStatus,
} from "../services/usersApiService";
import { mapApiUserToUserRecord } from "../mappers/user.mapper";

export interface UserRecord {
  id: number;
  apiId: string;
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
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  isDuplicateEmail: (email: string) => boolean;
  addUser: (input: NewUserInput) => Promise<UserRecord>;
  toggleUserStatus: (id: number) => Promise<void>;
}

const ROLE_IDS: Record<Role, number> = {
  "super-admin": 9,
  employee: 10,
  "department-manager": 11,
  "sector-manager": 12,
  "asset-manager": 13,
  auditor: 14,
};

const UsersDataContext = createContext<UsersDataContextValue | null>(null);

export function UsersDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUsers = await fetchUsers();
      setUsers(apiUsers.map(mapApiUserToUserRecord));
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "فشل تحميل المستخدمين";

      setError(message);
      console.error("Users API error:", requestError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUsers();
  }, [refreshUsers]);

  const isDuplicateEmail = useCallback(
    (email: string) => {
      const normalized = email.trim().toLowerCase();
      return users.some(
        (user) => user.email.toLowerCase() === normalized,
      );
    },
    [users],
  );

  const addUser = useCallback(
    async (input: NewUserInput): Promise<UserRecord> => {
      const apiUser = await createApiUser({
        fullName: input.firstName,
        email: input.email,
        roleId: ROLE_IDS[input.role],
        departmentId: input.departmentId,
        status: input.status === "active" ? "Active" : "Inactive",
      });

      const created = mapApiUserToUserRecord(apiUser);

      setUsers((previous) => [...previous, created]);
      return created;
    },
    [],
  );

  const toggleUserStatus = useCallback(
    async (id: number): Promise<void> => {
      const currentUser = users.find((user) => user.id === id);

      if (!currentUser) {
        throw new Error("المستخدم غير موجود");
      }

      const nextStatus =
        currentUser.status === "active" ? "Inactive" : "Active";

      const updatedApiUser = await updateApiUserStatus(
        currentUser.apiId,
        nextStatus,
      );

      const updatedUser = mapApiUserToUserRecord(updatedApiUser);

      setUsers((previous) =>
        previous.map((user) =>
          user.apiId === updatedUser.apiId ? updatedUser : user,
        ),
      );
    },
    [users],
  );

  return (
    <UsersDataContext.Provider
      value={{
        users,
        loading,
        error,
        refreshUsers,
        isDuplicateEmail,
        addUser,
        toggleUserStatus,
      }}
    >
      {children}
    </UsersDataContext.Provider>
  );
}

export function useUsersData() {
  const context = useContext(UsersDataContext);

  if (!context) {
    throw new Error(
      "useUsersData must be used inside UsersDataProvider",
    );
  }

  return context;
}

