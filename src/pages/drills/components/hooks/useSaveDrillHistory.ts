// src/hooks/useSaveDrillHistory.ts
import { useEffect, useRef } from 'react';
import { mutate } from 'swr';

import { postDrillHistory } from '@/api/drills';

export function useSaveDrillHistory(
  drillId: string | number | null | undefined,
  result: 'pass' | 'fail' | null,
  reason: string | null
) {
  const hasPosted = useRef(false);

  useEffect(() => {
    if (
      drillId != null &&
      !hasPosted.current &&
      (result === 'pass' || result === 'fail')
    ) {
      hasPosted.current = true;

      postDrillHistory(drillId, { result, reason: reason || undefined })
        .then(() => {
          // Re-fetch `/drills/{drillId}` after history is saved
          mutate(`/drills/${drillId}`);
        })
        .catch((err) => {
          console.error('Could not save drill history:', err);
          hasPosted.current = false; // allow retry on error
        });
    }

    return () => {
      hasPosted.current = false; // reset for next session
    };
  }, [drillId, result, reason]);
}
