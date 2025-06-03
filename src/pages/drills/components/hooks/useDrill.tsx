// src/pages/drills/components/DrillCard/hooks/useDrill.tsx
import useSWR from 'swr';

import { getDrill } from '@/api/drills';
import type { DrillPosition } from '@/types';

export default function useDrill(id: number | string) {
  const { data, error, isLoading, mutate } = useSWR<DrillPosition>(
    id ? `/drills/${id}` : null,
    () => getDrill(Number(id))
  );

  return {
    drill: data,
    loading: isLoading,
    error,
    refresh: mutate,
  };
}
