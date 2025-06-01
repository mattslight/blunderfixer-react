// src/hooks/useAnalysisEngine.ts
import { useEffect, useMemo, useState } from 'react';
import { Chess, PieceSymbol, Square } from 'chess.js';

import { useStockfish } from '@/hooks/useStockfish';
import { uciToArrow, uciToMove } from '@/lib/uci';

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

const TARGET_DEPTH = 18;
const MULTI_PV = 5;

export default function useAnalysisEngine(
  boardFEN: string,
  enabled = true
): UseAnalysisResult {
  // 1) Pull raw PV lines and bestMoveUCI from Stockfish
  const {
    lines: rawLines,
    bestMoveUCI,
    currentDepth,
  } = useStockfish(boardFEN, TARGET_DEPTH, MULTI_PV, enabled);

  // 2) evalScore only updates once we reach TARGET_DEPTH on rank=1
  const [evalScore, setEvalScore] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const bestLine = rawLines[0];
    if (bestLine && typeof bestLine.scoreCP === 'number') {
      setEvalScore(bestLine.scoreCP);
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
