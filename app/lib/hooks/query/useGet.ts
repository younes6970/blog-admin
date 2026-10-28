import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { ErrorResponse } from "~/types";

export default function useGet<TData = Response>(
  key: QueryKey,
  fetcher: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, ErrorResponse, TData, QueryKey>,
    "queryKey" | "queryFn"
  >
): UseQueryResult<TData, ErrorResponse> {
  return useQuery<TData, ErrorResponse, TData, QueryKey>({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  });
}
