// src/pages/drills/components/DrillCard/hooks/useDrill.tsx
import useSWR from 'swr';

import { getDrill } from '@/api/drills';
import type { DrillPosition } from '@/types';

export function useDrill(id: number | string) {
  const { data, error, isLoading, mutate } = useSWR<DrillPosition>(
    id ? `/drills/${id}` : null,
    () => getDrill(Number(id)),
    {
      revalidateOnFocus: false, // no re-fetch when tab gains focus
      revalidateOnReconnect: false, // no re-fetch on network reconnect
      refreshInterval: 0, // no polling
      revalidateIfStale: false, // don’t fetch on mount if cache is stale
    }
  );

  return {
    drill: data,
    loading: isLoading,
    error,
    refresh: mutate,
  };
}
