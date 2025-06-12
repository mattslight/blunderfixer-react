// src/hooks/useSaveDrillHistory.ts
import { useEffect, useRef } from 'react';
import { mutate } from 'swr';

import { postDrillHistory } from '@/api/drills';
import { useProfile } from '@/hooks/useProfile';

export function useSaveDrillHistory(
  drillId: string | number | null | undefined,
  result: 'pass' | 'fail' | null,
  reason: string | null,
  currentDepth: number,
  moves: string[],
  resetKey: number,
  delay = 750,
  minDepth = 12
) {
  const hasPosted = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    profile: { username },
  } = useProfile();

  // Reset posted flag when moving to a new drill
  useEffect(() => {
    hasPosted.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [drillId, resetKey]);

  useEffect(() => {
    if (
      drillId == null ||
      hasPosted.current ||
      currentDepth < minDepth ||
      (result !== 'pass' && result !== 'fail')
    ) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      postDrillHistory(drillId, {
        result,
        reason: reason || undefined,
        moves,
      })
        .then(() => {
          mutate(`/drills/${drillId}`);
          if (result === 'pass' && username) {
            try {
              const key = `bf:blunders_fixed:${username}`;
              const raw = localStorage.getItem(key);
              const val = raw ? parseInt(raw, 10) : 0;
              localStorage.setItem(key, String(val + 1));
            } catch {
              // ignore
            }
          }
          hasPosted.current = true;
        })
        .catch((err) => {
          console.error('Could not save drill history:', err);
          hasPosted.current = false; // retry on failure
        });
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [drillId, result, reason, currentDepth, moves, delay, minDepth, username]);
}
