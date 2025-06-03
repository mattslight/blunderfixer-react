import { useEffect, useRef } from 'react';

import { postDrillHistory } from '@/api/drills';

export function useSaveDrillHistory(
  drillId: string | number | null | undefined,
  result: 'pass' | 'fail' | null,
  reason: string | null
) {
  const hasPosted = useRef(false);

  useEffect(() => {
    if (
      drillId != null && // not null/undefined
      !hasPosted.current &&
      (result === 'pass' || result === 'fail')
    ) {
      hasPosted.current = true;
      postDrillHistory(drillId, { result, reason: reason || undefined }).catch(
        (err) => {
          console.error('Could not save drill history:', err);
          hasPosted.current = false; // Allow retry on error
        }
      );
    }

    return () => {
      hasPosted.current = false; // Reset for next drill session
    };
  }, [drillId, result, reason]);
}
