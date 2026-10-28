import { useCallback, useState } from "react";
import { useSearchParams } from "react-router";

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

const DEFAULT_PAGE_SIZE: PageSize = 20;
const PAGE_SIZE_STORAGE_KEY = "admin-page-size";

function getStoredPageSize(): PageSize {
  if (typeof window === "undefined") return DEFAULT_PAGE_SIZE;

  const storedValue = Number(window.localStorage.getItem(PAGE_SIZE_STORAGE_KEY));
  return PAGE_SIZE_OPTIONS.includes(storedValue as PageSize)
    ? (storedValue as PageSize)
    : DEFAULT_PAGE_SIZE;
}

export function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageSize, setPageSizeState] = useState<PageSize>(getStoredPageSize);
  const pageParam = Number(searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const setPage = useCallback(
    (nextPage: number) => {
      const nextSearchParams = new URLSearchParams(searchParams);

      if (nextPage <= 1) {
        nextSearchParams.delete("page");
      } else {
        nextSearchParams.set("page", String(nextPage));
      }

      setSearchParams(nextSearchParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setPageSize = (nextPageSize: PageSize) => {
    if (!PAGE_SIZE_OPTIONS.includes(nextPageSize)) return;

    setPageSizeState(nextPageSize);
    window.localStorage.setItem(PAGE_SIZE_STORAGE_KEY, String(nextPageSize));
    setPage(1);
  };

  return { page, setPage, pageSize, setPageSize };
}
