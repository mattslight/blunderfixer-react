// src/hooks/useStockfish.ts
import { useEffect, useState, useRef, useMemo } from 'react';
import { StockfishEngine } from '../lib/StockfishEngine';
import { parseUciInfo, PVLine, makeEmptyLines } from '../lib/uci';

const DEBUG = true;

export function useStockfish(
  fen: string,
  depth = 12,
  multiPV = 3
): { lines: PVLine[]; bestMove?: string; currentDepth: number } {
  // 1) create one engine per-hook keyed on multiPV
  const engine = useMemo(() => new StockfishEngine(multiPV), [multiPV]);

  // 2) local state
  const emptyLines = useMemo(() => makeEmptyLines(multiPV), [multiPV]);
  const [lines, setLines] = useState<PVLine[]>(emptyLines);
  const [bestMove, setBestMove] = useState<string>();
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
    setBestMove(undefined);
    setD(0);

    // start the engine
    engine.analyze(fen, depth);

    // subscribe to raw output
    const sub = engine.lines$.subscribe({
      next(raw) {
        // drop stale messages
        if (myRun !== runId.current) return;

        // log the moment we see our first “info depth”
        if (raw.startsWith('info depth ')) {
          console.log(`[useStockfish] ⬅ first depth #${myRun}:`, raw);
        }

        try {
          DEBUG && console.log(`[useStockfish] RAW #${myRun}:`, raw);
          const info = parseUciInfo(raw, fen);
          DEBUG && console.log(`[useStockfish] PARSED #${myRun}:`, info);
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
          if (!bestMove && info.rank === 1) {
            setBestMove(info.moves[0]);
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

  return { lines, bestMove, currentDepth };
}
