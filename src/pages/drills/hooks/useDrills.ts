// src/pages/drills/hooks/useDrills.ts

import { getDrills } from '@/api';
import useSWR from 'swr';

export function useDrills(username: string) {
  // only fetch if username is truthy
  const { data, error, isValidating, mutate } = useSWR(
    username ? ['drills', username] : null,
    // fetcher: SWR passes the key array to this fn
    ([, user]) => getDrills(user)
  );

  return {
    drills: data ?? [], // SWR data
    loading: !data && !error, // initial load flag
    refreshing: isValidating, // revalidation flag
    error, // any fetch error
    refresh: () => mutate(), // manual reload
  };
}
