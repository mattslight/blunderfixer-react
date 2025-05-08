// src/pages/games/DebugGameStore.tsx
import { useState, useEffect } from 'react';
import { GameRecord, AnalysisNode } from '@/types';
import GameLoader from './components/GameLoader';
import { GameSummary } from './components/GameSummary';
import { parseChessComGame } from '@/lib/chessComParser';
import { analysePGN } from '@/api';

interface DebugGameStoreProps {
  gamesMap: Record<string, GameRecord>;
  saveGame: (game: GameRecord) => void;
}

const username = 'mattslight';

export default function DebugGameStore({
  gamesMap,
  saveGame,
}: DebugGameStoreProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisNode[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value || null;
    if (newId === selectedId) return;
    setSelectedId(newId);
    setAnalysis([]);
  };

  // when a new game is selected, run analysis once
  useEffect(() => {
    if (!selectedId) return;
    const game = gamesMap[selectedId];
    if (!game?.pgn) return;

    setLoading(true);
    analysePGN(game.pgn, 12)
      .then((raw) => {
        const nodes: AnalysisNode[] = raw.map((r) => ({
          halfMoveIndex: r.half_move_index,
          fen: r.fen,
          evalCP: r.eval_cp,
          deltaCP: r.delta_cp,
          depth: 12,
        }));
        setAnalysis(nodes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedId, gamesMap]);

  const game = selectedId ? gamesMap[selectedId] : null;

  return (
    <div className="p-4 2xl:ml-8">
      <section className="mb-8">
        <GameLoader
          username={username}
          onSelect={(json) => saveGame(parseChessComGame(json))}
        />
      </section>

      {Object.keys(gamesMap).length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Pick a Stored Game</h2>
          <select
            className="rounded bg-gray-800 p-2"
            value={selectedId || ''}
            onChange={handleSelect}
          >
            <option value="">–– choose one ––</option>
            {Object.values(gamesMap).map((g) => (
              <option key={g.id} value={g.id}>
                {g.meta.players.white.player.username} vs{' '}
                {g.meta.players.black.player.username} @ {g.meta.date}
              </option>
            ))}
          </select>
        </section>
      )}

      {loading && <p>Running shallow analysis…</p>}

      {game && !loading && analysis.length > 0 && (
        <GameSummary game={game} analysis={analysis} />
      )}
    </div>
  );
}
