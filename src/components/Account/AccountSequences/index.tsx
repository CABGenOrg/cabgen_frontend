"use client";

import { useState, useMemo } from "react";
import { Plus, Upload, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    responsive?: string;
  }
}

import { section_btn } from "@/styles/tailwind_classes";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import {
  useGetSamplesQuery,
  useDeleteSampleMutation,
} from "@/redux/services/samples/samplesService";
import type { SampleResponse } from "@/redux/services/samples/samplesService";
import SampleFormModal from "./SampleFormModal";
import UploadFormModal from "./UploadFormModal";
import Modal from "./Modal";

const columnHelper = createColumnHelper<SampleResponse>();

const AccountSequences = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.sequences;
  const genderDict = AccountDict.option.gender;
  const labOther = AccountDict.option.laboratory.other;
  const cityOther = AccountDict.option.city.other;
  const healthServiceOther = AccountDict.option.healthService.other;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [modal, setModal] = useState<{
    type: "add" | "edit" | "upload" | "delete" | null;
    sample?: SampleResponse;
  }>({ type: null });

  const closeModal = () => setModal({ type: null });

  const { data = [], isLoading: loadingSamples } = useGetSamplesQuery(lang);
  const [deleteSample, { isLoading: deleting, error: deleteError }] =
    useDeleteSampleMutation();

  const handleDelete = async () => {
    try {
      await deleteSample(modal.sample?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: dict.name,
        size: 140,
        cell: (info) => <span title={info.getValue()} className="line-clamp-2 sm:truncate sm:block sm:max-w-[140px]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("microorganism", {
        header: dict.microorganism,
        size: 160,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => <span title={info.getValue()} className="line-clamp-2 sm:truncate sm:block sm:max-w-[160px]">{info.getValue()}</span>,
      }),
      columnHelper.accessor("origin", {
        header: dict.origin,
        size: 120,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[120px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("sample_source", {
        header: dict.sampleSource,
        size: 120,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[120px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("sequencer", {
        header: dict.sequencer,
        size: 140,
        meta: { responsive: "hidden md:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[140px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("collection_date", {
        header: dict.collectionDate,
        size: 110,
        meta: { responsive: "hidden sm:table-cell" },
        cell: (info) => {
          const v = info.getValue();
          if (!v) return "-";
          const d = v instanceof Date ? v : new Date(v);
          return isNaN(d.getTime()) ? "-" : d.toLocaleDateString(lang, { timeZone: "UTC" });
        },
      }),
      columnHelper.accessor("country_code", {
        header: dict.country,
        size: 80,
        meta: { responsive: "hidden lg:table-cell" },
      }),
      columnHelper.accessor("city", {
        header: dict.city,
        size: 130,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => <span title={info.getValue() || ""} className="line-clamp-2 sm:truncate sm:block sm:max-w-[130px]">{info.getValue() || "-"}</span>,
      }),
      columnHelper.accessor("fastq1", {
        header: dict.fastq1,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fastq2", {
        header: dict.fastq2,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.accessor("fasta", {
        header: dict.fasta,
        size: 100,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => {
          const v = info.getValue() || "";
          return <span title={v} className="line-clamp-2 sm:truncate sm:block sm:max-w-[100px]">{v.split("/").pop() || "-"}</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: dict.actions,
        size: 120,
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <button
              aria-label={dict.uploadSequences}
              className="p-2 rounded-lg bg-cabgen-400 text-white hover:bg-cabgen-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "upload", sample: info.row.original })
              }
            >
              <Upload size={15} />
            </button>
            <button
              aria-label={dict.editSample}
              className="p-2 rounded-lg text-gray-500 hover:text-cabgen-200 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 transition-colors"
              onClick={() =>
                setModal({ type: "edit", sample: info.row.original })
              }
            >
              <Pencil size={15} />
            </button>
            <button
              aria-label={dict.delete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors"
              onClick={() =>
                setModal({ type: "delete", sample: info.row.original })
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      }),
    ],
    [dict, lang],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h1 className="text-2xl font-semibold">{dict.title}</h1>
        <button
          className={`${section_btn} flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto`}
          onClick={() => setModal({ type: "add" })}
        >
          <Plus size={20} /> {dict.newSample}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-gray-50">
                  {hg.headers.map((h) => {
                    const sorted = h.column.getIsSorted();
                    return (
                      <th
                        key={h.id}
                        className={`px-4 py-3 text-left font-semibold text-gray-500 whitespace-nowrap cursor-pointer select-none hover:bg-gray-100 transition-colors ${h.column.columnDef.meta?.responsive ?? ""}`}
                        onClick={h.column.getToggleSortingHandler()}
                        style={{ width: h.getSize() }}
                      >
                        <span className="inline-flex items-center gap-1">
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext(),
                          )}
                          {sorted && (
                            <span
                              className={
                                sorted === "asc"
                                  ? "text-cabgen-200"
                                  : "text-cabgen-200"
                              }
                            >
                              {sorted === "asc" ? "\u2191" : "\u2193"}
                            </span>
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loadingSamples ? (
                <tr>
                  <td colSpan={99} className="py-12 text-center">
                    <Loading />
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={99} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <span className="text-sm">{dict.noResults}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 odd:bg-gray-50/30 hover:bg-gray-100/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={`px-4 py-3 cursor-default ${cell.column.columnDef.meta?.responsive ?? ""}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data.length > 0 && (
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-500">
            {dict.showing.replace("{count}", String(data.length))}
          </div>
        )}
      </div>

      {modal.type === "add" && (
        <SampleFormModal
          open
          onClose={closeModal}
          lang={lang}
          dict={dict}
          genderDict={genderDict}
          labOther={labOther}
          cityOther={cityOther}
          healthServiceOther={healthServiceOther}
          errorsDict={Errors}
        />
      )}

      {modal.type === "edit" && (
        <SampleFormModal
          open
          onClose={closeModal}
          lang={lang}
          dict={dict}
          genderDict={genderDict}
          labOther={labOther}
          cityOther={cityOther}
          healthServiceOther={healthServiceOther}
          errorsDict={Errors}
          initial={modal.sample}
        />
      )}

      {modal.type === "upload" && (
        <UploadFormModal
          open
          onClose={closeModal}
          lang={lang}
          dict={dict}
          errorsDict={Errors}
          sample={modal.sample ?? null}
        />
      )}

      <Modal
        open={modal.type === "delete"}
        onClose={closeModal}
        title={dict.delete}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 size={20} className="text-red-600" />
          </div>
          <div>
            <p className="text-gray-900 font-medium mb-1">{dict.delete}</p>
            <p className="text-gray-500 text-sm">
              {dict.deleteConfirm.replace("{name}", modal.sample?.name ?? "")}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          {deleteError && (
            <Message
              msg={
                typeof deleteError === "string" &&
                deleteError === "internalServer"
                  ? Errors[deleteError]
                  : String(deleteError)
              }
              type="error"
            />
          )}
          <Button variant="outline" onClick={closeModal}>
            {dict.cancel}
          </Button>
          {deleting ? (
            <Loading />
          ) : (
            <Button variant="destructive" onClick={() => handleDelete()}>
              {dict.delete}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountSequences;
