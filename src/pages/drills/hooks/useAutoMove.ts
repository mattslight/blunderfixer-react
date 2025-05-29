// src/hooks/useAutoMove.ts
import { useEffect, useRef } from 'react';

/**
 * Auto-triggers playBotMove() after each *user* move (odd history length).
 *
 * @param moveHistory  array of SAN strings
 * @param playBotMove  function that runs the engine reply
 * @param delayMs      ms to wait before firing
 */
export default function useAutoMove(
  moveHistory: string[],
  playBotMove: () => void,
  delayMs = 300
) {
  const prevLen = useRef<number>(moveHistory.length);

  useEffect(() => {
    const prev = prevLen.current;
    const curr = moveHistory.length;

    // Only after a user move (odd-length history)
    if (curr > prev && curr % 2 === 1) {
      const handle = setTimeout(playBotMove, delayMs);
      return () => clearTimeout(handle);
    }

    // Always update previous length
    prevLen.current = curr;
  }, [moveHistory, playBotMove, delayMs]);
}
