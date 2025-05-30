// src/hooks/useGameInputParser.ts
import { Chess } from 'chess.js';

import usePGNParser from '@/hooks/usePGNParser';
import { InputType } from '@/types';

/**
 * Result of parsing raw input (FEN, PGN, etc.)
 */
export interface ParsedInput {
  initialFEN: string; // The full FEN string to start from
  sanHistory: string[]; // Array of SAN moves extracted
  rawErrors: string[]; // Any parsing errors or warnings
  inputType: InputType;
}

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

export default function useGameInputParser(raw: string | null): ParsedInput {
  // Call this hook unconditionally
  const parsedPGN = usePGNParser(raw);
  const type = raw ? detectInputType(raw) : 'UNKNOWN';

  switch (type) {
    case 'FEN':
      return {
        initialFEN: raw,
        sanHistory: [],
        rawErrors: [],
        inputType: 'FEN',
      };

    case 'PARTIAL_FEN':
      return {
        initialFEN: `${raw} w KQkq - 0 1`,
        sanHistory: [],
        rawErrors: [],
        inputType: 'PARTIAL_FEN',
      };

    case 'PGN':
      return { ...parsedPGN, inputType: 'PGN' };

    default:
      return {
        initialFEN: new Chess().fen(),
        sanHistory: [],
        rawErrors: [],
        inputType: 'CHESS_COM',
      };
  }
}
