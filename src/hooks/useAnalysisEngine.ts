// src/hooks/useAnalysisEngine.ts
import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { useStockfish } from './useStockfish';

export default function useAnalysisEngine(boardFEN: string) {
  const {
    lines: rawLines,
    bestMove,
    currentDepth,
  } = useStockfish(boardFEN, 8, 3);
  const [evalScore, setEvalScore] = useState(0);
  const [arrows, setArrows] = useState([]);

  // normalize evalScore as before
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

  // memoise legalMoves & arrows effect (unchanged) …
  // return `lines` instead of `rawLines`

  return { lines, currentDepth, arrows, evalScore, bestMove };
}
