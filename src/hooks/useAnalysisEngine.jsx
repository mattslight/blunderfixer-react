// src/hooks/useAnalysisEngine
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
  const [evalScore, setEvalScore] = useState(0);

  // 1) kick off engine + features + legal‐move list whenever FEN changes
  useEffect(() => {
    stopAnalysis();
    runAnalysis(boardFEN);

    extractFeatures(boardFEN)
      .then(setFeatures)
      .catch(() => setError('Features extraction failed'));

    const chess = new Chess(boardFEN);
    setLegalMoves(chess.moves());
  }, [boardFEN, runAnalysis, stopAnalysis]);

  // 2) arrows & moveSquares from bestMove
  const [arrows, setArrows] = useState([]);
  const [moveSquares, setMoveSquares] = useState({});
  useEffect(() => {
    // clear stale every time boardFEN or bestMove changes
    setArrows([]);
    setMoveSquares({});

    if (!bestMove || !lines[0]?.moves.length) return;

    try {
      const chess = new Chess(boardFEN);
      // try both strict SAN and sloppy just in case
      const mv =
        chess.move(bestMove, { sloppy: false }) ||
        chess.move(bestMove, { sloppy: true });
      if (!mv) throw new Error();
      setArrows([[mv.from, mv.to, 'rgba(34,197,94,0.9)']]);
      setMoveSquares({
        [mv.from]: { backgroundColor: 'rgba(255,255,0,0.5)' },
        [mv.to]: { backgroundColor: 'rgba(0,255,0,0.5)' },
      });
    } catch {
      // move wasn’t legal in this position (stale or bad SAN) → no arrows
    }
  }, [bestMove, lines, boardFEN]);

  // Normalize so + means White is better, – means Black is better
  useEffect(() => {
    const rawCp = lines[0]?.scoreCP;
    if (typeof rawCp === 'number') {
      // whose turn? if Black to move, flip it
      const turn = new Chess(boardFEN).turn(); // 'w' or 'b'
      setEvalScore(turn === 'b' ? -rawCp : rawCp);
    }
  }, [lines]); //eslint-disable-line

  return {
    lines,
    currentDepth,
    features,
    legalMoves,
    arrows,
    moveSquares,
    error,
    evalScore,
  };
}
