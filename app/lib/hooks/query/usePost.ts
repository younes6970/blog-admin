import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import type { ErrorResponse } from "~/types";

export default function usePost<TRequest, TResponse = Response>(
  fetch: (data: TRequest) => Promise<TResponse>,
  options?: {
    onSuccess?: (data: TResponse) => void;
    onError?: (error: ErrorResponse) => void;
    invalidateQueries?: QueryKey[];
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TRequest) => fetch(data),
    retry: false,
    onSuccess: async (data: TResponse) => {
      if (options?.invalidateQueries?.length) {
        await Promise.all(
          options.invalidateQueries.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey, refetchType: "all" }),
          ),
        );
      }
      options?.onSuccess?.(data);
    },
    onError: (error: ErrorResponse) => {
      options?.onError?.(error);
    },
  });
}
