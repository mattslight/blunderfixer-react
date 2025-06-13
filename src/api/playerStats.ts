// src/api/playerStats.ts

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

export interface BlundersFixedResponse {
  username: string;
  blunders_fixed: number;
}

export async function getBlundersFixed(
  username: string
): Promise<BlundersFixedResponse> {
  const res = await fetch(
    `${BASE_URL}/player_stats/${username}/blunders_fixed`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch blunders fixed: ${res.status}`);
  }
  return res.json() as Promise<BlundersFixedResponse>;
}
