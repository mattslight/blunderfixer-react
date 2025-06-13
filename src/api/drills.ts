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
  include?: ('archived' | 'mastered')[];
}

export interface DrillHistoryPayload {
  result: 'pass' | 'fail';
  reason?: string; // optional reason for failure
  moves?: string[]; // sequence of moves played
  timestamp?: string;
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
  include = [],
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

  include.forEach((inc) => params.append('include', inc));

  const res = await fetch(`${BASE_URL}/drills?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch drills: ${res.status}`);
  }
  return res.json() as Promise<DrillPosition[]>;
}

export interface RecentDrillOpts {
  username: string;
  limit?: number;
  includeArchived?: boolean;
}

export async function getRecentDrills({
  username,
  limit = 20,
  includeArchived = false,
}: RecentDrillOpts) {
  const params = new URLSearchParams({ username, limit: String(limit) });
  if (includeArchived) params.append('include_archived', 'true');

  const res = await fetch(`${BASE_URL}/drills/recent?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch recent drills: ${res.status}`);
  }
  return res.json() as Promise<DrillPosition[]>;
}

export interface MasteredDrillOpts {
  username: string;
  limit?: number;
  includeArchived?: boolean;
}

export async function getMasteredDrills({
  username,
  limit = 20,
  includeArchived = false,
}: MasteredDrillOpts) {
  const params = new URLSearchParams({ username, limit: String(limit) });
  if (includeArchived) params.append('include_archived', 'true');

  const res = await fetch(`${BASE_URL}/drills/mastered?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch mastered drills: ${res.status}`);
  }
  return res.json() as Promise<DrillPosition[]>;
}

// Fetch single drill by ID
export async function getDrill(id: number) {
  const res = await fetch(`${BASE_URL}/drills/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch drill ${id}: ${res.status}`);
  }
  return res.json() as Promise<DrillPosition>;
}

export async function postDrillHistory(
  drillId: string | number,
  payload: DrillHistoryPayload
) {
  const res = await fetch(`${BASE_URL}/drills/${drillId}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to post history: ${res.status}`);
  }
  return res.json();
}

export interface DrillUpdatePayload {
  archived?: boolean;
  mark_played?: boolean;
}

export async function updateDrill(
  drillId: string | number,
  payload: DrillUpdatePayload
) {
  const numericId = Number(drillId);
  if (isNaN(numericId)) {
    throw new Error(`Invalid drillId: ${drillId}`);
  }

  const res = await fetch(`${BASE_URL}/drills/${numericId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to update drill ${drillId}: ${res.status}`);
  }

  return res.json() as Promise<DrillPosition>;
}
