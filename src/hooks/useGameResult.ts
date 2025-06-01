// src/hooks/useGameResult.ts

/**
 * useGameResult
 * --------------
 * React hook that tracks the outcome of a chess game based on the current FEN and hero side.
 *
 * @param fen - The current FEN string representing the board state.
 * @param heroSide - The perspective of the user ('white' or 'black').
 *
 * @returns A string indicating the game result:
 *   - 'win'  → The hero side has won by checkmate.
 *   - 'loss' → The hero side has lost by checkmate.
 *   - 'draw' → The game ended in a draw (stalemate, repetition, insufficient material, or 50-move rule).
 *   - null   → The game is still ongoing (no result yet).
 *
 * The hook updates reactively when `fen` or `heroSide` changes.
 *
 * Example usage:
 *   const result = useGameResult(fen, 'white');
 */

import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';

type GameResult = 'win' | 'loss' | 'draw' | null;

export default function useGameResult(
  fen: string,
  heroSide: 'white' | 'black'
): GameResult {
  const [result, setResult] = useState<GameResult>(null);

  useEffect(() => {
    const game = new Chess(fen);

    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        const winner = game.turn() === 'w' ? 'black' : 'white';
        setResult(winner === heroSide ? 'win' : 'loss');
      } else if (
        game.isStalemate() ||
        game.isInsufficientMaterial() ||
        game.isThreefoldRepetition() ||
        game.isDraw()
      ) {
        setResult('draw');
      }
    } else {
      setResult(null);
    }
  }, [fen, heroSide]);

  return result;
}
