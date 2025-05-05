// src/hooks/useGameHistory.ts
import { useRef, useState, useCallback, useEffect } from 'react';
import { Chess, DEFAULT_POSITION } from 'chess.js';

export interface GameHistory {
  fen: string;
  moveHistory: string[];
  currentIdx: number;
  /** whether a new move can be played at the current index */
  canPlayMove: boolean;
  setIdx(idx: number): void;
  makeMove(from: string, to: string, promotion?: string): boolean;
}

export interface UseGameHistoryOpts {
  /** Optional custom start FEN */
  initialFEN?: string;
  /** Array of SAN moves to seed the history */
  initialMoves?: string[];
  /** Whether to land at the end of `initialMoves` on init */
  startAtEnd?: boolean;
  /** If false, new moves only allowed at the current tip (no branching) */
  allowBranching?: boolean;
}

function arrayEquals(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function useGameHistory({
  initialFEN = DEFAULT_POSITION,
  initialMoves = [],
  startAtEnd = true,
  allowBranching = false,
}: UseGameHistoryOpts): GameHistory {
  // 1) one chess instance
  const chessRef = useRef(new Chess());

  // 2) synchronous “first‐render” seed
  //    so fen is already after those SANs on mount
  const initHistory = () => {
    const c = chessRef.current;
    c.reset();
    c.load(initialFEN);
    initialMoves.forEach((san) => c.move(san));
    return initialMoves;
  };

  // runs once on mount, before render
  const [moveHistory, setHistory] = useState<string[]>(() => initHistory());
  const initIdx = startAtEnd ? initialMoves.length : 0;
  const [currentIdx, setCurrentIdx] = useState<number>(initIdx);

  // 3) respond to *changes* in initialMoves or initialFEN
  useEffect(() => {
    const c = chessRef.current;
    c.reset();
    c.load(initialFEN);
    initialMoves.forEach((san) => c.move(san));

    setHistory(initialMoves);
    setCurrentIdx(startAtEnd ? initialMoves.length : 0);
  }, [initialFEN, initialMoves.join(','), startAtEnd]);

  // helper to replay positions
  const syncPosition = useCallback(
    (idx: number) => {
      const chess = chessRef.current;
      chess.reset();
      chess.load(initialFEN);
      moveHistory.slice(0, idx).forEach((san) => chess.move(san));
    },
    [initialFEN, moveHistory]
  );

  // determine if new moves are permitted
  const atTip = currentIdx === moveHistory.length;
  const canPlayMove = allowBranching ? true : atTip;

  // step through moves
  const setIdx = useCallback(
    (idx: number) => {
      const safe = Math.max(0, Math.min(idx, moveHistory.length));
      syncPosition(safe);
      setCurrentIdx(safe);
    },
    [moveHistory.length, syncPosition]
  );

  // attempt a new move or variation
  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!canPlayMove) return false;

      const chess = chessRef.current;
      // truncate future moves only if branching is allowed
      if (allowBranching && currentIdx < moveHistory.length) {
        setHistory(moveHistory.slice(0, currentIdx));
      }

      const mv = chess.move({ from, to, promotion: promotion?.toLowerCase() });
      if (!mv) {
        syncPosition(currentIdx);
        return false;
      }

      const newHistory = [...moveHistory.slice(0, currentIdx), mv.san];
      setHistory(newHistory);
      setCurrentIdx(currentIdx + 1);
      return true;
    },
    [allowBranching, canPlayMove, currentIdx, moveHistory, syncPosition]
  );

  // 4) always report the current FEN
  const fen = chessRef.current.fen();
  return { fen, moveHistory, currentIdx, canPlayMove, setIdx, makeMove };
}
