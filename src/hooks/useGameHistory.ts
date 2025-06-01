// src/hooks/useGameHistory.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess, DEFAULT_POSITION } from 'chess.js';

const DEBUG = false;

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

  /**
   * Whenever `resetKey` changes, the hook re­initializes to
   * `initialFEN` + `initialMoves`.
   **/
  resetKey?: any;
}

export default function useGameHistory({
  initialFEN = DEFAULT_POSITION,
  initialMoves = [],
  startAtIdx = 0,
  allowBranching = false,
  resetKey, // ← New prop
}: UseGameHistoryOpts): GameHistory {
  const chessRef = useRef(new Chess());

  // Helper: compare two string arrays for exact equality
  const arraysEqual = (a: string[], b: string[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  // ── Step 1: seed on mount OR when resetKey changes ─────────────────────────────
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

  // ── Sync to a given index ──────────────────────────────────────────────────────
  const syncPosition = useCallback(
    (idx: number) => {
      const c = chessRef.current;
      c.reset();
      c.load(initialFEN);
      moveHistory.slice(0, idx).forEach((san) => c.move(san));
    },
    [initialFEN, moveHistory]
  );

  // ── Step 2: only re­initialize when resetKey changes ────────────────────────────
  useEffect(() => {
    // Update moveHistory only if it truly differs
    setHistory((prev) => {
      if (arraysEqual(prev, initialMoves)) return prev;
      return initialMoves;
    });

    // Reset board to initialFEN + play up to startAtIdx
    const c = chessRef.current;
    c.reset();
    c.load(initialFEN);
    initialMoves.slice(0, startAtIdx).forEach((san) => c.move(san));

    // Update currentIdx
    setCurrentIdx((prev) => (prev === startAtIdx ? prev : startAtIdx));

    // Compute lastMove for the new position at startAtIdx
    if (startAtIdx > 0 && initialMoves.length > 0) {
      const verbose = c.history({ verbose: true });
      const last = verbose[verbose.length - 1];
      setLastMove((prev) =>
        prev?.from === last.from && prev?.to === last.to
          ? prev
          : { from: last.from, to: last.to }
      );
    } else {
      setLastMove((prev) => (prev ? undefined : prev));
    }
    // ── Depend only on resetKey, NOT on initialFEN or initialMoves ──
  }, [resetKey]);

  // ── Can we play a new move? ───────────────────────────────────────────────────
  const atTip = currentIdx === moveHistory.length;
  const canPlayMove = allowBranching ? true : atTip;

  // ── Manual stepping (back/forward in history) ─────────────────────────────────
  const setIdx = useCallback(
    (idx: number) => {
      const safe = Math.max(0, Math.min(idx, moveHistory.length));
      syncPosition(safe);
      setCurrentIdx((prev) => (prev === safe ? prev : safe));

      if (safe > 0) {
        const full = chessRef.current.history({ verbose: true });
        const last = full[full.length - 1];
        setLastMove((prev) =>
          prev?.from === last.from && prev?.to === last.to
            ? prev
            : { from: last.from, to: last.to }
        );
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

      if (allowBranching && currentIdx < moveHistory.length) {
        setHistory((prev) => prev.slice(0, currentIdx));
      }

      const mv = c.move({ from, to, promotion: promotion?.toLowerCase() });
      if (!mv) {
        syncPosition(currentIdx);
        return false;
      }

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
