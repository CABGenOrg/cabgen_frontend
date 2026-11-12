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
import { TableSkeleton } from "./Skeletons";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  loading: boolean;
  emptyMessage: string;
  countLabel: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  enableRowSelection?: boolean | ((row: any) => boolean);
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  maxSelection?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const DataTable = <TData,>({
  data,
  columns,
  loading,
  emptyMessage,
  countLabel,
  emptyTitle,
  emptyDescription,
  emptyAction,
  emptyIcon,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  maxSelection,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const defaultColumn: Partial<ColumnDef<TData, any>> = {
    cell: (info) => {
      const v = info.getValue();
      return v === null || v === undefined || v === "" ? "-" : v;
    },
  };

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
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

  // Vazio/loading: table-auto preenche o header na largura toda (não há corpo
  // para alinhar). Com dados: table-fixed — px idênticos aos das rows
  // virtualizadas (tableLayout: fixed) → alinhamento por construção.
  const isEmpty = rows.length === 0;

  return (
    <div className="bg-card rounded-lg shadow-md border border-border">
      <div
        ref={tableContainerRef}
        className="overflow-auto max-h-[min(600px,70vh)]"
      >
        <table className={`w-full text-sm ${isEmpty ? "table-auto" : "table-fixed"}`}>
          <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-muted">
                {enableRowSelection && (
                  <th className="px-2 py-2.5 sm:px-3 w-10">
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
                      className={`px-2 py-2.5 sm:px-3 text-left font-semibold text-muted-foreground whitespace-nowrap cursor-pointer select-none hover:bg-accent transition-colors ${h.column.columnDef.meta?.responsive ?? ""}`}
                      onClick={h.column.getToggleSortingHandler()}
                      style={{ width: h.getSize() }}
                    >
                      <span className="inline-flex items-center gap-1">
                        {flexRender(
                          h.column.columnDef.header,
                          h.getContext(),
                        )}
                        {sorted && (
                          <span className="text-cabgen-200 dark:text-cabgen-300">
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
              <TableSkeleton columns={columns.length} />
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={99}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription ?? emptyMessage}
                    action={emptyAction}
                    icon={emptyIcon}
                  />
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
                    className={`border-b border-border odd:bg-muted/30 hover:bg-accent/50 transition-colors ${
                      row.getIsSelected() ? "bg-cabgen-100/10" : ""
                    }`}
                  >
                    {enableRowSelection && (
                      <td className="px-2 py-2.5 sm:px-3 w-10">
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
                        className={`px-2 py-2.5 sm:px-3 cursor-default break-words ${cell.column.columnDef.meta?.responsive ?? ""}`}
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
      {(data.length > 0 || onPageChange) && (
        <div className="px-4 py-2.5 border-t border-border bg-muted/50 text-sm text-muted-foreground flex items-center justify-between gap-3">
          {data.length > 0 && (
            <span>{countLabel.replace("{count}", String(data.length))}</span>
          )}
          {onPageChange && page !== undefined && totalPages !== undefined && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={onPageChange}
              disabled={loading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
