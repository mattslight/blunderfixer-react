// src/hooks/useAnalysisEngine.ts
import { useEffect, useMemo, useState } from 'react';
import { Chess, PieceSymbol, Square } from 'chess.js';

import { useStockfish } from '@/hooks/useStockfish';
import { uciToArrow, uciToMove } from '@/lib/uci';

const DEBUG = false;
interface UseAnalysisResult {
  /** Full PV lines (rank-sorted), for display if needed. */
  lines: {
    rank: number;
    depth: number;
    scoreCP?: number;
    mateIn?: number;
    moves: string[];
  }[];
  /** Best move in SAN (e.g. “e4” or “Nf3”). */
  bestMove?: string;
  /** Drawing an arrow on the board (from-to) for bestMoveUCI. */
  bestMoveArrow?: [Square, Square, string];
  /** Best move in UCI (e.g. “e2e4”). */
  bestMoveUCI?: string;
  /** “+” = White is better, “−” = Black is better once depth ≥ target. */
  evalScore: number;
  /** All legal destination squares (e.g. [“e4”, “d4”, …]) if you want move hints. */
  legalMoves: string[];
  /** The deepest search depth we’ve seen so far. */
  currentDepth: number;
}

export default function useAnalysisEngine(
  boardFEN: string,
  enabled = true,
  multiPV = 5,
  targetDepth = 18
): UseAnalysisResult {
  // 1) Pull raw PV lines and bestMoveUCI from Stockfish
  const {
    lines: rawLines,
    bestMoveUCI,
    currentDepth,
  } = useStockfish(boardFEN, targetDepth, multiPV, enabled);

  // 2) evalScore updates once we reach TARGET_DEPTH on rank=1.
  //    If scoreCP is available, use it directly. If mateIn is reported (checkmate found),
  //    convert to ±10000: +10000 if White is winning, -10000 if Black is winning.
  const [evalScore, setEvalScore] = useState(0);

  // log currentDepth and rawLines for debugging
  useEffect(() => {
    if (rawLines.length > 0) {
      if (DEBUG)
        console.log(
          `Current Depth: ${currentDepth}, Raw Lines: ${JSON.stringify(rawLines)}`
        );
    } else {
      if (DEBUG)
        console.log(`Current Depth: ${currentDepth}, No raw lines available.`);
    }
  }, [currentDepth, rawLines]);

  useEffect(() => {
    if (!enabled) return;
    const bestLine = rawLines[0];
    if (!bestLine) return;
    if (bestLine.depth < 12) return; // Not deep enough yet

    if (typeof bestLine.scoreCP === 'number') {
      setEvalScore(bestLine.scoreCP);
    } else if (typeof bestLine.mateIn === 'number') {
      setEvalScore(10000 * Math.sign(bestLine.mateIn));
    }
  }, [rawLines, currentDepth, enabled]);

  // 3) Convert bestMoveUCI → SAN, catching illegal‐move errors
  const bestMoveSAN = useMemo(() => {
    if (!bestMoveUCI) return undefined;

    // a) Extract { from, to, promotion }
    const { from, to, promotion } = uciToMove(bestMoveUCI);
    if (!from || !to) return undefined;

    // b) Attempt to apply the move on a fresh Chess(boardFEN)
    const chess = new Chess(boardFEN);
    try {
      const moveObj: {
        from: string;
        to: string;
        promotion?: PieceSymbol;
      } = {
        from,
        to,
      };
      if (promotion) moveObj.promotion = promotion;

      const moveResult = chess.move(moveObj);
      return moveResult?.san; // undefined if illegal
    } catch {
      return undefined;
    }
  }, [bestMoveUCI, boardFEN]);

  const bestMoveArrow = useMemo(() => {
    if (!bestMoveUCI) return undefined;
    return uciToArrow(bestMoveUCI);
  }, [bestMoveUCI]);

  // 4) Compute legalMoves (once per FEN)
  const legalMoves = useMemo(() => {
    const chess = new Chess(boardFEN);
    return chess.moves();
  }, [boardFEN]);

  return {
    lines: rawLines,
    bestMove: bestMoveSAN,
    bestMoveArrow,
    bestMoveUCI,
    evalScore,
    legalMoves,
    currentDepth,
  };
}
