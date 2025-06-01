// src/lib/uci.ts

import { Chess, type Move, type PieceSymbol, type Square } from 'chess.js';

import { PVLine } from '@/types';
export type Promotion = 'n' | 'b' | 'r' | 'q';

const DEBUG = false;

export function makeEmptyLines(count: number): PVLine[] {
  return Array.from({ length: count }, (_, i) => ({
    rank: i + 1,
    depth: 0,
    moves: [],
    scoreCP: undefined,
    mateIn: undefined,
  }));
}

export function parseUciInfo(raw: string, baseFen: string): PVLine | null {
  // only lines we care about:
  if (!raw.startsWith('info ') || !raw.includes(' pv ')) return null;

  const dm = raw.match(/depth (\d+)/);
  const mm = raw.match(/multipv (\d+)/);
  const cpMatch = raw.match(/score cp (-?\d+)/);
  const mtMatch = raw.match(/score mate (-?\d+)/);
  const pv = raw.match(/ pv (.+)$/);
  if (!dm || !mm || !pv) return null;

  const depth = +dm[1];
  const rank = +mm[1];
  const uciMoves = pv[1].split(' ');

  // Determine side to move from FEN
  const sideToMove = baseFen.split(' ')[1]; // 'w' or 'b'

  // Parse raw scores and flip if Black to move
  let scoreCP: number | undefined = undefined;
  if (cpMatch) {
    const rawCp = +cpMatch[1];
    scoreCP = sideToMove === 'w' ? rawCp : -rawCp;
  }

  let mateIn: number | undefined = undefined;
  if (mtMatch) {
    const rawMate = +mtMatch[1];
    mateIn = sideToMove === 'w' ? rawMate : -rawMate;
  }

  // Build SAN moves from UCI PV
  const chess = new Chess(baseFen);
  const san: string[] = [];

  for (const uci of uciMoves) {
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;

    if (DEBUG)
      console.log('[parseUciInfo] applying UCI→object', {
        uci,
        from,
        to,
        promotion,
      });

    let m: Move | null = null;
    try {
      m = chess.move({ from, to, promotion });
    } catch (err) {
      if (DEBUG)
        console.log(
          `[parseUciInfo] invalid UCI "${uci}" at depth=${depth}, rank=${rank}:`,
          err
        );
      break;
    }

    if (!m) {
      if (DEBUG)
        console.log(
          `[parseUciInfo] illegal UCI "${uci}" at depth=${depth}, rank=${rank}`
        );
      break;
    }
    san.push(m.san);
  }

  return {
    rank,
    depth,
    scoreCP,
    mateIn,
    moves: san,
  };
}

/**
 * Converts a UCI move string (e.g. "e2e4", "e7e8q") into an object
 * containing { from, to, promotion? }.  If the UCI is invalid, returns
 * { from: null, to: null, promotion: null }.
 */
export function uciToMove(uci: unknown): {
  from: Square | null;
  to: Square | null;
  promotion: PieceSymbol | null;
} {
  // Must be at least 4 characters: from(2) + to(2).  Promotion adds a 5th char.
  if (typeof uci !== 'string' || uci.length < 4) {
    return { from: null, to: null, promotion: null };
  }

  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;

  let promotion: PieceSymbol | null = null;
  if (uci.length === 5) {
    // UCI promotions are lowercase: 'q', 'r', 'b', or 'n'
    const p = uci[4].toLowerCase();
    if (['q', 'r', 'b', 'n'].includes(p)) {
      promotion = p as PieceSymbol;
    }
  }

  return { from, to, promotion };
}
/**
 * Convert a UCI string into a single customArrow tuple
 * Returns an Arrow tuple e.g. ["e2", "e4", "green"]
 * Returns [null, null, null] if the input is not a valid UCI (e.g. 'e2e4').
 *
 * @param uci   - unknown value, expected to be 'e2e4', 'g1f3', etc.
 * @param color - arrow color (default: 'green')
 */
export function uciToArrow(
  uci: unknown,
  color: string = 'green'
): [Square, Square, string] {
  // must be a string
  if (typeof uci !== 'string') return [null, null, null];

  // must match two squares: from + to
  const m = uci.match(/^([a-h][1-8])([a-h][1-8])/i);
  if (!m) return [null, null, null];

  const [, from, to] = m; // m[1] = 'e2', m[2] = 'e4'
  return [from as Square, to as Square, color];
}
