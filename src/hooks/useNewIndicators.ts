import { useEffect, useMemo, useState } from 'react';

import { useProfile } from './useProfile';

import { useDrills } from '@/pages/drills/hooks/useDrills';
import { buildDrillFilters } from '@/pages/drills/utils/filters';
import { useRecentGames } from '@/pages/games/hooks/useRecentGames';

export function useNewGamesIndicator(limit = 10) {
  const {
    profile: { username },
  } = useProfile();
  const { games } = useRecentGames(username, limit);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!username) return;
    const lastSeen = parseInt(
      localStorage.getItem(`bf:last_visited_games:${username}`) || '0',
      10
    );
    const latest = games.reduce(
      (max, g) => (g?.end_time ? Math.max(max, g.end_time * 1000) : max),
      0
    );
    setHasNew(latest > lastSeen);
  }, [games, username]);

  return hasNew;
}

export function useNewDrillsIndicator() {
  const {
    profile: { username },
  } = useProfile();
  const filters = useMemo(
    () =>
      buildDrillFilters(
        username,
        {
          phaseFilter: 'all',
          excludeWins: false,
          includeArchived: false,
          includeMastered: false,
          rangeIdx: [0, 5],
        },
        undefined
      ),
    [username]
  );

  const { drills } = useDrills(filters);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    if (!username) return;
    const lastSeen = parseInt(
      localStorage.getItem(`bf:last_visited_drills:${username}`) || '0',
      10
    );
    const latest = drills.reduce((max, d) => {
      const ts = Date.parse(d.created_at);
      return Number.isFinite(ts) ? Math.max(max, ts) : max;
    }, 0);
    setHasNew(latest > lastSeen);
  }, [drills, username]);

  return hasNew;
}
