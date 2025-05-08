// src/pages/analyse/DebugGameStore.tsx
import { useState, useEffect } from 'react';
import GameLoader from './components/GameLoader';
import { parseChessComGame } from '@/lib/chessComParser';
import { GameRecord, AnalysisNode } from '@/types';
import { analysePGN } from '@/api';
import { GameSummary } from './components/GameSummary';

const username = 'mattslight';

export default function DebugGameStore() {
  const [gamesMap, setGamesMap] = useState<Record<string, GameRecord>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisNode[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value || null;
    if (newId === selectedId) return; // <— no change, don’t reset
    setSelectedId(newId);
    setAnalysis([]);
  };

  // 1) load stored games
  useEffect(() => {
    const raw = localStorage.getItem('bf:games');
    if (!raw) return;
    try {
      setGamesMap(JSON.parse(raw));
    } catch {}
  }, []);

  // 2) when a new game arrives, reset analysis state
  const saveGame = (record: GameRecord) => {
    const next = { ...gamesMap, [record.id]: record };
    localStorage.setItem('bf:games', JSON.stringify(next));
    setGamesMap(next);
    setSelectedId(record.id);
    setAnalysis([]);
  };

  // When a game is selected, fire analysePGN once
  useEffect(() => {
    if (!selectedId) return;
    const game = gamesMap[selectedId];
    if (!game || !game.pgn) return;

    setLoading(true);
    analysePGN(game.pgn, 12)
      .then((raw) => {
        // map your backend shape into AnalysisNode
        const nodes: AnalysisNode[] = raw.map((r) => ({
          halfMoveIndex: r.half_move_index,
          fen: r.fen,
          evalCP: r.eval_cp,
          deltaCP: r.delta_cp,
          depth: 12,
          // bestMove/pvLines omitted on shallow pass
        }));
        setAnalysis(nodes);
      })
      .catch((err) => {
        console.error('shallow analyse failed', err);
      })
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
