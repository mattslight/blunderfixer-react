// src/components/GameList.tsx
import GameCard from './GameCard';
import { RecentGame } from '../hooks/useRecentGames';

interface GameListProps {
  games: RecentGame[];
  username: string;
  onAnalyse: (g: RecentGame) => void;
}

export default function GameList({
  games,
  username,
  onAnalyse,
}: GameListProps) {
  if (!games.length) {
    return <p className="text-center text-gray-400">No games found.</p>;
  }
  return (
    <ul className="space-y-2">
      {games.map((g) => (
        <GameCard key={g.uuid} game={g} hero={username} onAnalyse={onAnalyse} />
      ))}
    </ul>
  );
}
