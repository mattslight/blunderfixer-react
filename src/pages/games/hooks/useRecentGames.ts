// src/pages/games/hooks/useRecentGames.ts
import useSWR from 'swr';

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
  const url = username
    ? `${import.meta.env.VITE_API_BASE_URL}/public/players/${username}/recent-games?limit=${limit}`
    : null;

  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    return res.json(); // could be RecentGame[] or { games: RecentGame[] }
  };

  const { data, error, isLoading, isValidating, mutate } = useSWR<
    RecentGame[] | { games: RecentGame[] },
    Error
  >(url, fetcher, {
    revalidateOnFocus: false,
  });

  // normalize whatever shape into a flat array
  const games: RecentGame[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.games)
      ? data.games
      : [];

  return {
    games,
    loading: isLoading,
    error: error?.message ?? null,
    reload: () => mutate(undefined, { revalidate: true }),
    isValidating, // <— flag you can hook a spinner to
  };
}
