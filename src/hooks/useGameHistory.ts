// src/hooks/useGameHistory.ts
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { Chess, DEFAULT_POSITION } from 'chess.js';

const DEBUG = true;

export interface GameHistory {
  fen: string;
  moveHistory: string[];
  currentIdx: number;
  canPlayMove: boolean;
  setIdx(this: void, idx: number): void;
  makeMove(this: void, from: string, to: string, promotion?: string): boolean;
  lastMove?: { from: string; to: string };
  reset(this: void): void;
}

export interface UseGameHistoryOpts {
  initialFEN?: string;
  initialMoves?: string[];
  startAtIdx?: number;
  allowBranching?: boolean;
}

export default function useGameHistory({
  initialFEN = DEFAULT_POSITION,
  initialMoves = [],
  startAtIdx = 0,
  allowBranching = false,
}: UseGameHistoryOpts): GameHistory {
  const chessRef = useRef(new Chess());

  // Helper: compare two string arrays for exact equality
  const arraysEqual = (a: string[], b: string[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  // 1) seed on mount
  const initHistory = () => {
    const c = chessRef.current;
    c.reset();
    c.load(initialFEN);
    initialMoves.forEach((san) => c.move(san));
    return initialMoves;
  };

  const [moveHistory, setHistory] = useState<string[]>(() => initHistory());
  const [currentIdx, setCurrentIdx] = useState<number>(() => startAtIdx);
  const [lastMove, setLastMove] = useState<{ from: string; to: string }>();

  // ── Keep a callback to replay a given index on demand ─────────────────────────
  const syncPosition = useCallback(
    (idx: number) => {
      const c = chessRef.current;
      c.reset();
      c.load(initialFEN);
      moveHistory.slice(0, idx).forEach((san) => c.move(san));
    },
    [initialFEN, moveHistory]
  );

  // ── Effect: whenever initialFEN, initialMoves, or startAtIdx changes, replay ─
  useEffect(() => {
    // 1) Update `moveHistory` only if it really differs from `initialMoves`
    setHistory((prevHistory) => {
      if (arraysEqual(prevHistory, initialMoves)) {
        return prevHistory;
      }
      return initialMoves;
    });

    // 2) Reset & replay up to `startAtIdx`
    const c = chessRef.current;
    c.reset();
    c.load(initialFEN);
    initialMoves.slice(0, startAtIdx).forEach((san) => c.move(san));

    // 3) Update `currentIdx` only if it's not already equal
    setCurrentIdx((prevIdx) => (prevIdx === startAtIdx ? prevIdx : startAtIdx));

    // 4) Compute `lastMove` based on the position reached at `startAtIdx`
    if (startAtIdx > 0 && initialMoves.length > 0) {
      const verboseHistory = c.history({ verbose: true });
      const last = verboseHistory[verboseHistory.length - 1];
      setLastMove((prev) => {
        // Only update if truly different
        if (prev?.from === last.from && prev?.to === last.to) {
          return prev;
        }
        return { from: last.from, to: last.to };
      });
    } else {
      // If at index 0, clear `lastMove` if it's not already undefined
      setLastMove((prev) => (prev ? undefined : prev));
    }
  }, [initialFEN, initialMoves, startAtIdx]);

  // ── Can we play a new move? ───────────────────────────────────────────────────
  const atTip = currentIdx === moveHistory.length;
  const canPlayMove = allowBranching ? true : atTip;

  // ── Manual stepping (back/forward in history) ─────────────────────────────────
  const setIdx = useCallback(
    (idx: number) => {
      const safe = Math.max(0, Math.min(idx, moveHistory.length));

      // Update the board position up to `safe`
      syncPosition(safe);
      // Update index only if it differs
      setCurrentIdx((prev) => (prev === safe ? prev : safe));

      // Update lastMove for the new index
      if (safe > 0) {
        const full = chessRef.current.history({ verbose: true });
        const last = full[full.length - 1];
        setLastMove((prev) => {
          if (prev?.from === last.from && prev?.to === last.to) {
            return prev;
          }
          return { from: last.from, to: last.to };
        });
      } else {
        setLastMove((prev) => (prev ? undefined : prev));
      }
    },
    [moveHistory.length, syncPosition]
  );

  // ── Playing a new move from the current position ─────────────────────────────
  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!canPlayMove) return false;
      const c = chessRef.current;

      // If branching is allowed and we're not at the tip, truncate history
      if (allowBranching && currentIdx < moveHistory.length) {
        setHistory((prev) => prev.slice(0, currentIdx));
      }

      const mv = c.move({ from, to, promotion: promotion?.toLowerCase() });
      if (!mv) {
        // Illegal move: restore to current index
        syncPosition(currentIdx);
        return false;
      }

      // Append the new SAN to history and advance index
      setHistory((prev) => [...prev.slice(0, currentIdx), mv.san]);
      setCurrentIdx((prev) => prev + 1);
      setLastMove({ from: mv.from, to: mv.to });
      return true;
    },
    [allowBranching, canPlayMove, currentIdx, moveHistory, syncPosition]
  );

  // ── Reset function: restore to initialFEN + initialMoves, index 0 ───────────
  const reset = useCallback(() => {
    const c = chessRef.current;
    c.reset();
    c.load(initialFEN);

    setHistory(initialMoves);
    setCurrentIdx(0);
    setLastMove(undefined);
  }, [initialFEN, initialMoves]);

  // ── Compute the current FEN string on each render ─────────────────────────────
  const fen = chessRef.current.fen();

  useEffect(() => {
    if (DEBUG) {
      console.log('[useGameHistory] Returning:', {
        fen,
        moveHistory,
        currentIdx,
        lastMove,
      });
    }
  }, [fen, moveHistory, currentIdx, lastMove]);

  return {
    fen,
    moveHistory,
    currentIdx,
    canPlayMove,
    setIdx,
    makeMove,
    lastMove,
    reset,
  };
}
