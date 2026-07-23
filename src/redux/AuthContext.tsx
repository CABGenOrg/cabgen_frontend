"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useGetMeQuery } from "./services/auth/authService";
import { usePathname } from "next/navigation";

export type User = {
  id: string;
  username: string;
  userRole: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) => {
  const pathname = usePathname();
  const { data, isLoading, isUninitialized } = useGetMeQuery(undefined, {
    skip: typeof window === "undefined",
  });

  const value = useMemo(() => {
    const user = data?.data ?? initialUser;
    const isAccountPage = pathname.includes("/account");
    const stillResolving = !user && (isLoading || isUninitialized);
    const isAuthenticated = !!user || (stillResolving && isAccountPage);

    return { user, isAuthenticated, isLoading: stillResolving };
  }, [data, isLoading, isUninitialized, initialUser, pathname]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);