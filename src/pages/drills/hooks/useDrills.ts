// src/pages/drills/hooks/useDrills.ts
import { useMemo } from 'react';
import useSWR from 'swr';

import { DrillFilters, getDrills } from '@/api/drills';

export function useDrills(filters: DrillFilters) {
  const swrKey = useMemo(
    () =>
      filters.username
        ? ['drills', JSON.stringify(filters)] // stable key
        : null,
    [filters]
  );

  const { data, error, isValidating, mutate } = useSWR(swrKey, () =>
    getDrills(filters)
  );

  return {
    drills: data ?? [],
    loading: !data && !error,
    refreshing: isValidating,
    error,
    refresh: () => mutate(),
  };
}
