// src/lib/uci.ts

import { Chess, type Square, type Move } from 'chess.js';

export type Promotion = 'n' | 'b' | 'r' | 'q';

const DEBUG = false;

export interface PVLine {
  rank: number; // multipv index (1–N)
  depth: number; // search depth
  scoreCP?: number; // centipawn score
  mateIn?: number; // mate in N
  moves: string[]; // SAN moves
}

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
  const cp = raw.match(/score cp (-?\d+)/);
  const mt = raw.match(/score mate (-?\d+)/);
  const pv = raw.match(/ pv (.+)$/);
  if (!dm || !mm || !pv) return null;

  const depth = +dm[1],
    rank = +mm[1],
    uciMoves = pv[1].split(' ');

  // make one Chess(board) and build SAN until you hit a bad move
  const chess = new Chess(baseFen);
  const san: string[] = [];

  for (const uci of uciMoves) {
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;

    DEBUG &&
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
      DEBUG &&
        console.log(
          `[parseUciInfo] invalid UCI "${uci}" at depth=${depth}, rank=${rank}:`,
          err
        );
      break;
    }

    if (!m) {
      DEBUG &&
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
    scoreCP: cp ? +cp[1] : undefined,
    mateIn: mt ? +mt[1] : undefined,
    moves: san,
  };
}

export function uciToMove(uci: unknown): {
  from: Square | null;
  to: Square | null;
} {
  // guard: must be a string of at least 4 chars
  if (typeof uci !== 'string' || uci.length < 4) {
    return { from: null, to: null };
  }

  return {
    from: uci.slice(0, 2) as Square,
    to: uci.slice(2, 4) as Square,
  };
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
