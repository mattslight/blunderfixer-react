// src/pages/games/hooks/useGameAnalysis.ts
import { useCallback, useEffect, useMemo, useState } from 'react';

import { analysePGN } from '@/api';
import { AnalysisNode, GameRecord } from '@/types';

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
  // inside useGameAnalysis…
  const analyse = useCallback(
    async (id: string): Promise<void> => {
      // cache‐skip
      if (analysisMap[id]?.length) return;

      const game = gamesMap[id];
      if (!game?.pgn) return;

      setLoading(true);
      setSelectedId(id); // optional, if you still want to know “current” id

      try {
        const raw = await analysePGN(game.pgn, 12);
        const nodes: AnalysisNode[] = raw.map((r) => ({
          halfMoveIndex: r.half_move_index,
          side: r.side,
          moveNumber: r.move_number,
          san: r.san,
          fenBefore: r.fen_before,

          evalBefore: r.eval_before,
          evalAfter: r.eval_after,
          evalCP: r.eval_after,
          deltaCP: r.delta_cp,

          depth: r.depth,
          playedMove: r.uci, // alias UCI → playedMove
          mateIn: r.mate_in, // if you’re consuming it
        }));

        setAnalysisMap((prev) => ({ ...prev, [id]: nodes }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [analysisMap, gamesMap, setAnalysisMap, setLoading, setSelectedId]
  );

  return { selectedId, analysis, loading, analyse, setSelectedId, analysedIds };
}
