// src/hooks/useAnalysisEngine.ts
import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { useStockfish } from './useStockfish';
import { uciToMove, uciToArrow } from '@/lib/uci';

export default function useAnalysisEngine(boardFEN: string) {
  const {
    lines: rawLines,
    bestMoveUCI,
    currentDepth,
  } = useStockfish(boardFEN, 8, 3);
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
