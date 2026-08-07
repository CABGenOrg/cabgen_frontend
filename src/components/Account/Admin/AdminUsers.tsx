"use client";

import { useState, useMemo } from "react";
import { Users, Pencil, Trash2, Power } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
} from "@/redux/services/admin/adminUsersService";
import type { AdminUserResponse } from "@/redux/services/admin/adminUsersService";
import AdminUserModal from "./AdminUserModal";

const columnHelper = createColumnHelper<AdminUserResponse>();

const formatDate = (value: Date | string | undefined, lang: string) => {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString(lang, { timeZone: "UTC" });
};

const AdminUsers = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "delete" | null;
    user?: AdminUserResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingUsers } = useGetUsersQuery();
  const [deleteUser, { isLoading: deleting, error: deleteError }] =
    useDeleteUserMutation();
  const [activateUser, { isLoading: togglingActive }] =
    useActivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(modal.user?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: dict.name,
        size: 120,
      }),
      columnHelper.accessor("username", {
        header: dict.username,
        size: 120,
      }),
      columnHelper.accessor("email", {
        header: dict.email,
        size: 200,
      }),
      columnHelper.accessor("country", {
        header: dict.country,
        size: 100,
      }),
      columnHelper.accessor("user_role", {
        header: dict.userRole,
        size: 100,
      }),
      columnHelper.accessor("is_active", {
        header: dict.isActive,
        size: 90,
        cell: (info) => {
          const active = info.getValue();
          return (
            <Badge variant={active ? "done" : "failed"}>
              {active ? dict.activeValues.yes : dict.activeValues.no}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("activated_by", {
        header: dict.activatedBy,
        size: 120,
      }),
      columnHelper.accessor("activated_on", {
        header: dict.activatedOn,
        size: 110,
        cell: (info) => formatDate(info.getValue(), lang),
      }),
      columnHelper.display({
        id: "actions",
        header: dict.actions,
        size: 100,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <button
              aria-label={info.row.original.is_active ? dict.deactivate : dict.activate}
              title={info.row.original.is_active ? dict.deactivate : dict.activate}
              disabled={togglingActive}
              className={`p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 disabled:opacity-50 ${
                info.row.original.is_active
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:text-green-700 hover:bg-green-50"
              }`}
              onClick={() => {
                const action = info.row.original.is_active
                  ? deactivateUser
                  : activateUser;
                action(info.row.original.id).unwrap().catch(() => {});
              }}
            >
              <Power size={15} />
            </button>
            <button
              aria-label={dict.editUser}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() => setModal({ type: "edit", user: info.row.original })}
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={dict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() => setModal({ type: "delete", user: info.row.original })}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      }),
    ],
    [dict, lang, togglingActive, activateUser, deactivateUser],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Users size={24} />}
        title={dict.users}
        actionLabel={dict.newUser}
        onAction={() => setModal({ type: "add" })}
      />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingUsers}
        emptyMessage={dict.noResults}
        countLabel={dict.showing}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminUserModal
          open
          onClose={closeModal}
          lang={lang}
          initial={modal.user}
          errorsDict={Errors}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.user?.name ?? ""}
        onDelete={handleDelete}
        deleting={deleting}
        error={
          typeof deleteError === "string" && deleteError === "internalServer"
            ? Errors[deleteError]
            : String(deleteError)
        }
        dict={{
          delete: dict.delete,
          cancel: dict.cancel,
          deleteConfirm: dict.deleteConfirm,
        }}
      />
    </div>
  );
};

export default AdminUsers;
