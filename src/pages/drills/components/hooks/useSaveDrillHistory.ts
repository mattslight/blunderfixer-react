// src/hooks/useSaveDrillHistory.ts
import { useEffect, useRef } from 'react';
import { mutate } from 'swr';

import { postDrillHistory } from '@/api/drills';
import { useDebounce } from '@/hooks/useDebounce';

export function useSaveDrillHistory(
  drillId: string | number | null | undefined,
  result: 'pass' | 'fail' | null,
  reason: string | null,
  currentDepth: number,
  delay = 750,
  minDepth = 12
) {
  const hasPosted = useRef(false);

  const debouncedResult = useDebounce(result, delay);
  const debouncedReason = useDebounce(reason, delay);

  // Reset posted flag when moving to a new drill
  useEffect(() => {
    hasPosted.current = false;
  }, [drillId]);

  useEffect(() => {
    if (
      drillId != null &&
      currentDepth >= minDepth &&
      !hasPosted.current &&
      (debouncedResult === 'pass' || debouncedResult === 'fail')
    ) {
      hasPosted.current = true;

      postDrillHistory(drillId, {
        result: debouncedResult,
        reason: debouncedReason || undefined,
      })
        .then(() => {
          // Re-fetch `/drills/{drillId}` after history is saved
          mutate(`/drills/${drillId}`);
        })
        .catch((err) => {
          console.error('Could not save drill history:', err);
          hasPosted.current = false; // allow retry on error
        });
    }
  }, [drillId, debouncedResult, debouncedReason, currentDepth]);
}
