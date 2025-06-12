// src/hooks/useSaveDrillHistory.ts
import { useEffect, useRef } from 'react';
import { mutate } from 'swr';

import { postDrillHistory } from '@/api/drills';
import { useProfile } from '@/hooks/useProfile';

const MIN_DEPTH = 12;
export function useSaveDrillHistory(
  drillId: string | number | null | undefined,
  result: 'pass' | 'fail' | null,
  reason: string | null,
  currentDepth: number,
  moves: string[],
  resetKey: number
) {
  const hasPosted = useRef(false);

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
      currentDepth >= MIN_DEPTH &&
      (result === 'pass' || result === 'fail');

    if (!canSave) return;

    hasPosted.current = true;

    const ts = new Date().toISOString();

    const optimistic = {
      id: Date.now(),
      drill_position_id: Number(drillId),
      result,
      reason: reason ?? null,
      moves,
      final_eval: null,
      timestamp: ts,
    };

    mutate(
      `/drills/${drillId}`,
      (current: any) =>
        current
          ? {
              ...current,
              history: [...current.history, optimistic],
              last_drilled_at: ts,
            }
          : current,
      { revalidate: false }
    );

    postDrillHistory(drillId, {
      result,
      reason,
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
      })
      .catch((err) => {
        console.error('Could not save drill history:', err);
        hasPosted.current = false; // retry on failure
      });
  }, [drillId, result, reason, currentDepth, moves, username]);
}
