// src/hooks/useRecentGames.ts
import { useState, useEffect, useCallback } from 'react';

export interface RecentGame {
  uuid: string;
  white: { username: string; rating: number; result: string };
  black: { username: string; rating: number; result: string };
  pgn: string;
  time_control: string;
  eco?: string;
  eco_url?: string;
  end_time: number;
  rated: boolean;
  termination?: string;
}

/**
 * Hook to fetch a user’s recent games from the Chess.com public API.
 *
 * @param username - Chess.com username whose games to load.
 * @param limit - Maximum number of recent games to fetch (default: 10).
 * @returns An object with:
 *   - games: array of RecentGame objects.
 *   - loading: boolean indicating whether the fetch is in progress.
 *   - error: string message if the fetch failed, or null.
 *   - reload: function to re-trigger the fetch manually.
 */

export function useRecentGames(username: string, limit = 10) {
  const [games, setGames] = useState<RecentGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Internal fetch logic: retrieves recent games for the given username.
   * Resets error, sets loading state, and updates `games` or `error`.
   */
  const load = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/public/players/${username}/recent-games?limit=${limit}`
      );
      if (!res.ok) throw new Error(res.statusText);
      setGames(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [username, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { games, loading, error, reload: load };
}
