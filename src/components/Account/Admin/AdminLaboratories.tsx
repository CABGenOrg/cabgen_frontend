"use client";

import { useState, useMemo } from "react";
import { Microscope, Pencil, Trash2 } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import SearchInput from "@/components/General/SearchInput";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import IconButton from "@/components/General/IconButton";
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
  const {
    data: fullData = [],
    isLoading: loadingLaboratories,
    error: fullError,
    refetch: refetchLaboratories,
  } = useGetLaboratoriesQuery();
  const {
    data: searchData = [],
    error: searchError,
    refetch: refetchSearch,
  } = useGetLaboratoriesByNameOrAbbreviationQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });
  const data = debouncedSearch ? searchData : fullData;
  const tableError = debouncedSearch ? searchError : fullError;
  const tableRefetch = debouncedSearch ? refetchSearch : refetchLaboratories;
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
        size: 150,
        cell: (info) =>
          info.getValue() === "option.laboratory.other"
            ? labOther
            : info.getValue() || "-",
      }),
      columnHelper.accessor("abbreviation", {
        header: dict.abbreviation,
        size: 120,
      }),
      columnHelper.accessor("is_active", {
        header: dict.isActive,
        size: 75,
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
        size: 85,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <IconButton
              label={dict.edit}
              icon={<Pencil size={18} />}
              onClick={() => setModal({ type: "edit", laboratory: info.row.original })}
            />
            <IconButton
              variant="danger"
              label={dict.delete}
              icon={<Trash2 size={18} />}
              onClick={() => setModal({ type: "delete", laboratory: info.row.original })}
            />
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

      <SearchInput onSearch={setDebouncedSearch} placeholder={dict.search} />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingLaboratories}
        error={tableError}
        errorTitle={Errors.loadErrorTitle}
        errorDescription={Errors.loadErrorDescription}
        retryLabel={Errors.retry}
        onRetry={tableRefetch}
        emptyMessage={dict.noLaboratories}
        emptyTitle={dict.laboratories}
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
