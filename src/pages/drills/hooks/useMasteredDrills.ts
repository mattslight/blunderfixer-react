import { useMemo } from 'react';
import useSWR from 'swr';

import { getMasteredDrills } from '@/api/drills';

export function useMasteredDrills(
  username: string,
  opts: { limit?: number; includeArchived?: boolean } = {}
) {
  const { limit = 20, includeArchived = false } = opts;
  const swrKey = useMemo(
    () => (username ? ['masteredDrills', username, limit, includeArchived] : null),
    [username, limit, includeArchived]
  );

  const { data, error, isValidating, mutate } = useSWR(swrKey, () =>
    getMasteredDrills({ username, limit, includeArchived })
  );

  return {
    drills: data ?? [],
    loading: !data && !error,
    refreshing: isValidating,
    error,
    reload: mutate,
  };
}
