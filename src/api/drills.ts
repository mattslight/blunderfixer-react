// src/api/drills.ts
import type { DrillPosition } from '@/types';

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

export interface DrillFilters {
  username: string; // required
  limit?: number; // default 50
  openingThreshold?: number; // default 14
  minEvalSwing?: number; // default 0   (omit if 0)
  maxEvalSwing?: number; // default Infinity (omit if Infinity)
  phases?: ('opening' | 'middle' | 'late' | 'endgame')[];
  heroResults?: ('win' | 'loss' | 'draw')[];
  opponent?: string; // substring, case-insensitive
}

export async function getDrills({
  username,
  limit = 20,
  openingThreshold = 14,
  minEvalSwing = 0,
  maxEvalSwing = Number.POSITIVE_INFINITY,
  phases = [],
  heroResults = [],
  opponent = '',
}: DrillFilters) {
  const params = new URLSearchParams({
    username,
    limit: String(limit),
    opening_threshold: String(openingThreshold),
  });

  if (minEvalSwing > 0) params.append('min_eval_swing', String(minEvalSwing));
  if (Number.isFinite(maxEvalSwing))
    params.append('max_eval_swing', String(maxEvalSwing));

  phases.forEach((p) => params.append('phases', p));
  heroResults.forEach((r) => params.append('hero_results', r));

  if (opponent.trim()) params.append('opponent', opponent.trim());

  const res = await fetch(`${BASE_URL}/drills?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch drills: ${res.status}`);
  }
  return res.json() as Promise<DrillPosition[]>;
}
