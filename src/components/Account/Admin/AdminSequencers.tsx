"use client";

import { useState, useMemo } from "react";
import { Cpu, Pencil, Trash2 } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import SearchInput from "@/components/General/SearchInput";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetSequencersQuery,
  useGetSequencersByBrandOrModelQuery,
  useDeleteSequencerMutation,
} from "@/redux/services/admin/adminSequencersService";
import type { AdminSequencerTableResponse } from "@/redux/services/admin/adminSequencersService";
import AdminSequencerModal from "./AdminSequencerModal";

const columnHelper = createColumnHelper<AdminSequencerTableResponse>();

const AdminSequencers = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;

  const [modal, setModal] = useState<{
    type: "add" | "edit" | "delete" | null;
    sequencer?: AdminSequencerTableResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: fullData = [], isLoading: loadingSequencers } =
    useGetSequencersQuery();
  const { data: searchData = [] } =
    useGetSequencersByBrandOrModelQuery(debouncedSearch, {
      skip: !debouncedSearch,
    });
  const data = debouncedSearch ? searchData : fullData;
  const [deleteSequencer, { isLoading: deleting, error: deleteError }] =
    useDeleteSequencerMutation();

  const handleDelete = async () => {
    try {
      await deleteSequencer(modal.sequencer?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("model", {
        header: dict.model,
        size: 200,
      }),
      columnHelper.accessor("brand", {
        header: dict.brand,
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
              aria-label={dict.editSequencer}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() => setModal({ type: "edit", sequencer: info.row.original })}
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={dict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() => setModal({ type: "delete", sequencer: info.row.original })}
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
        icon={<Cpu size={24} />}
        title={dict.sequencers}
        actionLabel={dict.newSequencer}
        onAction={() => setModal({ type: "add" })}
      />

      <SearchInput onSearch={setDebouncedSearch} />

      <DataTable
        data={data}
        columns={columns}
        loading={loadingSequencers}
        emptyMessage={dict.noSequencers}
        countLabel={dict.showingSequencers}
      />

      {(modal.type === "add" || modal.type === "edit") && (
        <AdminSequencerModal
          open
          onClose={closeModal}
          initial={modal.sequencer}
          errorsDict={Errors}
        />
      )}

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.sequencer?.model || ""}
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

export default AdminSequencers;
