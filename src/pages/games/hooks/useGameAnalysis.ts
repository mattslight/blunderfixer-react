// src/hooks/useGameAnalysis.ts
import { useState, useEffect, useCallback } from 'react';
import { GameRecord, AnalysisNode } from '@/types';
import { analysePGN } from '@/api';

export function useGameAnalysis(gamesMap: Record<string, GameRecord>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisNode[]>([]);
  const [loading, setLoading] = useState(false);

  const analyse = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const game = gamesMap[selectedId];
    if (!game?.pgn) return;

    setLoading(true);
    analysePGN(game.pgn, 12)
      .then((raw) =>
        setAnalysis(
          raw.map((r) => ({
            halfMoveIndex: r.half_move_index,
            fen: r.fen,
            evalCP: r.eval_cp,
            deltaCP: r.delta_cp,
            depth: 12,
          }))
        )
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedId, gamesMap]);

  return { selectedId, analysis, loading, analyse };
}
