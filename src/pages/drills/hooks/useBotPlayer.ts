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
  const engineRef = useRef<StockfishEngine | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ready, setReady] = useState(false);
  const currentRequestId = useRef(0);

  useEffect(() => {
    const engine = new StockfishEngine(1);
    engineRef.current = engine;

    engine.init()
      .then(() => setReady(true))
      .catch((e) => {
        console.error('[useBotPlayer] Engine init failed:', e);
        setError(e as Error);
      });

    return () => {
      engine.stop();
      engine.quit();
    };
  }, []);

  useEffect(() => {
    if (isThinking) {
      engineRef.current?.stop();
      setIsThinking(false);
    }
  }, [fen, isThinking]);

  const playBotMove = useCallback(() => {
    if (!ready || isThinking || !engineRef.current) return;

    const engine = engineRef.current;
    const myId = ++currentRequestId.current;

    setIsThinking(true);
    setError(null);

    (async () => {
      try {
        engine.stop();
        await engine.waitReady();
        if (myId !== currentRequestId.current) return;

        const bestUci = await engine.bestMove(fen, strength);
        if (myId !== currentRequestId.current) return;

        const { from, to } = uciToMove(bestUci);
        const promo = bestUci.length === 5 ? bestUci[4] : undefined;
        makeMove(from!, to!, promo);
      } catch (e) {
        setError(e as Error);
        if (DEBUG) console.error('[useBotPlayer] bestMove error:', e);
      } finally {
        if (myId === currentRequestId.current) {
          setIsThinking(false);
        }
      }
    })();
  }, [fen, strength, makeMove, ready, isThinking]);

  const cancel = useCallback(() => {
    engineRef.current?.stop();
    setIsThinking(false);
  }, []);

  return { isThinking, error, playBotMove, cancel };
}