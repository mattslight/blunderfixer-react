// src/pages/games/index.tsx
import { useProfile } from '@/hooks/useProfile';
import { parseChessComGame } from '@/lib/chessComParser';
import type { GameRecord } from '@/types';
import { RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameList from './components/GameList';
import { useGameAnalysis } from './hooks/useGameAnalysis';
import { useGameData } from './hooks/useGameData';
import { useRecentGames } from './hooks/useRecentGames';

export default function GamesHistoryPage() {
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const {
    profile: { username },
  } = useProfile();
  const { gamesMap, games: savedGames, saveGame } = useGameData();
  const { selectedId, analysis, loading, analyse, setSelectedId, analysedIds } =
    useGameAnalysis(gamesMap);
  const {
    games: rawRecent,
    loading: recentLoading,
    isValidating,
    error: recentError,
    reload,
  } = useRecentGames(username);

  // parse your recent JSON into GameRecord
  const recentGames = Array.isArray(rawRecent)
    ? rawRecent.map(parseChessComGame)
    : [];

  // merge recent + saved, dedupe by id, then sort by endTime descending
  const allGames: GameRecord[] = useMemo(() => {
    const byId: Record<string, GameRecord> = {};
    // save analysed first so they appear at top
    savedGames.forEach((g) => (byId[g.id] = g));
    recentGames.forEach((g) => {
      if (!byId[g.id]) byId[g.id] = g;
    });
    return Object.values(byId).sort((a, b) => b.meta.endTime - a.meta.endTime);
  }, [savedGames, recentGames]);

  // one handler for every card
  const handleAction = async (game: GameRecord) => {
    if (analysedIds.has(game.id)) {
      return navigate(`/report/${game.id}`);
    }

    saveGame(game);

    // mark this game as loading
    setLoadingIds((ids) => new Set(ids).add(game.id));

    try {
      // await the analysis promise
      await analyse(game.id);
      // once done, immediately navigate into the report
      navigate(`/report/${game.id}`);
    } finally {
      // remove it from loading set no matter success or failure
      setLoadingIds((ids) => {
        const next = new Set(ids);
        next.delete(game.id);
        return next;
      });
    }
  };

  return (
    <div className="p-4 pt-8 2xl:ml-12">
      <div className="mx-auto max-w-lg space-y-4">
        <span className="inline-blockpy-0.5 text-xs font-semibold tracking-wider text-green-500 uppercase">
          Your Activity
        </span>
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-white">Recent Games</h1>

          <div>
            <button
              onClick={() => reload()}
              disabled={isValidating || recentLoading || !username}
              className="inline-flex items-center rounded bg-gray-800 px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`mr-2 ${isValidating && `animate-spin`}`}
                size={14}
              />
              {isValidating
                ? 'Fetching...'
                : recentLoading
                  ? 'Loading…'
                  : 'Refresh'}
            </button>
          </div>
        </div>
        {recentError && <p className="text-red-500">{recentError}</p>}

        <GameList
          games={allGames}
          hero={username}
          isAnalysed={(g) => analysedIds.has(g.id)}
          isLoading={(g) => loadingIds.has(g.id)}
          onAction={handleAction}
        />
      </div>
    </div>
  );
}
