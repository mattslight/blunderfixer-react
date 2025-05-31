// src/pages/analyse/hooks/useStockfish.ts
import { useEffect, useMemo, useRef, useState } from 'react';

import { StockfishEngine } from '@/lib/StockfishEngine';
import { makeEmptyLines, parseUciInfo } from '@/lib/uci';
import { PVLine } from '@/types';

const DEBUG = false;

export function useStockfish(
  fen: string,
  depth = 12,
  multiPV = 3
): { lines: PVLine[]; bestMoveUCI?: string; currentDepth: number } {
  // 1) Create one StockfishEngine instance per `multiPV`
  const engine = useMemo(() => new StockfishEngine(multiPV), [multiPV]);

  // 2) Prepare initial state
  const emptyLines = useMemo(() => makeEmptyLines(multiPV), [multiPV]);
  const [lines, setLines] = useState<PVLine[]>(emptyLines);
  const [bestMoveUCI, setBestUCI] = useState<string | undefined>(undefined);
  const [currentDepth, setD] = useState(0);

  // 3) A counter so we ignore stale subscriptions
  const runId = useRef(0);

  // ─────────────────────────────────────────────────────────────────────────────
  // Revised useEffect, top→bottom:
  useEffect(() => {
    if (!fen) return; // nothing to do if fen is empty

    // bump generation so old subscriptions know they are stale
    runId.current += 1;
    const myRun = runId.current;

    if (DEBUG) {
      console.log(
        `[useStockfish] ANALYZE #${myRun} → FEN=${fen} depth=${depth}`
      );
    }

    // Reset UI state when a brand‐new search begins
    setLines(emptyLines);
    setBestUCI(undefined);
    setD(0);

    // Tell Stockfish to start analyzing at `depth`
    if (DEBUG) console.log('[useStockfish] ▶ FIRE analyze →', fen, depth);
    engine.analyze(fen, depth);

    // Subscribe to the engine's UCI “info” stream
    const sub = engine.lines$.subscribe({
      next(raw) {
        // If a newer run has started, drop this message
        if (myRun !== runId.current) return;

        if (DEBUG) console.log('[useStockfish] RAW engine line →', raw);

        try {
          const info = parseUciInfo(raw, fen);
          if (DEBUG) console.log('[useStockfish] PARSED info →', info);
          if (!info) return;

          // ── 1) Merge into `lines` state, only if this depth truly improves:
          setLines((old) => {
            const idx = info.rank - 1;
            const oldDepth = old[idx]?.depth || 0;

            // If the new info.depth is not strictly greater, do nothing:
            if (info.depth <= oldDepth) {
              return old;
            }

            // Otherwise, copy the array and update:
            const next = [...old];
            next[idx] = info;
            return next;
          });

          // ── 2) Update best‐move (PV rank=1) only if it truly changed:
          if (info.rank === 1) {
            // Extract the UCI list from the raw string
            const m = raw.match(/pv\s+((?:[a-h][1-8][a-h][1-8][nbrq]?\s*)+)/i);
            if (m) {
              const uciList = m[1].trim().split(/\s+/);
              const candidate = uciList[0];

              setBestUCI((prev) => {
                // If the new best move is identical to prev, bail out:
                if (prev === candidate) {
                  return prev;
                }
                return candidate;
              });
            }
          }

          // ── 3) Track highest depth, but only if it strictly increases:
          setD((prev) => {
            return info.depth > prev ? info.depth : prev;
          });
        } catch (err) {
          console.error('[useStockfish] unexpected stream error:', err);
        }
      },
    });

    // Cleanup: unsubscribe and cancel Stockfish search
    return () => {
      sub.unsubscribe();
      engine.stop();
    };
  }, [fen, depth, engine, emptyLines]);
  // ─────────────────────────────────────────────────────────────────────────────

  return { lines, bestMoveUCI, currentDepth };
}
