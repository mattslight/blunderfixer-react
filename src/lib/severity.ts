export type Severity =
  | 'blunder'
  | 'mistake'
  | 'inaccuracy'
  | 'timeImpulsive'
  | 'timeOveruse'
  | 'none';

export interface TimeControl {
  base: number; // seconds on the clock, e.g. 180 for “3+2”
  inc: number; // increment per move, e.g. 2 for “3+2”
}

// pawn-loss thresholds
const BLUNDER = 200; // 2 pawns
const MISTAKE = 100; // 1 pawn
export const INACCURACY = 40; // 0.4 pawns

// percentage factors for time checks
const IMPULSIVE_FACTOR = 0.2; // 20% of time budget per move
const OVERUSE_FACTOR = 2; // 200% of time budget per move

const BOOK_KNOWLEDGE_PLY = 10; // ply to start time checks
const MID_GAME_PLY = 50; // ply to switch to end budget

// Configurable color mappings
export const DOT_COLOR: Record<Severity, string> = {
  blunder: 'bg-red-600',
  mistake: 'bg-orange-600',
  inaccuracy: 'bg-yellow-500',
  timeImpulsive: 'bg-cyan-500',
  timeOveruse: 'bg-purple-600',
  none: 'bg-gray-800',
};

export const TIME_TEXT_COLOR: Record<Severity, string> = {
  blunder: 'text-gray-500',
  mistake: 'text-gray-500',
  inaccuracy: 'text-gray-500',
  timeImpulsive: 'text-cyan-400',
  timeOveruse: 'text-purple-500',
  none: 'text-gray-500',
};

/**
 * Options for computing severity
 */
export interface SeverityOptions {
  deltaCP: number; // centipawn change
  timeSpent?: number; // seconds spent
  ply: number; // half-move index
  tc: TimeControl; // time control settings
  openingPly?: number; // skip time checks until this ply (default 20)
  midGamePly?: number; // use full budget until this ply (default 50)
}

/**
 * Returns a Severity for a move based on pawn-loss and time-control factors.
 */
export function getSeverity(opts: SeverityOptions): Severity {
  const {
    deltaCP,
    timeSpent,
    ply,
    tc,
    openingPly = BOOK_KNOWLEDGE_PLY,
    midGamePly = MID_GAME_PLY,
  } = opts;

  // 1) Time-control checks (after opening theory)
  if (ply > openingPly && timeSpent !== undefined) {
    const budget = ply <= midGamePly ? tc.base / 60 + tc.inc / 2 : tc.inc;
    if (
      timeSpent < budget * IMPULSIVE_FACTOR &&
      Math.abs(deltaCP) > INACCURACY
    ) {
      return 'timeImpulsive';
    }
    if (timeSpent > budget * OVERUSE_FACTOR) {
      return 'timeOveruse';
    }
  }

  // 2) Pawn-loss severity
  const absΔ = Math.abs(deltaCP);
  if (absΔ >= BLUNDER) return 'blunder';
  if (absΔ >= MISTAKE) return 'mistake';
  if (absΔ >= INACCURACY) return 'inaccuracy';
  return 'none';
}
