// src/hooks/useStockfish.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

import { StockfishEngine } from '@/lib/StockfishEngine';
import { makeEmptyLines, parseUciInfo } from '@/lib/uci';
import { PVLine } from '@/types';

interface UseStockfishResult {
  /** Up to `multiPV` lines of PV info (rank‐sorted). */
  lines: PVLine[];
  /** The UCI string for the best move (e.g. “e2e4”). */
  bestMoveUCI?: string;
  /** The deepest search depth we’ve seen so far. */
  currentDepth: number;
}

/**
 * Custom hook that manages a Stockfish engine instance.
 *
 * @param fen      – FEN to analyze.
 * @param depth    – target search depth.
 * @param multiPV  – how many PV lines to request.
 * @param enabled  – if false, the hook does not send any commands.
 */
export function useStockfish(
  fen: string,
  depth = 12,
  multiPV = 3,
  enabled = true
): UseStockfishResult {
  // 1) Create one StockfishEngine instance per multiPV (re‐use on re‐renders).
  const engine = useMemo(() => new StockfishEngine(multiPV), [multiPV]);

  // 2) Empty lines array as initial state (length = multiPV, all depths=0).
  const emptyLines = useMemo(() => makeEmptyLines(multiPV), [multiPV]);
  const [lines, setLines] = useState<PVLine[]>(emptyLines);
  const [bestMoveUCI, setBestUCI] = useState<string>();
  const [currentDepth, setDepthState] = useState(0);

  // 3) Make a runId so we can ignore stale responses if `fen` changes quickly.
  const runId = useRef(0);

  useEffect(() => {
    if (!enabled || !fen) {
      // If disabled or no FEN, reset state and do nothing
      setLines(emptyLines);
      setBestUCI(undefined);
      setDepthState(0);
      return;
    }

    // bump run counter
    runId.current += 1;
    const myRun = runId.current;

    // clear previous state immediately
    setLines(emptyLines);
    setBestUCI(undefined);
    setDepthState(0);

    let sub: Subscription | null = null;
    let canceled = false;

    (async () => {
      // Stop any previous search, wait for “readyok”, then start new search
      await engine.analyze(fen, depth);
      if (canceled) return;

      // Subscribe only after engine is ready on this exact run
      sub = engine.lines$.subscribe((raw) => {
        if (myRun !== runId.current) return; // stale output
        let info: PVLine | null;
        try {
          info = parseUciInfo(raw, fen);
        } catch {
          return; // parsing error
        }
        if (!info) return;

        // 1) Merge into `lines`, only if this line’s depth improved
        setLines((old) => {
          const idx = info.rank - 1; // 0-based
          const oldDepth = old[idx]?.depth || 0;
          if (info.depth <= oldDepth) return old;
          const next = [...old];
          next[idx] = info;
          return next;
        });

        // 2) Update bestMoveUCI from rank=1 if it changed
        if (info.rank === 1) {
          const match = raw.match(
            /pv\s+((?:[a-h][1-8][a-h][1-8][nbrq]?\s*)+)/i
          );
          if (match) {
            const uciList = match[1].trim().split(/\s+/);
            const candidate = uciList[0];
            setBestUCI((prev) => (prev === candidate ? prev : candidate));
          }
        }

        // 3) Track highest depth seen
        setDepthState((prev) => (info.depth > prev ? info.depth : prev));
      });
    })();

    return () => {
      canceled = true;
      if (sub) sub.unsubscribe();
      engine.stop();
    };
  }, [fen, depth, engine, emptyLines, enabled]);

  return { lines, bestMoveUCI, currentDepth };
}
