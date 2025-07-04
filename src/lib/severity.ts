// src/lib/severity.ts
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

// pawn-loss thresholds (centipawns)
const BLUNDER = 200;
const MISTAKE = 100;
export const INACCURACY = 40;

// time-budget factors
const IMPULSIVE_FACTOR = 0.2;
const OVERUSE_FACTOR = 2;
const BOOK_KNOWLEDGE_PLY = 10;
const MID_GAME_PLY = 50;

// configurable color mappings
export const DOT_COLOR: Record<Severity, string> = {
  blunder: 'bg-red-600',
  mistake: 'bg-orange-600',
  inaccuracy: 'bg-yellow-500',
  timeImpulsive: 'bg-cyan-500',
  timeOveruse: 'bg-purple-600',
  none: 'bg-stone-800',
};
export const TIME_TEXT_COLOR: Record<
  'timeImpulsive' | 'timeOveruse' | 'none',
  string
> = {
  timeImpulsive: 'text-cyan-400',
  timeOveruse: 'text-purple-400',
  none: 'text-stone-300',
};
export const TEXT_SEVERITY_COLOR: Record<
  'blunder' | 'mistake' | 'inaccuracy' | 'none',
  string
> = {
  blunder: 'text-red-500',
  mistake: 'text-orange-500',
  inaccuracy: 'text-yellow-400',
  none: 'text-stone-600',
};

/**
 * Options for computing severity
 */
export interface SeverityOptions {
  deltaCP: number; // centipawn change
  timeSpent?: number; // seconds spent on this move
  ply: number; // half-move index
  tc: TimeControl;
  openingPly?: number;
  midGamePly?: number;
}

/**
 * Pawn-loss-only severity
 */
export function getErrorSeverity(
  deltaCP: number
): 'blunder' | 'mistake' | 'inaccuracy' | 'none' {
  const absΔ = Math.abs(deltaCP);
  if (absΔ >= BLUNDER) return 'blunder';
  if (absΔ >= MISTAKE) return 'mistake';
  if (absΔ >= INACCURACY) return 'inaccuracy';
  return 'none';
}

/**
 * Time-control-only severity (after opening)
 */
export function getTimeSeverity(
  opts: SeverityOptions
): 'timeImpulsive' | 'timeOveruse' | 'none' {
  const {
    ply,
    timeSpent,
    tc,
    openingPly = BOOK_KNOWLEDGE_PLY,
    midGamePly = MID_GAME_PLY,
  } = opts;
  if (ply <= openingPly || timeSpent == null) return 'none';
  const budget = ply <= midGamePly ? tc.base / 60 + tc.inc / 2 : tc.inc;
  if (
    timeSpent < budget * IMPULSIVE_FACTOR &&
    Math.abs(opts.deltaCP) > INACCURACY
  ) {
    return 'timeImpulsive';
  }
  if (timeSpent > budget * OVERUSE_FACTOR) {
    return 'timeOveruse';
  }
  return 'none';
}

/**
 * Combined severity: time tags override pawn-loss tags
 */
export function getSeverity(opts: SeverityOptions): Severity {
  const timeTag = getTimeSeverity(opts);
  if (timeTag !== 'none') return timeTag;
  return getErrorSeverity(opts.deltaCP);
}

// -- scoring for key-move selection --

/**
 * Weight assigned to each severity for ranking.
 */
export const SEVERITY_WEIGHT: Record<Severity, number> = {
  blunder: 5,
  mistake: 3,
  inaccuracy: 1.5,
  timeOveruse: 3,
  timeImpulsive: 1,
  none: 0,
};

/**
 * Options needed to score a move when picking key moves.
 */
export interface ScoreOptions {
  severity: Severity;
  impact: number; // centipawn swing (positive favours hero)
  evalBefore: number; // centipawn eval before move
}

/**
 * Computes a ranking score for a move based on severity, impact and swing.
 * Higher = more important.
 */
export function scoreMove(opts: ScoreOptions): number {
  const { severity, impact, evalBefore } = opts;
  const sevW = SEVERITY_WEIGHT[severity] || 0;
  const impW = Math.min(Math.abs(impact) / 100, 5); // cap at 5 pawns
  const swingBonus =
    (impact < 0 && evalBefore > 0) || (impact > 0 && evalBefore < 0) ? 3 : 1;
  return sevW * (1 + impW) * swingBonus;
}

/**
 * Computes a CSS class for the time remaining based on the time control.
 * @param secondsRemaining - The number of seconds remaining.
 * @param timeControl - The total time control in seconds.
 * @returns A CSS class string for styling the time remaining.
 */
export function getTimeRemainingClass(
  secondsRemaining: number,
  timeControl: number
): string {
  if (!timeControl) return 'text-stone-600';

  const pct = secondsRemaining / timeControl;

  if (pct < 0.05) return 'text-red-700';
  if (pct < 0.1) return 'text-yellow-500';
  else return 'text-stone-600';
}
