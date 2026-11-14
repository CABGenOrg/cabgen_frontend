"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useGetMeQuery } from "./services/auth/authService";
import type { UserToken } from "./services/auth/authService";
import { usePathname } from "next/navigation";

export type User = UserToken;

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isServiceUnavailable: boolean;
  refetchMe: () => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
  initialUser?: User | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isServiceUnavailable: false,
  refetchMe: async () => {},
});

const isUnavailableError = (error: unknown) => {
  const status = (error as { status?: unknown } | undefined)?.status;
  return (
    status === "FETCH_ERROR" ||
    status === "TIMEOUT_ERROR" ||
    (typeof status === "number" && status >= 500)
  );
};

export const AuthProvider = ({
  children,
  initialUser = null,
}: AuthProviderProps) => {
  const pathname = usePathname();
  const { data, error, isLoading, isUninitialized, refetch } = useGetMeQuery(
    undefined,
    {
      skip: typeof window === "undefined",
      refetchOnReconnect: true,
      refetchOnFocus: true,
    },
  );

  const value = useMemo(() => {
    const user = data ?? initialUser;
    const isAccountPage = pathname.includes("/account");
    const stillResolving = !user && (isLoading || isUninitialized);
    const isServiceUnavailable = !user && isUnavailableError(error);
    const isAuthenticated = !!user || (stillResolving && isAccountPage);

    const refetchMe = async () => {
      try {
        await refetch();
      } catch {}
    };

    return {
      user,
      isAuthenticated,
      isLoading: stillResolving,
      isServiceUnavailable,
      refetchMe,
    };
  }, [data, error, isLoading, isUninitialized, initialUser, pathname, refetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
