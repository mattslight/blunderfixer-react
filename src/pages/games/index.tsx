// src/pages/games/index.tsx
import { useGameData } from './hooks/useGameData';
import { useUsername } from './hooks/useUsername';
import { useGameAnalysis } from './hooks/useGameAnalysis';
import UsernameInput from './components/UsernameInput';
import GameLoader from './components/GameLoader';
import { GameSummary } from './components/GameSummary';
import { parseChessComGame } from '@/lib/chessComParser';

export default function GamesHistoryPage() {
  const [username, setUsername] = useUsername();
  const { gamesMap, games, saveGame } = useGameData();
  const { selectedId, analysis, loading, analyse } = useGameAnalysis(gamesMap);

  // when you load a new game, save it and immediately analyse
  const handleNew = (json: any) => {
    const rec = parseChessComGame(json);
    saveGame(rec);
    analyse(rec.id);
  };

  return (
    <div className="space-y-8 p-4 2xl:ml-12">
      <UsernameInput username={username} onUsernameChange={setUsername} />

      <GameLoader username={username} onSelect={handleNew} />

      {loading && <p>Running analysis…</p>}

      {selectedId && !loading && analysis.length > 0 && (
        <GameSummary game={gamesMap[selectedId]} analysis={analysis} />
      )}
    </div>
  );
}
