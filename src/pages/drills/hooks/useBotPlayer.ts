// src/hooks/useBotPlayer.ts
import { useCallback, useEffect, useRef, useState } from 'react';

import { StockfishEngine } from '@/lib/StockfishEngine';
import { uciToMove } from '@/lib/uci';

interface UseBotPlayerResult {
  /** Whether the engine is currently thinking */
  isThinking: boolean;
  /** Current error, if any */
  error: Error | null;
  /** Triggers the engine to compute and play a move */
  playBotMove: () => void;
  /** Cancels any ongoing engine search */
  cancel: () => void;
}

/**
 * Hook that picks and plays a bot move via Stockfish.
 * Uses engine.bestMove() and handles depth as 'strength'.
 */
export default function useBotPlayer(
  fen: string,
  strength: number,
  makeMove: (from: string, to: string, promotion?: string) => boolean
): UseBotPlayerResult {
  const engineRef = useRef<StockfishEngine | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize engine once
  useEffect(() => {
    engineRef.current = new StockfishEngine(1);
    return () => engineRef.current?.stop();
  }, []);

  // Cancel ongoing search when FEN changes
  useEffect(() => {
    if (isThinking) {
      engineRef.current?.stop();
      setIsThinking(false);
    }
  }, [fen]);

  const playBotMove = useCallback(() => {
    if (isThinking) return;
    const engine = engineRef.current;
    if (!engine) return;

    setError(null);
    setIsThinking(true);

    engine
      .bestMove(fen, strength)
      .then((bestUci) => {
        const { from, to } = uciToMove(bestUci);
        // UCI string with promotion is 5 chars, e.g. 'e7e8q'
        const promotion = bestUci.length === 5 ? bestUci[4] : undefined;
        makeMove(from, to, promotion);
      })
      .catch((e) => {
        console.error('[useBotPlayer] bestMove error:', e);
        setError(e as Error);
      })
      .finally(() => setIsThinking(false));
  }, [fen, strength, makeMove, isThinking]);

  const cancel = useCallback(() => {
    engineRef.current?.stop();
    setIsThinking(false);
  }, []);

  return { isThinking, error, playBotMove, cancel };
}
