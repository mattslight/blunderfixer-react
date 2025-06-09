import { useNavigate } from 'react-router-dom';

import GameList from '@/pages/games/components/GameList';
import type { GameRecord } from '@/types';

interface Props {
  games: GameRecord[];
  username: string;
  loading: boolean;
  onAnalyse: (game: GameRecord) => void;
}

export default function GameSection({
  games,
  username,
  loading,
  onAnalyse,
}: Props) {
  const navigate = useNavigate();

  return (
    <>
      <div className="mt-12 mb-2 flex justify-between">
        <h2 className="text-xl font-semibold text-stone-100">Recent Games</h2>
        <button
          className="text-sm text-blue-400 hover:underline"
          onClick={() => navigate('/games')}
        >
          More games »
        </button>
      </div>
      <section className="mb-20">
        <GameList
          games={games}
          hero={username}
          isAnalysed={() => false}
          isLoading={() => loading}
          onAction={onAnalyse}
        />
      </section>
    </>
  );
}
