// src/hooks/useGameHistory.ts
import { Chess, DEFAULT_POSITION, Move } from 'chess.js';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface GameHistory {
  fen: string;
  moveHistory: string[];
  currentIdx: number;
  /** whether a new move can be played at the current index */
  canPlayMove: boolean;
  setIdx(idx: number): void;
  makeMove(from: string, to: string, promotion?: string): boolean;
  lastMove?: { from: string; to: string };
}

export interface UseGameHistoryOpts {
  /** Optional custom start FEN */
  initialFEN?: string;
  /** Array of SAN moves to seed the history */
  initialMoves?: string[];
  /** Which move index to start at (defaults to 0) */
  startAtIdx?: number;
  /** If false, new moves only allowed at the current tip (no branching) */
  allowBranching?: boolean;
}

export default function useGameHistory({
  initialFEN = DEFAULT_POSITION,
  initialMoves = [],
  startAtIdx = 0,
  allowBranching = false,
}: UseGameHistoryOpts): GameHistory {
  // 1) one chess instance
  const chessRef = useRef(new Chess());

  // 2) synchronous “first‐render” seed
  const initHistory = () => {
    const c = chessRef.current;
    c.reset();
    c.load(initialFEN);
    initialMoves.forEach((san) => c.move(san));
    return initialMoves;
  };

  // runs once on mount
  const [moveHistory, setHistory] = useState<string[]>(() => initHistory());
  const [currentIdx, setCurrentIdx] = useState<number>(() => startAtIdx);
  const [lastMove, setLastMove] = useState<{ from: string; to: string }>();

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

  // 3) respond to changes in initialMoves or initialFEN or startAtIdx
  useEffect(() => {
    // 1) stash the new full history
    setHistory(initialMoves);

    // 2) replay only up to startAtIdx
    syncPosition(startAtIdx);
    setCurrentIdx(startAtIdx);

    // 3) record what that last move was
    if (startAtIdx > 0 && initialMoves.length > 0) {
      const full = chessRef.current.history({ verbose: true }) as Move[];
      const last = full[full.length - 1];
      setLastMove({ from: last.from, to: last.to });
    } else {
      setLastMove(undefined);
    }
  }, [initialFEN, initialMoves.join(','), startAtIdx, syncPosition]);

  // determine if new moves are permitted
  const atTip = currentIdx === moveHistory.length;
  const canPlayMove = allowBranching ? true : atTip;

  // step through moves
  const setIdx = useCallback(
    (idx: number) => {
      const safe = Math.max(0, Math.min(idx, moveHistory.length));
      syncPosition(safe);
      setCurrentIdx(safe);
      if (safe > 0) {
        const full = chessRef.current.history({ verbose: true }) as Move[];
        const last = full[full.length - 1];
        setLastMove({ from: last.from, to: last.to });
      } else {
        setLastMove(undefined);
      }
    },
    [moveHistory.length, syncPosition]
  );

  // attempt a new move or variation
  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!canPlayMove) return false;

      const chess = chessRef.current;
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
      setLastMove({ from: mv.from, to: mv.to });

      return true;
    },
    [allowBranching, canPlayMove, currentIdx, moveHistory, syncPosition]
  );

  // 4) always report the current FEN
  const fen = chessRef.current.fen();

  return {
    fen,
    moveHistory,
    currentIdx,
    canPlayMove,
    setIdx,
    makeMove,
    lastMove,
  };
}
