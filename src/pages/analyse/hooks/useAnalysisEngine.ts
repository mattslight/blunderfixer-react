// src/hooks/useAnalysisEngine.ts
import { uciToArrow, uciToMove } from '@/lib/uci';
import { Chess } from 'chess.js';
import { useEffect, useMemo, useState } from 'react';
import { useStockfish } from './useStockfish';

const DEBUG = false;
export default function useAnalysisEngine(boardFEN: string) {
  useEffect(() => {
    DEBUG && console.log('[useAnalysisEngine] called with fen', boardFEN);

    // skip if fen hasn't changed or still analyzing the same one
    // run your Stockfish logic here
  }, [boardFEN]); // ✅ only re-run when FEN changes

  const {
    lines: rawLines,
    bestMoveUCI,
    currentDepth,
  } = useStockfish(boardFEN, 40, 3);
  const [evalScore, setEvalScore] = useState(0);

  // normalize evalScore
  useEffect(() => {
    const first = rawLines[0];
    if (first && typeof first.scoreCP === 'number') {
      const turn = new Chess(boardFEN).turn();
      setEvalScore(turn === 'b' ? -first.scoreCP : first.scoreCP);
    }
  }, [rawLines, boardFEN]);

  // normalise the entire PV list
  const lines = useMemo(() => {
    const turnIsBlack = new Chess(boardFEN).turn() === 'b';
    return rawLines.map((l) => {
      const clone = { ...l };
      if (typeof clone.scoreCP === 'number') {
        clone.scoreCP = turnIsBlack ? -clone.scoreCP : clone.scoreCP;
      }
      if (typeof clone.mateIn === 'number') {
        clone.mateIn = turnIsBlack ? -clone.mateIn : clone.mateIn;
      }
      return clone;
    });
  }, [rawLines, boardFEN]);

  // **NEW**: memoise legalMoves as SAN strings
  const legalMoves = useMemo<string[]>(() => {
    const chess = new Chess(boardFEN);
    // chess.moves() returns an array of SANs by default
    return chess.moves();
  }, [boardFEN]);

  return {
    lines,
    currentDepth,
    evalScore,
    bestMove: uciToMove(bestMoveUCI), // Move object { from: 'e2', to: 'e4'}
    bestMoveArrow: uciToArrow(bestMoveUCI), // tuple ['e2','e4', 'green']
    bestMoveUCI, // UCI string e2e4
    legalMoves,
  };
}
