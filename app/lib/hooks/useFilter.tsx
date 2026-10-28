import { useSearchParams } from "react-router";

export function useFilter<Key extends string>(defaults: Record<Key, string>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, searchParams.get(key) ?? value]),
  ) as Record<Key, string>;
  const setFilter = (key: Key, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === defaults[key]) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    setSearchParams(next, { replace: true });
  };
  return { filter, setFilter };
}
