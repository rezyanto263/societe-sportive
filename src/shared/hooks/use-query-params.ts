'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type QueryParamValue = string | number | null | undefined;

type QueryParamUpdates = Record<string, QueryParamValue>;

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (
      updates: QueryParamUpdates,
      options?: { replace?: boolean; scroll?: boolean },
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      if (options?.replace) {
        router.replace(url, { scroll: options.scroll ?? false });
      } else {
        router.push(url, { scroll: options?.scroll ?? false });
      }
    },
    [pathname, router, searchParams],
  );

  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  return {
    searchParams,
    getParam,
    setParams,
  };
}
