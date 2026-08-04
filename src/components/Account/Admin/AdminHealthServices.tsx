"use client";

import { useState, useMemo } from "react";
import { HeartPulse, Pencil, Trash2 } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetHealthServicesQuery,
  useDeleteHealthServiceMutation,
} from "@/redux/services/admin/adminHealthServicesService";
import type { AdminHealthServiceTableResponse } from "@/redux/services/admin/adminHealthServicesService";
import AdminHealthServiceModal from "./AdminHealthServiceModal";

const columnHelper = createColumnHelper<AdminHealthServiceTableResponse>();

const AdminHealthServices = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const hsOther = AccountDict.option?.healthService?.other ?? "Other";

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "delete" | null;
    healthService?: AdminHealthServiceTableResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingHealthServices } =
    useGetHealthServicesQuery();
  const [deleteHealthService, { isLoading: deleting, error: deleteError }] =
    useDeleteHealthServiceMutation();

  const handleDelete = async () => {
    try {
      await deleteHealthService(modal.healthService?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: dict.name,
        size: 200,
        cell: (info) =>
          info.getValue() === "option.healthService.other"
            ? hsOther
            : info.getValue(),
      }),
      columnHelper.accessor("type", {
        header: dict.type,
        size: 150,
        cell: (info) =>
          (dict.healthServiceTypeValues as Record<string, string>)[
            info.getValue()
          ] ?? info.getValue(),
      }),
      columnHelper.accessor("country", {
        header: dict.country,
        size: 120,
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
      columnHelper.display({
        id: "actions",
        header: dict.actions,
        size: 100,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <button
              aria-label={dict.editHealthService}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "edit", healthService: info.row.original })
              }
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={dict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() =>
                setModal({ type: "delete", healthService: info.row.original })
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      }),
    ],
    [dict],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<HeartPulse size={24} />}
        title={dict.healthServices}
        actionLabel={dict.newHealthService}
        onAction={() => setModal({ type: "add" })}
      />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingHealthServices}
        emptyMessage={dict.noHealthServices}
        countLabel={dict.showingHealthServices}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminHealthServiceModal
          open
          onClose={closeModal}
          lang={lang}
          initial={modal.healthService}
          errorsDict={Errors}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.healthService?.name || ""}
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

export default AdminHealthServices;
