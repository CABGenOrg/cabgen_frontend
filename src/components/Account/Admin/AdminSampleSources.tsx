"use client";

import { useState, useMemo } from "react";
import { FlaskConical, Pencil, Trash2 } from "lucide-react";
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
  useGetSampleSourcesQuery,
  useGetSampleSourcesNyNameOrGroupQuery,
  useGetSampleSourceByIdQuery,
  useDeleteSampleSourceMutation,
} from "@/redux/services/admin/adminSampleSourcesService";
import type { AdminSampleSourceTableResponse } from "@/redux/services/admin/adminSampleSourcesService";
import AdminSampleSourceModal from "./AdminSampleSourceModal";

const columnHelper = createColumnHelper<AdminSampleSourceTableResponse>();

const AdminSampleSources = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "delete" | null;
    sampleSource?: AdminSampleSourceTableResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: fullData = [], isLoading: loadingSampleSources } =
    useGetSampleSourcesQuery(lang);
  const { data: searchData = [] } =
    useGetSampleSourcesNyNameOrGroupQuery(debouncedSearch, {
      skip: !debouncedSearch,
    });
  const data = debouncedSearch ? searchData : fullData;
  const [deleteSampleSource, { isLoading: deleting, error: deleteError }] =
    useDeleteSampleSourceMutation();

  const editId =
    modal.type === "edit" && modal.sampleSource ? modal.sampleSource.id : null;
  const { data: editData, isLoading: loadingEdit } = useGetSampleSourceByIdQuery(
    editId ?? "",
    { skip: !editId },
  );

  const handleDelete = async () => {
    try {
      await deleteSampleSource(modal.sampleSource?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: dict.name,
        size: 200,
      }),
      columnHelper.accessor("group", {
        header: dict.group,
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
            <IconButton
              label={dict.editSampleSource}
              icon={<Pencil size={18} />}
              onClick={() =>
                setModal({ type: "edit", sampleSource: info.row.original })
              }
            />
            <IconButton
              variant="danger"
              label={dict.delete}
              icon={<Trash2 size={18} />}
              onClick={() =>
                setModal({ type: "delete", sampleSource: info.row.original })
              }
            />
          </div>
        ),
      }),
    ],
    [dict],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<FlaskConical size={24} />}
        title={dict.sampleSources}
        actionLabel={dict.newSampleSource}
        onAction={() => setModal({ type: "add" })}
      />

      <SearchInput onSearch={setDebouncedSearch} />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingSampleSources}
        emptyMessage={dict.noSampleSources}
        countLabel={dict.showingSampleSources}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminSampleSourceModal
          open
          onClose={closeModal}
          initial={modal.type === "edit" ? editData ?? undefined : undefined}
          errorsDict={Errors}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.sampleSource?.name || ""}
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

export default AdminSampleSources;
