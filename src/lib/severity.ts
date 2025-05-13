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
const BLUNDER = 200;
const MISTAKE = 100;
export const INACCURACY = 40;

// percentage factors for time checks
const IMPULSIVE_FACTOR = 0.2;
const OVERUSE_FACTOR = 2;

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
    openingPly = 20,
    midGamePly = 50,
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
