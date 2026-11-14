"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/redux/AuthContext";

const RedirectIfAuthenticated = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  return null;
};

export default RedirectIfAuthenticated;
