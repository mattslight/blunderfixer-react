import { useEffect, useRef } from 'react';
import { mutate } from 'swr';

import { postDrillHistory } from '@/api/drills';
import { useProfile } from '@/hooks/useProfile';

const DEBUG = false;

interface UseSaveDrillHistoryProps {
  drillId: string | number | null | undefined;
  result: 'pass' | 'fail' | null;
  reason: string | null;
  moves: string[];
  resetKey: number;
}

export function useSaveDrillHistory({
  drillId,
  result,
  reason,
  moves,
  resetKey,
}: UseSaveDrillHistoryProps) {
  const hasPosted = useRef(false);

  const {
    profile: { username },
  } = useProfile();

  useEffect(() => {
    hasPosted.current = false;
  }, [drillId, resetKey]);

  useEffect(() => {
    const canSave =
      drillId != null &&
      !hasPosted.current &&
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

    if (DEBUG) console.log('[OPTIMISTIC]', optimistic);

    mutate(
      `/drills/${drillId}`,
      (current: any) => {
        const allTimestamps =
          current?.history.map((h: any) => h.timestamp) ?? [];
        if (DEBUG) {
          console.log('[CURRENT BEFORE OPTIMISTIC]', allTimestamps);
          console.log('[ADDING OPTIMISTIC]', optimistic.timestamp);
        }

        return current
          ? {
              ...current,
              history: [...current.history, optimistic],
              last_drilled_at: ts,
            }
          : current;
      },
      { revalidate: false }
    );

    postDrillHistory(drillId, {
      result,
      reason,
      moves,
      timestamp: ts,
    })
      .then((res) => {
        if (DEBUG) {
          console.log('[REVALIDATE - START]');
          console.log('[SERVER RETURNED]', res);
        }

        mutate(`/drills/${drillId}`, (data: any) => {
          if (DEBUG) {
            console.log(
              '[REVALIDATE - RAW HISTORY]',
              data.history.map((h: any) => h.timestamp)
            );
          }
          const unique = new Map();
          for (const h of data.history) {
            unique.set(new Date(h.timestamp).toISOString(), h);
          }
          const deduped = Array.from(unique.values());

          if (DEBUG) {
            console.log(
              '[REVALIDATE - DEDUPED HISTORY]',
              deduped.map((h) => new Date(h.timestamp).toISOString())
            );
          }

          return { ...data, history: deduped };
        });

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
  }, [drillId, result, reason, moves, resetKey, username]);
}
