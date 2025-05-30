// src/hooks/useMoveInput.ts
import { useState } from 'react';
import { Chess, Square } from 'chess.js';

const DEBUG = false;

/**
 * @param {string} boardFEN      – current FEN from useGameHistory().fen
 * @param {(from: string, to: string, promotion?: string) => boolean} makeMove
 *                                – the new hook’s function
 */

export interface MoveInput {
  from: string | null;
  to: string | null;
  showPromotionDialog: boolean;
  optionSquares: Record<string, { background: string }>;
  onSquareClick(this: void, square: string): void;
  onPieceDrop(this: void, from: string, to: string): boolean;
  onPromotionPieceSelect(this: void, choice: string): boolean;
}

export default function useMoveInput(
  boardFEN: string,
  makeMove: (from: string, to: string, promotion?: string) => boolean
): MoveInput {
  const [from, setFrom] = useState<string | null>(null);
  const [to, setTo] = useState<string | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [options, setOptions] = useState({});

  function getMoveOptions(square: Square) {
    const chess = new Chess(boardFEN);
    const moves = chess.moves({ square, verbose: true });
    if (!moves.length) {
      setOptions({});
      return false;
    }
    const opts = {};
    moves.forEach((m) => {
      opts[m.to] = {
        background: chess.get(m.to)
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
      };
    });
    opts[square] = { background: 'rgba(255,255,0,0.4)' };
    setOptions(opts);
    return true;
  }

  function onSquareClick(square: Square) {
    // Clear any old highlights
    if (DEBUG) console.log('[useMoveInput]', 'onSquareClick fired!');
    setOptions({});

    // 1) pick up a piece
    if (!from) {
      if (getMoveOptions(square)) setFrom(square);
      return;
    }

    // 2) try to drop it on another square
    const chess = new Chess(boardFEN);
    const verbose = chess.moves({ verbose: true });
    const found = verbose.find((m) => m.from === from && m.to === square);

    // illegal → either restart from this new square or cancel
    if (!found) {
      if (getMoveOptions(square)) {
        setFrom(square);
      } else {
        setFrom(null);
      }
      return;
    }

    // 3) promotion needed?
    if (
      found.piece === 'p' &&
      ((found.color === 'w' && square[1] === '8') ||
        (found.color === 'b' && square[1] === '1'))
    ) {
      setTo(square);
      setShowPromotionDialog(true);
      return;
    }

    // 4) normal move → hand off to history
    makeMove(from, square);
    setFrom(null);
    setTo(null);
  }

  function onPieceDrop(fromSq: string, toSq: string) {
    const chess = new Chess(boardFEN);
    const match = chess
      .moves({ verbose: true })
      .find((m) => m.from === fromSq && m.to === toSq);
    if (!match) return false;
    if (match.promotion) {
      // open the built-in dialog
      setFrom(fromSq);
      setTo(toSq);
      setShowPromotionDialog(true);
      return false; // tell the board “we’re handling it”
    }
    return makeMove(fromSq, toSq, match.promotion);
  }

  function onPromotionPieceSelect(choice: string): boolean {
    const promotion = choice.charAt(1).toLowerCase();
    if (from && to) {
      makeMove(from, to, promotion);
    }
    setFrom(null);
    setTo(null);
    setShowPromotionDialog(false);
    return true;
  }

  return {
    from,
    to,
    showPromotionDialog,
    optionSquares: options,
    onSquareClick,
    onPieceDrop,
    onPromotionPieceSelect,
  };
}
