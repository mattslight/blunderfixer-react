// src/pages/games/index.tsx
import { useGameData } from './hooks/useGameData';
import { useUsername } from './hooks/useUsername';
import { useGameAnalysis } from './hooks/useGameAnalysis';
import { useRecentGames } from './hooks/useRecentGames';
import UsernameInput from './components/UsernameInput';
import GameList from './components/GameList';
import { GameSummary } from './components/GameSummary';
import { parseChessComGame } from '@/lib/chessComParser';
import type { GameRecord } from '@/types';

export default function GamesHistoryPage() {
  const [username, setUsername] = useUsername();
  const { gamesMap, games: savedGames, saveGame } = useGameData();
  const { selectedId, analysis, loading, analyse, setSelectedId, analysedIds } =
    useGameAnalysis(gamesMap);
  const {
    games: rawRecent,
    loading: recentLoading,
    error: recentError,
    reload,
  } = useRecentGames(username);

  // parse recent JSON into GameRecord
  const recentGames: GameRecord[] = rawRecent.map(parseChessComGame);

  // filter out those already in recent
  const recentIds = new Set(recentGames.map((g) => g.id));
  const filteredSaved = savedGames.filter((g) => !recentIds.has(g.id));

  // click handlers
  const handleRecentAction = (game: GameRecord) => {
    if (analysedIds.has(game.id)) {
      setSelectedId(game.id);
    } else {
      saveGame(game);
      analyse(game.id);
    }
  };

  const handleSavedAction = (game: GameRecord) => {
    if (analysedIds.has(game.id)) {
      setSelectedId(game.id);
    } else {
      analyse(game.id);
    }
  };

  return (
    <div className="space-y-8 p-4 2xl:ml-12">
      <UsernameInput username={username} onUsernameChange={setUsername} />

      {/* Recent games */}
      <div className="mx-auto max-w-lg space-y-4">
        <div className="flex justify-end">
          <button
            onClick={reload}
            disabled={recentLoading || !username}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {recentLoading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
        {recentError && <p className="text-red-500">{recentError}</p>}
        <GameList
          games={recentGames}
          hero={username}
          isAnalysed={(g) => analysedIds.has(g.id)}
          onAction={handleRecentAction}
        />
      </div>

      {/* Saved games */}
      <GameList
        games={filteredSaved}
        hero={username}
        isAnalysed={(g) => analysedIds.has(g.id)}
        onAction={handleSavedAction}
      />

      {loading && <p>Running analysis…</p>}
      {selectedId && !loading && analysis.length > 0 && (
        <GameSummary game={gamesMap[selectedId]!} analysis={analysis} />
      )}
    </div>
  );
}
