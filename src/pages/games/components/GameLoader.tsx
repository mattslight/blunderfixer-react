// src/pages/games/components/GameLoader.tsx

import GameList from './GameList';
import { useRecentGames } from '../hooks/useRecentGames';

export default function GameLoader({ username, onSelect }) {
  const { games, loading, error, reload } = useRecentGames(username);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex justify-end">
        <button
          onClick={reload}
          disabled={loading || !username}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <GameList games={games} username={username} onAnalyse={onSelect} />
    </div>
  );
}
