import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "../../../auth";
import {
  createUser as createApiUser,
  fetchUsers,
  updateUserStatus as updateApiUserStatus,
  type UpdateUserStatusPayload,
} from "../services/usersApiService";
import { mapApiUserToUserRecord } from "../mappers/user.mapper";

export interface UserRecord {
  id: number;
  apiId: string;
  name: string;
  email: string;
  roleId: number | null;
  role: string;
  departmentId: string;
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

export const ROLE_IDS: Record<Role, number> = {
  employee: 10,
  "department-manager": 11,
  "sector-manager": 12,
  "asset-manager": 13,
  auditor: 14,
};

interface UsersDataContextValue {
  users: UserRecord[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  isDuplicateEmail: (email: string) => boolean;
  addUser: (input: NewUserInput) => Promise<UserRecord>;
  updateUserStatus: (
    apiId: string,
    payload: UpdateUserStatusPayload,
  ) => Promise<void>;
}

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
    const controller = new AbortController();

    const loadUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUsers = await fetchUsers(controller.signal);
        setUsers(apiUsers.map(mapApiUserToUserRecord));
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          requestError instanceof Error
            ? requestError.message
            : "فشل تحميل المستخدمين";

        setError(message);
        console.error("Users API error:", requestError);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      controller.abort();
    };
  }, []);

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
        fullName: input.firstName.trim(),
        email: input.email.trim().toLowerCase(),
        roleId: ROLE_IDS[input.role],
        departmentId: input.departmentId || undefined,
        status: input.status === "active" ? "Active" : "Inactive",
      });

      await refreshUsers();

      return mapApiUserToUserRecord(apiUser);
    },
    [refreshUsers],
  );

  const updateUserStatus = useCallback(
    async (
      apiId: string,
      payload: UpdateUserStatusPayload,
    ): Promise<void> => {
      await updateApiUserStatus(apiId, payload);
      await refreshUsers();
    },
    [refreshUsers],
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
        updateUserStatus,
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
