"use client";

import { useState, useMemo } from "react";
import { Bug, Pencil, Trash2 } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetMicroorganismsQuery,
  useGetMicroorganismByIdQuery,
  useDeleteMicroorganismMutation,
} from "@/redux/services/admin/adminMicroorganismsService";
import type { AdminMicroorganismTableResponse } from "@/redux/services/admin/adminMicroorganismsService";
import AdminMicroorganismModal from "./AdminMicroorganismModal";

const columnHelper = createColumnHelper<AdminMicroorganismTableResponse>();

const AdminMicroorganisms = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const microOther = AccountDict.option?.microorganism?.other ?? "Other";

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "delete" | null;
    microorganism?: AdminMicroorganismTableResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingMicroorganisms } =
    useGetMicroorganismsQuery(lang);
  const [deleteMicroorganism, { isLoading: deleting, error: deleteError }] =
    useDeleteMicroorganismMutation();

  const editId =
    modal.type === "edit" && modal.microorganism
      ? modal.microorganism.id
      : null;
  const { data: editData, isLoading: loadingEdit } =
    useGetMicroorganismByIdQuery(editId ?? "", { skip: !editId });

  const handleDelete = async () => {
    try {
      await deleteMicroorganism(modal.microorganism?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("taxon", {
        header: dict.taxon,
        size: 150,
        cell: (info) =>
          (dict.taxonValues as Record<string, string>)[info.getValue()] ??
          info.getValue(),
      }),
      columnHelper.accessor("species", {
        header: dict.species,
        size: 200,
      }),
      columnHelper.accessor("variety", {
        header: dict.variety,
        size: 150,
        cell: (info) =>
          info.getValue() === "option.microorganism.other"
            ? microOther
            : info.getValue(),
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
              aria-label={dict.editMicroorganism}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "edit", microorganism: info.row.original })
              }
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={dict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() =>
                setModal({ type: "delete", microorganism: info.row.original })
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      }),
    ],
    [dict, microOther],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Bug size={24} />}
        title={dict.microorganisms}
        actionLabel={dict.newMicroorganism}
        onAction={() => setModal({ type: "add" })}
      />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingMicroorganisms}
        emptyMessage={dict.noMicroorganisms}
        countLabel={dict.showingMicroorganisms}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminMicroorganismModal
          open
          onClose={closeModal}
          initial={modal.type === "edit" ? editData ?? undefined : undefined}
          errorsDict={Errors}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.microorganism?.species || ""}
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

export default AdminMicroorganisms;
