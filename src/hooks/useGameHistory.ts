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
  const chessRef = useRef(new Chess());

  const [moveHistory, setHistory] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

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

  // track last inputs to avoid unnecessary resets
  const prevRef = useRef<UseGameHistoryOpts | null>(null);
  useEffect(() => {
    const prev = prevRef.current;
    const movesChanged =
      !prev || !arrayEquals(prev.initialMoves!, initialMoves);
    const fenChanged = !prev || prev.initialFEN !== initialFEN;
    const startChanged = !prev || prev.startAtEnd !== startAtEnd;

    if (movesChanged || fenChanged || startChanged) {
      const chess = chessRef.current;
      chess.reset();
      chess.load(initialFEN);

      const targetIdx = startAtEnd ? initialMoves.length : 0;
      initialMoves.slice(0, targetIdx).forEach((san) => chess.move(san));

      setHistory(initialMoves);
      setCurrentIdx(targetIdx);
      prevRef.current = {
        initialFEN,
        initialMoves,
        startAtEnd,
        allowBranching,
      };
    }
  }, [initialFEN, initialMoves, startAtEnd]);

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

  const fen = chessRef.current.fen();
  return { fen, moveHistory, currentIdx, canPlayMove, setIdx, makeMove };
}
