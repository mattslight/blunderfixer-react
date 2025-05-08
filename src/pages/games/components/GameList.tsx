// src/pages/games/components/GameList.tsx
import { GameRecord } from '@/types';
import GameCard from './GameCard';

interface GameListProps {
  games: GameRecord[];
  hero: string;
  isAnalysed: (game: GameRecord) => boolean;
  onAction: (game: GameRecord) => void;
}

export default function GameList({
  games,
  hero,
  isAnalysed,
  onAction,
}: GameListProps) {
  if (games.length === 0) {
    return <p className="text-center text-gray-400">No games found.</p>;
  }

  return (
    <ul className="space-y-2">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          hero={hero}
          isAnalysed={isAnalysed(game)}
          onAction={onAction}
        />
      ))}
    </ul>
  );
}
