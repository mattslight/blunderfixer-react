// src/hooks/useMoveHistory.jsx

import { useCallback, useEffect, useState } from 'react';
import { Chess } from 'chess.js';

export default function useMoveHistory(initialFEN, initialHistory) {
  const [fens, setFens] = useState([initialFEN]);
  const [history, setHistory] = useState(initialHistory);
  const [currentIdx, setIdx] = useState(0);

  const boardFEN = fens[currentIdx];

  const applyMove = useCallback(
    (from, to, promotion) => {
      const chess = new Chess(initialFEN);
      history.slice(0, currentIdx).forEach((san) => chess.move(san));
      const mv = chess.move({ from, to, ...(promotion && { promotion }) });
      if (!mv) return false;
      const newHistory = [...history.slice(0, currentIdx), mv.san];
      const newFens = [...fens.slice(0, currentIdx + 1), chess.fen()];
      setHistory(newHistory);
      setFens(newFens);
      setIdx(currentIdx + 1);
      return true;
    },
    [initialFEN, history, fens, currentIdx]
  );

  // reset initialHistory
  useEffect(() => {
    setHistory(initialHistory);
    setFens([initialFEN]);
    setIdx(0);
  }, [initialFEN, initialHistory]);

  return { boardFEN, history, currentIdx, setIdx, applyMove };
}
