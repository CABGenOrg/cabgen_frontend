"use client";

import { useState, useMemo } from "react";
import { Globe, Pencil, Trash2 } from "lucide-react";
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
  useGetOriginsQuery,
  useGetOriginsByNameQuery,
  useGetOriginByIDQuery,
  useDeleteOriginMutation,
} from "@/redux/services/admin/adminOriginsService";
import type { AdminOriginTableResponse } from "@/redux/services/admin/adminOriginsService";
import AdminOriginModal from "./AdminOriginModal";

const columnHelper = createColumnHelper<AdminOriginTableResponse>();

const AdminOrigins = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "delete" | null;
    origin?: AdminOriginTableResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: fullData = [], isLoading: loadingOrigins } =
    useGetOriginsQuery(lang);
  const { data: searchData = [] } = useGetOriginsByNameQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });
  const data = debouncedSearch ? searchData : fullData;
  const [deleteOrigin, { isLoading: deleting, error: deleteError }] =
    useDeleteOriginMutation();

  const editId = modal.type === "edit" && modal.origin ? modal.origin.id : null;
  const { data: editData, isLoading: loadingEdit } = useGetOriginByIDQuery(
    editId ?? "",
    { skip: !editId },
  );

  const handleDelete = async () => {
    try {
      await deleteOrigin(modal.origin?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: dict.name,
        size: 200,
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
              label={dict.editOrigin}
              icon={<Pencil size={18} />}
              onClick={() => setModal({ type: "edit", origin: info.row.original })}
            />
            <IconButton
              variant="danger"
              label={dict.delete}
              icon={<Trash2 size={18} />}
              onClick={() => setModal({ type: "delete", origin: info.row.original })}
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
        icon={<Globe size={24} />}
        title={dict.origins}
        actionLabel={dict.newOrigin}
        onAction={() => setModal({ type: "add" })}
      />

      <SearchInput onSearch={setDebouncedSearch} />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingOrigins}
        emptyMessage={dict.noOrigins}
        countLabel={dict.showingOrigins}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminOriginModal
          open
          onClose={closeModal}
          initial={modal.type === "edit" ? editData ?? undefined : undefined}
          errorsDict={Errors}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.origin?.name || ""}
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

export default AdminOrigins;
