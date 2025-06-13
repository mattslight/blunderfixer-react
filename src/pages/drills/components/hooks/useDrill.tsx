import useSWR from 'swr';

import { drillKey, getDrill } from '@/api/drills';
import type { DrillPosition } from '@/types';

export function useDrill(id: number | string) {
  const key = id ? drillKey(id) : null;

  const { data, error, isLoading, mutate } = useSWR<DrillPosition>(key, () =>
    getDrill(Number(id))
  );

  return {
    drill: data,
    loading: isLoading,
    error,
    refresh: mutate,
  };
}
