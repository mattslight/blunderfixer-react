// src/pages/games/hooks/useGameAnalysis.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameRecord, AnalysisNode } from '@/types';
import { analysePGN } from '@/api';

/**
 * Manages analysis for each game, persisting results across reloads.
 * Stores a map of gameId → AnalysisNode[] in localStorage under 'bf:analysis'.
 * Exposes current selection, loading state, stored results, and IDs analysed.
 */
export function useGameAnalysis(gamesMap: Record<string, GameRecord>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisMap, setAnalysisMap] = useState<
    Record<string, AnalysisNode[]>
  >((): Record<string, AnalysisNode[]> => {
    try {
      const raw = localStorage.getItem('bf:analysis');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // IDs that have been analysed
  const analysedIds = useMemo(
    () => new Set(Object.keys(analysisMap)),
    [analysisMap]
  );

  // analysis for the currently selected game
  const analysis = selectedId ? analysisMap[selectedId] || [] : [];

  // persist analysis map
  useEffect(() => {
    try {
      localStorage.setItem('bf:analysis', JSON.stringify(analysisMap));
    } catch {}
  }, [analysisMap]);

  // run analysis if not cached
  const analyse = useCallback(
    (id: string) => {
      setSelectedId(id);
      if (analysisMap[id]?.length) return;
      const game = gamesMap[id];
      if (!game?.pgn) return;
      setLoading(true);
      analysePGN(game.pgn, 12)
        .then((raw) => {
          const nodes: AnalysisNode[] = raw.map((r) => ({
            halfMoveIndex: r.half_move_index,
            side: r.side,
            moveNumber: r.move_number,
            san: r.san,
            fenBefore: r.fen_before,
            evalBefore: r.eval_before,
            evalAfter: r.eval_after,
            evalCP: r.eval_cp,
            deltaCP: r.delta_cp,
            depth: r.depth || 12,
            bestMove: r.best_move,
            playedMove: r.played_move,
          }));
          setAnalysisMap((prev) => ({ ...prev, [id]: nodes }));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    },
    [analysisMap, gamesMap]
  );

  return { selectedId, analysis, loading, analyse, setSelectedId, analysedIds };
}
