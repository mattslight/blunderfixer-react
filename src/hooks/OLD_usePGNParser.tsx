// src/hooks/usePGNParser.tsx
import { useMemo } from 'react';
import { Chess } from 'chess.js';

export default function usePGNParser(pgn: string | null) {
  return useMemo(() => {
    const defaultGame = new Chess();
    const defaultFEN = defaultGame.fen();

    if (!pgn) {
      return { initialFEN: defaultFEN, sanHistory: [] };
    }

    // 1) Try chess.js's built-in PGN loader first
    const game = new Chess();
    try {
      game.loadPgn(pgn, { strict: false });
      // History() without verbose gives SAN array
      return {
        initialFEN: defaultFEN,
        sanHistory: game.history(),
      };
    } catch {
      console.warn(
        '[usePGNParser] full PGN failed, falling back to manual parse'
      );
    }

    // 2) Strip out tag lines and move numbers
    const movesOnlyText = pgn
      .split('\n')
      .filter((line) => !line.startsWith('[')) // drop metadata lines
      .join(' ')
      .replace(/\d+\.(\.\.)?/g, '') // drop "1.", "2...", etc.
      .trim();

    // 3) Tokenize and drop any leftover bracket fragments
    const tokens = movesOnlyText
      .split(/\s+/)
      .filter((tok) => tok && !tok.includes('[') && !tok.includes(']'));

    // 4) Apply each SAN move to a fresh game
    const fallbackGame = new Chess();
    const history: string[] = [];
    for (const san of tokens) {
      try {
        fallbackGame.move(san, { strict: false });
        history.push(san);
      } catch {
        console.warn('[usePGNParser] could not apply SAN move:', san);
      }
    }

    return {
      initialFEN: defaultFEN,
      sanHistory: history,
    };
  }, [pgn]);
}
