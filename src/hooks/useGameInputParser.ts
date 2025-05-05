// src/hooks/useGameInputParser.ts
import { Chess } from 'chess.js';
import usePGNParser from './usePGNParser';

type InputType = 'FEN' | 'PARTIAL_FEN' | 'PGN' | 'UNKNOWN';

function detectInputType(text: string): InputType {
  const trimmed = text.trim();
  const fenRegex =
    /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+ [wb] [KQkq-]+ [a-h1-8-]+ \d+ \d+$/;
  const partialFenRegex = /^([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+$/;
  if (fenRegex.test(trimmed)) return 'FEN';
  if (partialFenRegex.test(trimmed)) return 'PARTIAL_FEN';
  if (/\d+\./.test(trimmed) || /\[/.test(trimmed)) return 'PGN';
  return 'UNKNOWN';
}

export default function useGameInputParser(raw: string | null) {
  // Call this hook unconditionally
  const parsedPGN = usePGNParser(raw);
  const type = raw ? detectInputType(raw) : 'UNKNOWN';

  switch (type) {
    case 'FEN':
      return { initialFEN: raw!, sanHistory: [], rawErrors: [] };

    case 'PARTIAL_FEN':
      return {
        initialFEN: `${raw} w KQkq - 0 1`,
        sanHistory: [],
        rawErrors: [],
      };

    case 'PGN':
      return parsedPGN;

    default:
      return {
        initialFEN: new Chess().fen(),
        sanHistory: [],
        rawErrors: [],
      };
  }
}
