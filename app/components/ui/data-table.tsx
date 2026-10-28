import { useEffect, useRef, type ReactNode } from "react";
import { Database } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { cn } from "~/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  width?: string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyState?: ReactNode;
  className?: string;
  loading?: boolean;
  onRowClick?: (item: T) => void;
  selectedRowId?: string | number;
  classNameRow?: (item: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  emptyState,
  className,
  loading = false,
  onRowClick,
  selectedRowId,
  classNameRow,
}: DataTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRowId === undefined || selectedRowId === null || loading) {
      return;
    }

    const selectedRow = Array.from(
      tableContainerRef.current?.querySelectorAll<HTMLElement>("[data-row-id]") ?? [],
    ).find((row) => row.dataset.rowId === String(selectedRowId));
    selectedRow?.scrollIntoView({ block: "center" });
  }, [data, loading, selectedRowId]);

  return (
    <div
      ref={tableContainerRef}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      aria-busy={loading}
    >
      <Table className={cn("min-w-full", className)}>
        <TableHeader className="border-b border-gray-200 bg-gray-50/90">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key as string}
                scope="col"
                className={cn(
                  "h-12 px-4 text-right text-xs font-semibold tracking-wide text-gray-600",
                  column.className || "",
                )}
                style={{ minWidth: column.width }}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100">
          {loading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} className="hover:bg-white">
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={`${String(column.key)}-${columnIndex}`}
                    className="h-14 px-4 py-3"
                  >
                    <div
                      className={cn(
                        "h-3.5 animate-pulse rounded-full bg-gray-200",
                        columnIndex === 0 ? "w-8" : "w-20",
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-4 py-16 text-center">
                {emptyState || (
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <Database className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        داده‌ای برای نمایش وجود ندارد
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        فیلترها را تغییر دهید و دوباره بررسی کنید
                      </p>
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={item.id ?? index}
                className={cn(
                  "group transition-colors odd:bg-white even:bg-gray-50/40 hover:bg-blue-50/60",
                  {
                    "cursor-pointer": onRowClick,
                    "!bg-blue-100 shadow-[inset_4px_0_0_#3b82f6]":
                      selectedRowId !== undefined &&
                      selectedRowId !== null &&
                      String(item.id) === String(selectedRowId),
                  },
                  classNameRow?.(item),
                )}
                data-row-id={item.id ?? index}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) =>
                  column.key === "row" ? (
                    <TableCell
                      key={column.key as string}
                      className="h-14 px-4 py-3 text-sm text-gray-700"
                    >
                      {index + 1}
                    </TableCell>
                  ) : (
                    <TableCell
                      key={column.key as string}
                      className={cn(
                        "h-14 px-4 py-3 text-sm text-gray-700",
                        column.className,
                      )}
                    >
                      {column.render
                        ? column.render(item)
                        : (item[column.key as keyof T] as ReactNode) || "---"}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
