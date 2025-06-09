// src/constants/phase.ts
import { type TimeClass } from '@/hooks/useChessComRatings';

export const PHASE_DISPLAY: Record<string, string> = {
  opening: 'Opening',
  middle: 'Middle',
  late: 'Late',
  endgame: 'Endgame',
};
export const PHASE_COLORS: Record<string, string> = {
  Opening: 'bg-blue-700',
  Middle: 'bg-purple-700',
  Late: 'bg-fuchsia-700',
  Endgame: 'bg-rose-700',
};
export const TIME_ORDER: TimeClass[] = ['bullet', 'blitz', 'rapid', 'daily'];
