import { useEffect, useState } from 'react';

import { Chess } from 'chess.js';

import { extractFeatures } from '../api/analyse';

import useStockfish from './useStockfish';

export default function useAnalysisEngine(boardFEN) {
  const { lines, bestMove, currentDepth, runAnalysis, stopAnalysis } =
    useStockfish(26, 3);
  const [features, setFeatures] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    stopAnalysis();
    runAnalysis(boardFEN);

    extractFeatures(boardFEN)
      .then(setFeatures)
      .catch((e) => setError('Features failed'));

    const chess = new Chess(boardFEN);
    setLegalMoves(chess.moves());
  }, [boardFEN, runAnalysis, stopAnalysis]);

  // arrows & moveSquares from bestMove
  const [arrows, setArrows] = useState([]);
  const [moveSquares, setMoveSquares] = useState({});
  useEffect(() => {
    if (!bestMove) return setArrows([]), setMoveSquares({});
    const chess = new Chess(boardFEN);
    const mv = chess.move(bestMove);
    if (!mv) return setArrows([]), setMoveSquares({});
    setArrows([[mv.from, mv.to, 'rgba(34,197,94,0.9)']]);
    setMoveSquares({
      [mv.from]: { backgroundColor: 'rgba(255,255,0,0.5)' },
      [mv.to]: { backgroundColor: 'rgba(0,255,0,0.5)' },
    });
  }, [bestMove, boardFEN]);

  return {
    lines,
    currentDepth,
    features,
    legalMoves,
    arrows,
    moveSquares,
    error,
  };
}
