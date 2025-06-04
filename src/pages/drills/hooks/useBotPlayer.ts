// src/hooks/useBotPlayer.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Subscription } from 'rxjs';

import { StockfishEngine } from '@/lib/StockfishEngine';
import { uciToMove } from '@/lib/uci';

const DEBUG = false;
const MULTI_PV = 2; // how many lines to request from Stockfish
const DELTA_CP = 20; // max centipawn difference to consider moves equal

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
  strength = 14,
  makeMove,
}: UseBotPlayerParams): UseBotPlayerResult {
  // We store the engine in a ref so it persists between renders
  const engineRef = useRef<StockfishEngine | null>(null);
  const subRef = useRef<Subscription | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [ready, setReady] = useState(false);

  // 1) Initialize engine exactly once
  useEffect(() => {
    const engine = new StockfishEngine(MULTI_PV);
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
      subRef.current?.unsubscribe();
      subRef.current = null;
    };
  }, []); // empty dependency array = only once

  // 2) If the FEN changes mid-search, cancel that search
  useEffect(() => {
    if (isThinking) {
      engineRef.current?.stop();
      subRef.current?.unsubscribe();
      subRef.current = null;
      setIsThinking(false);
    }
  }, [fen]);

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

    const infoMap = new Map<number, { uci: string; cp?: number }>();

    subRef.current = engine.lines$.subscribe((msg) => {
      if (msg.startsWith('bestmove')) {
        const parts = msg.split(' ');
        const bestUci = parts[1];

        let chosen = bestUci;
        const best = infoMap.get(1);
        const bestScore = best?.cp;

        if (bestScore !== undefined) {
          const goodMoves = Array.from(infoMap.values())
            .filter(
              (m) =>
                m.cp !== undefined && Math.abs(bestScore - m.cp) <= DELTA_CP
            )
            .map((m) => m.uci);
          if (goodMoves.length > 1) {
            chosen =
              goodMoves[Math.floor(Math.random() * goodMoves.length)] ??
              bestUci;
          } else if (goodMoves.length === 1) {
            chosen = goodMoves[0];
          }
        }

        if (DEBUG) console.log('[useBotPlayer] chosen move =', chosen);
        const { from, to } = uciToMove(chosen);
        const promo = chosen.length === 5 ? chosen[4] : undefined;
        makeMove(from!, to!, promo);

        subRef.current?.unsubscribe();
        subRef.current = null;
        setIsThinking(false);
      } else if (msg.startsWith('info ')) {
        const depthMatch = msg.match(/depth (\d+)/);
        if (!depthMatch) return;

        const multiMatch = msg.match(/multipv (\d+)/);
        if (!multiMatch) return;
        const rank = +multiMatch[1];

        const cpMatch = msg.match(/score cp (-?\d+)/);
        const score = cpMatch ? +cpMatch[1] : undefined;

        const pvMatch = msg.match(
          /pv\s+((?:[a-h][1-8][a-h][1-8][nbrq]?\s*)+)/i
        );
        if (!pvMatch) return;
        const firstUci = pvMatch[1].trim().split(/\s+/)[0];

        infoMap.set(rank, { uci: firstUci, cp: score });
      }
    });

    engine.analyze(fen, strength).catch((e) => {
      if (DEBUG) console.error('[useBotPlayer] analyze error:', e);
      setError(e as Error);
      subRef.current?.unsubscribe();
      subRef.current = null;
      setIsThinking(false);
    });
  }, [fen, strength, makeMove, isThinking, ready]);

  const cancel = useCallback(() => {
    engineRef.current?.stop();
    subRef.current?.unsubscribe();
    subRef.current = null;
    setIsThinking(false);
  }, []);

  return { isThinking, error, playBotMove, cancel };
}
