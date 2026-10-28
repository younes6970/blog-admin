import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useRef } from "react";

export default function useLazyGet<TData, TError = unknown, TVariables = void>(
  keyBase: string,
  fetcher: (params: TVariables) => Promise<TData>
): [(params: TVariables) => void, UseQueryResult<TData, TError>] {
  const paramsRef = useRef<TVariables | null>(null);

  const query = useQuery<TData, TError>({
    queryKey: [keyBase, paramsRef],
    queryFn: () => {
      if (!paramsRef.current) throw new Error("Params not set");
      return fetcher(paramsRef.current);
    },
    enabled: false,
  });

  const trigger = (params: TVariables) => {
    paramsRef.current = params;
    query.refetch();
  };

  return [trigger, query];
}
