// src/pages/games/index.tsx
import { useGameData } from './hooks/useGameData';
import UsernameInput from './components/UsernameInput';
import AnalysisTable from './components/AnalysisTable';
import GameStore from './GameStore';

export default function GamesHistoryPage() {
  const { gamesMap, games, saveGame } = useGameData();

  return (
    <div className="2xl:ml-12">
      <div className="max-w-lg">
        <UsernameInput />
      </div>

      <AnalysisTable games={games} />

      <GameStore gamesMap={gamesMap} saveGame={saveGame} />
    </div>
  );
}
