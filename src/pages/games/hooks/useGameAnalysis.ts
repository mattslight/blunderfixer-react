// src/pages/games/hooks/useGameAnalysis.ts
import { useState, useEffect, useCallback } from 'react';
import { GameRecord, AnalysisNode } from '@/types';
import { analysePGN } from '@/api';

/**
 * Manages the selection of a game and runs Stockfish/PGN analysis on demand.
 *
 * @param gamesMap - An object mapping game IDs to GameRecord instances.
 * @returns An object containing:
 *   - selectedId: the ID of the currently selected game (or null if none).
 *   - analysis: an array of AnalysisNode representing the last run of engine analysis.
 *   - loading: whether a background analysis request is in progress.
 *   - analyse: function to trigger analysis for a given game ID.
 */
export function useGameAnalysis(gamesMap: Record<string, GameRecord>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisNode[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Triggers a new analysis run for the given game ID.
   * Clears previous results and sets loading state.
   */
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
