// src/hooks/useGameHistory.ts
import { Chess, DEFAULT_POSITION, Move } from 'chess.js';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface GameHistory {
  fen: string;
  moveHistory: string[];
  currentIdx: number;
  canPlayMove: boolean;
  setIdx(idx: number): void;
  makeMove(from: string, to: string, promotion?: string): boolean;
  lastMove?: { from: string; to: string };
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

  // ── Keep syncPosition for manual stepping ───────────────────────────
  const syncPosition = useCallback(
    (idx: number) => {
      const c = chessRef.current;
      c.reset();
      c.load(initialFEN);
      moveHistory.slice(0, idx).forEach((san) => c.move(san));
    },
    [initialFEN, moveHistory]
  );

  // ── Effect: replay up to startAtIdx on PGN or startIdx change ───────
  useEffect(() => {
    const c = chessRef.current;

    // a) update the history array
    setHistory(initialMoves);

    // b) reset & replay only up to startAtIdx
    c.reset();
    c.load(initialFEN);
    initialMoves.slice(0, startAtIdx).forEach((san) => c.move(san));
    setCurrentIdx(startAtIdx);

    // c) set lastMove based on that replay
    if (startAtIdx > 0 && initialMoves.length > 0) {
      const full = c.history({ verbose: true }) as Move[];
      const last = full[full.length - 1];
      setLastMove({ from: last.from, to: last.to });
    } else {
      setLastMove(undefined);
    }
  }, [
    initialFEN,
    initialMoves.join(','), // or JSON.stringify(initialMoves)
    startAtIdx,
  ]);

  // can we play a new move?
  const atTip = currentIdx === moveHistory.length;
  const canPlayMove = allowBranching ? true : atTip;

  // ── Manual stepping ─────────────────────────────────────────────────
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

  // ── Playing a new move ───────────────────────────────────────────────
  const makeMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (!canPlayMove) return false;
      const c = chessRef.current;

      // branch
      if (allowBranching && currentIdx < moveHistory.length) {
        setHistory(moveHistory.slice(0, currentIdx));
      }

      const mv = c.move({ from, to, promotion: promotion?.toLowerCase() });
      if (!mv) {
        syncPosition(currentIdx);
        return false;
      }

      const newHist = [...moveHistory.slice(0, currentIdx), mv.san];
      setHistory(newHist);
      setCurrentIdx(currentIdx + 1);
      setLastMove({ from: mv.from, to: mv.to });
      return true;
    },
    [allowBranching, canPlayMove, currentIdx, moveHistory, syncPosition]
  );

  // current FEN
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
