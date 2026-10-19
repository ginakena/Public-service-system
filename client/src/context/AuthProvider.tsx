import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError, AUTH_EXPIRED_EVENT, tokenStore } from "../lib/api";
import type { AuthResponse, RegisterInput, User } from "../types";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Only show the loading state when there is a saved token to verify
  const [loading, setLoading] = useState(() => tokenStore.get() !== null);

  // Restore the session on page load
  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .get<{ user: User }>("/auth/me")
      .then((res) => setUser(res.user))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) tokenStore.clear();
      })
      .finally(() => setLoading(false));
  }, []);

  // Log out automatically when the API says the token is no longer valid
  useEffect(() => {
    const onExpired = () => {
      tokenStore.clear();
      setUser(null);
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const startSession = useCallback(({ user, token }: AuthResponse) => {
    tokenStore.set(token);
    setUser(user);
    return user;
  }, []);

  const login = useCallback(
    async (identifier: string, password: string) =>
      startSession(await api.post<AuthResponse>("/auth/login", { identifier, password })),
    [startSession]
  );

  const register = useCallback(
    async (input: RegisterInput) => startSession(await api.post<AuthResponse>("/auth/register", input)),
    [startSession]
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}