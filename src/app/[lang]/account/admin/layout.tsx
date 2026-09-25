import React from "react";
import { notFound } from "next/navigation";
import { getServerUser } from "@/utils/handleServerUser";

const AdminLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getServerUser();
  if (user?.user_role !== "Admin") notFound();
  return <>{children}</>;
};

export default AdminLayout;
