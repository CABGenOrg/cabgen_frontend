"use client";

import React, { createContext, useContext } from "react";
import { useGetMeQuery } from "./services/authService";

export type User = {
  id: string;
  username: string;
  email: string;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useGetMeQuery(undefined, {
    skip: typeof window === "undefined",
  });
  const user = data?.data ?? null;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
