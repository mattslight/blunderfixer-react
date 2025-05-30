// src/hooks/usePGNParser.ts
import { useMemo } from 'react';
import { Chess } from 'chess.js';

interface ParsedGame {
  initialFEN: string;
  sanHistory: string[];
  rawErrors: string[];
}

export default function usePGNParser(pgn: string | null): ParsedGame {
  return useMemo(() => {
    const rawErrors: string[] = [];
    const defaultFEN = new Chess().fen();

    if (!pgn) {
      return { initialFEN: defaultFEN, sanHistory: [], rawErrors };
    }

    // 1) Look for [FEN "..."] header
    const fenMatch = pgn.match(/\[FEN\s+"([^"]+)"\]/);
    const startFEN = (fenMatch && fenMatch[1]) || defaultFEN;

    // 2) Try chess.js loadPgn
    const game = new Chess(startFEN);
    try {
      game.loadPgn(pgn, { strict: false });
      const parsed = game.history();
      if (parsed.length > 0) {
        return { initialFEN: startFEN, sanHistory: parsed, rawErrors };
      }
      rawErrors.push('loadPgn produced no moves, falling back');
    } catch (err) {
      rawErrors.push(`loadPgn error: ${err.message || err}`);
    }

    // 3) Fallback: strip comments, NAGs, tags, move-numbers
    const movesText = pgn
      .replace(/\{[^}]*\}/g, '')
      .replace(/\$\d+/g, '')
      .replace(/\[\w+\s+"[^"]*"\]/g, '')
      .replace(/\d+\.(\.\.)?/g, '')
      .trim();

    // 4) Tokenize plausible SAN
    const tokens = movesText
      .split(/\s+/)
      .filter((tok) =>
        /^[KQRNB]?[a-h]?[1-8]?x?[a-h][1-8](=[QRNB])?[+#]?$/.test(tok)
      );

    // 5) Replay on fresh board
    const fallback = new Chess(startFEN);
    const sanHistory: string[] = [];
    for (const san of tokens) {
      const m = fallback.move(san, { strict: false });
      if (m) {
        sanHistory.push(m.san);
      } else {
        rawErrors.push(`could not apply SAN move "${san}"`);
      }
    }

    return { initialFEN: startFEN, sanHistory, rawErrors };
  }, [pgn]);
}
