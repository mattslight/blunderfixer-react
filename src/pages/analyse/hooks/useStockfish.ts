// src/hooks/useStockfish.ts
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
  // 1) create one engine per-hook keyed on multiPV
  const engine = useMemo(() => new StockfishEngine(multiPV), [multiPV]);

  // 2) local state
  const emptyLines = useMemo(() => makeEmptyLines(multiPV), [multiPV]);
  const [lines, setLines] = useState<PVLine[]>(emptyLines);
  const [bestMoveUCI, setBestUCI] = useState<string>();
  const [currentDepth, setD] = useState(0);

  // 3) a counter to drop stale searches
  const runId = useRef(0);

  useEffect(() => {
    if (!fen) return;

    // bump generation
    runId.current += 1;
    const myRun = runId.current;

    DEBUG &&
      console.log(
        `[useStockfish] ANALYZE #${myRun} → FEN=${fen} depth=${depth}`
      );

    // reset UI
    setLines(emptyLines);
    setBestUCI(undefined);
    setD(0);

    // start the engine
    DEBUG && console.log('[useStockfish] FIRE analyze →', fen, depth);
    engine.analyze(fen, depth);

    // subscribe to raw output
    const sub = engine.lines$.subscribe({
      next(raw) {
        // drop stale messages
        if (myRun !== runId.current) return;

        DEBUG && console.log('[useStockfish] RAW engine line →', raw);

        try {
          const info = parseUciInfo(raw, fen);
          DEBUG && console.log('[useStockfish] PARSED info →', info);
          if (!info) return;

          // merge into state
          setLines((old) => {
            const next = [...old];
            const idx = info.rank - 1;
            if (info.depth >= (next[idx]?.depth || 0)) {
              next[idx] = info;
            }
            return next;
          });

          // first PV → bestMove
          if (info.rank === 1) {
            // 1) pull the "pv …" chunk out of the raw string
            const m = raw.match(/pv\s+((?:[a-h][1-8][a-h][1-8][nbrq]?\s*)+)/i);
            if (m) {
              const uciList = m[1].trim().split(/\s+/);
              // always overwrite so you get the deepest recommendation
              setBestUCI(uciList[0]);
            }
          }

          // track highest depth
          setD((d) => Math.max(d, info.depth));
        } catch (err) {
          console.error('[useStockfish] unexpected stream error:', err);
        }
      },
    });

    return () => {
      // cleanup subscription + cancel search
      sub.unsubscribe();
      engine.stop();
    };
  }, [fen, depth, engine, emptyLines]);

  return { lines, bestMoveUCI, currentDepth };
}
