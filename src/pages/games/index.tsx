// src/pages/games/index.tsx
import { useProfile } from '@/hooks/useProfile';
import { parseChessComGame } from '@/lib/chessComParser';
import type { GameRecord } from '@/types';
import { RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GameList from './components/GameList';
import { useGameAnalysis } from './hooks/useGameAnalysis';
import { useGameData } from './hooks/useGameData';
import { useRecentGames } from './hooks/useRecentGames';

export default function GamesHistoryPage() {
  const navigate = useNavigate();
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
  const handleAction = (game: GameRecord) => {
    const already = analysedIds.has(game.id);
    if (already) {
      navigate(`/report/${game.id}`);
    } else {
      saveGame(game);
      analyse(game.id);
    }
  };

  return (
    <div className="p-4 pt-0 2xl:ml-12">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex flex-row items-baseline justify-between">
          <div>
            <h1 className="mt-4 mb-2 text-2xl font-semibold text-white">
              Recent Games
            </h1>
          </div>
          <div>
            <button
              onClick={() => reload()}
              disabled={isValidating || recentLoading || !username}
              className="inline-flex items-center rounded border-1 border-blue-800 bg-blue-950 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
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
          onAction={handleAction}
        />
      </div>
    </div>
  );
}
