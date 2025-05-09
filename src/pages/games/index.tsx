// src/pages/games/index.tsx
import { useMemo } from 'react';
import { useGameData } from './hooks/useGameData';
import { useUsername } from '@/hooks/useUsername';
import { useNavigate } from 'react-router-dom';

import { useGameAnalysis } from './hooks/useGameAnalysis';
import { useRecentGames } from './hooks/useRecentGames';
import GameList from './components/GameList';
import { parseChessComGame } from '@/lib/chessComParser';
import type { GameRecord } from '@/types';

export default function GamesHistoryPage() {
  const navigate = useNavigate();
  const { username } = useUsername();
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
    <div className="space-y-8 p-4 2xl:ml-12">
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex justify-center">
          <button
            onClick={() => reload()}
            disabled={recentLoading || !username}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isValidating
              ? 'Refreshing…'
              : recentLoading
                ? 'Loading…'
                : 'Refresh'}
          </button>
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
