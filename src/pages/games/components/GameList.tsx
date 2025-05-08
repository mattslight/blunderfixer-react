// src/pages/games/components/GameList.tsx
import GameCard from './GameCard';
import { GameRecord } from '@/types';

interface GameListProps {
  /** Array of games to display */
  games: GameRecord[];
  /** Your username (for result coloring) */
  heroUsername: string;
  /** Called when the user taps "Analyse" */
  onSelect: (game: GameRecord) => void;
}

/**
 * Presentational list of GameCards—no fetch logic here.
 */
export default function GameList({
  games,
  heroUsername,
  onSelect,
}: GameListProps) {
  if (games.length === 0) {
    return <p className="text-center text-gray-400">No games to display.</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <ul className="space-y-2">
        {games.map((g) => (
          <GameCard
            key={g.id}
            game={g}
            heroUsername={heroUsername}
            onClick={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}
