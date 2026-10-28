import { cn } from "~/lib/utils";
import { PAGE_SIZE_OPTIONS, type PageSize } from "~/lib/hooks/usePagination";

const SIBLING_COUNT = 1;

type PaginationProps = {
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  pageSize: PageSize;
  onPageSizeChange: (pageSize: PageSize) => void;
};

export default function Pagination({
  totalCount,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPages = () => {
    const pages: (number | "...")[] = [];

    const leftSibling = Math.max(page - SIBLING_COUNT, 1);
    const rightSibling = Math.min(page + SIBLING_COUNT, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    // همیشه صفحه اول
    pages.push(1);

    // ...
    if (showLeftDots) {
      pages.push("...");
    }

    // صفحات وسط (بدون overlap با 1 و last)
    for (
      let i = Math.max(leftSibling, 2);
      i <= Math.min(rightSibling, totalPages - 1);
      i++
    ) {
      pages.push(i);
    }

    // ...
    if (showRightDots) {
      pages.push("...");
    }

    // همیشه صفحه آخر
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-1 shadow-inner"
          title="تعداد ردیف در هر صفحه"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onPageSizeChange(option)}
              className={cn(
                "h-8 min-w-10 rounded-lg px-2 text-xs font-medium transition-all cursor-pointer",
                option === pageSize
                  ? "bg-white text-main shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:bg-white/60 hover:text-gray-800",
              )}
              aria-label={`نمایش ${option} ردیف در صفحه`}
              aria-pressed={option === pageSize}
            >
              {option}
            </button>
          ))}
        </div>
        <span className="whitespace-nowrap text-xs text-gray-400">
          {totalCount.toLocaleString("fa-IR")} مورد
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className={cn(
              "px-3 py-1.5 rounded-md border text-sm bg-white cursor-pointer",
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-muted",
            )}
          >
            قبلی
          </button>

          {getPages().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={cn(
                  "px-3 py-1.5 rounded-md border text-sm bg-white cursor-pointer",
                  p === page ? "bg-main text-white border-0" : "hover:bg-muted",
                )}
              >
                {p}
              </button>
            ),
          )}

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className={cn(
              "px-3 py-1.5 rounded-md border text-sm bg-white cursor-pointer",
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted",
            )}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
