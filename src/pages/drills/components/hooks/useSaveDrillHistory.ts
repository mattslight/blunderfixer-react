// src/hooks/useSaveDrillHistory.ts
import { useEffect, useRef } from 'react';
import { mutate } from 'swr';

import { postDrillHistory } from '@/api/drills';
import { useDebounce } from '@/hooks/useDebounce';
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

  const debouncedResult = useDebounce(result, delay);
  const debouncedReason = useDebounce(reason, delay);
  const {
    profile: { username },
  } = useProfile();

  // Reset posted flag when moving to a new drill
  useEffect(() => {
    hasPosted.current = false;
  }, [drillId, resetKey]);

  useEffect(() => {
    const canSave =
      drillId != null &&
      !hasPosted.current &&
      currentDepth >= minDepth &&
      (debouncedResult === 'pass' || debouncedResult === 'fail');

    if (!canSave) return;

    hasPosted.current = true;

    postDrillHistory(drillId, {
      result: debouncedResult,
      reason: debouncedReason || undefined,
      moves,
    })
      .then(() => {
        mutate(`/drills/${drillId}`);
        if (debouncedResult === 'pass' && username) {
          try {
            const key = `bf:blunders_fixed:${username}`;
            const raw = localStorage.getItem(key);
            const val = raw ? parseInt(raw, 10) : 0;
            localStorage.setItem(key, String(val + 1));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => {
        console.error('Could not save drill history:', err);
        hasPosted.current = false; // retry on failure
      });
  }, [
    drillId,
    debouncedResult,
    debouncedReason,
    currentDepth,
    minDepth,
    moves,
    username,
  ]);
}
