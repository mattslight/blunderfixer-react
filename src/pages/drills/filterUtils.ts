// src/pages/drills/filterUtils.ts
export const THRESHOLD_OPTIONS = [
  1,
  150,
  225,
  337,
  500,
  1000,
  10000,
  Infinity,
] as const;

export type PhaseFilter = 'all' | 'opening' | 'middle' | 'late' | 'endgame';

export interface StickyFilters {
  phaseFilter: PhaseFilter;
  excludeWins: boolean;
  includeArchived: boolean;
  includeMastered: boolean;
  rangeIdx: [number, number];
}

const PREFIX = 'bf:params:';

export function readStickyValue<T>(key: string, def: T): T {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    return raw ? (JSON.parse(raw) as T) : def;
  } catch {
    return def;
  }
}

export function readStickyFilters(): StickyFilters {
  return {
    phaseFilter: readStickyValue<PhaseFilter>('drillPhaseFilter', 'all'),
    excludeWins: readStickyValue<boolean>('drillExcludeWins', true),
    includeArchived: readStickyValue<boolean>('drillIncludeArchived', false),
    includeMastered: readStickyValue<boolean>('drillIncludeMastered', false),
    rangeIdx: readStickyValue<[number, number]>('drillRangeIdx', [
      0,
      THRESHOLD_OPTIONS.length - 1,
    ]),
  };
}

import type { DrillFilters } from '@/api/drills';

export function buildDrillFilters(
  username: string,
  sticky: StickyFilters,
  opponent?: string
): DrillFilters {
  const {
    phaseFilter,
    excludeWins,
    includeArchived,
    includeMastered,
    rangeIdx,
  } = sticky;

  const includeFilters = [
    includeArchived && ('archived' as const),
    includeMastered && ('mastered' as const),
  ].filter(Boolean) as Array<'archived' | 'mastered'>;

  return {
    username,
    minEvalSwing: THRESHOLD_OPTIONS[rangeIdx[0]],
    maxEvalSwing: Number.isFinite(THRESHOLD_OPTIONS[rangeIdx[1]])
      ? THRESHOLD_OPTIONS[rangeIdx[1]]
      : undefined,
    phases: phaseFilter === 'all' ? undefined : [phaseFilter],
    heroResults: excludeWins
      ? (['loss', 'draw'] as Array<'loss' | 'draw'>)
      : undefined,
    opponent: opponent || undefined,
    include: includeFilters.length ? includeFilters : undefined,
    limit: 20,
    openingThreshold: 14,
  };
}
