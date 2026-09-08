"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useState, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Loading from "./Loading";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  loading: boolean;
  emptyMessage: string;
  countLabel: string;
  enableRowSelection?: boolean | ((row: any) => boolean);
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  maxSelection?: number;
}

const DataTable = <TData,>({
  data,
  columns,
  loading,
  emptyMessage,
  countLabel,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  maxSelection,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      ...(enableRowSelection && rowSelection ? { rowSelection } : {}),
    },
    onSortingChange: setSorting,
    onRowSelectionChange: onRowSelectionChange ?? undefined,
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectionFull =
    maxSelection !== undefined &&
    rowSelection !== undefined &&
    Object.keys(rowSelection).length >= maxSelection;

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100">
      <div
        ref={tableContainerRef}
        className="overflow-auto max-h-[min(600px,70vh)]"
      >
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-gray-50">
                {enableRowSelection && (
                  <th className="px-4 py-3 w-10">
                    <Checkbox
                      aria-label="Select all"
                      checked={table.getIsAllPageRowsSelected()}
                      disabled={selectionFull && !table.getIsAllPageRowsSelected()}
                      onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                      }
                    />
                  </th>
                )}
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
                          <span className="text-cabgen-200">
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
          <tbody
            style={{
              height: totalSize ? `${totalSize}px` : undefined,
              position: totalSize ? "relative" : undefined,
            }}
          >
            {loading ? (
              <tr>
                <td colSpan={99} className="py-12 text-center">
                  <Loading />
                </td>
              </tr>
            ) : rows.length === 0 ? (
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
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                      display: "table",
                      tableLayout: "fixed",
                    }}
                    className={`border-b border-gray-100 odd:bg-gray-50/30 hover:bg-gray-100/50 transition-colors ${
                      row.getIsSelected() ? "bg-cabgen-100/10" : ""
                    }`}
                  >
                    {enableRowSelection && (
                      <td className="px-4 py-3 w-10">
                        <Checkbox
                          aria-label="Select row"
                          checked={row.getIsSelected()}
                          disabled={
                            !row.getCanSelect() ||
                            (selectionFull && !row.getIsSelected())
                          }
                          onCheckedChange={(value) => row.toggleSelected(!!value)}
                        />
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`px-4 py-3 cursor-default ${cell.column.columnDef.meta?.responsive ?? ""}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-500">
          {countLabel.replace("{count}", String(data.length))}
        </div>
      )}
    </div>
  );
};

export default DataTable;
