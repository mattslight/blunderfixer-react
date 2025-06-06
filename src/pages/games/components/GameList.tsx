// src/pages/games/components/GameList.tsx
import GameCard from './GameCard';

import { GameRecord } from '@/types';

interface GameListProps {
  games: GameRecord[];
  hero: string;
  isAnalysed: (game: GameRecord) => boolean;
  isLoading: (game: GameRecord) => boolean;
  onAction: (game: GameRecord) => void;
}

export default function GameList({
  games,
  hero,
  isAnalysed,
  isLoading,
  onAction,
}: GameListProps) {
  // only keep games where hero is either White or Black
  const filtered = games.filter((g) => {
    const { white, black } = g.meta.players;
    return (
      white.player.username.toLowerCase() === hero.toLowerCase() ||
      black.player.username.toLowerCase() === hero.toLowerCase()
    );
  });

  if (!filtered.length) {
    return <p className="text-center text-stone-400">No games found.</p>;
  }

  return (
    <ul className="space-y-2">
      {filtered.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          hero={hero}
          isAnalysed={isAnalysed(game)}
          isLoading={isLoading(game)}
          onAction={onAction}
        />
      ))}
    </ul>
  );
}
