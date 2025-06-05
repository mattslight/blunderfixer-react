import { useMemo } from 'react';
import useSWR from 'swr';

import { getRecentDrills } from '@/api/drills';

export function useRecentDrills(
  username: string,
  opts: { limit?: number; includeArchived?: boolean } = {}
) {
  const { limit = 20, includeArchived = false } = opts;
  const swrKey = useMemo(
    () =>
      username ? ['recentDrills', username, limit, includeArchived] : null,
    [username, limit, includeArchived]
  );

  const { data, error, isValidating, mutate } = useSWR(swrKey, () =>
    getRecentDrills({ username, limit, includeArchived })
  );

  return {
    drills: data ?? [],
    loading: !data && !error,
    refreshing: isValidating,
    error,
    reload: mutate,
  };
}
