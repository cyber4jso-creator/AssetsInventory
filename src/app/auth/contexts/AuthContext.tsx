import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthContextValue, AuthUser } from "../types";
import { login as loginRequest, restoreSession, clearSession } from "../services/authService";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentUser(restoreSession());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const user = await loginRequest(email, password, rememberMe);
    setCurrentUser(user);
  };

  const logout = () => {
    clearSession();
    setCurrentUser(null);
  };

  const value: AuthContextValue = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
