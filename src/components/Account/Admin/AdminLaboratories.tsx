"use client";

import { useState, useMemo } from "react";
import { Microscope, Pencil, Trash2 } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import SearchInput from "@/components/General/SearchInput";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetLaboratoriesQuery,
  useGetLaboratoriesByNameOrAbbreviationQuery,
  useDeleteLaboratoryMutation,
} from "@/redux/services/admin/adminLaboratoriesService";
import type { AdminLaboratoryTableResponse } from "@/redux/services/admin/adminLaboratoriesService";
import AdminLaboratoryModal from "./AdminLaboratoryModal";

const columnHelper = createColumnHelper<AdminLaboratoryTableResponse>();

const AdminLaboratories = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const labOther = AccountDict.option?.laboratory?.other ?? "Other";

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "delete" | null;
    laboratory?: AdminLaboratoryTableResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: fullData = [], isLoading: loadingLaboratories } =
    useGetLaboratoriesQuery();
  const { data: searchData = [] } =
    useGetLaboratoriesByNameOrAbbreviationQuery(debouncedSearch, {
      skip: !debouncedSearch,
    });
  const data = debouncedSearch ? searchData : fullData;
  const [deleteLaboratory, { isLoading: deleting, error: deleteError }] =
    useDeleteLaboratoryMutation();

  const handleDelete = async () => {
    try {
      await deleteLaboratory(modal.laboratory?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: dict.name,
        size: 200,
        cell: (info) =>
          info.getValue() === "option.laboratory.other"
            ? labOther
            : info.getValue(),
      }),
      columnHelper.accessor("abbreviation", {
        header: dict.abbreviation,
        size: 150,
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
              aria-label={dict.editLaboratory}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() => setModal({ type: "edit", laboratory: info.row.original })}
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={dict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() => setModal({ type: "delete", laboratory: info.row.original })}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      }),
    ],
    [dict, labOther],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Microscope size={24} />}
        title={dict.laboratories}
        actionLabel={dict.newLaboratory}
        onAction={() => setModal({ type: "add" })}
      />

      <SearchInput onSearch={setDebouncedSearch} />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingLaboratories}
        emptyMessage={dict.noLaboratories}
        countLabel={dict.showingLaboratories}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminLaboratoryModal
          open
          onClose={closeModal}
          initial={modal.laboratory}
          errorsDict={Errors}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.laboratory?.name || ""}
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

export default AdminLaboratories;
