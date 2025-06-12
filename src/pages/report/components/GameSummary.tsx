// src/pages/games/components/GameSummary.tsx
import { useEffect, useMemo, useState } from 'react';

import EvalGraph from './EvalGraph';
import GameSummaryHeader from './GameSummaryHeader';
import StackView from './StackView';
import GameSummaryTable, { CombinedEntry } from './SummaryTable';
import TimeUsageChart from './TimeUsageChart';

import { useReportTableFilters } from '@/hooks/useReportTableFilters';
import {
  getErrorSeverity,
  getTimeSeverity,
  Severity,
  TimeControl,
} from '@/lib/severity';
import { AnalysisNode, GameRecord } from '@/types';

interface GameSummaryProps {
  game: GameRecord;
  analysis: AnalysisNode[];
  onDrill: (pgn: string, halfMoveIndex: number, heroSide: 'w' | 'b') => void;
  heroSide: 'w' | 'b';
}

type TimePoint = { move: number; heroTime: number; oppTime: number };

export function GameSummary({
  game,
  analysis,
  onDrill,
  heroSide,
}: GameSummaryProps) {
  const MAX = 4;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { showAll, setShowAll, heroOnly, setHeroOnly } =
    useReportTableFilters();

  // 1) Eval‐graph data
  const chartData = useMemo(
    () =>
      analysis.map((a) => ({
        ply: a.halfMoveIndex,
        raw: a.evalCP / 100, // ← add this
        plot: Math.max(-MAX, Math.min(MAX, a.evalCP / 100)),
        ...a,
      })),
    [analysis]
  );

  // 2) Combined entries for table + board
  const combined: CombinedEntry[] = useMemo(
    () =>
      analysis.map((a) => {
        const mv = game.moves[a.halfMoveIndex - 1];
        let tags: Severity[] = [];

        if (mv.side === heroSide) {
          const err = getErrorSeverity(a.deltaCP);
          const time = getTimeSeverity({
            deltaCP: a.deltaCP,
            timeSpent: mv.timeSpent,
            ply: a.halfMoveIndex,
            tc: {
              base: game.meta.timeControl,
              inc: game.meta.increment,
            } as TimeControl,
          });
          tags = [err, time].filter((t) => t !== 'none') as Severity[];
        }
        if (!tags.length) tags = ['none'];

        const impact = heroSide === 'b' ? -a.deltaCP : a.deltaCP;
        return { move: mv, analysis: a, tags, impact };
      }),
    [analysis, game.moves, heroSide, game.meta.increment, game.meta.timeControl]
  );

  // set initial position to first entry shown in the table
  useEffect(() => {
    if (selectedIndex != null || combined.length === 0) return;
    const entry = combined.find(
      (e) =>
        (showAll || e.tags[0] !== 'none') &&
        (!heroOnly || e.move.side === heroSide)
    );
    if (entry) setSelectedIndex(entry.analysis.halfMoveIndex);
    else setSelectedIndex(combined[0].analysis.halfMoveIndex);
  }, [combined, heroSide, selectedIndex, showAll, heroOnly]);

  // 3) Time‐usage chart data
  const timeData: TimePoint[] = useMemo(() => {
    const pts: TimePoint[] = [];
    analysis.forEach((a) => {
      const ply = a.halfMoveIndex;
      const full = Math.ceil(ply / 2);
      const mv = game.moves[ply - 1];
      const isHero = mv.side === heroSide;
      const t = mv.timeSpent ?? 0;

      let pt = pts.find((x) => x.move === full);
      if (!pt) {
        pt = { move: full, heroTime: 0, oppTime: 0 };
        pts.push(pt);
      }
      if (isHero) pt.heroTime += t;
      else pt.oppTime += t;
    });
    return pts;
  }, [analysis, game.moves, heroSide]);

  const handlePositionSelect = (halfMoveIndex: number) => {
    setSelectedIndex(halfMoveIndex);
  };

  return (
    <article className="mb-6 w-full max-w-6xl space-y-4 p-4">
      {/* Header + graphs */}
      <GameSummaryHeader game={game} />
      <EvalGraph
        data={chartData}
        max={MAX}
        handlePositionSelect={handlePositionSelect}
      />
      <TimeUsageChart
        data={timeData}
        game={game}
        heroSide={heroSide}
        handlePositionSelect={handlePositionSelect}
      />

      {/* Responsive layout: 1-col on mobile, 2-pane on desktop.
         Make _this_ div the scroll container on lg so sticky works */}
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[400px_1fr]">
        {/* Left pane: fixed-width, sticky table */}
        <aside>
          <GameSummaryTable
            combined={combined}
            onClick={handlePositionSelect}
            pgn={game.pgn}
            timeControl={game.meta.timeControl}
            heroSide={heroSide}
            showAll={showAll}
            setShowAll={setShowAll}
            heroOnly={heroOnly}
            setHeroOnly={setHeroOnly}
          />
        </aside>
        {/* Right pane: board + transport */}
        <section className="lg:sticky lg:top-14 lg:self-start">
          <StackView
            heroSide={heroSide}
            entries={combined}
            onDrill={onDrill}
            pgn={game.pgn}
            selectedIndex={selectedIndex}
          />
        </section>
      </div>
    </article>
  );
}
