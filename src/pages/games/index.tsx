import { useState, useEffect } from 'react';
import { GameRecord } from '@/types';
import UsernameInput from './components/UsernameInput';
import DebugGameStore from './DebugGameStore';
import AnalysisTable from './components/AnalysisTable';

export default function GamesHistoryPage() {
  const [games, setGames] = useState<GameRecord[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('bf:games');
    if (raw) {
      const gamesMap: Record<string, GameRecord> = JSON.parse(raw);
      setGames(Object.values(gamesMap));
    }
  }, []);

  return (
    <div className="2xl:ml-12">
      <div className="max-w-lg">
        <UsernameInput />
      </div>
      <AnalysisTable games={games} />
      <DebugGameStore />
    </div>
  );
}
