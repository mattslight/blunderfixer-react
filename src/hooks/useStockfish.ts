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
 * Now waits for the initial “readyok” handshake before ever triggering an analysis.
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
  // 1) Create one StockfishEngine instance per multiPV (persisted across re-renders)
  const engine = useMemo(() => new StockfishEngine(multiPV), [multiPV]);

  // 2) Precompute an “empty” lines array for initial/reset state
  const emptyLines = useMemo(() => makeEmptyLines(multiPV), [multiPV]);

  // 3) Local state for PV info, best‐move UCI string, and deepest depth seen
  const [lines, setLines] = useState<PVLine[]>(emptyLines);
  const [bestMoveUCI, setBestUCI] = useState<string>();
  const [currentDepth, setDepthState] = useState(0);

  // 4) We track a runId/ref so that if `fen` changes quickly, old output is thrown away
  const runId = useRef(0);

  // 5) We also track whether the engine has finished its initial handshake.
  //    If it hasn’t, we delay any analysis until after “init()” resolves.
  const [isInitialized, setIsInitialized] = useState(false);

  // 6) One‐time effect: call engine.init() to wait for the first “readyok”
  //    Once that completes, we mark isInitialized = true. If init() fails, we could
  //    surface an error, but here we simply log it.
  useEffect(() => {
    let didCancel = false;

    (async () => {
      try {
        if (engine) {
          // Wait for the very first “readyok” (UCI handshake complete)
          await engine.init();
          if (!didCancel) {
            setIsInitialized(true);
          }
        }
      } catch (e) {
        console.error('[useStockfish] engine.init() failed:', e);
        // We could set an “error” state here if desired.
      }
    })();

    return () => {
      didCancel = true;
      // When the engine instance is replaced or the component unmounts,
      // ensure any ongoing search is halted and the worker is terminated.
      engine.stop();
      engine.quit();
    };
  }, [engine]);

  // 7) Main effect: whenever `fen`, `depth`, `engine`, `emptyLines`, or `enabled` changes,
  //    we either reset state (if disabled) or issue a fresh analysis.
  useEffect(() => {
    // If the hook is disabled or there’s no FEN, clear state & do nothing
    if (!enabled || !fen) {
      setLines(emptyLines);
      setBestUCI(undefined);
      setDepthState(0);
      return;
    }

    // If the engine hasn’t finished its initial init() handshake yet, wait until it does
    if (!isInitialized) {
      // We can bail out early. The next time `isInitialized` flips to true,
      // this effect will re-run with the same fen/depth and trigger analyze().
      return;
    }

    // Otherwise, proceed with a fresh analysis run:
    runId.current += 1;
    const myRun = runId.current;

    // Immediately reset our displayed lines and bestMoveUCI
    setLines(emptyLines);
    setBestUCI(undefined);
    setDepthState(0);

    let sub: Subscription | null = null;
    let canceled = false;

    (async () => {
      try {
        // 1) Kick off the “analyze(fen, depth)” call,
        //    which internally does:
        //       send('stop'); await waitReady();
        //       send('ucinewgame'); send(`position fen …`); await waitReady();
        //       send(`go depth ${depth}`);
        await engine.analyze(fen, depth);

        // If the effect has been torn down in the meantime, bail out.
        if (canceled) return;

        // 2) Subscribe to engine.lines$. Now that the engine is ready to analyze,
        //    it will emit “info depth … pv …” lines, followed by “bestmove …”.
        sub = engine.lines$.subscribe((raw) => {
          if (myRun !== runId.current) {
            // Old run; ignore.
            return;
          }

          // Try to parse it into a PVLine. If parseUciInfo returns null, ignore.
          let info: PVLine | null;
          try {
            info = parseUciInfo(raw, fen);
          } catch {
            return;
          }
          if (!info) return;

          // 3) Merge into the `lines` array if this PV line’s depth is newer
          setLines((old) => {
            const idx = info.rank - 1; // 0-based indexing
            const oldDepth = old[idx]?.depth || 0;
            if (info.depth <= oldDepth) {
              return old;
            }
            const next = [...old];
            next[idx] = info;
            return next;
          });

          // 4) If this is rank=1, extract the first move from “pv …”
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

          // 5) Always track the maximum depth seen so far
          setDepthState((prev) => (info.depth > prev ? info.depth : prev));
        });
      } catch (e) {
        console.error('[useStockfish] analyze() error:', e);
      }
    })();

    // Cleanup: unsubscribe & cancel if fen/depth changes or component unmounts.
    return () => {
      canceled = true;
      if (sub) sub.unsubscribe();
      // Tell Stockfish to stop the current search
      engine.stop();
    };
  }, [fen, depth, engine, emptyLines, enabled, isInitialized]);

  return { lines, bestMoveUCI, currentDepth: currentDepth };
}
