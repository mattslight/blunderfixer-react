// src/hooks/useMoveInput.ts
import { useState } from 'react';
import { Chess, Square } from 'chess.js';

const DEBUG = false;

/**
 * @param boardFEN      – current FEN string from useGameHistory().fen
 * @param makeMove      – (from, to, promotion?) => boolean, provided by useGameHistory
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
  const [fromSq, setFromSq] = useState<string | null>(null);
  const [toSq, setToSq] = useState<string | null>(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [options, setOptions] = useState<
    Record<string, { background: string }>
  >({});

  /** Highlight all legal destination squares (and the origin) for a clicked source. */
  function getMoveOptions(square: Square): boolean {
    const chess = new Chess(boardFEN);
    const moves = chess.moves({ square, verbose: true });

    if (DEBUG) console.log('[useMoveInput] getMoveOptions for', square, moves);

    if (!moves.length) {
      setOptions({});
      return false;
    }

    const opts: Record<string, { background: string }> = {};
    moves.forEach((m) => {
      opts[m.to] = {
        background: chess.get(m.to)
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
      };
    });
    // Always highlight the source square itself:
    opts[square] = { background: 'rgba(255,255,0,0.4)' };

    setOptions(opts);
    return true;
  }

  /** Called when a user clicks/taps a square */
  function onSquareClick(square: Square) {
    if (DEBUG) console.log('[useMoveInput] onSquareClick:', square);
    // Clear existing highlights:
    setOptions({});

    // 1) If no source is selected yet, try to pick this up as a “from”
    if (!fromSq) {
      if (getMoveOptions(square)) {
        setFromSq(square);
      }
      return;
    }

    // 2) We already have a “from” selected. See if “from→square” is a legal move:
    const chess = new Chess(boardFEN);
    const allVerboseMoves = chess.moves({ verbose: true });
    const found = allVerboseMoves.find(
      (m) => m.from === fromSq && m.to === square
    );

    // Illegal drop: either start a new “from” or clear selection
    if (!found) {
      if (getMoveOptions(square)) {
        setFromSq(square);
      } else {
        setFromSq(null);
      }
      return;
    }

    // 3) If this is a pawn promotion, we need to open the dialog:
    if (
      found.piece === 'p' &&
      ((found.color === 'w' && square[1] === '8') ||
        (found.color === 'b' && square[1] === '1'))
    ) {
      if (DEBUG) console.log('[useMoveInput] Promotion needed at', square);
      setToSq(square);
      setShowPromotionDialog(true);
      return;
    }

    // 4) Otherwise, it’s a normal “from→to” move. Hand it off to useGameHistory:
    if (DEBUG)
      console.log(
        '[useMoveInput] Calling makeMove(sel:',
        fromSq,
        '→',
        square,
        ')'
      );
    const success = makeMove(fromSq, square);
    if (DEBUG) console.log('[useMoveInput] makeMove returned', success);
    // Clear selection either way (the board will re-render if makeMove was true)
    setFromSq(null);
    setToSq(null);
  }

  /** Called when a piece is dragged & dropped (drag source → drop target) */
  function onPieceDrop(from: string, to: string): boolean {
    if (DEBUG) console.log('[useMoveInput] onPieceDrop:', from, '→', to);

    const chess = new Chess(boardFEN);
    const match = chess
      .moves({ verbose: true })
      .find((m) => m.from === from && m.to === to);

    if (!match) {
      if (DEBUG) console.log('[useMoveInput] Illegal drop, no matching move');
      return false; // Tell react-chessboard “reject the drop”
    }

    // If promotion is required, open the dialog first and return false
    if (match.promotion) {
      if (DEBUG)
        console.log('[useMoveInput] Pawn promotion drop from', from, 'to', to);
      setFromSq(from);
      setToSq(to);
      setShowPromotionDialog(true);
      return false; // Keep the piece on the source square, let dialog handle the rest
    }

    // Otherwise, it’s a normal move. Return makeMove(...) result:
    const success = makeMove(from, to, match.promotion);
    if (DEBUG)
      console.log('[useMoveInput] onPieceDrop → makeMove returned', success);
    return success;
  }

  /** Called when the user chooses “q”, “r”, “b”, or “n” in the built-in promotion dialog */
  function onPromotionPieceSelect(choice: string): boolean {
    if (DEBUG) console.log('[useMoveInput] onPromotionPieceSelect:', choice);
    // choice is something like “wQ” or “bR”. Extract the second char as the promotion type:
    const promotion = choice.charAt(1).toLowerCase();

    if (fromSq && toSq) {
      if (DEBUG)
        console.log(
          '[useMoveInput] Actually calling makeMove for promotion:',
          fromSq,
          '→',
          toSq,
          promotion
        );
      makeMove(fromSq, toSq, promotion);
    }
    // Clear out selection and dialog state
    setFromSq(null);
    setToSq(null);
    setShowPromotionDialog(false);
    return true;
  }

  return {
    from: fromSq,
    to: toSq,
    showPromotionDialog,
    optionSquares: options,
    onSquareClick,
    onPieceDrop,
    onPromotionPieceSelect,
  };
}
