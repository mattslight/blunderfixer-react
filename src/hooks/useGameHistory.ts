// src/hooks/useGameHistory.ts
import { useRef, useState, useCallback } from 'react';
import { Chess, DEFAULT_POSITION } from 'chess.js';

export interface GameHistory {
  /** current FEN to feed into <Chessboard position={fen} /> */
  fen: string;
  /** full array of SAN moves so far */
  moveHistory: string[];
  /** index into `moveHistory` for stepping (0 = startpos) */
  currentIdx: number;
  /** set to step through existing moves */
  setIdx(idx: number): void;
  /** attempt to make a new move from /to; returns true if legal */
  makeMove(from: string, to: string, promotion?: string): boolean;
}

export default function useGameHistory(
  initialFEN = DEFAULT_POSITION
): GameHistory {
  const chessRef = useRef(new Chess(initialFEN));
  const [moveHistory, setHistory] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // always keep the engine position in sync with currentIdx
  const syncPosition = useCallback(
    (idx: number) => {
      const chess = chessRef.current;
      chess.reset();
      chess.load(initialFEN);
      moveHistory.slice(0, idx).forEach((san) => chess.move(san));
    },
    [initialFEN, moveHistory]
  );

  // stepping
  const setIdx = useCallback(
    (idx: number) => {
      const safe = Math.max(0, Math.min(idx, moveHistory.length));
      syncPosition(safe);
      setCurrentIdx(safe);
    },
    [moveHistory.length, syncPosition]
  );

  // make a new move (drag-drop or click)
  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      const chess = chessRef.current;

      // if we're not at the tip, truncate future moves (branch)
      if (currentIdx < moveHistory.length) {
        setHistory(moveHistory.slice(0, currentIdx));
      }

      // attempt move
      const move = chess.move({
        from,
        to,
        promotion: promotion?.toLowerCase(),
      });
      if (!move) {
        // illegal
        syncPosition(currentIdx);
        return false;
      }

      // record and advance
      const newHistory = [...moveHistory.slice(0, currentIdx), move.san];
      setHistory(newHistory);
      setCurrentIdx(currentIdx + 1);
      return true;
    },
    [currentIdx, moveHistory, syncPosition]
  );

  // current FEN
  const fen = chessRef.current.fen();

  return { fen, moveHistory, currentIdx, setIdx, makeMove };
}
