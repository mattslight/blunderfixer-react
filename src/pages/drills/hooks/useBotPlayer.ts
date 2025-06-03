// src/hooks/useBotPlayer.ts
import { useCallback, useEffect, useRef, useState } from 'react';

import { StockfishEngine } from '@/lib/StockfishEngine';
import { uciToMove } from '@/lib/uci';

const DEBUG = false;

interface UseBotPlayerResult {
  isThinking: boolean;
  error: Error | null;
  playBotMove: () => void;
  cancel: () => void;
}

interface UseBotPlayerParams {
  fen: string;
  strength?: number;
  makeMove: (from: string, to: string, promotion?: string) => boolean;
}

export default function useBotPlayer({
  fen,
  strength = 20,
  makeMove,
}: UseBotPlayerParams): UseBotPlayerResult {
  // We store the engine in a ref so it persists between renders
  const engineRef = useRef<StockfishEngine | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ready, setReady] = useState(false);

  // 1) Initialize engine exactly once
  useEffect(() => {
    const engine = new StockfishEngine(1);
    engineRef.current = engine;

    // Wait for the initial “readyok” handshake before marking ready = true
    engine
      .init()
      .then(() => {
        if (DEBUG) console.log('[useBotPlayer] Engine is ready to use.');
        setReady(true);
      })
      .catch((e) => {
        console.error('[useBotPlayer] Engine failed to initialize:', e);
        setError(e as Error);
      });

    // On unmount, tell Stockfish to stop and quit
    return () => {
      engine.stop();
      engine.quit();
    };
  }, []); // empty dependency array = only once

  // 2) If the FEN changes mid-search, cancel that search
  useEffect(() => {
    if (isThinking) {
      engineRef.current?.stop();
      setIsThinking(false);
    }
  }, [fen, isThinking]);

  // 3) playBotMove only runs if engine is fully “ready”
  const playBotMove = useCallback(() => {
    if (!ready) {
      // Engine isn’t ready yet, so ignore the request for now
      if (DEBUG)
        console.log('[useBotPlayer] engine not ready; skipping playBotMove');
      return;
    }

    if (isThinking) {
      // Already in the middle of a search
      return;
    }

    const engine = engineRef.current;
    if (!engine) return;

    setError(null);
    setIsThinking(true);

    engine
      .bestMove(fen, strength)
      .then((bestUci) => {
        if (DEBUG) console.log('[useBotPlayer] bestUci =', bestUci);
        const { from, to } = uciToMove(bestUci);
        // If promotion, the UCI string is 5 chars: e.g. “e7e8q”
        const promo = bestUci.length === 5 ? bestUci[4] : undefined;
        makeMove(from!, to!, promo);
      })
      .catch((e) => {
        if (DEBUG) console.error('[useBotPlayer] bestMove error:', e);
        setError(e as Error);
      })
      .finally(() => {
        setIsThinking(false);
      });
  }, [fen, strength, makeMove, isThinking, ready]);

  const cancel = useCallback(() => {
    engineRef.current?.stop();
    setIsThinking(false);
  }, []);

  return { isThinking, error, playBotMove, cancel };
}
