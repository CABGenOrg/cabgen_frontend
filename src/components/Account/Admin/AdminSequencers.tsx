"use client";

import { useState, useMemo } from "react";
import { Cpu, Pencil, Trash2 } from "lucide-react";
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
  const sequencerOther = AccountDict.option.sequencer.other;

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
      columnHelper.accessor("brand", {
        header: dict.brand,
        size: 150,
        cell: (info) => <span>{info.getValue() === "option.sequencer.other" ? sequencerOther : info.getValue()}</span>,
      }),
      columnHelper.accessor("model", {
        header: dict.model,
        size: 200,
        cell: (info) => <span>{info.getValue() === "option.sequencer.other" ? sequencerOther : info.getValue()}</span>,
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
              label={dict.editSequencer}
              icon={<Pencil size={18} />}
              onClick={() => setModal({ type: "edit", sequencer: info.row.original })}
            />
            <IconButton
              variant="danger"
              label={dict.delete}
              icon={<Trash2 size={18} />}
              onClick={() => setModal({ type: "delete", sequencer: info.row.original })}
            />
          </div>
        ),
      }),
    ],
    [dict, sequencerOther],
  );

  return (
    <div className="w-full">
      <PageHeader
        icon={<Cpu size={24} />}
        title={dict.sequencers}
        actionLabel={dict.newSequencer}
        onAction={() => setModal({ type: "add" })}
      />

      <SearchInput onSearch={setDebouncedSearch} placeholder={dict.search} />

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
